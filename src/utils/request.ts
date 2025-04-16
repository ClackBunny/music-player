import axios from 'axios';

import { showMessage } from './status' // 接口请求失败的状态码
import { message } from 'ant-design-vue'
import { useSeverLoadingStore } from '@/stores/serverLoading.ts'
import pinia from "@/stores";

const store = useSeverLoadingStore(pinia) // 调用方法,控制加载动画的开启关闭

// 创建axios实例
const request = axios.create({
    baseURL: "/api", // 设置请求的基地址
    timeout: 10000, // 请求超时时间
    withCredentials: true, // send cookies when cross-domain requests
});

declare module "axios" {
    interface AxiosInstance {
        (config: AxiosRequestConfig): Promise<any>

        // 这里追加你的参数
    }
}

// 请求白名单
const loadingWhiteList: string[] = []

// 请求拦截器
request.interceptors.request.use(
    config => {
        if (!loadingWhiteList.includes(config?.url ?? '')) { // 如果白名单中没有请求的url,则加载loading
            // loading = ElLoading.service(loadingConfig)
            store.isLoading(true)
        }
        // 在此处添加请求头等，如添加 token
        const token = localStorage.getItem("token");
        config.headers["Authorization"] = token ? "Bearer " + localStorage.getItem("token") : '';
        // 如果是 GET 请求，添加 timestamp 参数
        if (config.method?.toLowerCase() === 'get') {
            if (!config.params) {
                config.params = {};
            }
            // config.params.timestamp = Date.now(); // 当前时间戳（单位：毫秒）
        }
        // ✅ 拼接并打印最终 URL（仅开发环境可打印）
        if (import.meta.env.VITE_ENV === 'development') {
            const url = new URL(config.baseURL + (config.url ?? ''), window.location.origin);

            // 将 params 拼成 query string
            const params = new URLSearchParams(config.params || {}).toString();
            const fullUrl = `${url.pathname}${params ? '?' + params : ''}`;

            console.log(`[GET ${fullUrl}]`);
        }
        return config;
    },
    (error: any) => {
        store.isLoading(false)
        // loading.close()
        Promise.reject(error);
    }
);

// 响应拦截器
request.interceptors.response.use(
    (response: any) => {
        store.isLoading(false)
        // loading.close() // 关闭加载动画
        if (response.status === 200) {  // 如果请求连接成功
            if (response.data.code === 200 || response.config.responseType == 'blob'
            ) { // 如果请求的接口有返回数据
                return Promise.resolve(response.data);
            } else {
                message.error(response.data.message)
                return Promise.reject(response.data);
            }
        } else {  // 请求失败 通过message 提示错误信息
            message.error(showMessage(response.status))
            return Promise.reject(response);
        }
    },
    // 请求失败
    (error: any) => {
        store.isLoading(false)
        // loading.close()
        const {response} = error;
        if (response) {
            // 请求已发出，但是不在2xx的范围
            message.error(showMessage(response.status))

            return Promise.reject(response.data);
        } else {
            message.error('网络连接异常,请稍后再试!')
        }
    }
);

export default request;