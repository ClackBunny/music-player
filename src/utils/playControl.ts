import { message, Modal } from "ant-design-vue";
import { usePlayStateStore } from "@/stores/playState.ts";
import { storeToRefs } from "pinia";
import { checkMusic, songUrl } from "@/api/song.ts";
import type { SongItem } from "@/type/type.ts";
import { getAlbum, getAlbumPicUrl } from "@/api/album.ts";
import { getPlaylistTrackAll } from "@/api/playlist.ts";
import { getArtist } from "@/api/artist.ts";

const store = usePlayStateStore()
const {playState, playList} = storeToRefs(store)

/**
 * 播放音乐
 * @param indexInList 在播放列表中的索引值,大于等于0时会赋值给playState(理论上都是大于等于0)
 */
export async function handlePlay(indexInList: number = 0) {
    // 判断歌曲在不在列表中
    if (indexInList < 0 || indexInList >= playList.value.length) {
        message.info("歌曲不在播放列表中");
        return;
    }

    const songId = playList.value[indexInList].id;
    // 1. 检查歌曲是否可用
    const isAvailable = await check(songId)
    if (!isAvailable) {
        message.warning("歌曲不可用，请检查登录状态或是否有版权")
        return;
    }

    // 2. 获取歌曲 URL
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
 * 添加到播放列表, 不获取专辑封面
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
        maskClosable: true,
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
        maskClosable: true,
        onOk() {
            playList.value = [];
            playState.value.index = -1;
            playState.value.musicUrl = '';
            message.success("播放列表已清空");
        }
    });
}

/**
 * 添加歌单到播放列表
 * @param songListId 歌单ID
 * @param needMessage 是否需要通知,默认true
 */
export async function addSongListToPlaylist(songListId: number, needMessage: boolean = true) {
    const songList = (await getPlaylistTrackAll(songListId)).songs;
    batchAddToPlaylist(songList, needMessage);
}

/**
 * 播放歌单
 *
 * @param songListId 歌单ID
 * @param songListName 歌单名字, 用于二次确认
 */
export async function playSongList(songListId: number, songListName: string) {
    Modal.confirm({
        title: "播放歌单",
        content: `确定要播放'${songListName}'歌单吗？这将清空当前播放列表。`,
        okText: "播放",
        cancelText: "取消",
        maskClosable: true,
        async onOk() {
            playList.value = [];
            await addSongListToPlaylist(songListId, false);
            playState.value.index = 0;
            playState.value.musicUrl = '';
            await handlePlay(0);
            message.success("播放列表已更新");
        }
    });
}

/**
 * 添加进列表
 *
 * @param albumId 专辑ID
 * @param needMessage 是否需要弹窗提醒
 */
export async function addAlbumToPlaylist(albumId: number, needMessage: boolean = true) {
    const songs = (await getAlbum(albumId)).songs;
    batchAddToPlaylist(songs, needMessage);
}

/**
 * 播放专辑
 *
 * @param albumId 专辑ID
 * @param albumName 专辑名字, 用于二次确认
 */
export async function playAlbum(albumId: number, albumName: string) {
    Modal.confirm({
        title: "播放歌单",
        content: `确定要播放'${albumName}'专辑吗？这将清空当前播放列表。`,
        okText: "播放",
        cancelText: "取消",
        maskClosable: true,
        async onOk() {
            playList.value = [];
            await addAlbumToPlaylist(albumId, false);
            playState.value.index = 0;
            playState.value.musicUrl = '';
            await handlePlay(0);
            message.success("播放列表已更新");
        }
    });
}

/**
 * 添加歌手的热门歌曲进列表
 *
 * @param artistId 歌手ID
 * @param needMessage 是否需要弹窗提醒
 */
export async function addSingerToPlaylist(artistId: number, needMessage: boolean = true) {
    const songs = (await getArtist(artistId)).hotSongs;
    batchAddToPlaylist(songs, needMessage);
}

/**
 * 播放歌手热门歌曲
 *
 * @param artistId 歌手ID
 * @param artistName 歌手名字, 用于二次确认
 */
export async function playSingerHotSongs(artistId: number, artistName: string) {
    Modal.confirm({
        title: "播放歌手热门歌曲",
        content: `确定要播放'${artistName}的热门歌曲吗？这将清空当前播放列表。`,
        okText: "播放",
        cancelText: "取消",
        maskClosable: true,
        async onOk() {
            playList.value = [];
            await addSingerToPlaylist(artistId, false);
            playState.value.index = 0;
            playState.value.musicUrl = '';
            await handlePlay(0);
            message.success("播放列表已更新");
        }
    });
}

/**
 * 批量添加歌曲到播放列表
 *
 * @param songList 歌曲列表
 * @param needMessage 是否需要弹窗提醒
 */
function batchAddToPlaylist(songList: SongItem[], needMessage: boolean = true) {
    // 重复的歌曲不添加
    const existSongId = new Set(playList.value.map(value => value.id))
    const needToAddSongList = songList.filter(item => !existSongId.has(item.id));
    const repeatNumber = songList.length - needToAddSongList.length;
    playList.value.push(...needToAddSongList);
    if (needMessage) {
        message.info(`成功添加${needToAddSongList.length}首歌` +
            (repeatNumber ? `,重复${repeatNumber}` : ''));
    }
}

// ==================== 内部方法 ====================
// 检查歌曲是否有用
async function check(songId: number): Promise<boolean> {
    const res = await checkMusic(songId)
    return (res.code === 200 && res.success)
}

// 获取音乐的url
async function getMusicUrl(songId: number): Promise<string | null> {
    try {
        const res = await songUrl(songId)
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
