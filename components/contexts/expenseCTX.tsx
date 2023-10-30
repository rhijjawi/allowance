import React, { createContext, use, useContext, useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
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
    const { user, isSignedIn, isLoaded } = useUser()
    const {getToken} = useAuth()
    useEffect(() => {
        if (!user && isLoaded){
            setLoading(false)
            _setError(true)
        }
        //(requesting_user_id() = user_id)
        async function fetchExpenses(){
            const token = await getToken({template: "supabase"})
            const supabase = await getSupabase(token)
            const { data, error } = await supabase.from('expenses').select('*').order('transaction_date', { ascending: false }) as {data : ExpenseSchema[], error:any}
            
            console.log(user, token, data)
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
                    let standardizedCurrency = await standardizeCurrency(_, user!.publicMetadata.currency as string)
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
                    {/* 
                        RE LOG IN!!!
                    */}
                }
                _setError(true)
            }
            if (data){
                let standardizedExpenses : ExpenseSchema[] = []
                for (let expense of data){
                    let standardizedCurrency = await standardizeCurrency(expense, user?.publicMetadata.currency as string)
                    expense['standardizedCurrency'] = standardizedCurrency
                    standardizedExpenses.push(expense)
                }
                setExpenseData(standardizedExpenses)
            }
            setLoading(false)
        }
        if (user && isLoaded){
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