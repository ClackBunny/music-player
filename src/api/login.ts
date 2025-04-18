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

export function loginQrCheck(key: string,): Promise<loginQrCheckApiResponse> {
    return request.get('/login/qr/check', {
        params: {
            "key": key,
            "timestamp": Date.now(),
        },
    })
}

export function loginQrCreate(key: string): Promise<loginQrCreateApiResponse> {
    console.log("在请求创建时,key=", key);
    return request.get('/login/qr/create', {
        params: {
            "key": key,
            qrimg: 1,
        }
    })
}

export function loginQrKey(): Promise<loginQrKeyApiResponse> {
    return request.get<loginQrKeyApiResponse>('/login/qr/key', {})
}