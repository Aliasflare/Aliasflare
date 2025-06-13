export const diff = (a: any, b: any) => {
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

export function getReadableTextColor(hexColor: string) {
  if (hexColor.length === 4) hexColor = '#' + [...hexColor.slice(1)].map(c => c + c).join('');
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? 'black' : 'white';
}