import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Color, BadgeDelta, Card, Flex, LineChart, Metric, NumberInput, Switch, TextInput,  } from "@tremor/react";
import { AddDebtModal } from "@/components/ui/modals/DebtCalc";
import * as calc from "@/functions/debt/calc"
import { currFormatter } from "@/utils/functions/valueFormatters";
import { useUser } from "@clerk/nextjs";
export default function Calculator(){
    const {user, isLoaded, isSignedIn} = useUser()
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [avData, setav] = useState<calc.Debt[]>([])
    const [snowData, setSnow] = useState<calc.Debt[]>([])
    const [avalanche, setAvalanche] = useState<{monthlyBalances : {}[], totalInterestPaid: number}>({monthlyBalances : [], totalInterestPaid: 0})
    const [snowball, setSnowball] = useState<{monthlyBalances : {}[], totalInterestPaid: number}>({monthlyBalances : [], totalInterestPaid: 0})
    const [name, setName] = useState<string|null>(null)
    const [bal, setBal] = useState<number|null>(null)
    const [int, setInt] = useState<number|null>(null)
    useEffect(()=>{
        const {monthlyBalances, totalInterestPaid} = calc.simulateRepayments(avData, 3000, 'avalanche');
        setAvalanche({monthlyBalances, totalInterestPaid})
    }, [avData])
    useEffect(()=>{
        const {monthlyBalances, totalInterestPaid} = calc.simulateRepayments(snowData, 3000, 'snowball');
        setSnowball({monthlyBalances, totalInterestPaid})
    }, [snowData])
    if (snowball.monthlyBalances.length == 0 || avalanche.monthlyBalances.length == 0) return <></>
    return (
        <main className="bg-dark-tremor-background-muted/75 -z-[100] flex min-h-screen flex-col items-center justify-between px-6 py-12 md:px-24">
            <Card className="relative h-fit">
                <div className="w-full h-fit gap-y-6 mb-6 grid grid-cols-3">
                    {snowData.map((debt : calc.Debt, index: number)=>(
                        <>
                            <Card className="max-w-sm dark:ring-amber-300">
                                <p className="text-3xl mb-2 leading-6">{debt.name}</p>
                                <p className="text-base">{currFormatter(debt.original.balance, ((user && isSignedIn) ? user?.publicMetadata?.currency as string : "EUR")! )}</p>
                                <p className="text-base">{debt.interestRate}% APY</p>
                            </Card>
                        </>
                    ))}
                </div>
                <Card className="max-w-sm h-fit mb-12">
                    <TextInput className="mb-4" placeholder="Debt Label" value={name ? name : ""} onValueChange={(e)=>{setName(e)}} />
                    <div className="grid grid-rows-2 grid-cols-1 gap-y-5">
                        <NumberInput placeholder="Debt Balance" min={0} error={int == null || int > 9999999 || int < 0} max={999999999999} value={bal ? bal : undefined} onValueChange={(e)=>{setBal(e)}} />
                        <NumberInput placeholder="Debt Interest APY (%)" min={0} error={int == null || int > 99 || int < 0} max={99} step={"1"} value={int ? int : undefined} onValueChange={(e)=>{setInt(e)}} />
                    </div>
                    <div className="w-full mt-5">
                        <button disabled={name == null || bal == 0 || (int == null || int == 0 || int > 100)} onClick={()=>{
                            if (name == null || bal == 0 || int == 0 || int == null) return;
                            setav((prev)=>{return prev.concat(new calc.Debt(name, bal!, int))})
                            setSnow((prev)=>{return prev.concat(new calc.Debt(name, bal!, int))})
                            setName(null)
                            setBal(null)
                            setInt(null)
                            }} className="inline-flex disabled:cursor-not-allowed items-end justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 dark:text-white dark:bg-black/20 ring-1 ring-green-400 hover:bg-green-200 dark:hover:bg-black/0 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2">Add</button>
                    </div>
                </Card>
                <Card className="max-w-sm">
                    <Flex justifyContent="between" alignItems="center">
                    <p>Interest Paid</p>
                    </Flex>
                    <Metric>{currFormatter(avalanche.totalInterestPaid, (user && isSignedIn) ? user.publicMetadata.currency as string : "EUR" )}</Metric>
                </Card>
                <div className="w-full h-1"></div>
                <AreaChart 
                showAnimation
                className="my-12"
                title="Avalanche Balances"
                curveType="step"
                index={'month'}
                data={avalanche.monthlyBalances}
                categories={Object.keys(avalanche.monthlyBalances[0]).filter(val => val!='month')}
                stack={false}
                valueFormatter={(val : number)=>`Balance: ${currFormatter(val)}`}
                />
                <Card className="max-w-sm">
                    <Flex justifyContent="between" alignItems="center">
                    <p>Interest Paid</p>
                    </Flex>
                    <Metric>{currFormatter(snowball.totalInterestPaid, (user && isSignedIn) ? user.publicMetadata.currency as string : "EUR"  )}</Metric>
                </Card>
                <AreaChart 
                showAnimation
                className="my-12"
                curveType="step"
                title="Snowball Balances"
                index={'month'}
                data={snowball.monthlyBalances}
                categories={Object.keys(snowball.monthlyBalances[0]).filter(val => val!='month')}
                stack={false}
                valueFormatter={(val : number)=>`Balance: ${currFormatter(val)}`}
                />
            </Card>
        </main>
    )
}