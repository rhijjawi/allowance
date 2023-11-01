import { ExpenseType, IncomeType } from "@/components/contexts/expenseCTX"
import { CategorySchema } from "@/types/supabase"

export function MonthExpenses(expenses : any, month : Date){
    return expenses.filter((expense : any) => {
        let date = new Date(expense.transaction_date)
        if (date.getUTCMonth() == month.getUTCMonth() && date.getFullYear() == month.getUTCFullYear()){return expense}
    })
};
export function LastPeriodDates(){
    return [new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1), new Date(new Date().setUTCMonth(new Date().getUTCMonth() - 1)), new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date()]
}
export function From1sttoNowEXP(expenses : ExpenseType[]|IncomeType[], category: CategorySchema){
    const lastMonthToDate = expenses.filter((expense : ExpenseType|IncomeType) => {
        let today = new Date()
        const transaction_date = new Date(expense.transaction_date)
        let firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        let lastDayAllowed = new Date();
        if (expense.recurring){
            const day = transaction_date.getDate()
            const today = new Date().getDate()         
            if ((day < today)&& (expense.category[0] == category.id)){
                console.log('recurringLast', expense, expense.recurring, day, today)
                return true
            }
        }
        return ((firstDay <= new Date(expense.transaction_date) && new Date(expense.transaction_date) <= lastDayAllowed) && expense.category[0] == category.id)
    })
    const MonthToDate = expenses.filter((expense : ExpenseType|IncomeType) => {
        const transaction_date = new Date(expense.transaction_date)
        let firstDayLastMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
        let lastDayAllowedLastMonth = new Date(new Date().setUTCMonth(new Date().getUTCMonth() - 1));
        if (expense.recurring){
            const day = transaction_date.getDate()
            const today = new Date().getDate()         
            if ((day < today)&& (expense.category[0] == category.id)){
                console.log('recurring', expense, expense.recurring, day, today)
                return true
            }
        }
        return ((firstDayLastMonth <= transaction_date && transaction_date <= lastDayAllowedLastMonth) && expense.category[0] == category.id)
    })
    return [lastMonthToDate, MonthToDate]
}
export function From1sttoNowINC(incomes : IncomeType[], category: CategorySchema){
    const lastMonthToDate = incomes.filter((income : IncomeType) => {
        let today = new Date()
        let firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        let lastDayAllowed = new Date();
        return ((firstDay <= new Date(income.transaction_date) && new Date(income.transaction_date) <= lastDayAllowed))
    })
    const MonthToDate = incomes.filter((income : IncomeType) => {
        console.log(income)
        const transaction_date = new Date(income.transaction_date)
        let firstDayLastMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
        let lastDayAllowedLastMonth = new Date(new Date().setUTCMonth(new Date().getUTCMonth() - 1));
        return (firstDayLastMonth <= transaction_date) && (transaction_date <= lastDayAllowedLastMonth)
    })
    return [lastMonthToDate, MonthToDate]
}