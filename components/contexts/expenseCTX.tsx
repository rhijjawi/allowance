import React, { createContext, use, useContext, useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { getSupabase } from "@/utils/supabase";
import { useRouter } from "next/router";
import { ExpenseSchema, CategorySchema, IncomeSchema } from "@/types/supabase";
import Metadata from "../interfaces/userwithMetadata";
import { standardizeCurrency } from "@/utils/functions/valueFormatters";
const ExpenseCTX = createContext<any>([])

export function ExpenseCTXProvider({children} : {children: React.ReactNode}){
    const [expenseData, setExpenseData] = useState<ExpenseSchema[]>([])
    const [categoryData, setcategoryData] = useState<CategorySchema[]>([])
    const [incomeData, setIncomeData] = useState<IncomeSchema[]>([])
    const [incomeCategoryData, setIncomeCategoryData] = useState<CategorySchema[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [_error, _setError] = useState<boolean>(false)
    const router = useRouter()
    const { user, error, isLoading } = useUser() as {user : Metadata, error: any, isLoading: boolean};
    
    useEffect(() => {
        if (!user && !isLoading){
            setLoading(false)
            _setError(true)
        }
        
        async function fetchExpenses(){
            const supabase = await getSupabase(user!.accessToken)
            console.log(supabase)
            const { data, error } = await supabase.from('expenses').select('*').order('transaction_date', { ascending: false }) as {data : ExpenseSchema[], error:any}
            const categories  = await supabase.from('categories').select('*').order('id', { ascending: true })
            if (categories.data){
                setcategoryData(categories.data)
            }
            if (categories.error){
                _setError(true)
            }
            const income  = await supabase.from('income').select('*').order('id', { ascending: true })
            const incomeCategories  = await supabase.from('incomeCategories').select('*').order('id', { ascending: true })
            if (income.data){
                let standardizedIncomes : IncomeSchema[] = []
                for (const _ of income.data){
                    let standardizedCurrency = await standardizeCurrency(_, user.user_metadata?.currency)
                    _['standardizedCurrency'] = standardizedCurrency
                    standardizedIncomes.push(_)
                }
                setIncomeData(income.data)
            }
            if (income.error){
                _setError(true)
            }
            if (incomeCategories.data){
                setIncomeCategoryData(incomeCategories.data)
            }
            if (error || income.error || categories.error || incomeCategories.error){
                if (error.code == "PGRST301") {
                    router.push('/api/auth/login')
                }
                _setError(true)
            }
            if (data){
                let standardizedExpenses : ExpenseSchema[] = []
                for (let expense of data){
                    let standardizedCurrency = await standardizeCurrency(expense, user.user_metadata?.currency)
                    expense['standardizedCurrency'] = standardizedCurrency
                    standardizedExpenses.push(expense)
                }
                setExpenseData(standardizedExpenses)
            }
            setLoading(false)
        }
        if (user && !isLoading){
            fetchExpenses()
        }
        
    }, [user])
    return (
        <ExpenseCTX.Provider value={{expenseData, categoryData, incomeData, incomeCategoryData, _error, loading, setExpenseData, setIncomeData}}>
            {children}
        </ExpenseCTX.Provider>
    )
}
export type ExpenseType = ExpenseSchema
export type IncomeType = IncomeSchema
export function useExpenses(){
    const ctx = useContext(ExpenseCTX)
    if (ctx === undefined) throw new Error("useExpenseCTX must be used within a ExpenseCTXProvider")
    return ctx
}