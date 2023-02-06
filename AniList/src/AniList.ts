import { createEntryResults, createHistory, createShortEntry, EntryResults, EntryResultsInfo, fetch, History, MediaType, Tracker } from "soshiki-sources"

export default class AniListTracker extends Tracker {
    getAuthUrl(): string {
        return 'https://anilist.co/api/v2/oauth/authorize?client_id=10765&response_type=token'
    }
    logout(): void {
        setKeychainValue("access", '')
        setStorageValue("userId", '')
        setLoginStatus(false)
    }

    async handleResponse(url: string): Promise<void> {
        const access = url.split("#")[1].split("&")[0].split("=")[1]
        const res = await fetch("https://graphql.anilist.co", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`
            },
            body: JSON.stringify({
                query: `query { Viewer { id } }`
            })
        }).then(res => JSON.parse(res.data))
        setKeychainValue("access", access)
        setStorageValue("userId", `${res.data.Viewer.id}`)
        setLoginStatus(true)
    }

    parseStatus(status: string): History.Status {
        switch (status) {
            case 'CURRENT': return History.Status.IN_PROGRESS
            case 'PLANNING': return History.Status.PLANNED
            case 'COMPLETED': return History.Status.COMPLETED
            case 'DROPPED': return History.Status.DROPPED
            case 'PAUSED': return History.Status.PAUSED
            case 'REPEATING': return History.Status.IN_PROGRESS
            default: return History.Status.UNKNOWN
        }
    }

    getStatus(status: History.Status): string {
        switch (status) {
            case History.Status.IN_PROGRESS: return 'CURRENT'
            case History.Status.PLANNED: return 'PLANNING'
            case History.Status.COMPLETED: return 'COMPLETED'
            case History.Status.DROPPED: return 'DROPPED'
            case History.Status.PAUSED: return 'PAUSED'
            default: return 'CURRENT'
        }
    }

    async getHistory(mediaType: MediaType, id: string): Promise<History | null> {
        const access = getKeychainValue("access")
        if (access === null || typeof access === 'undefined') throw new Error("Access token not found.")
        const userId = getStorageValue("userId")
        if (typeof userId !== 'string') throw new Error("User ID not found.")
        const res = await fetch("https://graphql.anilist.co", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`
            },
            body: JSON.stringify({
                query: `query { MediaList (mediaId: ${id}, type: ${mediaType === MediaType.VIDEO ? 'ANIME' : 'MANGA'}, userId: ${userId}) { id, progress, status, progressVolumes, score(format: POINT_10_DECIMAL) } }`
            })
        }).then(res => JSON.parse(res.data))
        if (res.data?.MediaList === null || typeof res.data?.MediaList === 'undefined') return null
        return createHistory({
            id: `${res.data.MediaList.id}`,
            chapter: mediaType !== MediaType.VIDEO ? res.data.MediaList.progress : undefined,
            volume: mediaType !== MediaType.VIDEO ? res.data.MediaList.progressVolumes ?? undefined : undefined,
            episode: mediaType === MediaType.VIDEO ? res.data.MediaList.progress : undefined,
            score: res.data.MediaList.score,
            status: this.parseStatus(res.data.MediaList.status)
        })
    }

    async setHistory(mediaType: MediaType, id: string, history: History): Promise<void> {
        const access = getKeychainValue("access")
        if (access === null || typeof access === 'undefined') throw new Error("Access token not found.")
        let args: string[] = []
        for (const entry of Object.entries(history)) {
            switch (entry[0]) {
                case 'chapter': args.push(`progress: ${entry[1]}`); break
                case 'volume': args.push(`progressVolumes: ${entry[1]}`); break
                case 'episode': args.push(`progress: ${entry[1]}`); break
                case 'score': args.push(`scoreRaw: ${(entry[1] as number) * 10}`); break
                case 'status': args.push(`status: ${this.getStatus(entry[1] as History.Status)}`); break
            }
        }
        const historyEntry = await this.getHistory(mediaType, id)
        if (historyEntry !== null) args.push(`id: ${historyEntry.id}`)
        await fetch("https://graphql.anilist.co", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`
            },
            body: JSON.stringify({
                query: `mutation { SaveMediaListEntry (mediaId: ${id}, ${args.join(', ')}) { id } }`
            })
        })
    }

    async deleteHistory(mediaType: MediaType, id: string): Promise<void> {
        const access = getKeychainValue("access")
        if (access === null || typeof access === 'undefined') throw new Error("Access token not found.")
        const historyEntry = await this.getHistory(mediaType, id)
        if (historyEntry === null) throw new Error("History entry does not exist.")
        await fetch("https://graphql.anilist.co", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`
            },
            body: JSON.stringify({
                query: `mutation { DeleteMediaListEntry (id: ${historyEntry.id}) { deleted } }`
            })
        })
    }

    async getSearchResults(previousInfo: EntryResultsInfo | null, mediaType: MediaType, query: string): Promise<EntryResults> {
        const page = previousInfo === null ? 1 : previousInfo.page + 1
        const access = getKeychainValue("access")
        if (access === null || typeof access === 'undefined') throw new Error("Access token not found.")
        const res = await fetch("https://graphql.anilist.co", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`
            },
            body: JSON.stringify({
                query: `query { Page (page: ${page}, perPage: 50) { pageInfo { hasNextPage }, media(search: "${query.replace("\"", "\\\"")}", type: ${mediaType === MediaType.VIDEO ? 'ANIME' : 'MANGA'}) { id, title { english, romaji }, coverImage { large }, staff { nodes { name { full } } } } } }`
            })
        }).then(res => JSON.parse(res.data))
        return createEntryResults({
            page: page,
            hasMore: res.data.Page.pageInfo.hasNextPage ?? false,
            entries: res.data.Page.media.map((entry: any) => createShortEntry({
                id: `${entry.id}`,
                title: entry.title.english ?? entry.title.romaji ?? "",
                subtitle: entry.staff.nodes[0]?.name.full ?? "",
                cover: entry.coverImage.large ?? ""
            }))
        })
    }

}