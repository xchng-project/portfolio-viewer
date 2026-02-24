export const compactString = (str: string, chars?: number, saveFirst?: number) => {
    if (!str) {
        return str
    }
    const useChars = chars || 3
    if (saveFirst && str.length < useChars * 2 + 2 + saveFirst) {
        return str
    }
    if (str.length < useChars * 2 + 2) {
        return str
    }
    if (saveFirst) {
        return `${str.slice(0, useChars + saveFirst)}...${str.slice(-useChars)}`
    }
    return `${str.slice(0, useChars)}...${str.slice(-useChars)}`
}
