import { h, ref } from 'vue'
import { defineStore } from 'pinia'
import { type MenuProps } from 'ant-design-vue';
import { SearchType } from "@/type/searchType.ts";


export const useSearchStore = defineStore('search', () => {

    const routeMap = new Map([
        ["singleSong", "/search/singleSong"],
        ["songList", "/search/songList"],
        ["singer", "/search/singer"],
        ["album", "/search/album"],
    ])
    const typeMap = new Map([
        ["singleSong", SearchType.SINGLE_SONG.valueOf()],
        ["songList", SearchType.SONG_LIST.valueOf()],
        ["singer", SearchType.SINGER.valueOf()],
        ["album", SearchType.ALBUM.valueOf()],
    ])
    const menuItems = ref<MenuProps['items']>([
        {
            key: "singleSong",
            icon: () => h("span", {class: 'iconfont kongxin-music', style: {fontSize: '16px', height: '14px'}},),
            label: '单曲',
            title: '单曲',
        },
        {
            key: 'songList',
            icon: () => h("span", {class: 'iconfont kongxin-gedan', style: {fontSize: '16px', height: '16px'}},),
            label: '歌单',
            title: '歌单',
        },
        {
            key: 'singer',
            icon: () => h("span", {class: 'iconfont kongxin-geshou1', style: {fontSize: '16px', height: '16px'}},),
            label: '歌手',
            title: '歌手',
        },
        {
            key: 'album',
            icon: () => h("span", {class: 'iconfont kongxin-zhuanji', style: {fontSize: '16px', height: '16px'}},),
            label: '专辑',
            title: '专辑',
        }
    ]);

    /*
    * 获取menu对应key的路由*/
    function getRoute(key: string) {
        return routeMap.has(key) ? routeMap.get(key) : "/"
    }


    return {menuItems, routeMap, typeMap, getRoute};
})
