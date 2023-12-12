import { useUser } from "@clerk/nextjs";
import { ReactElement, use, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Text, ButtonProps, NumberInput, DatePicker, DatePickerProps } from "@tremor/react";
import { CurrencyDollarIcon } from "@heroicons/react/24/solid";
import * as symbols from "@/components/static/symbols.json";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";
import axios from "axios";
function nth(number: number){
    if (number > 3 && number < 21) return 'th';
    switch (number % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
};
function Card(props : any, {...rest}){
    return(
    <div className={`divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow w-full mt-5 max-w-[80%] my-auto mx-auto border-2 ${props.className}`}>
    <div className="px-4 py-5 sm:px-6 text-lg dark:bg-dark-tremor-background">
      {props.header}
    </div>
    <div className="pt-5 sm:pt-6 dark:bg-dark-tremor-background">{props.children}</div>
    <div className="px-4 py-4 sm:px-6 dark:bg-dark-tremor-background">
      {props.footer}
    </div>
  </div>)
}
export default function Profile() {
    const {user,isLoaded, } = useUser()
    const MonthlyBudget = useRef<HTMLInputElement>(null)
    const MonthlyIncome = useRef<HTMLInputElement>(null)
    const saveRef = useRef<HTMLButtonElement>(null)
    const [date, setdate] = useState<number>(1)
    const [monthlyBudget, setMonthlyBudget] = useState<number>()
    const [budgetCurrency, setbudgetCurrency] = useState<string>("USD")
    const [monthlyIncome, setMonthlyIncome] = useState<number>()
    const [incomeCurrency, setIncomeCurrency] = useState<string>("USD")
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [wasOpened, setWasOpened] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    return (<>
    <Card header={<h1>Profile</h1>} footer={<span className="text-stone-500">Change your profile picture on <a target="_blank" className="text-[rgb(29,79,196)]" href={'https://gravatar.com/'}>Gravatar</a><br/>If you're running into any issues, feel free to contact us at: <a className="text-blue-300 underline" href={`mailto:expenses@ramzihijjawi.me`}>expenses@ramzihijjawi.me</a></span>}>
        <div className="w-24 h-24 right-0 left-0 mx-auto ">
            <div className="relative  z-10 text-center inline-flex h-full aspect-square items-center justify-center rounded-full bg-gray-500">
                <span className="relative text-center inline-flex h-full aspect-square items-center justify-center rounded-lg bg-gray-500 overflow-hidden">
                    {user?.imageUrl ? <Image alt={""} src={user.imageUrl} width={1000} height={1000}></Image> : <span className="text-md font-medium leading-none text-white">{user?.fullName?.split(' ').map((i)=>{return i[0]+""})}</span>}
                </span>
            </div>
            </div>
            <div className="relative w-full right-0 h-12 block">
                <div className="w-fit right-0 absolute left-0 mx-auto mt-3">
                    <p className="text-xl"><b>{user?.fullName}</b></p>
                </div>
            </div>
            <div className="my-3 max-w-sm mx-auto">
                {/* <div className="relative max-w-md mx-auto right-0 h-12 block">
                    <label className="text-md font-medium leading-none text-gray-700">Monthly Budget</label>
                    <NumberInput placeholder="Enter your monthly budget" ref={MonthlyBudget}/>
                </div> */}
                <label htmlFor="monthlyBudget" className="text-md block mb-2 font-medium leading-none text-gray-700 dark:text-white">
                        Monthly Budget
                </label>
                <div className="grid grid-cols-10">
                <div className="col-span-10 h-10 relative text-sm font-medium leading-6 text-gray-900">
                        <NumberInput
                            ref={MonthlyBudget}
                            icon={CurrencyDollarIcon}
                            placeholder="Amount..."
                            enableStepper={false}
                            className="border-2 border-orange-400 dark:border-orange-400"
                        />
                        <label htmlFor="currency" className="sr-only">
                            Currency
                        </label>
                        <select
                            id="currency"
                            name="currency"
                            onChange={(e)=>{
                                setbudgetCurrency(e.target.value)
                            }
                                }
                            className="h-full dark:text-gray-900 absolute right-0 top-0 float-right rounded-md border-0 bg-transparent text-gray-500 focus:ring-transparent sm:text-sm"
                            value={budgetCurrency}
                        >
                            {Object.keys(symbols).map((currency:string, index:number) => (
                                <option key={index} value={currency}>{currency}</option>
                            ))}
                        </select>

                </div>
                <div className="col-span-1 col-start-9 mx-4">
                    {/* <Button tooltip="?"
                    icon={CalendarIcon} className="h-full px-2 aspect-square"></Button> */}
                </div>
                </div>
                <label htmlFor="monthlyBudget" className="text-md block font-medium leading-none text-gray-700 mt-8 mb-2 dark:text-white">
                        Monthly Income/Allowance
                </label>
                <div className="grid grid-cols-10">
                <div className="col-span-9 w-[95%] h-10 relative text-sm font-medium leading-6 text-gray-900 ">
                        <NumberInput
                            ref={MonthlyIncome}
                            icon={CurrencyDollarIcon}
                            placeholder="Amount..."
                            enableStepper={false}
                            value={monthlyIncome}
                            className="border-2 border-green-400 dark:border-green-400"
                            onValueChange={(e)=>{
                                setMonthlyIncome(e);
                            }}
                        />
                        <label htmlFor="currency" className="sr-only">
                            Currency
                        </label>
                        <select
                            id="currency"
                            name="currency"
                            onChange={(e)=>{
                                setIncomeCurrency(e.target.value)
                            }
                                }
                            className="h-full absolute right-0 top-0 float-right rounded-md border-0 bg-transparent text-gray-500 dark:text-gray-900 focus:ring-transparent sm:text-sm"
                            value={incomeCurrency}
                        >
                            {Object.keys(symbols).map((currency:string, index:number) => (
                                <option key={index} value={currency}>{currency}</option>
                            ))}
                        </select>

                </div>
                <div className="col-span-1 col-start-10 ml-5">
                    <Button tooltip={!wasOpened ? "What day of the month do you get your income/allowance?" : `You receive your income/allowance on the ${date}${nth(date)} day of each month`} icon={CalendarIcon} className={`${!wasOpened ? 'dark:border-red-500' : " dark:border-green-500"} border-2 h-full px-2 aspect-square float-right`} onClick={()=>{setIsOpen(true);setWasOpened(true)}}></Button>
                    <Dialog open={isOpen} onClose={()=>{}} className={'relative z-[500] '}>
                        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                        <div className='fixed inset-0 flex w-screen items-center justify-center p-4 '>
                        <Dialog.Panel className={`rounded-md relative w-full bg-white dark:bg-black max-w-2xl h-fit  max-h-full border-2 border-green-600 dark:border-green-600`}>
                            <Dialog.Title className={'flex bg-emerald-400 items-start justify-between p-4 border-b rounded-t dark:border-white dark:text-white text-black'}>Income</Dialog.Title>
                            <div className='p-6 rounded-md space-y-4'>
                                    <label htmlFor="monthlyBudget" className="text-md block font-medium leading-none text-gray-700 dark:text-white mt-0 mb-2">When do you recieve your paycheck, allowance, or income?</label>
                                    <div className="z-[120] h-12 relative">
                                        <NumberInput min={1} max={31} className="max-w-sm mx-auto " value={date}  onValueChange={(e)=>{setdate(e)}} />
                                    </div>
                                    <div className="z-[120] relative h-fit">
                                        <Text>You recieve your paycheck, allowance, or income on the {date}{nth(date)} day of each month.</Text>
                                    </div>
                            </div>
                                    <div className="relative w-fit mb-3 right-0 bottom-0 left-0 mx-auto">
                                        <Button onClick={()=>{
                                            setIsOpen(false)
                                        }} className="h-10 pt-4 py-2 mx-auto relative">Done</Button>
                                    </div>
                        </Dialog.Panel>
                        </div>
                    </Dialog>
                    </div>
                    {/*  */}
                </div>
                </div>
                <div className="w-fit mx-auto right-0 left-0 bottom-0">
                    <Button ref={saveRef} loading={loading} onClick={()=>{
                        setLoading(true)    
                    }} className="relative mx-auto my-5 py-2 px-3">Save Changes</Button>
                </div>
            
            
    </Card>
    </>)
}