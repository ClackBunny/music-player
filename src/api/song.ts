import request from "@/utils/request.ts";

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