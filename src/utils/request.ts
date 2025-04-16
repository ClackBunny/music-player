// utils/request.ts
import axios, {
    type AxiosInstance,
    type AxiosRequestConfig,
    type AxiosResponse,
    type InternalAxiosRequestConfig,
} from 'axios';
import { message } from 'ant-design-vue';
import { showMessage } from './status';
import { useSeverLoadingStore } from '@/stores/serverLoading.ts';
import pinia from '@/stores';

const store = useSeverLoadingStore(pinia);

// 请求白名单：不显示 loading 的接口
const loadingWhiteList: string[] = [];

// 创建 Axios 实例
const service: AxiosInstance = axios.create({
    baseURL: '/api',
    timeout: 10000,
    withCredentials: true,
});

// ✅ 请求拦截器
service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        if (config.method?.toLowerCase() === 'get') {
            config.params = {
                ...(config.params || {}),
                // timestamp: Date.now() // optional: 防缓存
            };
        }

        if (!loadingWhiteList.includes(config.url || '')) {
            store.isLoading(true);
        }

        // 打印最终URL
        if (import.meta.env.VITE_ENV === 'development') {
            const url = new URL(config.baseURL + (config.url ?? ''), window.location.origin);
            const params = new URLSearchParams(config.params || {}).toString();
            console.log(`[REQUEST]: ${url.pathname}${params ? '?' + params : ''}`);
        }

        return config;
    },
    (error) => {
        store.isLoading(false);
        return Promise.reject(error);
    }
);

// ✅ 响应拦截器
service.interceptors.response.use(
    (response: AxiosResponse) => {
        store.isLoading(false);

        // ✅ 成功并返回 code === 200（业务成功）
        if (
            response.status === 200 &&
            (response.data?.code === 200 || response.config.responseType === 'blob')
        ) {
            return response.data;
        } else {
            message.error(response.data?.message || '请求失败');
            return Promise.reject(response.data);
        }
    },
    (error) => {
        store.isLoading(false);

        const response = error?.response;
        if (response) {
            message.error(showMessage(response.status) || '请求异常');
            return Promise.reject(response.data);
        } else {
            message.error('网络连接异常，请稍后重试！');
            return Promise.reject(error);
        }
    }
);

// ✅ 封装通用请求类型（自动解包 data）
interface MyAxios {
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;

    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;

    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;

    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

const request: MyAxios = {
    get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
        service.get<T>(url, config).then((res) => res as T),
    post: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
        service.post<T>(url, data, config).then((res) => res as T),
    put: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
        service.put<T>(url, data, config).then((res) => res as T),
    delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
        service.delete<T>(url, config).then((res) => res as T),
};


export default request;
