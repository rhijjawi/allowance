'use client';
import { Card, Title, LineChart, Button, BarChart, Grid, Col, Color, ProgressCircle, Metric, ProgressBar, Subtitle, Text} from "@tremor/react";
import { PlusCircleIcon, InformationCircleIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useUser, useAuth } from "@clerk/nextjs";
import { getSupabase } from "../../utils/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {currFormatter, standardizeCurrency, NumToMonth, MonthToNum} from "@/utils/functions/valueFormatters"
import { ExpenseType, useExpenses } from "@/components/contexts/expenseCTX";
import { getColor } from "@/components/static/categories";
import { CategorySchema, IncomeSchema } from "@/types/supabase";
import { motion } from "framer-motion";
import Link from "next/link";
import { isMobile } from "react-device-detect"
import { MonthExpenses } from "@/utils/functions/filterData";
import {BudgetStatus, BudgetMath} from "@/utils/functions/math"
import { SavingsModal } from "@/components/forms/savingsDialogue";
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
    const [checked, setChecked] = useState(false)
    const [misc, setMisc] = useState<any>(null)
    const {expenseData, categoryData, loading} = useExpenses()
    const [chartData, setChartData] = useState<any>([])
    const [presentCategories, setPresentCategories] = useState<any>([])
    const [percentage, setPercentage] = useState<[number, number]>([0,0])
    const CustomCard = motion(Card, {forwardMotionProps: true})
    const CustomBarChart = motion(BarChart, {forwardMotionProps: true})
    const [hideRent, setHideRent] = useState<boolean>(false)
    const [isSavingsOpen, setIsSavingsOpen] = useState<boolean>(false)
    const [sum, setSum] = useState<number>(0)
    const router = useRouter()
    useEffect(()=>{
        if (expenseData.length > 0){
            setSum(0)
            console.log(expenseData)
            MonthExpenses(expenseData, new Date()).forEach((exp : ExpenseType)=>setSum((...prev) => prev[0] + exp.standardizedCurrency!))
        }
    }, [expenseData])
    useEffect(()=>{
        async function a(){
            await router.push('/')
        }
        if ((isLoaded && !isSignedIn) || (isSignedIn && user.publicMetadata.role !== 'student')){
            a()
        }
        return () => {}
    }, [isLoaded])
    useEffect(()=>{
        let active = true;
        if (misc == null){
            fetch('/api/user/misc').then((res)=>{
                if (res.status == 200){
                    res.json().then((data)=>{
                        if (active){
                            setMisc(data)
                        }
                    })
                }
            })
        }
    }, [])
    useEffect(()=>{
        let active = true
        let categoryList : any = {}
        let expenseList : any = {}
        let data : any = []
        if (categoryData == null || expenseData == null) return
        categoryData.forEach((e : any)=>{categoryList[e.id] = e.category})
        const thisMonth = expenseData.filter((e : ExpenseType)=>{
            if (e.recurring){
                let recurranceDate : Date = new Date(Date.parse(e.transaction_date as string))
                return (recurranceDate.getDate() >= new Date().getDate())
            }
            return (Date.parse(e.transaction_date as string) > new Date().setDate(1))
        })
        thisMonth.forEach(async(i)=>{
            let category = categoryData.find((element : any) => {return element.id === i.category[0]})!.category
            expenseList[`${NumToMonth(new Date().getUTCMonth())} ${new Date().getUTCFullYear()}`] ? {} : expenseList[`${NumToMonth(new Date().getUTCMonth())} ${new Date().getUTCFullYear()}`] = {}
            expenseList[`${NumToMonth(new Date().getUTCMonth())} ${new Date().getUTCFullYear()}`][category] ? expenseList[`${NumToMonth(new Date().getUTCMonth())} ${new Date().getUTCFullYear()}`][category] += await standardizeCurrency(i, user!.publicMetadata?.currency as string) : expenseList[`${NumToMonth(new Date().getUTCMonth())} ${new Date().getUTCFullYear()}`][category] = await standardizeCurrency(i, user!.publicMetadata.currency as string)
        })
        
        Object.keys(expenseList).forEach((i)=>{
            let _data = expenseList[i]
            _data.month = i
            data.push(_data)
        })
        if (data.length > 0){
            if (active){
                data = data.sort((a : any, b : any) => (Date.parse(a.transaction_date) - Date.parse(b.transaction_date)))
                setChartData(data)
            }
            return () => {active = false}
        }
    }, [expenseData, categoryData])
useEffect(()=>{
    if (!misc){return }
    async function a(){
        setPercentage([0, 0])
        const budgetMath = await BudgetMath(sum, user?.publicMetadata.currency as string, misc.budget)
        setPercentage(budgetMath)
    }
    a();
}, [misc])

if(!isLoaded || loading || misc == null ) return <></>;
return (
    <main className='flex min-h-screen flex-col items-center justify-between px-6 md:px-24 pt-12 -z-[100] bg-dark-tremor-background-muted/75'>
        <Card className="h-16 relative">
            <div className="absolute text-left top-[50%] -translate-y-[50%] z-0 left-0 right-0 m-auto ml-5 w-fit">
                <Button size="md" className="h-full"><PlusCircleIcon className="h-6 w-6 inline"/><span> Quick Add</span></Button>
            </div>
            <div className="absolute text-right top-[50%] -translate-y-[50%] z-0 left-0 right-0 m-auto mr-5 w-fit">
                <Button size="md" className="h-full"><InformationCircleIcon className="h-6 w-6 inline "/><span> Read more</span></Button>
            </div>
        </Card>
        <Grid numItemsMd={3} numItemsLg={3} numItemsSm={1} className="w-full gap-x-5 my-5 max-md:gap-y-5">
            <CustomCard
            variants={cardVariants}
            animate={!loading ? "animate" : "initial"}
            >
                <Title >Budget Status</Title>
                {misc.budget[0] == 0 ? <p className="text-xl">Please <Link className="font-bold" href="/profile/manage">set</Link> a budget</p> : <ProgressCircle showAnimation tooltip={`${BudgetStatus(percentage[0])[1]} - ${currFormatter(percentage[1], misc.budget[1])}/${currFormatter(misc.budget[0], misc.budget[1])}`} className="py-5" size="lg" color={BudgetStatus(percentage[0])[0]} value={percentage[0]}/>}
                {misc.budget[0] !== 0 ? <Subtitle className={`text-center dark:`}>You have spent <b>{percentage[0].toFixed(2)}</b>% of your budget</Subtitle> : null}
            </CustomCard>
            <CustomCard
            className="relative max-md:h-[200px]"
            variants={cardVariants}
            animate={!loading ? "animate" : "initial"}
            transition={{delay : 3}}>
                <Title color="green" className="mb-2">
                    Savings Account
                </Title>
                {misc.savings[1] == 0 ? 
                    <div className="relative my-auto">
                        <Text className="w-fit mx-auto px-4">To manage your savings, you'll need to set a goal first.</Text>
                    </div> : null}
                <div className="my-auto mx-auto bottom-0 relative">
                    {misc.savings[1] == 0 ? null : <><div className=" w-fit mx-auto rounded-md my-2">
                         <p className="text-3xl font-semibold text-center">{currFormatter(misc.savings[0], misc.savings[2] as string)} saved</p>
                        <ProgressBar tooltip={`${(misc.savings[0]/misc.savings[1])*100}%`} className=" h-full rounded-md" value={(misc.savings[0]/misc.savings[1])*100}/></div>
                    <p className="text-3xl font-semibold w-full text-center"><span className="text-green-400">{currFormatter(misc.savings[1], misc.savings[2] as string)}</span> goal</p></>}
                </div>
                <Button className="absolute bottom-0 float-left left-0 mb-3 ml-3 md:mb-5 md:ml-5" iconPosition="right" onClick={()=>setIsSavingsOpen(true)} icon={PencilIcon}>Edit Goal</Button>
                <Button className="absolute bottom-0 float-right right-0 mb-3 mr-3 md:mb-5 md:mr-5" iconPosition="right" icon={PencilIcon}>Edit</Button>
                <SavingsModal isOpen={isSavingsOpen} setIsOpen={setIsSavingsOpen} misc={misc}/>
            </CustomCard>
            <CustomCard
            className="relative max-md:h-[200px]"
            variants={cardVariants}
            >
                <Title color="red" className="mb-2">Emergency Fund</Title>
                <p className="text-2xl font-semibold text-left">{currFormatter(misc.emergency[0], user?.publicMetadata.currency as string)} in cash</p>
                <p className="text-2xl font-semibold text-left">{currFormatter(misc.emergency[1], user?.publicMetadata.currency as string)} in bank account</p>
                <Button className="absolute bottom-0 left-0 mb-5 ml-5" iconPosition="left" icon={InformationCircleIcon}>More Info</Button>
                <Button className="absolute bottom-0 right-0 mb-5 mr-5" iconPosition="right" icon={PencilIcon}>Edit</Button>
            </CustomCard>
        </Grid>
        <Card className="h-fit relative max-md:h-fit">
                { 
                <>
                <Title>Overall Expenditure</Title>
                <div className="absolute top-0 right-0 py-5 px-12">
                    <div className={`${hideRent ? "text-green-400 hover:text-green-500" : "text-red-400 hover:text-red-500"} dark:hover:text-gray-500 dark:text-white h-fit w-fit select-none`} onClick={()=>{setHideRent(!hideRent)}}>
                        <label className="text-sm  font-semibold cursor-pointer ">{!hideRent ? "Hide" : "Show"} the <span className="font-bold ">Rent</span> category</label>
                    </div>
                </div>
                <div className="">
                <CustomBarChart
                variants={chartVariants}
                animate={chartData.length > 0 ? "animate" : "initial"}
                exit={{size: 0, opacity: 0}}
                transition={{duration: 0.3}}
                id={"barChart"}
                className="mt-6 min-w-fit w-full min-h-[400px] aspect-square"
                data={chartData}
                enableLegendSlider={isMobile}
                colors={categoryData.map((i : CategorySchema)=>{
                    return getColor(i.id!) as Color})!}
                categories={
                    
                    categoryData.map((i : any)=>{
                    
                    if (!hideRent){
                        return i.category
                    }
                    else {
                        if (!(i.category == "Housing")){
                            return i.category
                        }
                    }
                })}
                index="month"
                valueFormatter={(number)=>{return currFormatter(number, user!.publicMetadata.currency as string)}}
                /></div></>}
                {chartData.length == 0 ? <motion.p className="mt-6">It looks like you haven't recorded any expense data. Click <Link href="/expenditure/list" className="text-black font-semibold">here</Link> to get started</motion.p> : null}
            </Card>

      {/* <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        
      </div> */}

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
      </div>
    </main>
)
}
