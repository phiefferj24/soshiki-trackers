import { createEntry, createEntryResults, createHistory, createShortEntry, Entry, EntryContentRating, EntryResults, EntryResultsInfo, EntrySeason, EntryStatus, fetch, History, MediaType, Tracker } from "soshiki-sources/dist"

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

    getSupportedMediaTypes(): ("text" | "image" | "video")[] {
        return ["text", "image", "video"]
    }

    async getDiscoverEntries(mediaType: MediaType, category: string): Promise<Entry[]> {
        let searchComponents: string[] = []
        switch (category) {
            case "Featured": 
                searchComponents.push("sort: START_DATE_DESC")
                searchComponents.push("popularity_greater: 10000")
                searchComponents.push("status: RELEASING")
                break
            case "Trending": searchComponents.push("sort: TRENDING_DESC"); break
            case "Top": searchComponents.push("sort: POPULARITY_DESC"); break
            case "New This Season":
                searchComponents.push("sort: POPULARITY_DESC")
                const month = (new Date().getMonth() + 1) % 12 + 1 // dec, jan, feb, ..., nov (for seasons)
                searchComponents.push(`season: ${month <= 3 ? "WINTER" : month <= 6 ? "SPRING" : month <= 9 ? "SUMMER" : "FALL"}`)
                searchComponents.push(`seasonYear: ${new Date().getFullYear() + (month === 1 ? 1 : 0)}`) // flips year to the next year if month is december
                break
            case "Upcoming":
                searchComponents.push("sort: POPULARITY_DESC")
                searchComponents.push(`startDate_greater: ${new Date().getFullYear()}${("0" + new Date().getMonth()).slice(-2)}${("0" + new Date().getDay()).slice(-2)}`)
                break
            case "Movies":
                searchComponents.push("sort: TRENDING_DESC")
                searchComponents.push("format: MOVIE")
                break
            default:
                searchComponents.push("sort: ID")
        }
        const res = await fetch("https://graphql.anilist.co", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `
query { 
    Page (page: 1, perPage: 20) { 
        media(type: ${mediaType === MediaType.VIDEO ? 'ANIME' : 'MANGA'}, ${searchComponents.join(", ")}) { 
            id, 
            title { 
                english, 
                romaji 
            }, 
            coverImage { 
                large,
                extraLarge
            }, 
            bannerImage,
            staff { 
                nodes { 
                    name { 
                        full 
                    } 
                } 
            },
            genres,
            ${mediaType === MediaType.VIDEO ? "episodes" : "chapters"},
            siteUrl,
            isAdult,
            season,
            seasonYear,
            status(version: 2),
            description(asHtml: false)
        } 
    } 
}`
            })
        }).then(res => JSON.parse(res.data))
        return res.data.Page.media.map((entry: any) => createEntry({
            id: `${entry.id}`,
            title: entry.title?.english ?? entry.title?.romaji ?? "",
            cover: entry.coverImage?.extraLarge ?? entry.coverImage?.large ?? "",
            banner: entry.bannerImage ?? "",
            staff: entry.staff?.nodes?.map((staff: any) => staff.name?.full ?? "") ?? [],
            tags: entry.genres ?? [],
            nsfw: entry.isAdult ? EntryContentRating.nsfw : EntryContentRating.safe,
            status: entry.status === "FINISHED" ? EntryStatus.completed : entry.status === "RELEASING" ? EntryStatus.ongoing : entry.status === "CANCELLED" ? EntryStatus.dropped : entry.status === "HIATUS" ? EntryStatus.hiatus : EntryStatus.unknown,
            score: typeof entry.meanScore === "number" ? entry.meanScore / 10 : undefined,
            items: entry.episodes ?? entry.chapters ?? undefined,
            season: entry.season === "WINTER" ? EntrySeason.winter : entry.season === "SPRING" ? EntrySeason.spring : entry.season === "SUMMER" ? EntrySeason.summer : EntrySeason.fall,
            year: entry.seasonYear,
            url: entry.siteUrl ?? "",
            description: entry.description ?? ""
        }))
    }

    async getSeeMoreEntries(previousInfo: EntryResultsInfo | null, mediaType: MediaType, category: string): Promise<EntryResults> {
        const page = (previousInfo?.page ?? 0) + 1
        let searchComponents: string[] = []
        switch (category) {
            case "Featured": searchComponents.push("sort: POPULARITY_DESC"); break
            case "Trending": searchComponents.push("sort: TRENDING_DESC"); break
            case "Top": searchComponents.push("sort: POPULARITY_DESC"); break
            case "New This Season":
                searchComponents.push("sort: POPULARITY_DESC")
                const month = (new Date().getMonth() + 1) % 12 + 1 // dec, jan, feb, ..., nov (for seasons)
                searchComponents.push(`season: ${month <= 3 ? "WINTER" : month <= 6 ? "SPRING" : month <= 9 ? "SUMMER" : "FALL"}`)
                searchComponents.push(`seasonYear: ${new Date().getFullYear() + (month === 1 ? 1 : 0)}`) // flips year to the next year if month is december
                break
            case "Upcoming":
                searchComponents.push("sort: POPULARITY_DESC")
                searchComponents.push(`startDate_greater: ${new Date().getFullYear()}${("0" + new Date().getMonth()).slice(-2)}${("0" + new Date().getDay()).slice(-2)}`)
                break
            case "Movies":
                searchComponents.push("sort: TRENDING_DESC")
                searchComponents.push("format: MOVIE")
                break
            default:
                searchComponents.push("sort: ID")
        }
        const res = await fetch("https://graphql.anilist.co", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `query { Page (page: ${page}, perPage: 50) { pageInfo { hasNextPage }, media(type: ${mediaType === MediaType.VIDEO ? 'ANIME' : 'MANGA'}, ${searchComponents.join(", ")}) { id, title { english, romaji }, coverImage { large }, staff { nodes { name { full } } } } } }`
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

    getDiscoverSections(): string[] {
        return ["New This Season", "Upcoming", "Movies"]
    }
}