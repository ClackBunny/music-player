import './assets/main.css'
import { createApp } from 'vue'
import Antd, { message } from 'ant-design-vue'

import App from './App.vue'
import router from './router'
import pinia from "@/stores";
import "normalize.css"
import "@/assets/iconfont/iconfont.css"

const app = createApp(App)
const env = import.meta.env

app.use(pinia)
app.use(router)
app.use(Antd)

app.config.globalProperties.$message = message
app.config.performance = true
app.mount('#app')
