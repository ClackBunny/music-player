import request from "@/utils/request.ts";

type loginQrKeyApiResponse = {
    data: {
        code: number,
        unikey: string
    },
    code: number;
}
type loginQrCreateApiResponse = {
    data: {
        qrurl: string,
        qrimg: string,
    },
    code: number
}


type loginQrCheckApiResponse = {
    code: number,
    message: string,
    cookie: string
}

type loginStatusApiResponse = {
    data: {
        code: number,
        account: any,
        profile: any
    },
}

export function loginQrCheck(key: string,): Promise<loginQrCheckApiResponse> {
    return request.get('/login/qr/check', {
        params: {
            "key": key,
            "timestamp": Date.now(),
        },
    })
}

/**
 * 创建登录的二维码
 * @param key
 */
export function loginQrCreate(key: string): Promise<loginQrCreateApiResponse> {
    return request.get('/login/qr/create', {
        params: {
            "key": key,
            qrimg: 1,
        }
    })
}

/**
 * 生成登录用的key
 * @param timeStamp
 */
export function loginQrKey(timeStamp: number = 0): Promise<loginQrKeyApiResponse> {
    return request.get<loginQrKeyApiResponse>('/login/qr/key', {
        params: {
            timestamp: timeStamp,
        }
    })
}

/**
 * 用户登录状态
 *
 * @param timeStamp
 */
export function loginStatus(timeStamp: number = 0): Promise<loginStatusApiResponse> {
    return request.get<loginStatusApiResponse>('/login/status', {
        params: {
            timestamp: timeStamp,
        }
    })
}