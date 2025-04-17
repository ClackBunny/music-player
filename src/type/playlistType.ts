/**
 *  歌单相关类型
 *
 * @Author: kongxin
 * @Date: 2025/4/17 22:42:41
 * @LastEditors: kongxin
 */
import type { SongItem } from "@/type/type.ts";

export type PlayListTrackApiResponse = {
    songs: SongItem[],
    code: number,
};