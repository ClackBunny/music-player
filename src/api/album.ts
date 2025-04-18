import request from "@/utils/request.ts";
import type { Album, SongItem } from "@/type/type.ts";
import { renameKeysList } from "@/utils/renameKeys.ts";

export type AlbumApiResponse = {
    resourceState: boolean,
    songs: SongItem[],
    code: number,
    album: Album
}

/**
 * 获取专辑详情
 *
 * @param albumId 专辑ID
 */
export function getAlbum(albumId: number) {
    return request.get<AlbumApiResponse>('/album', {
        params: {
            id: albumId,
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
        return {
            resourceState: res.resourceState,
            songs: songs,
            code: res.code,
            album: res.album
        };
    })
}

/**
 * 获取专辑图片
 *
 * @param albumId 专辑ID
 */
export async function getAlbumPicUrl(albumId: number) {
    let result = await getAlbum(albumId);
    return result.album.picUrl;
}