import { BarChart } from "@tremor/react";
import { ExpenseType, useExpenses } from "../contexts/expenseCTX";
import { currFormatter } from "@/utils/functions/valueFormatters";
import { useUser } from "@clerk/nextjs"


import UserType from "../interfaces/userwithMetadata";
import { useEffect, useState } from "react";
import { IncomeSchema } from "@/types/supabase";
export default function MIMO(props: {income : IncomeSchema[], currency : string}){
    const {expenseData} = useExpenses()
    const [moneyOut, setmoneyOut] = useState<number>(0)
    const [moneyIn, setMoneyIn] = useState<number>(0)
    useEffect(()=>{
        async function handle(){
            setmoneyOut(0)
            setMoneyIn(0)
            expenseData.map((expense : ExpenseType)=>{
                if (new Date(expense.transaction_date).getUTCMonth() == new Date().getUTCMonth() || expense.recurring == true){
                    setmoneyOut((prev)=>{return prev + expense.standardizedCurrency!})
                }
                
            })
            props.income.map((income : IncomeSchema)=>{
                if (new Date(income.transaction_date).getUTCMonth() == new Date().getUTCMonth() || income.recurring == true){
                    setMoneyIn((prev)=>{return prev + income.standardizedCurrency!})
                }
            })

        }
        handle()
    },[expenseData])
    return (
    <BarChart
    data={[{
        "Money In": moneyIn,
        "Money Out": moneyOut,
      }]}
      index={"label"}
      className=""
      categories={["Money In", "Money Out"]}
      colors={["green", "red"]}
      yAxisWidth={70}
      valueFormatter={(number)=>{return new Intl.NumberFormat('en-US', { style: 'currency',  currency: props.currency}).format(number)}}
    />)
}