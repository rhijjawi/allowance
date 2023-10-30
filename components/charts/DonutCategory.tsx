import { Color, DonutChart, Title, Text, Bold } from "@tremor/react"
import { useEffect, useState } from "react"
import { CategorySchema, ExpenseSchema } from "@/types/supabase"
import { useUser } from "@clerk/nextjs"
import {NumToMonth, standardizeCurrency, currFormatter } from "@/utils/functions/valueFormatters"
import UserType from "@/components/interfaces/userwithMetadata"
import sliceType from "../interfaces/sliceType"
import { getBadge, getBadgeByCategoryName, getColor, getIDByCategoryName } from "../static/categories"
export default function DC(props : any){
    
    const [donut, setDonut] = useState<any>([])
    const [totalExpenditure, setTotalExpenditure] = useState<number>(0)
    const [slice, setSlice] = useState<sliceType>()
    let expenseData : ExpenseSchema[] = props.expenseData
    let categoryData : CategorySchema[] = props.categoryData//
    const {user, isSignedIn, isLoaded} = useUser()
    const [Badge, setBadge] = useState<any>()
    useEffect(()=>{
        if (slice){
            setBadge(getBadgeByCategoryName(slice?.label!, categoryData, 'xs', 'align-bottom'))
        }
    },[slice])

    useEffect(() => {
        async function handle(){
            let catSums : {[index : string] : number} = {}
            setTotalExpenditure(0)
            for (let exp of expenseData){
                if ((new Date().getUTCMonth()) == (new Date(exp.transaction_date).getUTCMonth()) || exp.recurring == true){
                    let catString = categoryData.find((element) => {return element.id === exp.category[0]})!.category
                if (!(catSums[catString])){
                    catSums[catString] = 0
                    console.log(catSums[catString])
                }
                catSums[catString] = catSums[catString] + exp.standardizedCurrency!}
            }
            return [catSums]
        }
        if (categoryData && user && expenseData){
            let sumsArr : any = []
            handle().then((d)=>{
                Object.values(d[0]).map((sum)=>{setTotalExpenditure((prev)=>{return prev + sum})})
                Object.keys(d[0]).forEach((c)=>{
                    sumsArr.push({label : c, value : d[0][c]})
                })
                console.log(sumsArr)
                setDonut(sumsArr)
            })
        }
    }, [props.expenseData])
    let MonthAsString = (NumToMonth(new Date().getUTCMonth()))
    return (
        <>
            <Title>Expenditure by Category ({MonthAsString})</Title>
                <DonutChart 
                    data={donut}
                    index={'label'}
                    valueFormatter={(number)=>{
                        return currFormatter(number, user!.publicMetadata?.currency as string)
                    }}
                    className=" h-80 w-full py-5 mx-2 px-2 rounded-md "
                    colors={donut.map((e : any) => {return getColor(getIDByCategoryName(e.label, categoryData))})}
                    category="value"
                    variant="donut"
                    onValueChange={(v) => setSlice(v)}/>
                {slice ? <div className="py-3 px-2 min-h-12 bg-white rounded-md text-black ">
                    <Text className="leading-6">{Badge} account for {((slice?.value/totalExpenditure)*100).toFixed(1)}% of your total expenditure this month</Text>
                </div>: <></>}
        </>
    )
}