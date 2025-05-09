export const diff = (a: any, b: any) => {
    console.log(a, b);
    const d:Record<string, any> = {};
    for(const key of [...Object.keys(a), ...Object.keys(b)]) {
        if(JSON.stringify(a[key]) != JSON.stringify(b[key]))
            d[key] = b[key];
    }
    return d;
}

export function transformBooleans(key: string, value: any) {
    if(value instanceof Boolean || typeof value == 'boolean')
        return value ? 1 : 0;
    return value;
}