/**
 * 歌单相关的接口
 *
 * @Author: kongxin
 * @Date: 2025/4/17 22:30:33
 * @LastEditors: kongxin
 */
import request from "@/utils/request.ts";
import type { PlayListTrackApiResponse } from "@/type/playlistType.ts";
import { renameKeysList } from "@/utils/renameKeys.ts";
import type { SongItem } from "@/type/type.ts";


/**
 * 获取歌单的所有歌曲
 *
 * @param playlistId 歌单ID
 * @param offset 分页偏移量
 * @param limit 分页限制
 */
export function getPlaylistTrackAll(playlistId: number, offset: number = 0, limit: number = 0): Promise<PlayListTrackApiResponse> {
    return request.get('/playlist/track/all', {
        params: {
            id: playlistId,
            offset: offset,
            limit: limit,
        }
    }).then((res) => {
        // 这里做类型转换,让他出去之后实用对应的数据
        const nameMap = {
            'artists': {from: 'ar'},
            'album': {from: 'al'},
            'duration': {from: 'dt'},
            'alias': {from: 'alia'},
        }
        const songs = renameKeysList(res.songs, nameMap, true) as SongItem[];
        return {songs, code: res.code} as PlayListTrackApiResponse;
    })

}