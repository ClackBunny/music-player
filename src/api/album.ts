import request from "@/utils/request.ts";
import type { Album } from "@/type/type.ts";

export type AlbumApiResponse = {
    resourceState: boolean,
    songs: { id: number, name: string }[],
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
    })
}

/**
 * 获取专辑图片
 *
 * @param albumId 专辑ID
 */
export async function getAlbumPicUrl(albumId: number) {
    let result = await getAlbum(albumId) as AlbumApiResponse;
    return result.album.picUrl;
}