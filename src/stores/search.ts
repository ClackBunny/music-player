import { computed, h, ref } from 'vue'
import { defineStore } from 'pinia'
import { CalendarOutlined, MailOutlined, SettingOutlined, } from '@ant-design/icons-vue'
import { type MenuProps } from 'ant-design-vue';
import { SearchType } from "@/api/search.ts";

export const useSearchStore = defineStore('search', () => {

    const keyword = ref<string>('')
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
            icon: () => h(MailOutlined),
            label: '单曲',
            title: '单曲',
        },
        {
            key: 'songList',
            icon: () => h(CalendarOutlined),
            label: '歌单',
            title: '歌单',
        },
        {
            key: 'singer',
            icon: () => h(SettingOutlined),
            label: '歌手',
            title: '歌手',
        },
        {
            key: 'album',
            icon: () => h(SettingOutlined),
            label: '专辑',
            title: '专辑',
        }
    ]);
    const hasKeywords = computed(() => {
        return !!keyword?.value?.length
    })

    /*
    * 获取menu对应key的路由*/
    function getRoute(key: string) {
        return routeMap.has(key) ? routeMap.get(key) : "/"
    }


    return {keyword, hasKeywords, menuItems, routeMap, typeMap, getRoute};
})
