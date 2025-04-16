// 播放相关的类型
export type PlayStateType = {
    // 当前播放歌曲位于播放列表的索引值
    index: number;
    // 播放 / 暂停
    isPlaying: boolean;
    // 歌曲时长
    duration: number;
    // 是否获取到时长
    getDuration: boolean;
    // 当前播放的时间
    current: number;
    // 音量
    volume: number;
    // 静音前音量
    muteVolume: number;
    // 是否需要缓冲
    buffer: boolean;
    // 缓冲列表
    bufferList: Array<{ start: number; end: number }>;
    // 歌词开 / 歌词关
    lyrics: boolean;
    // 歌词列表
    lrcList: Array<{
        // 时间,单位：秒
        lineTime: number;
        // 歌词
        txt: string;
    }>;
    // 当前播放歌词索引
    curLrcIndex: number;
    // 播放顺序
    playOrder: "along" | "random" | "loop";
    // 唱片旋转定时器
    coverTimer: number | undefined;
    // 唱片旋转角度
    angle: number;
    // 是否显示播放列表
    playList: boolean;
    needChangeUrl: boolean;
    musicUrl: string
};