/**
 *  歌手相关功能接口
 *
 * @Author: kongxin
 * @Date: 2025/4/18 14:21:32
 * @LastEditors: kongxin
 */
import request from "@/utils/request.ts";
import { renameKeysList } from "@/utils/renameKeys.ts";
import type { SongItem } from "@/type/type.ts";

/**
 * 获取歌手部分信息和热门歌曲
 *
 * @param artistId
 */
export function getArtist(artistId: number) {
    return request.get('/artists', {
        params: {
            id: artistId,
        }
    }).then((res) => {
        // 这里做类型转换,让他出去之后实用对应的数据
        const nameMap = {
            'artists': {from: 'ar'},
            'album': {from: 'al'},
            'duration': {from: 'dt'},
            'alias': {from: 'alia'},
        }
        const songs = renameKeysList(res.hotSongs, nameMap, true) as SongItem[];
        return {
            artist: res.artist,
            hotSongs: songs,
            code: res.code,
            more: res.more
        };
    })
}