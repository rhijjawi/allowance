import { Color, DonutChart, Title, Text, Bold } from "@tremor/react"
import { useEffect, useState } from "react"
import { CategorySchema, ExpenseSchema } from "@/types/supabase"
import { UserProfile, useUser } from "@auth0/nextjs-auth0/client"
import {NumToMonth, standardizeCurrency } from "@/utils/functions/valueFormatters"
import UserType from "@/components/interfaces/userwithMetadata"
import sliceType from "../interfaces/sliceType"
import { getBadge, getBadgeByCategoryName, getColor, getIDByCategoryName } from "../static/categories"
export default function DC(props : any){
    
    const [donut, setDonut] = useState<any>([])
    const [totalExpenditure, setTotalExpenditure] = useState<number>(0)
    const [slice, setSlice] = useState<sliceType>()
    const expenseData : ExpenseSchema[] = props.expenseData
    const categoryData : CategorySchema[] = props.categoryData
    //@ts-expect-error
    const {user} = useUser() as {user: UserType}
    const [Badge, setBadge] = useState<any>()
    const currFormatter = (number: number) => {
        console.log(number)
        return (new Intl.NumberFormat('en-US', { style: 'currency', currency: user.user_metadata.currency})).format(number)
    };
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
                let standardizedCurrency = await standardizeCurrency(exp, user.user_metadata.currency)
                if ((new Date().getUTCMonth()) == (new Date(exp.transaction_date).getUTCMonth()) || exp.recurring == true){
                    let catString = categoryData.find((element) => {return element.id === exp.category[0]})!.category
                if (!(catSums[catString])){
                    catSums[catString] = 0
                    console.log(catSums[catString])
                }
                console.log(standardizedCurrency)
                catSums[catString] = catSums[catString] + standardizedCurrency}
            }
            return [catSums]
        }
        if (categoryData && user && expenseData){
            let sumsArr : any = []
            handle().then((d)=>{
                Object.values(d[0]).map((sum)=>{setTotalExpenditure((prev)=>{return prev + sum})})
                Object.keys(d[0]).forEach((c)=>{sumsArr.push({label : c, value : d[0][c]})})
                console.log(sumsArr)
                setDonut(sumsArr)
            })
        }
    }, [user, categoryData])
    let MonthAsString = (NumToMonth(new Date().getUTCMonth()))
    return (
        <>
            <Title>Expenditure by Category ({MonthAsString})</Title>
                <DonutChart 
                    data={donut}
                    index={'label'}
                    valueFormatter={(number)=>{
                        return currFormatter(number)
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