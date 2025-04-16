import request from "@/utils/request.ts";
import type { SongItem } from "@/type/type.ts";

export enum SearchType {
    SINGLE_SONG = 1,
    ALBUM = 10,
    SINGER = 100,
    SONG_LIST = 1000,
}

export type SearchResultData = {
    songs: SongItem[];
    hasMore: boolean;
    songCount: number;
}

export type SearchApiResponse = {
    result: SearchResultData;
    code: number;
}

export type CheckMusicApiResponse = {
    code: number;
    success: boolean;
}

export type SongUrlApiResponse = {
    code: number;
    data: {
        id: number;
        url: string;
    }[]
}

export function search(keyword: string, type: SearchType = SearchType.SINGLE_SONG,) {
    return request.get<SearchApiResponse>('/search', {
        params: {
            keywords: keyword,
            type: type.valueOf()
        },
    })
}

/**
 * 判断音乐是否可用
 * @param musicId 音乐Id
 * @param br 码率,默认999000(已经最大)
 */
export function checkMusic(musicId: number, br: number = 999000): Promise<CheckMusicApiResponse> {
    return request.get('/check/music', {
        params: {
            id: musicId,
            br: br
        },
    })
}

/**
 * 获取歌曲url
 * @param musicId 音乐Id
 * @param br 码率,默认999000(已经最大)
 */
export function songUrl(musicId: number, br: number = 999000): Promise<SongUrlApiResponse> {
    return request.get('/song/url', {
        params: {
            id: musicId,
            br: br
        },
    })
}