import { Card, Badge, Button, Table, TabPanel, TabPanels, Grid, Divider, TabGroup, TableHead, TableHeaderCell, TableBody, TableRow, TableCell, TableFoot, TableFooterCell, Title, Select, SelectItem, Text, BarChart, AreaChart, TabList, Tab, TextInput, Col, Metric, LineChart, Subtitle, Callout } from "@tremor/react"
import {use, useEffect, useState} from 'react'
import { useExpenses, ExpenseType } from "@/components/contexts/expenseCTX"
import {ArrowDownOnSquareIcon, BanknotesIcon, CalendarDaysIcon, ChevronDownIcon, ChevronUpIcon, ClipboardDocumentIcon, CurrencyYenIcon, ExclamationCircleIcon, EyeIcon, MagnifyingGlassCircleIcon, PlusCircleIcon, QuestionMarkCircleIcon} from '@heroicons/react/24/outline'
import { useFileUpload } from "@/components/contexts/fileManagerCTX"
import { useTransactionHandler } from "@/components/contexts/transactionHandler"
import { useUser } from "@clerk/nextjs"
import UpcomingTable from "@/components/charts/UpcomingTable"
import DonutCategory from "@/components/charts/DonutCategory"
import MIMO from "@/components/charts/MoneyInMoneyOut"
import badges, { getBadge, getColor } from "@/components/static/categories"
import { ExpenditureDialog, IncomeDialogue } from "@/components/forms/QuickForms"
import getPrevious from "@/functions/getPrevious"
import { CategorySchema, ExpenseSchema, IncomeSchema } from "@/types/supabase"
import {ExpenditureDelta, IncomeDelta} from "@/components/charts/ExpenditureDelta"
import { LastPeriodDates } from "@/utils/functions/filterData"
import { motion } from "framer-motion"
import { NumToMonth, currFormatter } from "@/utils/functions/valueFormatters"
import ExpenseTable from "@/components/charts/ExpenseTable"
import React from "react";
import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
import { useRouter } from "next/router"

let ChevronStyle = ["absolute w-8 aspect-square rounded-full right-0 bottom-0 top-0 my-auto mr-4","w-8 h-8 border-2 rounded-full absolute"]

export default function ListPage(){
    const { user, isSignedIn, isLoaded } = useUser()
    const router = useRouter()
    const [filtermode, setFiltermode] = useState<number>(0) // 0: all, 1: past 2 weeks, 2: past month, 3: past year
    const filterlabels = ["All Expenditure", "Expenditure in the past 2 weeks", "Expenditure in the past month", "Expenditure in the past year"]
    const selectLabels = ["All", "14 days", "30 days", "365 days"]
    const [supportedBanks, setSupportedBanks] = useState<string[]>([])
    // const [filtered, setFiltered] = useState<any>([])
    // const [originalState, setOriginalState] = useState<any>([])
    // const [search, setSearch] = useState<string>("")
    const {expenseData, categoryData, incomeData, _error, setExpenseData} = useExpenses()
    const [sortBy, setSortBy] = useState<[number, number]>([0, 0])

    const [CurrentlyEditing, setCurrentlyEditing] = useState<any>(null)
    const previousEditing = getPrevious(CurrentlyEditing)
    const [label, setLabel] = useState<string>("")
    const [tab, setTab] = useState(0)
    const [sum, setSum] = useState<any[]|null>(null);

    const chevrons = [null, <ChevronUpIcon className={ChevronStyle[1]}/>, <ChevronDownIcon className={ChevronStyle[1]}/>]
    const {error : error, loading, setExpense} = useFileUpload()
    const {handlerMode, setHandlerMode} = useTransactionHandler() as {handlerMode : string|null, setHandlerMode: React.Dispatch<React.SetStateAction<any[]>>}
    const [categorySums, setCategorySums] = useState([{}])
    const [uncategorized, setUncategorized] = useState<ExpenseSchema[]>([])
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isIncomeOpen, setIncomeIsOpen] = useState<boolean>(false)
    const categoryBadges = badges()
    const past6months = [1, 2, 3, 4, 5, 6].map((i)=>{
        let date = new Date();
        let month = (new Date(date.setUTCMonth(date.getUTCMonth() - i))).getUTCMonth()
        let year = (new Date(date.setUTCMonth(date.getUTCMonth() - i))).getUTCFullYear()
        return [month, year]
    }).reverse()

    const [bank, setBank] = useState<string|undefined>(undefined)
    useEffect(() => {
        fetch('/api/expenses/supported').then((res) => {
            if (res.status === 200){
                res.json().then((data)=>{
                    setSupportedBanks(data.banks)
                })
            }
        });
    }, []);
    useEffect(() => {
        if (!expenseData){return}
        setSum([])
        past6months.forEach((month)=>{
            let expenses = expenseData.filter((exp : ExpenseSchema)=>{
                if (exp.recurring){
                    let date = new Date(Date.parse(exp.transaction_date as string))
                    if (date.getUTCMonth() >= month[0] && date.getUTCFullYear() >= month[1]){
                        return true
                    }
                }
                return (new Date(exp.transaction_date)).getUTCMonth() == month[0] && (new Date(exp.transaction_date)).getUTCFullYear() == month[1]
            })
            let sum = expenses.reduce((a : number, b : ExpenseSchema) => a + b.standardizedCurrency!, 0)
            setSum((prev) => [...prev!, {month: `${NumToMonth(month[0])} ${month[1]}`, "Expenditure": Number(sum.toFixed(2))}])
        })
    }, [expenseData])
    useEffect(() => {
        if (!expenseData){return}
        setUncategorized(expenseData.filter((item)=>{return item.category[0]==0}))
    }, [expenseData])
    useEffect(() => {
        const updateFunction = async () => {
            // await (await getSupabase(user!.accessToken)).from('expenses').update({label: label}).eq(id, id)
        }
        if (CurrentlyEditing == null && typeof previousEditing == 'number'){
            alert(label)
        }
    }, [previousEditing])
    useEffect(()=>{
        async function a(){
            await router.push('/')
        }
        if ((isLoaded && !isSignedIn) || (isSignedIn && user.publicMetadata.role !== 'student')){
            a()
        }
        return () => {}
    }, [isLoaded])
    const daterange = LastPeriodDates()
    if(!isLoaded) return null;
    return (
        <>
        <main className="p-12 min-h-screen bg-dark-tremor-background-muted/75">
            <ExpenditureDialog isOpen={isOpen} setIsOpen={setIsOpen} />
            <IncomeDialogue isOpen={isIncomeOpen} setIsOpen={setIncomeIsOpen} />
      <Title className="text-white">Dashboard 🏦</Title>
      <Text className="text-slate-300">A detailed overview of your finances.</Text>

      <TabGroup className="mt-6" index={tab} onIndexChange={setTab}>
        <TabList>
          <Tab icon={EyeIcon} className="text-white hover:text-slate-400">Overview</Tab>
          <Tab icon={MagnifyingGlassCircleIcon} className="text-white hover:text-slate-400">Details</Tab>
          <Tab icon={CalendarDaysIcon} className="text-white hover:text-slate-400">Month-to-date</Tab>
          <Tab icon={CurrencyYenIcon} className="text-white  hover:text-slate-400">Savings</Tab>
          <Tab icon={ArrowDownOnSquareIcon} className="text-white hover:text-slate-400">Import</Tab>
          {uncategorized.length > 0 ? <Tab icon={QuestionMarkCircleIcon} className="text-white hover:text-slate-400">Uncategorized</Tab> : <></>}
        </TabList>
        <TabPanels>
          <TabPanel>
            <Grid numItemsMd={2} numItemsSm={1} numItemsLg={3} className="gap-6 mt-6">
                <Card className="min-h-80 h-fit bg-white border-slate-400 border-2">
                {user ?
                    <DonutCategory expenseData={expenseData} categoryData={categoryData}/>: null}
                    <motion.div
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1 },
                    }}
                    initial="hidden"
                    transition={{ duration: 1.2 }}
                    animate={uncategorized.length > 0 ? "visible" : "hidden"}
                    >
                        <Subtitle className="select-none dark:text-slate-300 text-center">It seems that you have <b>{currFormatter(expenseData.filter((item)=>{return item.category[0]==0}).reduce((a, b)=>{return a + b.standardizedCurrency!}, 0), user?.publicMetadata.currency as string)}</b> in uncategorized expenses. Click <a className="text-blue-500 cursor-pointer hover:underline" onClick={()=>{setTab(4)}}>here</a> to assign them categories.</Subtitle>
                    </motion.div>
                </Card>
                    <div className="">
                        <Card className="shadow-md min-h-16 h-fit bg-white border-slate-400 border-2">
                            <Title>Upcoming Transactions</Title>
                            <UpcomingTable expenses={expenseData}  categories={categoryData}/>
                        </Card>
                        <Card className="shadow-md bg-white border-slate-400 border-2 mt-3 flex-grow grid grid-cols-3">
                            <Title className="col-span-1 col-start-1">Copy your invite code</Title>
                            <Button icon={ClipboardDocumentIcon} size={"lg"} className="float-right col-start-3 text-sm w-full">Copy</Button>
                        </Card>
                        <Card className="shadow-md bg-white border-slate-400 border-2 mt-3 flex-grow grid grid-cols-3">
                            <Button className="col-start-1 h-12" icon={PlusCircleIcon} color="red" onClick={()=>setIsOpen(true)}>Add Expense</Button>
                            <Button className="col-start-3 h-12" icon={PlusCircleIcon} color="emerald" onClick={()=>setIncomeIsOpen(true)}>Add Income</Button>
                        </Card>
                    </div>
                <Card className="w-full shadow-md bg-white border-slate-400 border-2">
                    <Title>Money In vs. Money Out</Title>
                    <MIMO expenses={expenseData} income={incomeData} currency={user!.publicMetadata.currency as string}/>
                </Card>
                <Col numColSpan={3} numColSpanLg={3}>
                    <Card className="w-full shadow-md bg-white border-slate-400 border-2">
                        {sum && <div className="whitespace-pre-line"><Title>Total Spending in the last 6 months</Title><LineChart rotateLabelX={{angle: 90, verticalShift : 50, xAxisHeight:100}} yAxisWidth={60} className="w-full mt-6" data={sum!} valueFormatter={(e)=>currFormatter(e, user?.publicMetadata.currency as string)} categories={["Expenditure"]} index={"month"} colors={["emerald"]} /></div>}
                    </Card>
                </Col>
            </Grid>
          </TabPanel>
          <TabPanel>
            <Card className="mt-6 bg-white border-slate-400 border-2">
                <div className="flex justify-between">
                        <Title className="w-fit relative float-left">{filterlabels[filtermode]}</Title>
                        {/* @ts-ignore */}
                        <Select className="w-[20%] relative float-right h-12 top-1" value={filtermode} onValueChange={(v)=>{setFiltermode(v); console.log(v)}}>
                            {/* @ts-ignore */}
                            {selectLabels.map((item, index) => {return <SelectItem key={index} className="text-stone-700 bg-gray-800/30 hover:cursor-pointer" value={index}>{item}</SelectItem>})}
                        </Select>
                    </div>
                    <div className="block">
                        {expenseData.length > 0 ? <ExpenseTable setSortBy={setSortBy} setExpenseFU={setExpense} sortBy={sortBy} expenseData={expenseData}/> 
                        : <motion.div className="h-full text-center w-full block mt-5">No data. To get started, go to the overview tab via the tab list above.</motion.div>}
                    </div>
            </Card>
          </TabPanel>
          <TabPanel>
          <Grid numItemsMd={2} numItemsLg={3} className="gap-6 mt-6 ">
                <Col numColSpan={1} numColSpanLg={3}>
                <Card className=" dark:border-2 relative">
                    <div className="w-full ml-5 my-5"><Text className="inline-block pr-2">Previous Period:</Text><Text className="inline-block dark:text-white"> {(new Intl.DateTimeFormat('en-DE' , {dateStyle : 'long'})).format(daterange[0])} - {(new Intl.DateTimeFormat('en-DE' , {dateStyle : 'long'})).format(daterange[1])}</Text><div><Text className="inline-block pr-2">Current Period:</Text><Text className="inline-block dark:text-white"> {(new Intl.DateTimeFormat('en-DE' , {dateStyle : 'long'})).format(daterange[2])} - {(new Intl.DateTimeFormat('en-DE' , {dateStyle : 'long'})).format(daterange[3])}</Text></div></div>
                    <div className="grid grid-cols-3 relative">
                        {categoryData.map((item: CategorySchema, index: number)=>{return (<ExpenditureDelta category={item} key={index} expenses={expenseData}/>)})}
                        <IncomeDelta category={{category: "Income", id: 0, subcategories: []}} incomes={incomeData}/>
                    </div>
                    
                </Card>
                </Col>
            </Grid>
        </TabPanel>
        <TabPanel>
            <Col numColSpan={1} numColSpanLg={3} className="gap-6 mt-6 ">
                <Card className=" dark:border-2 relative">
                    <div className="aspect-square h-9 float-right">
                        <CurrencyYenIcon className="dark:fill-white aspect-square h-full w-fit float-right"/>
                    </div>
                    <Title>Your Savings</Title>
                    <Text className="text-sm">These values should always reflect the current values of your bank accounts.</Text>
                </Card>
            </Col>
        </TabPanel>
        <TabPanel>
            <Grid numItemsSm={1} numItemsMd={1} numItemsLg={1} className="gap-6 mt-6">
                    <Card className="aspect-[3/1] mx-auto w-[32rem]">
                        <div className="aspect-square h-9 float-right">
                            <ArrowDownOnSquareIcon className="aspect-square h-full w-fit float-right"/>
                        </div>
                        <Title className="mb-4">Import Transactions (.csv)</Title>
                        <Callout className="h-fit mt-4" title="This feature is currently in development." icon={ExclamationCircleIcon} color="orange">
                            The list of supported banks is constantly growing, so if you don't see your bank, please submit a request via the Report Bug button in the bottom right corner.
                        </Callout>
                        <Subtitle className="select-none my-2">You can import transactions from your bank account by selecting your bank from the dropdown below.</Subtitle>
                        <Select className="my-3" value={bank} onValueChange={(e)=>setBank(e)}>
                            {supportedBanks.length > 0 && supportedBanks.sort().map((bank)=>(<SelectItem className="cursor-pointer" value={bank}>{bank.charAt(0).toUpperCase()+bank.slice(1)}</SelectItem>))}
                        </Select>
                        <div className="block w-full">
                            <Button className="mx-auto block left-0 right-0 " onClick={()=>{}}>Import Bank Statement</Button>
                        </div>
                        
                    </Card>
            </Grid>
        </TabPanel>
        <TabPanel>
            <Col numColSpan={1} numColSpanLg={3} className="gap-6 mt-6 ">
                <Card className=" dark:border-2 relative">
                    <div className="aspect-square h-9 float-right">
                        <QuestionMarkCircleIcon className="aspect-square h-full w-fit float-right"/>
                    </div>
                    <Title className="mb-4">Uncategorized Transactions</Title>
                    {!(uncategorized.length > 0) ? <><Subtitle className="cursor-pointer select-none">You have no uncategorized transactions. These only appear when you have imported transactions through a bank statement.</Subtitle><Subtitle>Click <b><a className="cursor-pointer " onClick={()=>setTab(1)}>here</a></b> to return</Subtitle></> : null}
                    <ExpenseTable expenseData={uncategorized} sortBy={sortBy} setSortBy={setSortBy} setExpenseFU={setExpense}/>
                </Card>
            </Col>

        </TabPanel>
        </TabPanels>
      </TabGroup>
    </main>
        </>
    )
}