import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Text, Badge, TextInput, Card, Button } from '@tremor/react';
import { ExpenseSchema, IncomeSchema } from '@/types/supabase';
import { ArrowLeftIcon, ArrowRightIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { TrashIcon } from '@heroicons/react/24/solid';
import HoverSwitchCurr from '../ui/buttons/hoverSwitchCurr';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { getColor, getBadge, getBadgeByCategoryName, getIDByCategoryName } from '../static/categories';
import { useExpenses } from '../contexts/expenseCTX';
import { useTransactionHandler } from '../contexts/transactionHandler';
import { currFormatter } from '@/utils/functions/valueFormatters';
import { useUser } from '@clerk/nextjs';
let TableHeadStyle = ["dark:bg-black bg-white select-none relative","h-6 relative right-0 bottom-0 top-0 left-0 mx-auto my-auto"]
let ChevronStyle = ["absolute w-8 aspect-square rounded-full right-0 bottom-0 top-0 my-auto mr-4","w-8 h-8 border-2 rounded-full absolute"]
const chevrons = [null, <ChevronUpIcon className={ChevronStyle[1]}/>, <ChevronDownIcon className={ChevronStyle[1]}/>]

export default function ExpTable({filter, sortBy, setSortBy, setExpenseFU} : {filter? : "uncategorized"|0|1|2|3, sortBy : [number, number], setSortBy:Dispatch<SetStateAction<[number, number]>>, setExpenseFU: Dispatch<SetStateAction<number>>}) {
    const {handlerMode, setHandlerMode} = useTransactionHandler() as {handlerMode : string|null, setHandlerMode: React.Dispatch<React.SetStateAction<[null|'delete'|'edit'|'modifyCategory'|'add', number[]]>>}
    const {expenseData, categoryData, incomeData, _error, setExpenseData} = useExpenses()
    const [data, setData] = useState<ExpenseSchema[]>([])
    const [selected, setSelected] = useState<number[]>([])
    const [paginatedData, setPaginatedData] = useState<ExpenseSchema[]>([])
    const [page, setPage] = useState(0)
    const pageSize = 25
    const {user} = useUser()
    useEffect(()=>{
        if (filter){
            switch (filter){
                case "uncategorized":
                    setData(expenseData.filter((expense : ExpenseSchema)=>{
                        return ((expense.category[0] == 0) && (expense.category[1] == 0))
                    }))
                    break;
                default:
                    setData(expenseData)
                    break;
            }
        }
        else {
            setData(expenseData)
        }
        setPage(0)
    }, [expenseData])
    useEffect(()=>{ 
        const spliced = data.slice(page*pageSize, (page+1)*pageSize)
        setPaginatedData(spliced)
    }, [page, data])
    return (<>
    {selected.length > 0 && <Card className="fixed min-h-[4rem] max-h-fit max-w-fit z-50 border-neutral-900 border rounded-md bottom-5 left-5">
        <p>Average: <strong>{currFormatter(expenseData.filter((exp)=>selected.includes(exp.id!)).map((exp : ExpenseSchema)=>{
            return exp.standardizedCurrency
        }).reduce((b,a)=>b!+a!, 0)!/selected.length, (user!.publicMetadata as {currency : string}).currency)}</strong></p>
        Total: <strong>{currFormatter(expenseData.filter((exp)=>selected.includes(exp.id!)).map((exp : ExpenseSchema)=>{
            return exp.standardizedCurrency
        }).reduce((b,a)=>b!+a!, 0)!, (user!.publicMetadata as {currency : string}).currency)}</strong>
    </Card>}
    <Table className="relative grid mt-5 w-full rounded-b-md border-2 rounded-md overflow-visible">
            {selected.length > 0 ? <>
            <div key={'_0'} className="absolute h-fit w-fit rounded-md -top-16 left-0 right-0 mx-auto z-0">
                <span key={'_0_0'} className="isolate inline-flex rounded-md shadow-sm">
                    <button key={'_0_1'} type="button" className="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10" onClick={()=>setSelected([])}>Clear Selection</button>
                    <button key={'_0_2'} type="button" className="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10" onClick={()=>setHandlerMode(["delete", selected])}>Bulk Delete</button>
                    <button key={'_0_3'} type="button" className="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10">Bulk Rename</button>
                    <button key={'_0_4'} type="button" className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10" onClick={()=>setHandlerMode(["modifyCategory", selected])}>Bulk Edit Categories</button>
                </span>
            </div></> : null}
    <TableHead>
        <TableRow className="border-b-2 dark:border-b-white border-b-black">
            <TableHeaderCell className={`w-16 relative ${TableHeadStyle[0]}`}>
                <div className={`w-fit h-full ${TableHeadStyle[1]}`}>
                </div>
            </TableHeaderCell>
            <TableHeaderCell className={`w-64 relative border-x-gray-500 border-x ${TableHeadStyle[0]}`}>
                <div className={`w-fit ${TableHeadStyle[1]}`}>
                    <Text className="hover:cursor-pointer w-fit h-full dark:text-white text-black dark:hover:text-stone-300 hover:text-gray-300">
                        Recurring
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
                    <p className="hover:cursor-pointer w-fit dark:text-white text-black dark:hover:text-stone-300 hover:text-gray-300">Transaction Date</p>
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
        {paginatedData.map((item : ExpenseSchema, index : number) => {
            const daystoMs = [1209600000, 2678400000, 31557600000];
            if (Number.isInteger(filter) && filter != 0){
                const filterTime = new Date(Number(new Date()) - daystoMs[Number(filter)-1]);
                if(!(new Date(item.transaction_date) >= filterTime && new Date(item.transaction_date) <= new Date())) return (<></>);
            }
            let date = "unknown"
            let formatter = Intl.NumberFormat('en-US', {})
            if (data.length == 0){
                return (<TableRow key={item.id}>
                        <TableCell key={`${item.id}.1`} className="w-full">
                            <Text className="w-fit mx-auto right-0" >No Expenses</Text>
                        </TableCell>
                    </TableRow>)
                }
            if (!data[0].transaction_date){}
            else {
                
                date = (new Intl.DateTimeFormat(navigator.languages[0], {dateStyle : 'long'}).format(new Date(item.transaction_date)))
                formatter = new Intl.NumberFormat(navigator.languages[0], {currency: item.currency, style: 'currency'})
            }
            return (<TableRow key={item.id} onClick={(e)=>{
                if (selected.indexOf(item.id!) == -1) setSelected((prev)=>prev.concat(item.id!))
                else setSelected((prev)=>prev.filter((id)=>id != item.id))
                
            }} className={"dark:divide-white cursor-pointer divide-black divide-x " + ["dark:bg-black/10 bg-white ", "dark:bg-slate-800 bg-gray-800/10"][index%2]}>
                <TableCell key={`${item.id}.2`} className="relative w-8 mx-0 my-auto ">
                    <div className="absolute right-0 top-0 left-0 bottom-0 w-6 h-6 p-6 ">
                        <input readOnly id="comments" checked={selected.indexOf(item.id!) !== -1} aria-describedby="comments-description" name="comments" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"/>
                    </div>
                </TableCell>
                <TableCell key={`${item.id}.3`} className="relative w-8 mx-auto my-auto">
                    <div className="absolute right-0 top-0 left-0 bottom-0 w-4 h-4 mx-auto my-auto">
                        <input checked={item.recurring} readOnly disabled id="checked-checkbox" type="checkbox" value="" className="absolute w-full aspect-square  bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                    </div>
                </TableCell>
                <TableCell key={`${item.id}.4`} className="mx-auto relative grid grid-cols-10 h-full">
                    <div className={`col-span-8 relative h-[100%]`}>{/*"float-left relative bottom-0 top-0 left-0 mx-auto my-auto max-w-fit whitespace-pre-wrap break-words h-fit */}
                        <Text className="w-full text-lg py-4 px-2 text-black dark:text-white my-auto top-0 bottom-0 absolute whitespace-pre-wrap break-words h-fit">{item.label}</Text>
                    </div>
                    <div className="col-span-2 col-start-9 ml-2 relative h-10 aspect-square"></div>
                    {/* <div className={`col-span-2 col-start-9 ml-2 relative h-10 aspect-square rounded-md ${!(item.id == CurrentlyEditing) ? 'bg-white/20' : 'bg-green-400'}`} onClick={(e)=>{
                        if (item.id == CurrentlyEditing){setCurrentlyEditing(null); return}; setCurrentlyEditing(item.id)}}>
                        {!(item.id == CurrentlyEditing) ? (<PencilIcon className="w-4 h-4 bottom-0 right-0 left-0 top-0 absolute mx-auto dark:text-white my-auto"/>) : (<CheckIcon className="w-4 h-4 bottom-0 right-0 left-0 top-0 absolute mx-auto my-auto" />)}
                    </div> */}
                </TableCell>
                <TableCell key={`${item.id}.5`} className="relative">
                    <Badge id='noclick' onClick={(e)=>{
                        e.stopPropagation();
                        setHandlerMode(['modifyCategory',[item.id!]])}} tooltip={
                        //@ts-ignore
                        String((categoryData.find((element) => {return element.id === item.category[0]}))!.subcategories[item.category[1]])} size={'md'} color={getColor((categoryData.find((element) => {return element.id === item.category[0]})).id)} className={`select-none hover:bg-${getColor((categoryData.find((element) => {return element.id === item.category[0]})).id)}-200 hover:cursor-pointer dark:bg-black/0 border border-${getColor((categoryData.find((element) => {return element.id === item.category[0]})).id)}-500`} icon={getBadge((categoryData.find((element) => {return element.id === item.category[0]})).id)}>{(categoryData.find((element) => {return element.id === item.category[0]})).category}</Badge>
                </TableCell>
                <TableCell key={`${item.id}.6`} className="mx-auto border-x">
                    <Text className="w-fit right-0 left-0 mx-auto dark:text-white text-black">
                        {String(date)}
                    </Text>
                </TableCell>
                <TableCell key={`${item.id}.7`} className="mx-auto ">
                    <Text className="w-fit right-0 left-0 mx-auto text-black dark:text-white">
                        <HoverSwitchCurr size={'md'} expense={item}/>
                    </Text>
                </TableCell>
                <TableCell key={`${item.id}.8`} className="mx-auto">
                    <div className="border border-black/20 py-2 px-3 cursor-pointer rounded-md" onClick={()=>{setExpenseFU(item.id!)}}>
                        <Text className="w-fit right-0 left-0 mx-auto text-black dark:text-white ">
                            {item.files.length} files
                        </Text>
                    </div>
                </TableCell>
                <TableCell key={`${item.id}.9`} className="mx-auto relative">
                    <div className="border-2 border-gray-300 text-gray-600 focus:ring-indigo-600 w-10 aspect-square relative rounded-md mx-auto my-auto left-0 right-0 top-0 bottom-0 cursor-pointer hover:text-red-600" onClick={(e)=>{setHandlerMode(['delete', [item.id!]]); e.stopPropagation()}}>
                        <TrashIcon className="w-5 h-5 absolute mx-auto my-auto left-0 right-0 top-0 bottom-0"/>
                    </div>
                </TableCell>
            </TableRow>)
        })}
    </TableBody>
</Table>
<div className="relative mx-auto w-fit grid grid-cols-[auto_fit-content(100%)_auto] gap-x-2 mt-6">
    <Button iconPosition={'left'} onClick={()=>{setPage((prev)=>prev-1)}} disabled={page < 1} icon={ArrowLeftIcon} tooltip='Previous Page'>Previous</Button>
    <div className="w-fit h-fit my-auto"> 
        <p className='align-middle h-fit whitespace-nowrap'>Page <strong>{page+1}</strong> of <strong>{Math.ceil(data.length / pageSize)}</strong></p>
    </div>
    <Button iconPosition={'right'} tooltip='Next Page' onClick={()=>{setPage((prev)=>prev+1)}} disabled={data.slice((page+1)*pageSize, (page+2)*pageSize).length == 0} icon={ArrowRightIcon}>Next</Button>
</div>
</>)
}