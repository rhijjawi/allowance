import { CategorySchema, ExpenseSchema, IncomeSchema } from "@/types/supabase"

export type ExpenseProvider = {
    expenseData:ExpenseSchema[],
    categoryData:CategorySchema[],
    incomeData:IncomeSchema[],
    incomeCategoryData:CategorySchema[],
    _error:any,
    loading: true|false,
    setExpenseData: React.Dispatch<React.SetStateAction<ExpenseSchema[]>>,
    setIncomeData: React.Dispatch<React.SetStateAction<IncomeSchema[]>>
}