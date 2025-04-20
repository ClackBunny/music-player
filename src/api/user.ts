import request from "@/utils/request.ts";
import type { UserDetailApiResponse } from "@/type/userType.ts";

/**
 *  用户相关接口
 *
 * @Author: kongxin
 * @Date: 2025/4/20 10:05:32
 * @LastEditors: kongxin
 */

export function getUserDetail(uid: number) {
    return request.get<UserDetailApiResponse>('/user/detail', {
        params: {
            uid: uid
        }
    })
}