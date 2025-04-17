/**
 * 转换对象中的字段名
 *
 * @Author: kongxin
 * @Date: 2025/4/17 21:53:06
 * @LastEditors: kongxin
 */

/**
 * 字段重命名规则类型
 * @template T 原始对象类型
 */
export type RenameFieldRule<T = any> = {
    /** 要映射的原始字段路径，如 'user.name' */
    from: string;
    /** 可选的字段值转换函数 */
    transform?: (value: any) => any;
    /** 当字段不存在时的默认值 */
    default?: any;
    /** 是否为必需字段，若未提供将抛出错误 */
    required?: boolean;
};

/**
 * 映射表类型，键为目标字段路径，值为对应的重命名规则
 */
export type RenameMap<T = any> = {
    [toPath: string]: RenameFieldRule<T>;
};

/**
 * 将路径字符串（支持 a.b[0].c 格式）转换为键数组
 */
function parsePath(path: string): (string | number)[] {
    return path.split('.').flatMap(part =>
        part.split(/\[([^}]+)\]/).filter(Boolean).map(p => (isNaN(Number(p)) ? p : Number(p)))
    );
}

/**
 * 根据嵌套路径从对象中安全获取值
 */
function getNestedValue(obj: any, path: string): any {
    return parsePath(path).reduce((acc, key) => acc?.[key], obj);
}

/**
 * 根据嵌套路径设置对象中的值（自动创建中间结构）
 */
function setNestedValue(obj: any, path: string, value: any): void {
    const keys = parsePath(path);
    keys.reduce((acc, key, index) => {
        if (index === keys.length - 1) {
            acc[key] = value;
        } else {
            if (!(key in acc)) acc[key] = typeof keys[index + 1] === 'number' ? [] : {};
            return acc[key];
        }
        return acc;
    }, obj);
}

/**
 * 对单个对象进行字段重命名
 *
 * @param obj 原始对象
 * @param renameMap 字段映射表
 * @param preserveUnmapped 是否保留未映射的原始字段（默认 false）
 * @returns 一个重命名后的新对象
 */
export function renameKeys<T extends Record<string, any>, R extends RenameMap<T>>(
    obj: T,
    renameMap: R,
    preserveUnmapped = false
): Record<string, any> {
    const result: Record<string, any> = {};

    for (const toPath in renameMap) {
        const rule = renameMap[toPath];
        const rawValue = getNestedValue(obj, rule.from);

        if (rawValue === undefined) {
            if (rule.required) throw new Error(`字段 "${rule.from}" 是必需的`);
            else if ('default' in rule) setNestedValue(result, toPath, rule.default);
        } else {
            const finalValue = rule.transform ? rule.transform(rawValue) : rawValue;
            setNestedValue(result, toPath, finalValue);
        }
    }

    if (preserveUnmapped) {
        for (const key in obj) {
            const isMapped = Object.values(renameMap).some(rule => rule.from.split('.')[0] === key);
            if (!isMapped) result[key] = obj[key];
        }
    }

    return result;
}

/**
 * 对对象数组进行字段重命名
 *
 * @param list 原始对象数组
 * @param renameMap 字段映射表
 * @param preserveUnmapped 是否保留未映射的原始字段（默认 false）
 * @returns 重命名后的对象数组
 */
export function renameKeysList<T extends object, R extends RenameMap<T>>(
    list: T[],
    renameMap: R,
    preserveUnmapped = false
): Record<string, any>[] {
    return list.map(item => renameKeys(item, renameMap, preserveUnmapped));
}
