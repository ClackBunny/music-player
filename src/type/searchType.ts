/**
 * 这里是搜索组件相关的类型
 */
import type { Album, Artist, Creator, SongItem, Track } from "@/type/type.ts";

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

export interface AlbumResultData {
    albums: Album[];
    albumCount: number;
    hlWords: string[];
}

export interface SingerResultData {
    artists: Artist[];
    artistCount: number;
    hlWords: string[];
    hasMore: boolean;
}

// 搜索接口类型
export type SearchApiResponse = {
    result: SingleSongResultData | SongListResultData | AlbumResultData | SingerResultData;
    code: number;
}

export interface SongListItem {
    id: number;
    name: string;
    coverImgUrl: string;
    creator: Creator;
    subscribed: boolean;
    trackCount: number;
    userId: number;
    playCount: number;
    bookCount: number;
    specialType: number;
    officialTags: string[] | null;
    action: string;
    actionType: string;
    recommendText: string;
    score: number | null;
    description: string;
    highQuality: boolean;
    track: Track;
    alg: string;
}






