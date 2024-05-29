import { ExpenseSchema } from '@/types/supabase'
import { currFormatter } from '@/utils/functions/valueFormatters'
import { useUser } from '@clerk/nextjs'
import { Button } from '@tremor/react'
import { useState } from 'react'
import UserType from '@/components/interfaces/userwithMetadata'
export default function ButtonWhenHoverShowOrigCurr(props: {
    expense: ExpenseSchema
    size: 'sm' | 'md' | 'xs' | 'lg' | 'xl'
}) {
    const [isMouseOut, setIsMouseOut] = useState<boolean>(true)
    const { user } = useUser()

    let CurrString = [
        `${currFormatter(props.expense.amount, props.expense.currency)}`,
        `${currFormatter(props.expense.standardizedCurrency!, user!.publicMetadata!.currency as string)}`,
    ][Number(isMouseOut)]
    return (
        <Button
            variant="secondary"
            color="gray"
            size={props.size}
            className={`w-32 cursor-default hover:bg-transparent border-2 dark:border-red-600`}
            onMouseEnter={() => {
                setIsMouseOut(false)
            }}
            onMouseLeave={() => {
                setIsMouseOut(true)
            }}
        >
            <div className="w-full dark:text-white text-tremor-content">
                {CurrString}
            </div>
        </Button>
    )
}

export function HoverCurrGeneral(props: {
    expense: ExpenseSchema
    size: 'sm' | 'md' | 'xs' | 'lg' | 'xl'
    currency: [string, number]
}) {
    const [isMouseOut, setIsMouseOut] = useState<boolean>(true)
    const { user } = useUser()

    let CurrString = [
        `${currFormatter(props.expense.amount, props.expense.currency)}`,
        `${currFormatter(props.expense.amount * props.currency[1]!, props.currency[0] as string)}`,
    ][Number(isMouseOut)]
    return (
        <Button
            variant="secondary"
            color="gray"
            size={props.size}
            className={`w-32 cursor-default hover:bg-transparent border-2 dark:border-red-600`}
            onMouseEnter={() => {
                setIsMouseOut(false)
            }}
            onMouseLeave={() => {
                setIsMouseOut(true)
            }}
        >
            <div className="w-full dark:text-white text-tremor-content">
                {CurrString}
            </div>
        </Button>
    )
}
