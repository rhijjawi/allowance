import { Color } from '@tremor/react'
import {
    standardizeCurrency,
    standardizeCurrencyGeneral,
} from './valueFormatters'

export function BudgetStatus(percentage: number): [Color, string] {
    let color: Color
    let status: string
    if (percentage > 100) {
        color = 'red'
        status = 'Exceeded budget'
    } else if (percentage > 75) {
        color = 'orange'
        status = 'Nearing budget limit'
    } else if (percentage > 50) {
        color = 'yellow'
        status = 'Halfway to budget limit'
    } else if (percentage > 25) {
        color = 'green'
        status = 'Good standing'
    } else {
        color = 'blue'
        status = 'Well below limit'
    }
    return [color, status]
}
export async function BudgetMath(
    sum: number,
    prefferedCurr: string,
    budget: [number, string]
): Promise<[number, number]> {
    const [budgetAmount, budgetCurrency] = budget
    const sumInBudgetCurrency = await standardizeCurrencyGeneral(
        sum,
        prefferedCurr,
        budgetCurrency
    )
    console.log(sumInBudgetCurrency, budgetAmount)
    return [(sumInBudgetCurrency / budgetAmount) * 100, sumInBudgetCurrency]
}
