import request from "@/utils/request.ts";
import axios from "axios";

export enum SearchType {
    SINGLE_SONG = 1,
    ALBUM = 10,
    SINGER = 100,
    SONG_LIST = 1000,
}

export function search(keyword: string, type: SearchType = SearchType.SINGLE_SONG, ) {
    return request.get('/search', {
        params: {
            keywords: keyword,
            type: type.valueOf()
        },
    })
}