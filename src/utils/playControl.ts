import { message, Modal } from "ant-design-vue";
import { usePlayStateStore } from "@/stores/playState.ts";
import { storeToRefs } from "pinia";
import { checkMusic, songUrl } from "@/api/song.ts";
import type { SongItem } from "@/type/type.ts";
import { getAlbumPicUrl } from "@/api/album.ts";

const store = usePlayStateStore()
const {playState, playList} = storeToRefs(store)

/**
 * 播放音乐
 * @param indexInList 在播放列表中的索引值,大于等于0时会赋值给playState(理论上都是大于等于0)
 */
export async function handlePlay(indexInList: number = 0) {
    // 判断歌曲在不在列表中
    if (indexInList < 0 || indexInList >= playList.value.length) {
        if (indexInList >= playList.value.length) {
            message.info("歌曲不在播放列表中");
            return;
        }
    }

    const songId = playList.value[indexInList].id;
    // 1. 检查歌曲是否可用
    const isAvailable = await check(songId)
    if (!isAvailable) {
        message.warning("歌曲不可用，请检查登录状态或是否有版权")
        return;
    }

    // 2. 获取歌曲 URL
    console.log("获取ing");
    const url = await getMusicUrl(songId)

    if (!url) {
        message.error("无法获取播放地址")
        return;
    }

    // 3. 设置播放状态
    playState.value.index = indexInList;
    playState.value.musicUrl = url
}

/**
 * 添加到播放列表
 * @param song
 */
export async function addToPlayList(song: SongItem) {

    if (playList.value.filter(item => item.id === song.id).length > 0) {
        message.info("已经存在在列表中")
        return;
    }
    song.album.picUrl = await getAlbumPicUrl(song.album.id)
    message.info("添加成功")
    return playList.value.push(song) - 1;
}

/**
 * 添加到播放列表
 * @param song
 */
export function addToPlayListWithoutPic(song: SongItem) {

    if (playList.value.filter(item => item.id === song.id).length > 0) {
        message.info("已经存在在列表中")
        return;
    }
    message.info("添加成功")
    return playList.value.push(song) - 1;
}

/**
 * 标记喜欢歌曲
 * @param songId 歌曲ID
 */
export function handleFollow(songId: number) {
    message.info("空信努力开发ing  (ง •_•)ง")
}

/**
 * 下一首歌
 */
export function nextSong() {
    if (playList.value.length < 1) {
        message.warning("播放列表没有歌曲");
        return;
    }
    playState.value.index++
    if (playState.value.index >= playList.value.length) {
        message.info("已经播放至结尾,从头开始播放")
        playState.value.index = 0;
    }
    handlePlay(playState.value.index);
}

/**
 * 上一首歌
 */
export function previousSong() {
    if (playList.value.length < 1) {
        message.warning("播放列表没有歌曲");
        return;
    }
    playState.value.index--
    if (playState.value.index < 0) {
        message.info("已经播放至开头,从结尾开始播放")
        playState.value.index = playList.value.length - 1;
    }
    handlePlay(playState.value.index);
}

/**
 * 删除歌曲（带确认弹窗）
 */
export function handleDelete(index: number) {
    const song = playList.value[index];
    Modal.confirm({
        title: "删除歌曲",
        content: `确定要从播放列表中删除《${song.name}》吗？`,
        okText: "删除",
        cancelText: "取消",
        async onOk() {
            const wasPlaying = playState.value.index === index;
            playList.value.splice(index, 1);

            if (playList.value.length === 0) {
                playState.value.index = -1;
                playState.value.musicUrl = '';
                return;
            }

            // 调整播放索引
            if (wasPlaying) {
                if (index >= playList.value.length) {
                    playState.value.index = 0;
                }
                await handlePlay(playState.value.index);
            } else if (index < playState.value.index) {
                playState.value.index--; // 保持当前播放位置正确
            }
        }
    });
}

/**
 * 清空播放列表（带确认）
 */
export function clearPlayList() {
    Modal.confirm({
        title: "清空播放列表",
        content: "确定要清空播放列表吗？这将停止当前播放。",
        okText: "清空",
        cancelText: "取消",
        onOk() {
            playList.value = [];
            playState.value.index = -1;
            playState.value.musicUrl = '';
            message.success("播放列表已清空");
        }
    });
}

// ==================== 内部方法 ====================

async function check(songId: number): Promise<boolean> {
    const res = await checkMusic(songId)
    console.log(res)
    const result = (res.code === 200 && res.success)
    console.log("检查结果:", result)
    return result
}

async function getMusicUrl(songId: number): Promise<string | null> {
    try {
        const res = await songUrl(songId)
        console.log("songUrl", res)
        if (res.code !== 200 || res.data.length <= 0) {
            message.error("songUrl 获取失败. " + res.data)
            return null
        }
        return res.data[0].url
    } catch (err) {
        message.error("获取歌曲地址失败")
        console.log(err)
        return null
    }
}
