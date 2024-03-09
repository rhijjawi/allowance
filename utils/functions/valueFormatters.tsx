import { ExpenseType, IncomeType } from '@/components/contexts/expenseCTX'
export const currFormatter = (number: number, curr: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: curr,
    }).format(number)
}
export const standardizeCurrency = async (
    transaction: ExpenseType | IncomeType,
    currency: string = 'USD'
) => {
    const [Y, M, D] = transaction.transaction_date.toString().split('-')
    const url =
        process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:3001'
            : 'https://api.logmoney.app'
    let _
    if (transaction.currency === currency) return 1 * transaction.amount
    if (new Date(transaction.transaction_date) > new Date()) {
        _ = await fetch(`${url}/today/${transaction.currency}/${currency}`)
    } else {
        _ = await fetch(
            `${url}/historical/${Y}-${M}-${D}/${transaction.currency}/${currency}`
        )
    }
    let data = await _.json()
    return data.amount * transaction.amount
}
export const standardizeCurrencyGeneral = async (
    amount: number,
    srccurrency: string = 'USD',
    destcurrency: string
) => {
    const url =
        process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:3001'
            : 'https://api.logmoney.app'
    if (srccurrency === destcurrency) return amount
    let _ = await fetch(`${url}/today/${srccurrency}/${destcurrency}`)
    let data = await _.json()
    return data.amount * amount
}
export const NumToMonth = (number: number): string => {
    return 'January,February,March,April,May,June,July,August,September,October,November,December'.split(
        ','
    )[number]
}
export const MonthToNum = (month: string): number => {
    return 'January,February,March,April,May,June,July,August,September,October,November,December'
        .split(',')
        .indexOf(month)
}
