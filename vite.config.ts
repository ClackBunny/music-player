import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({mode}) => {
    const env = loadEnv(mode,process.cwd());
    const {VITE_BASE_URL} = env
    return {
        plugins: [
            vue(),
            vueDevTools(),
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            },
        },
        server: {
            proxy: {
                // 这里配置代理, 可以用envConfig里面配置
                '/api': {
                    target: VITE_BASE_URL,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, '')
                }
            }
        }
    }
})
