import { parse as fnsparse } from 'date-fns'
import { ExpenseType, IncomeType, InsertExp } from '../contexts/expenseCTX'
import { Database } from '@/types/supabase'

export const functions: {
    [index: string]: (arr: string[]) => InsertExp | null
} = {
    commerzbank: CommerzBank,
    revolut: Revolut,
    wise: Wise,
}

class Transaction {
    line: string[]
    label: string
    amount: number
    currency: string
    category: [number, number]
    refunded: boolean
    transaction_date: Date
    recurring: boolean
    files: string[]
    is_displayed?: boolean
    constructor(
        line: string[],
        label: number,
        amount: number,
        currency: number,
        category: [number, number] | null,
        refunded: boolean,
        transaction_date: number,
        recurring: boolean,
        dateFormat: string,
        files: string[],
        is_displayed?: boolean
    ) {
        this.line = line
        this.label = line[label]
        this.amount = Math.abs(Number(line[amount]))
        this.currency = line[currency]
        this.category = category ? category : [0, 0]
        this.transaction_date = fnsparse(
            line[transaction_date],
            dateFormat,
            new Date()
        )
        this.refunded = Boolean(false)
        this.recurring = Boolean(false)
        this.files = files
        this.is_displayed = is_displayed
    }
    toJSONData() {
        return {
            label: this.label,
            amount: this.amount,
            currency: this.currency,
            category: this.category,
            transaction_date: this.transaction_date,
            refunded: this.refunded,
            recurring: this.recurring,
            files: this.files,
            is_displayed: this.is_displayed,
        }
    }
}

function Wise(arr: string[]) {
    const twID = arr[0].trim().toLowerCase()
    if (!twID.startsWith('card')) return null
    const transaction = new Transaction(
        arr,
        4,
        2,
        3,
        null,
        false,
        1,
        false,
        'dd-MM-yyyy',
        []
    )
    transaction.label = transaction.label.split('issued by ')[1]
    return transaction.toJSONData()
}

function Revolut(arr: any) {
    let transactionDate,
        label,
        amount,
        currency = null
    if (arr[0] !== 'CARD_PAYMENT') {
        return null
    } else {
    }
    ;[, , transactionDate, , label, amount, , currency] = arr
    const transaction = new Transaction(
        arr,
        4,
        5,
        7,
        null,
        false,
        2,
        false,
        'yyyy-MM-dd HH:mm:ss',
        []
    )
    return transaction.toJSONData()
}

function CommerzBank(arr: string[]) {
    if (arr.length > 0) {
        if (arr[2] == 'debit') {
            const transaction = new Transaction(
                arr,
                3,
                4,
                5,
                null,
                false,
                0,
                false,
                'dd.MM.yyyy',
                []
            )
            transaction.label = transaction.label.split('/')[0]
            return transaction.toJSONData()
        } else {
            return null
        }
    } else {
        return null
    }
}
