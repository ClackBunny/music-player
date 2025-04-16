import request from "@/utils/request.ts";
import type { SongItem } from "@/type/type.ts";
import type { SongListItem } from "@/type/searchType.ts";

export enum SearchType {
    SINGLE_SONG = 1,
    ALBUM = 10,
    SINGER = 100,
    SONG_LIST = 1000,
}

export type SingleSongResultData = {
    songs: SongItem[];
    hasMore: boolean;
    songCount: number;
}

// 歌单搜索结果类型
export type SongListResultData = {
    playlists: SongListItem[];
    hasMore: boolean;
    playlistCount: number;
}
// 搜索接口类型
export type SearchApiResponse = {
    result: SingleSongResultData | SongListResultData;
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