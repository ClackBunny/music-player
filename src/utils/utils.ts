import type { LocationQueryValue } from "vue-router";

/**
 * 将路由查询参数转换为字符串
 * @param value 查询参数值
 * @param defaultValue 当值为空时的默认值
 * @returns 转换后的字符串
 */
export function queryToString(
    value: LocationQueryValue | LocationQueryValue[],
    defaultValue: string = ''
): string {
    if (Array.isArray(value)) {
        // 处理数组类型，取第一个有效值
        return value.length > 0 ? String(value[0]) : defaultValue;
    }

    // 处理字符串类型和 null/undefined
    return value != null ? String(value) : defaultValue;
}

/**
 * 将路由查询参数转换为字符串
 * @param value 查询参数值
 * @param defaultValue 当值为空时的默认值
 * @returns 转换后的字符串
 */
export function queryToNumber(
    value: LocationQueryValue | LocationQueryValue[],
    defaultValue: number = 0,
): number {
    if (Array.isArray(value)) {
        // 处理数组类型，取第一个有效值
        return value.length > 0 ? Number(value[0]) : defaultValue;
    }

    // 处理字符串类型和 null/undefined
    return value != null ? Number(value) : defaultValue;
}

/**
 * 将秒变成01:00的形式
 * @param seconds 秒数
 */
export function secondsToMinutes(seconds: number) {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}