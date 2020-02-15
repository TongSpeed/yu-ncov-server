const _pinyin = require("pinyin");


export const pinyin =( first: boolean = false)=> (a: string): string => {
    const style = first ? _pinyin.STYLE_FIRST_LETTER : _pinyin.STYLE_NORMAL;
    const result: string[][] = _pinyin(a, { style })
    return result.map(
        (a: string[]) => a.length > 0 ? a[0] : '').join('')
}
export const pinyinFull = (a: string): string[] =>[pinyin(true)(a),pinyin(false)(a)] 
export const pinyinFullString = (a: string): string =>pinyinFull(a).join(' ')