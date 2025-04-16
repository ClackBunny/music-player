import request from "@/utils/request.ts";

export function loginQrCheck(key: string,) {
    return request.get('/login/qr/check', {
        params: {
            "key": key,
        },
    })
}

export function loginQrKey() {
    return request.get('/login/qr/key', {})
}