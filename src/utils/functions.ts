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

export const formatBalance = (value: string, significantFractionDigits = 3) => {
    const normalized = value.trim()
    if (!normalized) {
        return normalized
    }

    const sign = normalized.startsWith('-') ? '-' : ''
    const unsigned = sign ? normalized.slice(1) : normalized
    const [rawIntegerPart, rawFractionPart = ''] = unsigned.split('.')
    const integerPart = rawIntegerPart || '0'
    const firstSignificantFractionIndex = rawFractionPart.search(/[1-9]/)

    if (firstSignificantFractionIndex === -1) {
        return `${sign}${integerPart}`
    }

    const decimalPlaces = firstSignificantFractionIndex + significantFractionDigits
    const fractionPart = rawFractionPart.padEnd(decimalPlaces + 1, '0')
    const keptFractionDigits = fractionPart.slice(0, decimalPlaces).split('')
    const shouldRoundUp = Number(fractionPart[decimalPlaces]) >= 5
    const integerDigits = integerPart.split('')

    if (shouldRoundUp) {
        let carry = 1
        for (let i = keptFractionDigits.length - 1; i >= 0 && carry; i--) {
            const nextDigit = Number(keptFractionDigits[i]) + carry
            keptFractionDigits[i] = String(nextDigit % 10)
            carry = nextDigit > 9 ? 1 : 0
        }

        for (let i = integerDigits.length - 1; i >= 0 && carry; i--) {
            const nextDigit = Number(integerDigits[i]) + carry
            integerDigits[i] = String(nextDigit % 10)
            carry = nextDigit > 9 ? 1 : 0
        }

        if (carry) {
            integerDigits.unshift('1')
        }
    }

    const roundedFractionPart = keptFractionDigits.join('').replace(/0+$/, '')

    if (!roundedFractionPart) {
        return `${sign}${integerDigits.join('')}`
    }

    return `${sign}${integerDigits.join('')}.${roundedFractionPart}`
}
