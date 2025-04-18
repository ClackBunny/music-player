/**
 *  歌手相关类型
 *
 * @Author: kongxin
 * @Date: 2025/4/18 14:23:35
 * @LastEditors: kongxin
 */
import type { Artist, SongItem } from "@/type/type.ts";

// /artist接口的返回参数
export type ArtistApiResponse = {
    artist: Artist;
    hotSongs: SongItem[];
    more: boolean;
    code: number;
}