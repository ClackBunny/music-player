import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({mode}) => {
        const env = loadEnv(mode, process.cwd());
        const {VITE_MY_BASE_URL} = env
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
                        target: VITE_MY_BASE_URL,
                        changeOrigin: true,
                        rewrite: (path) => path.replace(/^\/api/, ''),
                        configure: (proxy, options) => {
                            if (mode === 'dev') {
                                proxy.on('proxyReq', (proxyReq, req, res) => {
                                    console.log(`[代理请求] ${req.method} ${req.url} → ${VITE_MY_BASE_URL}${proxyReq.path}`);
                                });

                                proxy.on('proxyRes', (proxyRes, req, res) => {
                                    console.log(`[代理响应] ${req.method} ${req.url} ← 状态码: ${proxyRes.statusCode}`);
                                });
                            }
                        }
                    }
                }
            }
        }
    }
)
