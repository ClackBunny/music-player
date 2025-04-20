import { createRouter, createWebHistory } from 'vue-router'
import Search from "@/views/Search.vue";
import Temp from "@/Temp.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            redirect: '/search'
        },
        {
            path: '/search',
            name: 'search',
            component: Search
        },
        {
            path: '/temp',
            name: 'temp',
            component: Temp
        },
    ],
})

export default router
