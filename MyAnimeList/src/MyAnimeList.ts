import { EntryResults, EntryResultsInfo, History, MediaType, Tracker, fetch, createEntryResults, createShortEntry, createHistory, Entry, ImageChapter, TextChapter, VideoEpisode } from 'soshiki-sources'

const UNRESERVED_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'

export default class MyAnimeListTracker extends Tracker {
    id = "myanimelist"
    getSupportedMediaTypes(): ('text' | 'image' | 'video')[] {
        throw new Error('Method not implemented.')
    }
    getDiscoverEntries(mediaType: MediaType, category: string): Promise<Entry[]> {
        throw new Error('Method not implemented.')
    }
    getSeeMoreEntries(previousInfo: EntryResultsInfo | null, mediaType: MediaType, category: string): Promise<EntryResults> {
        throw new Error('Method not implemented.')
    }
    getDiscoverSections(mediaType: MediaType): string[] {
        throw new Error('Method not implemented.')
    }
    getItems(mediaType: MediaType, id: string): Promise<TextChapter[] | ImageChapter[] | VideoEpisode[]> {
        throw new Error('Method not implemented.')
    }
    getAuthUrl(): string {
        let code = ''
        for (let i = 0; i < 128; ++i) code += UNRESERVED_CHARACTERS[Math.floor(Math.random() * UNRESERVED_CHARACTERS.length)]
        this.setStorageValue('verifier', code)
        return `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=e5a028c76621493bacc52ca0dd309ecd&code_challenge=${code}&code_challenge_method=plain`
    }
    logout(): void {
        this.setKeychainValue('access', '')
        this.setKeychainValue('refresh', '')
        this.setStorageValue('userId', '')
        this.setLoginStatus(false)
    }
    async handleResponse(url: string): Promise<void> {
        const code = url.split("=")[1]
        const verifier = this.getStorageValue('verifier')
        if (typeof verifier !== 'string' || verifier === null) throw new Error("Code verifier not found.")
        const res = await fetch("https://myanimelist.net/v1/oauth2/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `client_id=e5a028c76621493bacc52ca0dd309ecd&grant_type=authorization_code&code=${code}&code_verifier=${verifier}`
        }).then(res => JSON.parse(res.data))
        if (typeof res.access_token === 'undefined') throw new Error("Verification was unsuccessful.")
        const user = await fetch("https://api.myanimelist.net/v2/users/@me", {
            headers: {
                "Authorization": `Bearer ${res.access_token}`
            }
        }).then(res => JSON.parse(res.data))
        this.setKeychainValue('access', res.access_token)
        this.setKeychainValue('refresh', res.refresh_token)
        this.setStorageValue('userId', user.id)
        this.setLoginStatus(true)
    }

    parseStatus(status: string): History.Status {
        switch(status) {
            case 'watching': return History.Status.IN_PROGRESS
            case 'reading': return History.Status.IN_PROGRESS
            case 'completed': return History.Status.COMPLETED
            case 'on_hold': return History.Status.PAUSED
            case 'dropped': return History.Status.DROPPED
            case 'plan_to_watch': return History.Status.PLANNED
            case 'plan_to_read': return History.Status.PLANNED
            default: return History.Status.UNKNOWN
        }
    }

    getStatus(status: History.Status, mediaType: MediaType): string {
        switch(status) {
            case History.Status.IN_PROGRESS: return mediaType === MediaType.VIDEO ? 'watching' : 'reading'
            case History.Status.COMPLETED: return 'completed'
            case History.Status.PAUSED: return 'on_hold'
            case History.Status.DROPPED: return 'dropped'
            case History.Status.PLANNED: return mediaType === MediaType.VIDEO ? 'plan_to_watch' : 'plan_to_read'
            default: return mediaType === MediaType.VIDEO ? 'watching' : 'reading'
        }
    }

    async getHistory(mediaType: MediaType, id: string): Promise<History | null> {
        const access = this.getKeychainValue('access')
        if (access === null || typeof access === 'undefined') throw new Error("No access token found.")
        const res = await fetch(`https://api.myanimelist.net/v2/${mediaType === MediaType.VIDEO ? 'anime' : 'manga'}/${id}?fields=my_list_status`, {
            headers: {
                'Authorization': `Bearer ${access}`
            }
        }).then(res => JSON.parse(res.data))
        return createHistory({
            id: `${res.id}`,
            chapter: mediaType !== MediaType.VIDEO ? res.my_list_status?.num_chapters_read ?? undefined : undefined,
            volume: mediaType !== MediaType.VIDEO ? res.my_list_status?.num_volumes_read ?? undefined : undefined,
            episode: mediaType === MediaType.VIDEO ? res.my_list_status?.num_episodes_watched ?? undefined : undefined,
            score: res.my_list_status?.score ?? undefined,
            status: this.parseStatus(res.my_list_status.status)
        })
    }
    async setHistory(mediaType: MediaType, id: string, history: History): Promise<void> {
        const access = this.getKeychainValue('access')
        if (access === null || typeof access === 'undefined') throw new Error("No access token found.")
        let query: string[] = [`status=${this.getStatus(history.status, mediaType)}`]
        if (typeof history.chapter === 'number') query.push(`num_chapters_read=${history.chapter}`)
        if (typeof history.volume === 'number') query.push(`num_volumes_read=${history.volume}`)
        if (typeof history.episode === 'number') query.push(`num_watched_episodes=${history.episode}`)
        if (typeof history.score === 'number') query.push(`score=${Math.floor(history.score)}`)
        await fetch(`https://api.myanimelist.net/v2/${mediaType === MediaType.VIDEO ? 'anime' : 'manga'}/${id}/my_list_status`, {
            method: "PATCH",
            headers: {
                'Authorization': `Bearer ${access}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: query.join("&")
        })
    }
    async deleteHistory(mediaType: MediaType, id: string): Promise<void> {
        const access = this.getKeychainValue('access')
        if (access === null || typeof access === 'undefined') throw new Error("No access token found.")
        await fetch(`https://api.myanimelist.net/v2/${mediaType === MediaType.VIDEO ? 'anime' : 'manga'}/${id}/my_list_status`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${access}`
            }
        })
    }
    async getSearchResults(previousInfo: EntryResultsInfo | null, mediaType: MediaType, query: string): Promise<EntryResults> {
        const page = previousInfo === null ? 1 : previousInfo.page
        const access = this.getKeychainValue('access')
        if (access === null) throw new Error("No access token found.")
        const res = await fetch(`https://api.myanimelist.net/v2/${mediaType === MediaType.VIDEO ? 'anime' : 'manga'}?q=${encodeURIComponent(query)}&limit=100&offset=${(page - 1) * 100}`, {
            headers: {
                'Authorization': `Bearer ${access}`
            }
        }).then(res => JSON.parse(res.data))
        return createEntryResults({
            page: page,
            hasMore: typeof res.paging.next !== 'undefined',
            entries: res.data.map(entry => createShortEntry({
                id: `${entry.node.id}`,
                title: entry.node.title ?? "",
                subtitle: "",
                cover: entry.node.main_picture.large ?? entry.node.main_picture.medium ?? ""
            }))
        })
    }

}