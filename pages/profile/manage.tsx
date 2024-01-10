"use client";
import { UserProfile, useUser } from "@clerk/nextjs";
import { Dialog } from "@headlessui/react";
import { CalendarIcon, CurrencyDollarIcon, UserIcon, WalletIcon } from "@heroicons/react/24/outline";
import { Button, NumberInput, Text } from "@tremor/react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import symbols from "@/components/static/symbols.json";
import { useAlerts } from "@/components/contexts/alertHandler";
function nth(number: number){
    if (number > 3 && number < 21) return 'th';
    switch (number % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
};
export default function ManageProfile(){
    const {user, isLoaded, isSignedIn} = useUser()
    const router = useRouter()
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
    const [misc, setMisc] = useState<any>(null)
    const { addAlert } = useAlerts()
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
    if (!isLoaded)return (<></>)

    return (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full min-h-screen h-fit"
        transition={{duration: 1}}
        >

            <UserProfile path="/profile/manage" routing="virtual" appearance={{elements: {rootBox : "mx-auto h-fit my-10"}}}>
                <UserProfile.Page label="account" />
                <UserProfile.Page label="security" />
                <UserProfile.Page label="Expenditure" url="expenditure" labelIcon={<WalletIcon />}>
                    <div className="w-full h-fit">
                    <div className="my-3 max-w-sm mx-auto">
                
                <label htmlFor="monthlyBudget" className="text-md block mb-2 font-medium leading-none text-gray-700 dark:text-black">
                        Monthly Budget
                </label>
                <div className="grid grid-cols-10">
                <div className="col-span-10 h-10 relative text-sm font-medium leading-6 text-gray-900">
                        <NumberInput
                            value={misc.budget[0]}
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
                            className="h-full dark:text-white absolute right-0 top-0 float-right rounded-md border-0 bg-transparent text-gray-500 focus:ring-transparent sm:text-sm"
                            value={misc.budget[1]}
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
                <label htmlFor="monthlyBudget" className="text-md block font-medium leading-none text-gray-700 mt-8 mb-2 dark:text-black">
                        Monthly Income/Allowance
                </label>
                <div className="grid grid-cols-10">
                <div className="col-span-9 w-[95%] h-10 relative text-sm font-medium leading-6 text-gray-900 ">
                        <NumberInput
                            ref={MonthlyIncome}
                            icon={CurrencyDollarIcon}
                            placeholder="Amount..."
                            enableStepper={false}
                            value={misc.budget[1]}
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
                                    <div className="w-fit mb-3 right-0 bottom-0 left-0 mx-auto">
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
                    <div className="h-fit w-fit mx-auto mt-5">
                        <Button className="mx-auto">Save Changes</Button>
                    </div>
                </div>
                    </div>
                </UserProfile.Page>
                <UserProfile.Page label="Subscription" url="subscription" labelIcon={<UserIcon />}>
                    <div className="w-full h-24">
                        <p className="text-black font-semibold text-2xl">Manage your Subscription</p>
                        <div className="mx-auto w-fit py-3">
                            <Button variant="primary" className="mx-auto w-fit bottom-0 right-0 left-0 top-0" onClick={async()=>{
                                fetch(`/api/stripe/createPortalSession?backurl=${router.pathname}`, {method : "POST"}).then((res) => {
                                    if (res.status === 200){
                                        res.json().then((data)=>{
                                            router.push(data.portalSession)
                                        })
                                    }
                                    else{
                                        res.json().then((data)=>{
                                            addAlert("error", "Something went wrong", 5000)
                                        })
                                    }
                                })
                            }}>Manage</Button>
                        </div>
                    </div>
                </UserProfile.Page> 
            </UserProfile>
        </motion.div>
    )
}