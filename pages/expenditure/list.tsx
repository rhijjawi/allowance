'use client'
import { Card, Badge, Table, TabPanel,DonutChart, TabPanels, Grid, Divider, TabGroup, TableHead, TableHeaderCell, TableBody, TableRow, TableCell, TableFoot, TableFooterCell, Title, Select, SelectItem, Text, BarChart, AreaChart, TabList, Tab } from "@tremor/react"
import {useEffect, useState} from 'react'
import { useExpenses, ExpenseType } from "@/components/contexts/expenseCTX"
import {ChevronDownIcon, ChevronUpIcon} from '@heroicons/react/24/outline'
import { sortData } from "@/utils/functions/sortData"
import { CheckIcon, PencilIcon, TrashIcon} from "@heroicons/react/24/solid"
import { useFileUpload } from "@/components/contexts/fileManagerCTX"
import { useTransactionHandler } from "@/components/contexts/transactionHandler"
import { useRouter } from "next/router"
import { currFormatter, standardizeCurrency } from "@/utils/functions/valueFormatters"
import { useUser, UserProfile } from "@auth0/nextjs-auth0/client"
import UpcomingTable from "@/components/charts/UpcomingTable"
import DonutCategory from "@/components/charts/DonutCategory"
import badges, { getBadge, getColor } from "@/components/static/categories"
import UserType from "@/components/interfaces/userwithMetadata"
let TableHeadStyle = ["dark:bg-black bg-white select-none","h-6 relative right-0 bottom-0 top-0 left-0 mx-auto my-auto"]
let ChevronStyle = ["absolute w-8 aspect-square rounded-full right-0 bottom-0 top-0 my-auto mr-4","w-8 h-8 border-2 rounded-full absolute"]
let colors = ["slate", "gray", "zinc", "neutral", "stone", "red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal", "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose"]
export default function listPage(){
    const router = useRouter()
    //@ts-ignore
    const {user, error, isLoading}  = useUser() as {user: UserType, error: any, isLoading: boolean}
    const [expenses, setExpenses] = useState<any>([])
    const [filtermode, setFiltermode] = useState<number>(0) // 0: all, 1: past 2 weeks, 2: past month, 3: past year
    const filterlabels = ["All Expenditure", "Expenditure in the past 2 weeks", "Expenditure in the past month", "Expenditure in the past year"]
    const selectLabels = ["All", "14 days", "30 days", "365 days"]
    const [filtered, setFiltered] = useState<any>([])
    const [originalState, setOriginalState] = useState<any>([])
    const [search, setSearch] = useState<string>("")
    const {expenseData, categoryData, _error} = useExpenses() as {expenseData: ExpenseType[], categoryData: any[], _error: any, isLoading: boolean}
    const [sortBy, setSortBy] = useState<null|any>([0, 0])
    const [CurrentlyEditing, setCurrentlyEditing] = useState<any>(null)
    const [tab, setTab] = useState(0)
    const chevrons = [null, <ChevronUpIcon className={ChevronStyle[1]}/>, <ChevronDownIcon className={ChevronStyle[1]}/>]
    const {errorFU, loading, setExpense} = useFileUpload()
    const {handlerMode, setHandlerMode} = useTransactionHandler() as {handlerMode : string|null, setHandlerMode: React.Dispatch<React.SetStateAction<any[]>>}
    const [categorySums, setCategorySums] = useState({})
    
    const categoryBadges = badges()
    const currFormatter = (number: number) => {
        console.log(number)
        return (new Intl.NumberFormat('en-US', { style: 'currency', currency: user.user_metadata!.currency})).format(number)
    };
    useEffect(() => {
        if (expenseData.length > 0){
            setExpenses(expenseData)
            console.log(expenseData)
            console.log(categoryData)
            expenseData.forEach((exp)=>{
                console.log((categoryData.find((element) => {return element.id === exp.category[0]})).category)
            })
        }
    }, [expenseData, isLoading])
    useEffect(() => {
    }, [user])
    
    
    return (
        <>
        <main className="p-12 min-h-screen">
      <Title>Dashboard 🏦</Title>
      <Text>A more detailed view of your expenses </Text>

      <TabGroup className="mt-6" defaultIndex={tab} onIndexChange={setTab}>
        <TabList>
          <Tab>Overview</Tab>
          <Tab>Detail</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Grid numItemsMd={2} numItemsLg={3} className="gap-6 mt-6">
              <Card className="min-h-80 h-fit bg-slate-200 border-slate-400 border-2">
              {user ?
                <DonutCategory expenseData={expenseData} categoryData={categoryData}/>: null}
              </Card>
              <div className="">
              <Card className="min-h-16 h-fit bg-slate-200 border-slate-400 border-2">
                <Title>Upcoming Transactions</Title>
                <UpcomingTable expenses={expenseData} categories={categoryData}/>
              </Card>
              </div>
              <Card className="min-h-16 h-fit bg-slate-200 border-slate-400 border-2">
                <Title>Upcoming Transactions</Title>
                <UpcomingTable expenses={expenseData} categories={categoryData}/>
              </Card>
            </Grid>
            <div className="mt-6">
              <Card>
                <div className="h-96">
                        <Title className="">All Categories</Title>
                            <div className="">
                                {/* <AreaChart
                                index="date"
                                className="px-2 py-3"
                                categories={["allowance","housing","cheese"]}
                                colors={["red", "blue", "cyan"]}
                                data={[{
                                    date: "Oct 08",
                                    housing: 100,
                                    cheese: 100,
                                    allowance: -1000,
                                },
                                {
                                    date: "Oct 09",
                                    housing: 150,
                                    cheese: 200,
                                    allowance: -1000,
                                },
                                {
                                    date: "Oct 10",
                                    housing: 200,
                                    cheese: 250,
                                    allowance: -1000,
                                },
                                {
                                    date: "Oct 11",
                                    housing: 800,
                                    cheese: 250,
                                    allowance: -1000,
                                }
                            ]}
                                /> */}
                        </div>
                    </div>
                </Card>
            </div>
          </TabPanel>
          <TabPanel>
            <Card className="mt-6">
                <div className="flex justify-between">
                        <Title className="w-fit relative float-left">{filterlabels[filtermode]}</Title>
                        {/* @ts-ignore */}
                        <Select className="w-[20%] relative float-right h-12 top-1" value={filtermode} onValueChange={(v)=>{setFiltermode(v); console.log(v)}}>
                            {/* @ts-ignore */}
                            {selectLabels.map((item, index) => {return <SelectItem key={index} className="text-stone-700 bg-gray-800/30 hover:cursor-pointer" value={index}>{item}</SelectItem>})}
                        </Select>
                    </div>
                    <div className="flex justify-between">
                        <Table className="mt-5 w-full rounded-b-md border-2 rounded-md">
                            <TableHead>
                                <TableRow className="border-b-2 dark:border-b-white border-b-black">
                                    <TableHeaderCell className={`w-8 relative ${TableHeadStyle[0]}`}>
                                        <div className={`w-fit ${TableHeadStyle[1]}`}>
                                            <Text className="hover:cursor-pointer w-fit h-full dark:text-white text-black dark:hover:text-stone-300 hover:text-gray-300">
                                                Recurring?
                                            </Text>
                                        </div>
                                    </TableHeaderCell>
                                    <TableHeaderCell className={`w-64 relative border-x-gray-500 border-x ${TableHeadStyle[0]}`}>
                                        <div className={`w-fit ${TableHeadStyle[1]}`} onClick={()=>{setSortBy([1, (sortBy[1]+1)%3])}}>
                                            <Text className="hover:cursor-pointer w-fit h-full dark:text-white text-black dark:hover:text-stone-300 hover:text-gray-300">Transaction Label</Text>
                                        </div>
                                        <div className={ChevronStyle[0]}>
                                            { (sortBy[0]==1) ? chevrons[sortBy[1]] : null }
                                        </div>
                                    </TableHeaderCell>
                                    <TableHeaderCell className={`w-24 relative border-x-gray-500 border-x ${TableHeadStyle[0]}`}>
                                        <div className={`w-fit ${TableHeadStyle[1]}`}>
                                            <Text className="w-fit h-full dark:text-white text-black dark:hover:text-stone-300 hover:text-gray-300">Category</Text>
                                        </div>
                                    </TableHeaderCell>
                                    <TableHeaderCell className={`w-64 dark:border-l-white border-x-gray-500 border-x ${TableHeadStyle[0]}`}>
                                        <div className={`w-fit ${TableHeadStyle[1]}`} onClick={()=>{setSortBy([2, (sortBy[1]+1)%3])}}>
                                            <Text className="hover:cursor-pointer w-fit dark:text-white text-black dark:hover:text-stone-300 hover:text-gray-300">Transaction Date</Text>
                                        </div>
                                        <div className={ChevronStyle[0]}>
                                            { (sortBy[0]==2) ? chevrons[sortBy[1]] : null }
                                        </div>
                                        </TableHeaderCell>
                                    <TableHeaderCell className={`w-16 dark:border-l-white border-x-gray-500 ${TableHeadStyle[0]}`}>
                                        <div className={`w-fit ${TableHeadStyle[1]}`} onClick={()=>{setSortBy([3, (sortBy[1]+1)%3])}}>
                                            <Text className="hover:cursor-pointer w-fit dark:text-white text-black dark:hover:text-stone-300 hover:text-gray-300">Transaction Amount</Text>
                                        </div>
                                        <div className={ChevronStyle[0]}>
                                            { (sortBy[0]==3) ? chevrons[sortBy[1]] : null }
                                        </div>
                                    </TableHeaderCell>
                                    <TableHeaderCell className={`w-8 dark:border-l-white border-x-gray-500 ${TableHeadStyle[0]}`}>
                                        <div className={`w-fit ${TableHeadStyle[1]}`}>
                                            <Text className="w-fit dark:text-white text-black dark:hover:text-stone-300 hover:text-gray-300 break-words">Receipt</Text>
                                        </div>
                                    </TableHeaderCell>
                                    <TableHeaderCell className={`w-8 dark:border-l-white border-x-gray-500 ${TableHeadStyle[0]}`}>
                                        <TrashIcon className="w-5 h-5 absolute mx-auto my-auto left-0 right-0 top-0 bottom-0 "/>
                                    </TableHeaderCell>
                                </TableRow>
                            </TableHead>
                            <TableBody className="h-fit dark:divide-white divide-y  divide-black">
                                {expenses.map((item : ExpenseType, index : number) => {
                                    let date = "unknown"
                                    let formatter = Intl.NumberFormat('en-US', {})
                                    if (expenses.length == 0){
                                        return (<TableRow key={index}>
                                                <TableCell className="w-full">
                                                    <Text className="w-fit mx-auto right-0" >No Expenses</Text>
                                                </TableCell>
                                            </TableRow>)
                                        }
                                    if (!expenses[0].transaction_date){}
                                    else {
                                        // const [Y, M, D] = expenses[0].transaction_date.split('-')
                                        // date = String(new Date(item.transaction_date))
                                        date = (new Intl.DateTimeFormat(navigator.languages[0], {dateStyle : 'full'}).format(new Date(item.transaction_date)))
                                        formatter = new Intl.NumberFormat(navigator.languages[0], {currency: item.currency, style: 'currency'})
                                    }
                                    return (<TableRow key={index} className={"dark:divide-white divide-black divide-x " + ["dark:bg-black/10 bg-white ", "dark:bg-slate-800 bg-gray-800/10"][index%2]}>
                                        <TableCell className="relative w-8 mx-auto my-auto">
                                            <div className="absolute right-0 top-0 left-0 bottom-0 w-4 h-4 mx-auto my-auto">
                                                <input checked={item.recurring} readOnly disabled id="checked-checkbox" type="checkbox" value="" className="absolute w-full aspect-square  bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                            </div>
                                        </TableCell>
                                        <TableCell className="mx-auto relative grid grid-cols-10 h-full">
                                            <div suppressContentEditableWarning contentEditable={item.id == CurrentlyEditing} className={`col-span-8 relative h-[100%] ${(item.id == CurrentlyEditing) ? 'border border-green-500/80 rounded-md' : ''}`}>{/*"float-left relative bottom-0 top-0 left-0 mx-auto my-auto max-w-fit whitespace-pre-wrap break-words h-fit */}
                                                <Text className="w-full text-lg py-4 px-2 text-black dark:text-white my-auto top-0 bottom-0 absolute whitespace-pre-wrap break-words h-fit">{item.label}</Text>
                                            </div>
                                            <div className={`col-span-2 col-start-9 ml-2 relative h-10 aspect-square rounded-md ${!(item.id == CurrentlyEditing) ? 'bg-white/20' : 'bg-green-400'}`} onClick={(e)=>{ //relative float-right h-8 aspect-square  right-0 bottom-0 top-0 my-auto mr-4 border-2 cursor-pointer 
                                                if (item.id == CurrentlyEditing){setCurrentlyEditing(null); return}; setCurrentlyEditing(item.id)}}>
                                                {!(item.id == CurrentlyEditing) ? (<PencilIcon className="w-4 h-4 bottom-0 right-0 left-0 top-0 absolute mx-auto dark:text-white my-auto"/>) : (<CheckIcon className="w-4 h-4 bottom-0 right-0 left-0 top-0 absolute mx-auto my-auto" />)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="relative">
                                            <Badge tooltip={
                                                (categoryData.find((element) => {return element.id === item.category[0]})).subcategories[item.category[1]]
                                                //@ts-ignore
                                            } size={'md'} color={getColor((categoryData.find((element) => {return element.id === item.category[0]})).id)} className={`select-none dark:bg-black/0 border border-${getColor((categoryData.find((element) => {return element.id === item.category[0]})).id)}-500`} icon={getBadge((categoryData.find((element) => {return element.id === item.category[0]})).id)}>{(categoryData.find((element) => {return element.id === item.category[0]})).category}</Badge>
                                        </TableCell>
                                        <TableCell className="mx-auto border-x">
                                            <Text className="w-fit right-0 left-0 mx-auto dark:text-white text-black">
                                                {String(date)}
                                            </Text>
                                        </TableCell>
                                        <TableCell className="mx-auto ">
                                            <Text className="w-fit right-0 left-0 mx-auto text-black dark:text-white">
                                                {formatter.format(item.amount)} {item.currency}
                                            </Text>
                                        </TableCell>
                                        <TableCell className="mx-auto">
                                            <div className="border border-black/20 py-2 px-3 cursor-pointer rounded-md" onClick={()=>{setExpense(item.id)}}>
                                                <Text className="w-fit right-0 left-0 mx-auto text-black dark:text-white ">
                                                    {item.files.length} files
                                                </Text>
                                            </div>
                                        </TableCell>
                                        <TableCell className="mx-auto relative">
                                            <div className="border-2 border-red-400/80 w-10 aspect-square bg-gray-400/30 relative rounded-md mx-auto my-auto left-0 right-0 top-0 bottom-0 cursor-pointer hover:text-red-600" onClick={()=>{setHandlerMode(['delete', item.id])}}>
                                                <TrashIcon className="w-5 h-5 absolute mx-auto my-auto left-0 right-0 top-0 bottom-0"/>
                                            </div>
                                        </TableCell>
                                    </TableRow>)
                                })}
                            </TableBody>
                        </Table>
                    </div>
            </Card>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </main>
        </>
    )
}