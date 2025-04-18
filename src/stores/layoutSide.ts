import { h, ref } from 'vue'
import { defineStore } from 'pinia'
import { AppstoreOutlined, CalendarOutlined, MailOutlined, SettingOutlined, } from '@ant-design/icons-vue'
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
            key: "temp",
            icon: () => h(MailOutlined),
            label: 'temp',
            title: 'temp',
        },
        {
            key: 'search',
            icon: () => h(CalendarOutlined),
            label: 'search',
            title: 'search',
        },
        {
            type: 'divider',
        },
        {
            key: 'login',
            icon: () => h(SettingOutlined),
            label: 'login',
            title: 'login',
        },
        {
            key: 'sub1',
            label: '我的',
            title: '我的',
            children: [
                {
                    key: '3',
                    icon: () => h(AppstoreOutlined),
                    label: 'temp',
                    title: 'Option 3',
                },
                {
                    key: '4',
                    icon: () => h(AppstoreOutlined),
                    label: 'Option 4',
                    title: 'Option 4',
                },
                {
                    key: 'sub1-2',
                    icon: () => h(AppstoreOutlined),
                    label: 'Submenu',
                    title: 'Submenu',
                },
            ],
        },
        {
            key: 'sub2',
            icon: () => h(SettingOutlined),
            label: 'group 1',
            title: 'group1',
            children: [
                {
                    key: '7',
                    label: 'Option 7',
                    title: 'Option 7',
                },
                {
                    key: '8',
                    label: 'Option 8',
                    title: 'Option 8',
                },
                {
                    key: '9',
                    label: 'Option 9',
                    title: 'Option 9',
                },
                {
                    key: '10',
                    label: 'Option 10',
                    title: 'Option 10',
                },
            ],
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
