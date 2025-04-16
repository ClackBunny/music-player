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
    picId: number;
    img1v1Id: number;
    briefDesc: string;
    picUrl: string;
    img1v1Url: string;
    albumSize: number;
    alias: string[];
    trans: string;
    musicSize: number;
    topicPerson: number;
}

export interface Album {
    name: string;
    id: number;
    idStr: string | null;
    type: string;
    size: number;
    picId: number;
    blurPicUrl: string;
    companyId: number;
    pic: number;
    picUrl: string;
    publishTime: number;
    description: string;
    tags: string;
    company: string;
    briefDesc: string;
    artist: Artist;
    songs: any[];
    alias: string[];
    status: number;
    copyrightId: number;
    commentThreadId: string;
    artists: Artist[];
    onSale: boolean;
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
