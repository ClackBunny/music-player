import { h, ref } from 'vue'
import { defineStore } from 'pinia'
import { CalendarOutlined, } from '@ant-design/icons-vue'
import type { ItemType } from 'ant-design-vue'

export const useLayoutSideStore = defineStore('layoutSide', () => {
    const collapsed = ref(false)
    const routeMap = new Map([
        ["temp", "/temp"],
        ["search", "/search"],
        ["login", "/login"],
    ])
    const menuItems = ref<Array<ItemType>>([

        {
            key: 'search',
            icon: () => h(CalendarOutlined),
            label: 'search',
            title: 'search',
        },
        {
            type: 'divider',
        },
    ]);

    function trigger() {
        collapsed.value = !collapsed.value
    }

    /*
    * 获取menu对应key的路由*/
    function getRoute(key: string) {
        return routeMap.has(key) ? routeMap.get(key) : "/"
    }


    return {collapsed, menuItems, trigger, routeMap, getRoute};
})
