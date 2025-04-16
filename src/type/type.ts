export type PlayList = Array<SongItem>
export type SongItem = {
    id: number;
    name: string;
    artists: Artist[];
    album: Album;
    // 音乐时长
    duration: number;
    copyrightId?: number;
    alias: string[];
    // 0: 免费或无版权 1: VIP 歌曲 4: 购买专辑 8: 非会员可免费播放低音质，会员可播放高音质及下载
    fee?: number;
}
export type Album = {
    id: number;
    name: string;
    artists?: Artist[];
    artist?: Artist;
    publishTime?: number;
    size?: number;
    copyrightId?: number;
    status?: number;
    picId?: number | string;
    picUrl?: string;
    info?:Object;
}

export type Artist = {
    id: number;
    name: string;
    picId?: number | string;
    picUrl?: string | null;
    alias?: string[];
    img1v1Url?: string;
}

// 获取歌曲名字(包含别名)
export function getSongTitle(song: SongItem): string {
    if (song.alias.length >= 1) {
        return song.name + " - (" + song.alias.join(",") + ")";
    } else {
        return song.name;
    }
}

// 获取歌手名字拼接
export function getSongArtist(song: SongItem): string {
    if (song.artists.length >= 1) {
        return song.artists.map((value) => {
            return value.name;
        }).join(", ");
    } else {
        return "未知"
    }
}