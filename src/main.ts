import './assets/main.css'
import { createApp } from 'vue'
import Antd, { message } from 'ant-design-vue'

import App from './App.vue'
import router from './router'
import pinia from "@/stores";
import "normalize.css"

const app = createApp(App)
const env = import.meta.env
console.log(env)
app.use(pinia)
app.use(router)
app.use(Antd)
// app.use(Button)
// app.use(Layout)
// app.use(Menu)

app.config.globalProperties.$message = message
app.mount('#app')
