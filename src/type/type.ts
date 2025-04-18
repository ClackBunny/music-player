// 这里放一些公用的类型
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

export interface Creator {
    nickname: string;
    userId: number;
    userType: number;
    avatarUrl: string;
    authStatus: number;
    expertTags: string[] | null;
    experts: Record<string, any> | null;
}

export interface Track {
    name: string;
    id: number;
    position: number;
    alias: string[];
    status: number;
    fee: number;
    copyrightId: number;
    disc: string;
    no: number;
    artists: Artist[];
    album: Album;
    starred: boolean;
    popularity: number;
    score: number;
    starredNum: number;
    duration: number;
    playedNum: number;
    dayPlays: number;
    hearTime: number;
    ringtone: string | null;
    crbt: string | null;
    audition: string | null;
    copyFrom: string;
    commentThreadId: string;
    rtUrl: string | null;
    ftype: number;
    rtUrls: string[];
    copyright: number;
    hMusic: MusicQuality;
    mMusic: MusicQuality;
    lMusic: MusicQuality;
    bMusic: MusicQuality;
    mvid: number;
    rtype: number;
    rurl: string | null;
    mp3Url: string | null;
}

export interface Artist {
    name: string;
    id: number;
    alias?: string[];
    picUrl?: string;
    picId?: number;
    img1v1Id?: number;
    briefDesc?: string;
    img1v1Url?: string;
    albumSize?: number;
    trans?: string;
    musicSize?: number;
    topicPerson?: number;
}

export interface Album {
    id: number;
    name: string;
    publishTime?: number;
    artist?: Artist;
    size?: number;
    status?: number;
    idStr?: string | null;
    type?: string;
    picId?: number | string;
    blurPicUrl?: string;
    companyId?: number;
    pic?: number;
    picUrl?: string;
    description?: string;
    tags?: string;
    company?: string;
    briefDesc?: string;
    songs?: any[];
    alias?: string[];
    copyrightId?: number;
    commentThreadId?: string;
    artists?: Artist[];
    onSale?: boolean;
}

export interface MusicQuality {
    name: string | null;
    id: number;
    size: number;
    extension: string;
    sr: number;
    dfsId: number;
    bitrate: number;
    playTime: number;
    volumeDelta: number;
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

// 获取专辑的名字
export function getAlbumTitle(album: Album): string {
    if (album.alias && album.alias.length >= 1) {
        return album.name + " (" + album.alias.join(",") + ")";
    } else {
        return album.name;
    }
}