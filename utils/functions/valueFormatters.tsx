import { ExpenseType, IncomeType } from "@/components/contexts/expenseCTX";
export const currFormatter = (number: number, curr: string = "USD") => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: curr}).format(number)
};
export const standardizeCurrency = async(transaction : ExpenseType|IncomeType, currency : string = "USD") => {
    const [Y,M,D] = (transaction.transaction_date.split('-'));
    let _
    if (new Date(transaction.transaction_date) > new Date()){
        _ = await fetch(`https://api.logmoney.app/today/${transaction.currency}/${currency}`)
    }
    else {
        _ = await fetch(`https://api.logmoney.app/historical/${Y}-${M}-${D}/${transaction.currency}/${currency}`)
    }
    let data = await _.json()
    return data.amount * transaction.amount
}
export const NumToMonth = (number : number) : string => {
    return "January,February,March,April,May,June,July,August,September,October,November,December".split(",")[number]
}
export const MonthToNum = (month : string) : number => {
    return "January,February,March,April,May,June,July,August,September,October,November,December".split(",").indexOf(month)
}