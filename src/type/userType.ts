/**
 *  用户相关的类型
 *
 * @Author: kongxin
 * @Date: 2025/4/20 10:08:36
 * @LastEditors: kongxin
 */

export type userProfile = {
    "avatarDetail": null,
    "birthday": number,
    "gender": number,
    "nickname": string,
    "avatarUrl": string,
    "backgroundUrl"?: string,
    "createTime": number,
    "description": string,
    "userId": number,
    "signature": string,
    "authority": number,
    "followeds": number,
    "follows": number,
    "blacklist": false,
    "eventCount": number,
    "allSubscribedCount": number,
    "playlistBeSubscribedCount": number,
    "followMe": false,
    "cCount": number,
    "inBlacklist": false,
    "sDJPCount": number,
    "playlistCount": number,
    "sCount": number,
    "newFollows": number
}

// user/detail接口的返回结果
export type UserDetailApiResponse = {
    code: number,
    level: number,
    "listenSongs": number,
    "userPoint": {
        "userId": number,
        "balance": number,
        "updateTime": number,
        "version": number,
        "status": number,
        "blockBalance": number,
    },
    "profile": userProfile

}