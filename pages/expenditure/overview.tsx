'use client';
import { Card, Title, LineChart, Button, BarChart, Grid, Col, Color, ProgressCircle, Metric, ProgressBar } from "@tremor/react";
import { PlusCircleIcon, InformationCircleIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useUser, useAuth } from "@clerk/nextjs";
import { getSupabase } from "../../utils/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {currFormatter, standardizeCurrency, NumToMonth, MonthToNum} from "@/utils/functions/valueFormatters"
import { ExpenseType, useExpenses } from "@/components/contexts/expenseCTX";
import { getColor } from "@/components/static/categories";
import { CategorySchema } from "@/types/supabase";
import { motion } from "framer-motion";
import Link from "next/link";
import { Switch } from "@headlessui/react";
import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";
import { MonthExpenses } from "@/utils/functions/filterData";
import axios from "axios";
const chartVariants = {
    animate : {opacity: 1, width: "99%"},
    initial : {opacity: 0, width: "100%"}
}
const cardVariants = {
    animate : {opacity: 1},
    initial : {opacity: 0}
    
}


export default function Expenditure() {
    const {user, isLoaded, isSignedIn} = useUser();
    const { data, error, isLoading } = useSWR('/api/user/misc', fetcher)
    const [checked, setChecked] = useState(false)
    const {expenseData, categoryData, loading} = useExpenses()
    const [chartData, setChartData] = useState<any>([])
    const [cards, setCards] = useState<any>([])
    const CustomCard = motion(Card, {forwardMotionProps: true})
    const CustomBarChart = motion(BarChart, {forwardMotionProps: true})
    const [sum, setSum] = useState<number>(0)
    // useEffect(()=>{
    //     if (expenseData.length > 0){
    //         axios.post('http://localhost:2999/generate_report', {expenseList : expenseData, categoryData: categoryData, id : user?.id})
    //  }
    // }, [expenseData])
    useEffect(()=>{
        if (expenseData.length > 0){
            setSum(0)
            MonthExpenses(expenseData, new Date()).forEach((exp : ExpenseType)=>setSum((...prev) => prev[0] + exp.standardizedCurrency!))
        }
    }, [expenseData])
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
                data = data.sort((a : any, b : any) => (MonthToNum(a.month.split(' ')[0]) - MonthToNum(b.month.split(' ')[0])))
                setChartData(data)
            }
            return () => {active = false}
        }}
        
    }, [expenseData, categoryData])
if(!isLoaded || loading || isLoading) return <></>;

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
        <Grid numItemsMd={3} numItemsLg={3} numItems={1} className="w-full gap-x-5 my-5">
            <CustomCard
            variants={cardVariants}
            animate={!loading ? "animate" : "initial"}
            >
                <Title >Expenditure Status</Title>
                {data.budget[0] == 0 ? <p className="text-xl">Please set a budget</p> : <ProgressCircle tooltip={`On track - ${currFormatter(sum, user?.publicMetadata.currency as string)}/${data.budget[0]} @ ${(sum/data.budget[0])*100}`} className="py-5" size="lg" color="green" value={(sum/data.budget[0])*100}/>}
            </CustomCard>
            <CustomCard
            className="relative"
            variants={cardVariants}
            animate={!loading ? "animate" : "initial"}
            transition={{delay : 3}}>
                <Title color="green" className="mb-2">
                    Savings Account
                </Title>
                <div className="">
                    <p className="text-3xl font-semibold text-center">{currFormatter(data.savings[0], user?.publicMetadata.currency as string)} saved</p>
                    <div className=" w-[60%] mx-auto rounded-md my-2">
                        {data.savings[1] !== 0 && <ProgressBar tooltip={`${(data.savings[0]/data.savings[1])*100}%`} className=" h-full rounded-md" value={(data.savings[0]/data.savings[1])*100}/>}
                    </div>
                    {data.savings[1] !== 0 && <p className="text-3xl font-semibold w-full text-center"><span className="text-green-400">{currFormatter(data.savings[1], user?.publicMetadata.currency as string)}</span> goal</p>}
                </div>
                <Button className="absolute bottom-0 left-0 mb-5 ml-5" iconPosition="right" icon={PencilIcon}>Edit Goal</Button>
                <Button className="absolute bottom-0 right-0 mb-5 mr-5" iconPosition="right" icon={PencilIcon}>Edit</Button>
            </CustomCard>
            <CustomCard
            className="relative"
            variants={cardVariants}
            >
                <Title color="red" className="mb-2">Emergency Fund</Title>
                <p className="text-2xl font-semibold text-left">{currFormatter(data.emergency[0], user?.publicMetadata.currency as string)} in cash</p>
                <p className="text-2xl font-semibold text-left">{currFormatter(data.emergency[1], user?.publicMetadata.currency as string)} in bank account</p>
                <Button className="absolute bottom-0 right-0 mb-5 mr-5" iconPosition="right" icon={PencilIcon}>Edit</Button>
            </CustomCard>
        </Grid>
        <Card className="h-fit relative">
                { 
                <>
                <Title>Overall Expenditure</Title>
                    <Switch
                    checked={checked}
                    onChange={setChecked}
                    className={`${checked ? 'bg-indigo-600' : 'bg-gray-200'} absolute top-0 right-0 my-5 mx-5 inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    >
                    <span className="sr-only">Use setting</span>
                    <span
                        aria-hidden="true"
                        className={`${checked ? 'translate-x-6' : 'translate-x-1'
                        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                    />
                    </Switch>
                <CustomBarChart
                variants={chartVariants}
                animate={chartData.length > 0 ? "animate" : "initial"}
                exit={{size: 0, opacity: 0}}
                transition={{duration: 0.3}}
                id={"barChart"}
                className="mt-6 min-w-fit w-full min-h-[400px] aspect-square"
                data={chartData}
                colors={categoryData.map((i : CategorySchema)=>{
                    return getColor(i.id!) as Color})!}
                categories={categoryData.map((i : any)=>{return i.category})}
                index="month"
                valueFormatter={(number)=>{return currFormatter(number, user!.publicMetadata.currency as string)}}
                /></>}
                {chartData.length == 0 ? <motion.p className="mt-6">It looks like you haven't recorded any expense data. Click <Link href="/expenditure/list" className="text-black font-semibold">here</Link> to get started</motion.p> : null}
            </Card>
                

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
