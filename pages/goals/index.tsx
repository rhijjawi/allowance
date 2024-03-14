import {Content, Loader} from "@/components/Common"
import { Goals } from "@/components/ui/buttons/NoUserData"
import { useAuth, useUser } from "@clerk/nextjs"
import { Card, Grid, ProgressBar, Title } from "@tremor/react"
import { useCallback, useEffect, useState } from "react"
import {GoalModal, DeletePrompt} from "@/components/forms/AddGoal"
import { getSupabase } from "@/utils/supabase"
import {FireConfetti} from "@/utils/fun"
import { currFormatter } from "@/utils/functions/valueFormatters"
import { TrashIcon } from "@heroicons/react/24/outline"
import { AnimatePresence } from "framer-motion"
import {motion} from "framer-motion"
import { useRouter } from "next/router"
type GoalType = {id :number|string, label : string, amount_total : number, amount_saved : number, currency : string}
const MotionCard = motion(Card)
export default function Page(){
    const {user, isLoaded, isSignedIn} = useUser()
    const [goals, setGoals] = useState<GoalType[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [TBD, setTBD] = useState<null|string|number>(null)
    const {getToken} = useAuth()
    const router = useRouter()
    useEffect(()=>{
        async function a(){
            const supabase = await getSupabase(await getToken({template : "supabase"}))
            const {data, error} = await supabase.from("goals").select("*")
            if (data){
                setGoals(data)
                setLoading(false)
            }
        }
        a()
    }, [])
    function openModal(){
        setIsOpen(true)
    }
    async function updateSaved(goal : GoalType, diff : number){
        const newAmount = goal.amount_saved+diff >= 0 ? goal.amount_saved+diff : 0
        if (newAmount > goal.amount_total){
            FireConfetti()
        }
        setIsLoading(true)
        const supabase = await getSupabase(await getToken({template : "supabase"}))
        let updatedGoal = {
            ...goal,
            amount_saved : newAmount
        }
        setGoals((prev : GoalType[])=>{
            return [
                ...prev.filter((goals)=>goals.id != goal.id),
                updatedGoal
            ]
        })
        const {data, error} = await supabase.from("goals").update(updatedGoal).eq("id", updatedGoal.id)
        await sleep(500)
        setIsLoading(false)
    }
    function sleep(time: number) {
        return new Promise((resolve) => {
            setTimeout(resolve, time);
    })};
    async function PromptdeleteGoal(id: string | number) {
        setTBD(id)
    }
    async function deleteGoal(id: string | number) {
        setIsLoading(true)
        const supabase = await getSupabase(await getToken({template : "supabase"}))
        await supabase.from("goals").delete({count : "exact"}).eq("id", id)
        setGoals((goals)=>[...goals.filter((goal)=>goal.id != id)])
    }
    function getColorRange(number: number): "slate" | "gray" | "zinc" | "neutral" | "stone" | "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald" | "teal" | "cyan" | "sky" | "blue" | "indigo" | "violet" | "purple" | "fuchsia" | "pink" | "rose" {
        const percentage = number/100;
        if (percentage >= 1) {
            return "green";
        }
        if (percentage >= 0.75) {
            return "green";
        }
        if (percentage >= 0.5) {
            return "cyan";
        }
        if (percentage >= 0.25) {
            return "blue";
        }
        if (percentage >= 0) {
            return "blue";
        }
        return "blue";
    }
    if (!isLoaded || loading) return <Loader/>
    if (isLoaded && !isSignedIn) router.push("/sign-in?redirect_url=/goals")
    return (<>
        <GoalModal user={user?.id!} setGoals={setGoals} isOpen={isOpen} setIsOpen={setIsOpen} defaultCurrency={(user?.publicMetadata as {currency : string}).currency}/>
        <DeletePrompt user={user?.id!} id={TBD} setId={setTBD} delete={deleteGoal}/>
        <Content>
            <div className="grid grid-cols-1 min-h-[90vh] h-[90vh] ">
                <Card className="h-full flex flex-col gap-y-3 overflow-y-scroll">
                    <Title className="mb-2">Saving Goals</Title>
                    {goals.length == 0 ? <Goals openModal={openModal} /> : <div className="absolute -translate-y-1 right-0 w-fit mr-6"><button className="justify-center rounded-md border border-transparent bg-green-100 px-6 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2" onClick={()=>setIsOpen(true)}>Add a goal</button></div>}
                    <AnimatePresence>
                    {goals.sort((a,b) => Number(a.id) - Number(b.id)).map((goal, index)=>{
                        return (
                            <MotionCard key={`card_${index}`} className="p-2 h-48 flex flex-row dark:border-white border-2">
                                <img src="https://picsum.photos/1000" className="h-[100%] aspect-square rounded-md" alt="" />
                                <div className="flex-grow relative">
                                    <div className="absolute top-0 leading-6 bottom-0 mb-auto align-middle h-fit left-0">
                                        <p className="text-2xl translate-x-5">Goal</p>
                                        <p className="mx-6 text-4xl top-0">{goal.label}</p>
                                    </div>
                                    <div className="bottom-2 right-0 left-0 mx-auto absolute w-[90%]">
                                        <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content flex items-center justify-between">
                                            <span>{currFormatter(goal.amount_saved, goal.currency)} &bull; {Math.round(goal.amount_saved/goal.amount_total*100)}%</span>
                                            <span>{currFormatter(goal.amount_total, goal.currency)}</span>
                                        </p>
                                        <ProgressBar value={goal.amount_saved/goal.amount_total*100} color={getColorRange(Math.round(goal.amount_saved/goal.amount_total*100))} className="mt-3" />
                                    </div>
                                    <div className="absolute flex flex-col right-0 top-0 w-fit">
                                        <div className="w-full flex gap-x-2 h-10">
                                            <button className="justify-center rounded-md border border-transparent bg-red-100 px-6 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-wait " disabled={isLoading} onClick={()=>{updateSaved(goal,-100)}}><span className="">{currFormatter(- 100, goal.currency)}</span></button>
                                            <button className="justify-center rounded-md border border-transparent bg-red-100 px-6 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-wait" disabled={isLoading} onClick={()=>{updateSaved(goal,-10)}}><span className="">{currFormatter(- 10, goal.currency)}</span></button>
                                            <button className="justify-center rounded-md border border-transparent bg-red-100 px-6 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-wait" disabled={isLoading} onClick={()=>{updateSaved(goal,-1)}}><span className="">{currFormatter(- 1, goal.currency)}</span></button>
                                            <button className="justify-center rounded-md border border-transparent bg-green-100 px-6 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-wait" disabled={isLoading} onClick={()=>{updateSaved(goal,1)}}>+<span className="">{currFormatter(1, goal.currency)}</span></button>
                                            <button className="justify-center rounded-md border border-transparent bg-green-100 px-6 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-wait" disabled={isLoading} onClick={()=>{updateSaved(goal,10)}}>+<span className="">{currFormatter(10, goal.currency)}</span></button>
                                            <button className="justify-center rounded-md border border-transparent bg-green-100 px-6 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-wait" disabled={isLoading} onClick={()=>{updateSaved(goal,100)}}>+<span className="">{currFormatter(100, goal.currency)}</span></button>
                                        </div>
                                        <div className="my-2"/>
                                        <button className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-6 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">Set new value</button>
                                    </div>
                                    <TrashIcon className="h-8 border rounded-md cursor-pointer hover:bg-slate-100/80 text-black p-1 absolute right-0 bottom-0 mb-1 mr-3" onClick={()=>{PromptdeleteGoal(goal.id)}}/>
                                </div>
                            </MotionCard>
                        )})}
                    </AnimatePresence>
                </Card>
            </div>
        </Content>
    </>)
}

