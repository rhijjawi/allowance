import { ExpenseSchema } from "@/types/supabase"
import { currFormatter } from "@/utils/functions/valueFormatters"
import { useUser } from "@auth0/nextjs-auth0/client"
import { Button } from "@tremor/react"
import { useState } from "react"
import UserType from "@/components/interfaces/userwithMetadata"
export default function buttonWhenHoverShowOrigCurr(props : {expense : ExpenseSchema, size: "sm" | "md" | "xs" | "lg" | "xl"}){
    const [isMouseOut, setIsMouseOut] = useState<boolean>(true)
    const {user} = useUser() as {user: UserType}
    let CurrString = [`${currFormatter(props.expense.amount, props.expense.currency)}`, `${currFormatter(props.expense.standardizedCurrency!, user.user_metadata?.currency)}`][Number(isMouseOut)]
    return <Button variant="secondary" color="gray" size={props.size} className={`w-32 cursor-default hover:bg-transparent border-2 dark:border-red-600`} onMouseEnter={()=>{setIsMouseOut(false)}} onMouseLeave={()=>{setIsMouseOut(true)}}>
        <div className="w-full dark:text-white text-tremor-content">{CurrString}</div></Button>
}