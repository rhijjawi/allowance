'use client';
import { Card, Title, LineChart, Button, BarChart, Grid, Col, Color } from "@tremor/react";
import { PlusCircleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { useUser, useAuth } from "@clerk/nextjs";
import { getSupabase } from "../../utils/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {currFormatter, standardizeCurrency, NumToMonth, MonthToNum} from "@/utils/functions/valueFormatters"
import { ExpenseType, useExpenses } from "@/components/contexts/expenseCTX";
import { getColor } from "@/components/static/categories";
import { CategorySchema } from "@/types/supabase";
import { motion } from "framer-motion";


export default function Expenditure() {

    const {user, isLoaded, isSignedIn} = useUser();
    
    // const {getToken} = useAuth()
    const {expenseData, categoryData} = useExpenses()
    const [chartData, setChartData] = useState<any>([])
    const [cards, setCards] = useState<any>([])
    const CustomCard = motion(Card)
    // useEffect(()=>{
    //     let active = true
    //     if (user){
    //         if (expenseData.length == 0){
    //         getSupabase(user.accessToken).then((supabase)=>{
    //                 supabase.from('expenses').select('*').order('transaction_date' ,{ascending: true}).then((expenses)=>{
    //                     if (expenses.data){
    //                         if (active){
    //                             setExpenseData(expenses.data)
    //                         }
    //                     }
    //                     if (expenses.error){
    //                         if (expenses.error.code == "PGRST301"){
    //                             router.push('/api/auth/login')
    //                         }
    //                     }
    //                 }
    //                 )
    //             }
    //             )
    //         }}
    //     return () => {active = false}
    //     },[isLoading])
    useEffect(()=>{
        let active = true
        let categoryList : any = {}
        let expenseList : any = {}
        async function forEachData(i : ExpenseType){
            const [Y,M,D] = (i.transaction_date.split('-'));
            let date = new Date(Date.parse(`${i.transaction_date}`))
            let category = categoryData.find((element : any) => {return element.id === i.category[0]})!.category
            expenseList[`${NumToMonth(date.getUTCMonth())} ${date.getUTCFullYear()}`] ? {} : expenseList[`${NumToMonth(date.getUTCMonth())} ${date.getUTCFullYear()}`] = {}
            expenseList[`${NumToMonth(date.getUTCMonth())} ${date.getUTCFullYear()}`][category] ? expenseList[`${NumToMonth(date.getUTCMonth())} ${date.getUTCFullYear()}`][category] += await standardizeCurrency(i, user!.publicMetadata?.currency as string) : expenseList[`${NumToMonth(date.getUTCMonth())} ${date.getUTCFullYear()}`][category] = await standardizeCurrency(i, user!.publicMetadata.currency as string)
        }
        if (categoryData != null){
            categoryData.forEach((e : any)=>{
            categoryList[e.id] = e.category
        })
        for (let exp of expenseData){
            forEachData(exp)
        }
        let data : any = []
        Object.keys(expenseList).forEach((i)=>{
            let _data = expenseList[i]
            _data.month = i
            data.push(_data)
        })
        if (data.length > 0){
            if (active){
                data = data.sort((a : any, b : any) => {
                    return MonthToNum(a.month.split(' ')[0]) - MonthToNum(b.month.split(' ')[0])
                })
                setChartData(data)
            }
            else{

            }
            return () => {active = false}
        }}
        
    }, [expenseData, categoryData])
    //
    useEffect(()=>{
        if (chartData.length > 0){
        let nowmonth = NumToMonth(new Date().getUTCMonth())
        let nowyear = (new Date().getUTCFullYear())
        let cards : any = []
        chartData.forEach((i : any, index : number)=>{
            if (i.month == `${nowmonth} ${nowyear}`){
                Object.keys(i).forEach((category)=>{
                    if (category != "month"){
                        cards.push(
                            <Card key={`${category}-${index}`} className="w-80">
                                <Title>{category}</Title>
                                <div className="text-2xl font-bold">{i[category]}</div>
                            </Card>
                        )
                    }
                })
            }
        });
        setCards(cards)
    }
    }, [chartData])
if(!isLoaded) return <></>;
if(chartData.length == 0) return <></>;
return (
    <main className='flex min-h-screen flex-col items-center justify-between px-24 pt-12 -z-[100]'>
        <Card className="h-16 relative">
            <div className="absolute text-left top-[50%] -translate-y-[50%] z-0 left-0 right-0 m-auto ml-5 w-fit">
                <Button size="md" className="h-full"><PlusCircleIcon className="h-6 w-6 inline"/><span> Quick Add</span></Button>
            </div>
            <div className="absolute text-right top-[50%] -translate-y-[50%] z-0 left-0 right-0 m-auto mr-5 w-fit">
                <Button size="md" className="h-full"><InformationCircleIcon className="h-6 w-6 inline "/><span> Read more</span></Button>
            </div>
        </Card>
            {<CustomCard 
            hidden={chartData.length == 0}
            initial={{size: 0, opacity: 0}}
            animate={{size: 1, opacity: 1}}
            >
                {(chartData.length > 0) ? 
                <>
                <Title>Overall Expenditure</Title>
                <BarChart 
                id={"barChart"}
                hidden={chartData.length == 0}
                className="mt-6 min-w-fit aspect-square"
                data={chartData}
                //@ts-ignore
                colors={categoryData.map((i : CategorySchema)=>{
                    return getColor(i.id!)})!}
                categories={categoryData.map((i : any)=>{return i.category})}
                index="month"
                valueFormatter={(number)=>{return currFormatter(number, user!.publicMetadata.currency as string)}}
                /></>: <></>}
            </CustomCard>}

        <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-5 mt-6 w-full">
            {cards}    
        </Grid>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
      </div>
    </main>
)
}
