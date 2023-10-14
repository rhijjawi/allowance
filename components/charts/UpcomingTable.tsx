import {useState, useEffect, Fragment} from "react"
import { ExpenseType } from "../contexts/expenseCTX";
import { Card, Table, TableHead, Button, TableRow, TableHeaderCell, TableBody, TableCell, Text, Title, Badge } from "@tremor/react";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { getColor, getBadge } from "@/components/static/categories";
let TableHeadStyle = ["dark:bg-black bg-white select-none","h-6 relative right-0 bottom-0 top-0 left-0 mx-auto my-auto"]
export default function table(props : {expenses : ExpenseType[], categories : any}){
    let {expenses, categories} = props
    const [modalOpen, setModalOpen] = useState<any>(false)
    const [recurring, setRecurring] = useState<any>([])
    //important info
    useEffect(()=>{
        let active = true
        expenses.map((expense : ExpenseType) => {
            let date = new Date(expense.transaction_date)
            date.setUTCMonth(new Date().getUTCMonth())
            let DateDelta = Number(new Date(date)) - Number(new Date())
            if (DateDelta < 0){return}
            if (expense.recurring || ((Number(new Date(expense.transaction_date)) - Number(new Date())) > 0)){
                setRecurring((prevState : any) => [...prevState, expense])}
        })
    }, [expenses])
    useEffect(()=>{
    }, [recurring])
    const closeModal = (): any => setModalOpen(false);
    return (
        <>
            <Table className="mt-5 max-w-full w-full border border-slate-400 rounded-md max-h-32 overflow-y-scroll">
            <TableHead className="border-b border-black bg-white">
                <TableRow>
                    <TableHeaderCell className={`w-8 relative ${TableHeadStyle[0]}`}>
                        <div className={`${TableHeadStyle[1]}`}>
                            <Text className="hover:cursor-pointer w-fit h-full dark:text-white text-black">
                                Label
                            </Text>
                        </div>
                    </TableHeaderCell>
                    <TableHeaderCell className={`w-8 relative ${TableHeadStyle[0]}`}>
                        <div className={` ${TableHeadStyle[1]}`}>
                            <Text className="hover:cursor-pointer w-fit h-full dark:text-white text-black">
                                Date
                            </Text>
                        </div>
                    </TableHeaderCell>
                    <TableHeaderCell className={`w-8 relative ${TableHeadStyle[0]}`}>
                        <div className={` ${TableHeadStyle[1]}`}>
                            <Text className="hover:cursor-pointer w-fit h-full dark:text-white text-black">
                                Amount
                            </Text>
                        </div>
                    </TableHeaderCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {recurring.map((item : ExpenseType, index: number) => {
                    let date = new Date(item.transaction_date)
                    date.setUTCMonth(new Date().getUTCMonth())
                    let DateDelta = Number(new Date(date)) - Number(new Date())
                    if (DateDelta < 0){return}
                    return (
                        <TableRow key={index}>
                            <TableCell>{item.label}</TableCell>
                            <TableCell>
                            <Text>In {Math.round(DateDelta/(1000*3600*24))} days</Text>
                            </TableCell>
                            <TableCell>
                            <Text className={`dark:text-white`}>{new Intl.NumberFormat('en-DE', {currency: item.currency, style: 'currency'}).format(item.amount)}</Text>
                            </TableCell>
                        </TableRow>
                )}).splice(0,3)}
            </TableBody>
            </Table>
                {recurring.length > 3 ? <div className="relative right-0 left-0 bottom-0 w-full h-8 mt-5"><Button 
                    tooltip="View the full table of your upcoming/recurring transactions" 
                    className=" max-w-sm bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 absolute mx-auto my-auto left-0 right-0 top-0 bottom-0"
                    icon={ArrowsPointingOutIcon}
                    onClick={()=>{setModalOpen(true)}}>
                    Show Full Table [{recurring.length - 3} more...] 
                </Button></div>: <></>}
            <Transition appear show={modalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-25" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel
                        className="w-full max-w-xl transform overflow-hidden ring-tremor bg-white
                                            p-6 text-left align-middle shadow-tremor transition-all rounded-xl"
                        >
                        <div className="relative mt-3">
                            <Table className="min-h-fit h-fit mt-5 w-full rounded-b-md border-2 rounded-md">
                            <TableHead>
                                <TableRow className="border-b-2 dark:border-b-white border-b-black">
                                    <TableHeaderCell className={`w-8 relative ${TableHeadStyle[0]}`}>
                                        <div className={` ${TableHeadStyle[1]}`}>
                                            <Text className="hover:cursor-pointer w-fit h-full dark:text-white text-black">
                                                Label
                                            </Text>
                                        </div>
                                    </TableHeaderCell>
                                    <TableHeaderCell className={`w-8 relative ${TableHeadStyle[0]}`}>
                                        <div className={` ${TableHeadStyle[1]}`}>
                                            <Text className="hover:cursor-pointer w-fit h-full dark:text-white text-black">
                                                Category
                                            </Text>
                                        </div>
                                    </TableHeaderCell>
                                    <TableHeaderCell className={`w-8 relative ${TableHeadStyle[0]}`}>
                                        <div className={` ${TableHeadStyle[1]}`}>
                                            <Text className="hover:cursor-pointer w-fit h-full dark:text-white text-black">
                                                Next Payment
                                            </Text>
                                        </div>
                                    </TableHeaderCell>
                                    <TableHeaderCell className={`w-8 relative ${TableHeadStyle[0]}`}>
                                        <div className={` ${TableHeadStyle[1]}`}>
                                            <Text className="hover:cursor-pointer w-fit h-full dark:text-white text-black">
                                                Amount
                                            </Text>
                                        </div>
                                    </TableHeaderCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {recurring.map((item : ExpenseType, index : number) => {
                                    let date = new Date(item.transaction_date)
                                    date.setUTCMonth(new Date().getUTCMonth())
                                    let DateDelta = Number(new Date(date)) - Number(new Date())
                                    if (DateDelta < 0){return}
                                    return (
                                        <TableRow key={item.id} className={"dark:divide-white divide-tremor-border divide-x " + ["dark:bg-black/10 bg-white ", "dark:bg-slate-800 bg-gray-800/10"][index%2]}>
                                    <TableCell>{item.label}</TableCell>
                                    <TableCell>
                                        <Text>
                                            <Badge tooltip={
                                                    (categories.find((element : any) => {return element.id === item.category[0]})).subcategories[item.category[1]]
                                                    //@ts-ignore
                                                } size={'md'} color={getColor((categories.find((element) => {return element.id === item.category[0]})).id)} className={`select-none dark:bg-black/0 border border-${getColor((categories.find((element) => {return element.id === item.category[0]})).id)}-500`} icon={getBadge((categories.find((element) => {return element.id === item.category[0]})).id)}>{(categories.find((element) => {return element.id === item.category[0]})).category}</Badge>
                                        </Text>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Text>In {Math.round(DateDelta/(1000*3600*24))} days</Text>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Text>{(new Intl.NumberFormat(navigator.languages[0], {currency: item.currency, style: 'currency'})).format(item.amount)}</Text>
                                    </TableCell>
                                </TableRow>
                                )})}
                                
                            </TableBody>
                            </Table>
                        </div>
                        
                        <Button className="mt-5 w-full bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300" onClick={closeModal}>
                            Go back
                        </Button>
                        </Dialog.Panel>
                    </Transition.Child>
                    </div>
                </div>
                </Dialog>
            </Transition>
        </>
    )
}