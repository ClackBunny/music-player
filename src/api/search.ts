import request from "@/utils/request.ts";
import { type SearchApiResponse, SearchType } from "@/type/searchType.ts";

export function search(keyword: string, type: SearchType = SearchType.SINGLE_SONG, offset: number = 0, limit: number = 30): Promise<SearchApiResponse> {
    return request.get<SearchApiResponse>('/search', {
        params: {
            keywords: keyword,
            type: type.valueOf(),
            offset,
            limit,
        },
    })
}
