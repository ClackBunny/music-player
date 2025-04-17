import { defineStore } from "pinia";
import { ref } from "vue";
import type { PlayStateType } from "@/type/playState.ts";
import type { PlayList } from "@/type/type.ts";

export const usePlayStateStore = defineStore('playState', () => {
// 播放状态
    const playState = ref<PlayStateType>({
        index: -1,
        isPlaying: false,
        volume: 60,
        muteVolume: 60,
        duration: 0,
        getDuration: false,
        current: 0,
        buffer: true,
        bufferList: [],
        lyrics: false,
        lrcList: [],
        curLrcIndex: 0,
        playOrder: "along",
        coverTimer: undefined,
        angle: 0,
        playList: true,
        needChangeUrl: true,
        musicUrl: ""
    });
    const playList = ref<PlayList>([
            {
                id: 347230,
                name: "海阔天空",
                artists: [{
                    "id": 11127,
                    "name": "Beyond",
                    "picUrl": '',
                    "alias": [],
                    "picId": 0,
                    "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                }],
                album: {
                    "id": 34209,
                    "name": "海阔天空",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": '',
                        "alias": [],
                        "picId": 0,
                        "img1v1Url": "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                    },
                    "publishTime": 747504000000,
                    "size": 10,
                    "copyrightId": 1416737,
                    "status": 1,
                    "picId": "109951168912558460",
                },
                // 音乐时
                duration: 326000,
                copyrightId: 1416737,
                alias: [],
                // 0: 免费或无版权 1: VIP 歌曲 4: 购买专辑 8: 非会员可免费播放低音质，会员可播放高音质及下载
                fee: 1
            },
            {
                id: 569213220,
                name: "像我这样的人",
                artists: [
                    {
                        "id": 12138269,
                        "name": "毛不易",
                        "picUrl": '',
                        "alias": [],
                        "picId": 0,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                    }
                ],
                album: {
                    "id": 39483040,
                    "name": "平凡的一天",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": '',
                        "alias": [],
                        "picId": 0,
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                    },
                    "publishTime": 1530547200000,
                    "size": 26,
                    "copyrightId": 2708402,
                    "status": 0,
                    picId: 109951163350929740,
                },
                // 音乐时
                duration: 207466,
                copyrightId: 2708402,
                alias: [],
                fee: 8,
            },
            {
                "id": 28815250,
                "name": "平凡之路",
                "artists": [
                    {
                        "id": 4721,
                        "name": "朴树",
                        "picUrl": '',
                        "alias": [],
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                    }
                ],
                "album": {
                    "id": 35444067,
                    "name": "猎户星座",
                    "artist": {
                        "id": 0,
                        "name": "",
                        "picUrl": '',
                        "alias": [],
                        "img1v1Url": "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
                    },
                    "publishTime": 1493481600007,
                    "size": 11,
                    "copyrightId": 2712526,
                    "status": 0,
                },
                "duration": 302119,
                "copyrightId": 2712526,
                "alias": [
                    "电影《后会无期》主题曲"
                ],
                "fee": 1
            }
        ]
    )
    const isPlayListOpen = ref(false);
    return {playState, playList, isPlayListOpen}
})