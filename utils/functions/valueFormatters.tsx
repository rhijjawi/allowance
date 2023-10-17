import { ExpenseType } from "@/components/contexts/expenseCTX";
export const currFormatter = (number: number, curr: string = "USD") => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: curr}).format(number)
};
export const standardizeCurrency = async(transaction : ExpenseType, currency : string = "USD") => {
    const [Y,M,D] = (transaction.transaction_date.split('-'));
    let _
    if (new Date(transaction.transaction_date) > new Date()){
        _ = await fetch(`http://127.0.0.1:3001/today/${transaction.currency}/${currency}`)
    }
    else {
        _ = await fetch(`http://127.0.0.1:3001/historical/${Y}-${M}-${D}/${transaction.currency}/${currency}`)
    }
    let data = await _.json()
    return data.amount * transaction.amount
}
export const NumToMonth = (number : number) : string => {
    return "January,February,March,April,May,June,July,August,September,October,November,December".split(",")[number]
}