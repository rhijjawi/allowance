import { Card, Badge, Button, Table, TabPanel,DonutChart, TabPanels, Grid, Divider, TabGroup, TableHead, TableHeaderCell, TableBody, TableRow, TableCell, TableFoot, TableFooterCell, Title, Select, SelectItem, Text, BarChart, AreaChart, TabList, Tab, TextInput, Col, Metric } from "@tremor/react"
import {useEffect, useState} from 'react'
import { useExpenses, ExpenseType } from "@/components/contexts/expenseCTX"
import {ChevronDownIcon, ChevronUpIcon, ClipboardDocumentIcon, PlusCircleIcon} from '@heroicons/react/24/outline'
import { sortData } from "@/utils/functions/sortData"
import { CheckIcon, PencilIcon, TrashIcon} from "@heroicons/react/24/solid"
import { useFileUpload } from "@/components/contexts/fileManagerCTX"
import { useTransactionHandler } from "@/components/contexts/transactionHandler"
import { useUser } from "@clerk/nextjs"
import UpcomingTable from "@/components/charts/UpcomingTable"
import DonutCategory from "@/components/charts/DonutCategory"
import MIMO from "@/components/charts/MoneyInMoneyOut"
import badges, { getBadge, getColor } from "@/components/static/categories"
import { ExpenditureDialog, IncomeDialogue } from "@/components/forms/QuickForms"
import HoverSwitchCurr from "@/components/ui/buttons/hoverSwitchCurr"
import getPrevious from "@/functions/getPrevious"
import { CategorySchema, ExpenseSchema, IncomeSchema } from "@/types/supabase"
import {ExpenditureDelta, IncomeDelta} from "@/components/charts/ExpenditureDelta"
import { LastPeriodDates } from "@/utils/functions/filterData"
import { motion } from "framer-motion"
let TableHeadStyle = ["dark:bg-black bg-white select-none","h-6 relative right-0 bottom-0 top-0 left-0 mx-auto my-auto"]
let ChevronStyle = ["absolute w-8 aspect-square rounded-full right-0 bottom-0 top-0 my-auto mr-4","w-8 h-8 border-2 rounded-full absolute"]

export default function listPage(){
    const { user, isSignedIn, isLoaded } = useUser()
    const [filtermode, setFiltermode] = useState<number>(0) // 0: all, 1: past 2 weeks, 2: past month, 3: past year
    const filterlabels = ["All Expenditure", "Expenditure in the past 2 weeks", "Expenditure in the past month", "Expenditure in the past year"]
    const selectLabels = ["All", "14 days", "30 days", "365 days"]
    const [filtered, setFiltered] = useState<any>([])
    const [originalState, setOriginalState] = useState<any>([])
    const [search, setSearch] = useState<string>("")
    const {expenseData, categoryData, incomeData, _error, setExpenseData} = useExpenses()
    const [sortBy, setSortBy] = useState<null|any>([0, 0])

    const [CurrentlyEditing, setCurrentlyEditing] = useState<any>(null)
    const previousEditing = getPrevious(CurrentlyEditing)
    const [label, setLabel] = useState<string>("")
    const [tab, setTab] = useState(0)
    const chevrons = [null, <ChevronUpIcon className={ChevronStyle[1]}/>, <ChevronDownIcon className={ChevronStyle[1]}/>]
    const {errorFU, loading, setExpense} = useFileUpload()
    const {handlerMode, setHandlerMode} = useTransactionHandler() as {handlerMode : string|null, setHandlerMode: React.Dispatch<React.SetStateAction<any[]>>}
    const [categorySums, setCategorySums] = useState({})
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isIncomeOpen, setIncomeIsOpen] = useState<boolean>(false)
    const categoryBadges = badges()
    useEffect(() => {
        const updateFunction = async () => {
            // await (await getSupabase(user!.accessToken)).from('expenses').update({label: label}).eq(id, id)
        }
        if (CurrentlyEditing == null && typeof previousEditing == 'number'){
            alert(label)
        }
    }, [previousEditing])
    const daterange = LastPeriodDates()
    if(!isLoaded) return null;
    return (
        <>
        <main className="p-12 min-h-screen">
            <ExpenditureDialog isOpen={isOpen} setIsOpen={setIsOpen} />
            <IncomeDialogue isOpen={isIncomeOpen} setIsOpen={setIncomeIsOpen} />
      <Title>Dashboard 🏦</Title>
      <Text>A detailed overview of your finances.</Text>

      <TabGroup className="mt-6" defaultIndex={tab} onIndexChange={setTab}>
        <TabList>
          <Tab>Overview</Tab>
          <Tab>Detail</Tab>
          <Tab>Month-to-date</Tab>
          <Tab>Savings</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Grid numItemsMd={2} numItemsLg={3} className="gap-6 mt-6">
              <Card className="min-h-80 h-fit bg-slate-200 border-slate-400 border-2">
              {user ?
                <DonutCategory expenseData={expenseData} categoryData={categoryData}/>: null}
              </Card>
              <div className="">
              <Card className="shadow-md min-h-16 h-fit bg-slate-200 border-slate-400 border-2">
                <Title>Upcoming Transactions</Title>
                <UpcomingTable expenses={expenseData} categories={categoryData}/>
              </Card>
              <Card className="shadow-md bg-slate-200 border-slate-400 border-2 mt-3 flex-grow grid grid-cols-3">
                <Title className="col-span-1 col-start-1">Copy your invite code</Title>
                <Button icon={ClipboardDocumentIcon} size={"lg"} className="float-right col-start-3 text-sm w-full">Copy</Button>
              </Card>
              <Card className="shadow-md bg-slate-200 border-slate-400 border-2 mt-3 flex-grow grid grid-cols-3">
                <Button className="col-start-1 h-12" icon={PlusCircleIcon} color="red" onClick={()=>setIsOpen(true)}>Add Expense</Button>
                <Button className="col-start-3 h-12" icon={PlusCircleIcon} color="emerald" onClick={()=>setIncomeIsOpen(true)}>Add Income</Button>
              </Card>
              </div>
              <Card className="w-full shadow-md bg-slate-200 border-slate-400 border-2">
                <Title>Money In vs. Money Out</Title>
                <MIMO expenses={expenseData} income={incomeData} currency={user!.publicMetadata.currency as string}/>
              </Card>
            </Grid>
            
              {/* <Card>
                <div className="mt-6">
                <div className="h-96">
                        <Title className="">All Categories</Title>
                            <div className="">
                                <AreaChart
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
                                />
                        </div>
                    </div>
                </div>
                </Card> */}
          </TabPanel>
          <TabPanel>
            <Card className="mt-6 bg-slate-200 border-slate-400 border-2">
                <div className="flex justify-between">
                        <Title className="w-fit relative float-left">{filterlabels[filtermode]}</Title>
                        {/* @ts-ignore */}
                        <Select className="w-[20%] relative float-right h-12 top-1" value={filtermode} onValueChange={(v)=>{setFiltermode(v); console.log(v)}}>
                            {/* @ts-ignore */}
                            {selectLabels.map((item, index) => {return <SelectItem key={index} className="text-stone-700 bg-gray-800/30 hover:cursor-pointer" value={index}>{item}</SelectItem>})}
                        </Select>
                    </div>
                    <div className="block">
                        {expenseData.length > 0 ?<Table className="grid mt-5 w-full rounded-b-md border-2 rounded-md">
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
                                            <Text className="w-fit dark:text-white text-black  break-words">Receipt</Text>
                                        </div>
                                    </TableHeaderCell>
                                    <TableHeaderCell className={`w-8 dark:border-l-white border-x-gray-500 ${TableHeadStyle[0]}`}>
                                        <TrashIcon className="w-5 h-5 absolute mx-auto my-auto left-0 right-0 top-0 bottom-0 "/>
                                    </TableHeaderCell>
                                </TableRow>
                            </TableHead>
                            
                            <TableBody className="h-fit dark:divide-white divide-y  divide-black">
                                {expenseData.map((item : ExpenseType, index : number) => {
                                    let date = "unknown"
                                    let formatter = Intl.NumberFormat('en-US', {})
                                    if (expenseData.length == 0){
                                        return (<TableRow key={index}>
                                                <TableCell className="w-full">
                                                    <Text className="w-fit mx-auto right-0" >No Expenses</Text>
                                                </TableCell>
                                            </TableRow>)
                                        }
                                    if (!expenseData[0].transaction_date){}
                                    else {
                                        
                                        date = (new Intl.DateTimeFormat(navigator.languages[0], {dateStyle : 'long'}).format(new Date(item.transaction_date)))
                                        formatter = new Intl.NumberFormat(navigator.languages[0], {currency: item.currency, style: 'currency'})
                                    }
                                    return (<TableRow key={item.id} className={"dark:divide-white divide-black divide-x " + ["dark:bg-black/10 bg-white ", "dark:bg-slate-800 bg-gray-800/10"][index%2]}>
                                        <TableCell className="relative w-8 mx-auto my-auto">
                                            <div className="absolute right-0 top-0 left-0 bottom-0 w-4 h-4 mx-auto my-auto">
                                                <input checked={item.recurring} readOnly disabled id="checked-checkbox" type="checkbox" value="" className="absolute w-full aspect-square  bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                            </div>
                                        </TableCell>
                                        <TableCell className="mx-auto relative grid grid-cols-10 h-full">
                                            <div className={`col-span-8 relative h-[100%] ${(item.id == CurrentlyEditing) ? 'border-2 border-green-500/80 rounded-lg' : ''}`}>{/*"float-left relative bottom-0 top-0 left-0 mx-auto my-auto max-w-fit whitespace-pre-wrap break-words h-fit */}
                                                {!(item.id == CurrentlyEditing) ? <Text className="w-full text-lg py-4 px-2 text-black dark:text-white my-auto top-0 bottom-0 absolute whitespace-pre-wrap break-words h-fit">{item.label}</Text> : <TextInput onChange={(e)=>{setLabel(e.target.value)}} className="w-full text-lg py-4 px-2 text-black dark:text-white my-auto top-0 bottom-0 absolute whitespace-pre-wrap break-words h-[100%]" defaultValue={item.label} />}
                                            </div>
                                            <div className="col-span-2 col-start-9 ml-2 relative h-10 aspect-square"></div>
                                            {/* <div className={`col-span-2 col-start-9 ml-2 relative h-10 aspect-square rounded-md ${!(item.id == CurrentlyEditing) ? 'bg-white/20' : 'bg-green-400'}`} onClick={(e)=>{
                                                if (item.id == CurrentlyEditing){setCurrentlyEditing(null); return}; setCurrentlyEditing(item.id)}}>
                                                {!(item.id == CurrentlyEditing) ? (<PencilIcon className="w-4 h-4 bottom-0 right-0 left-0 top-0 absolute mx-auto dark:text-white my-auto"/>) : (<CheckIcon className="w-4 h-4 bottom-0 right-0 left-0 top-0 absolute mx-auto my-auto" />)}
                                            </div> */}
                                        </TableCell>
                                        <TableCell className="relative">
                                            <Badge tooltip={
                                                //@ts-ignore
                                                String((categoryData.find((element) => {return element.id === item.category[0]}))!.subcategories[item.category[1]])} size={'md'} color={getColor((categoryData.find((element) => {return element.id === item.category[0]})).id)} className={`select-none dark:bg-black/0 border border-${getColor((categoryData.find((element) => {return element.id === item.category[0]})).id)}-500`} icon={getBadge((categoryData.find((element) => {return element.id === item.category[0]})).id)}>{(categoryData.find((element) => {return element.id === item.category[0]})).category}</Badge>
                                        </TableCell>
                                        <TableCell className="mx-auto border-x">
                                            <Text className="w-fit right-0 left-0 mx-auto dark:text-white text-black">
                                                {String(date)}
                                            </Text>
                                        </TableCell>
                                        <TableCell className="mx-auto ">
                                            <Text className="w-fit right-0 left-0 mx-auto text-black dark:text-white">
                                                <HoverSwitchCurr size={'md'} expense={item}/>
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
                        </Table> : <></>}
                        {expenseData.length == 0 ? <motion.div className="h-full text-center w-full block mt-5">No data. To get started, go to the overview tab via the tab list above.</motion.div> : null}
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
            <Card className=" dark:border-2 relative"></Card>
            </Col>
        </TabPanel>
        </TabPanels>
      </TabGroup>
    </main>
        </>
    )
}