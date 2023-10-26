import { useUser } from "@auth0/nextjs-auth0/client";
import { Dialog } from "@headlessui/react";
import { createContext, useContext, useEffect, useState } from "react";
import { ExpenseType, useExpenses } from "./expenseCTX";
import { Card, Metric, Subtitle, Text, Title, Callout} from "@tremor/react";
import { ExclamationCircleIcon} from "@heroicons/react/24/solid";
import {CheckIcon, XMarkIcon} from "@heroicons/react/24/outline";
import { getSupabase } from "@/utils/supabase";
import { useRouter } from "next/router";
const TransactionHandlerCTX = createContext<any>([])

export function TransactionHandlerProvider({children} : {children: React.ReactNode}){
    const { user, error, isLoading } = useUser();
    const [handlerMode, setHandlerMode] = useState<any[]>([null, null])
    const [resolvedExpense, setResolvedExpense] = useState<ExpenseType|null>(null)
    let { expenseData  } = useExpenses()
    const router = useRouter()
    const functions = {
        'delete' : async() => {
            await (await getSupabase(user!.accessToken)).from('expenses').delete().eq('id', handlerMode[1])
            setHandlerMode([null, null])
            return router.reload()
        },
        'edit' : async() => {

        }, 
        'add' : async() => {
            
        }
    }
    useEffect(() => {
        expenseData.forEach((e : ExpenseType) => {
            console.log(e?.id, handlerMode[1])
            if (e.id == Number(handlerMode[1])){
                setResolvedExpense(e)
            }
        })
    }, [handlerMode])
    return (
        <TransactionHandlerCTX.Provider value={{handlerMode, setHandlerMode}}>
            <Dialog open={!(handlerMode[0] == null)} onClose={() => {setHandlerMode([null, null])}
                } className="">
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/70">
                    <Dialog.Panel className="max-w-sm rounded-md h-fit w-72 aspect-square bg-white border-2 border-black py-3 px-2">
                    <Dialog.Title className="text-black text-2xl font-semibold">
                        {/* Capitalize first letter */}
                        {
                            !(handlerMode[0] == null) ? handlerMode[0].charAt(0).toUpperCase() + handlerMode[0].substr(1) : ""
                        } a transaction
                    </Dialog.Title>
                    <div className="w-full h-0.5 bg-gray-600 my-2"></div>
                    <Dialog.Description className="text-black">
                       {resolvedExpense && 
                       <>
                        <Text>Are you sure you'd like to delete the following transaction?</Text><br/>
                        <Text>{resolvedExpense.label}</Text><br/>
                        <Text>{new Intl.NumberFormat(navigator.languages[0], {
                                style: 'currency',
                                currency: resolvedExpense.currency,
                            }).format(resolvedExpense.amount)}</Text>
                            <Callout className="h-12 mt-4" title={handlerMode[0] == "delete" ? "This action cannot be undone." : ""} icon={ExclamationCircleIcon} color="rose">
                            {handlerMode[0] == "delete" ? "This action cannot be undone." : ""}
                            </Callout>
                       </>
                       }
                    </Dialog.Description>
                    <div className="relative h-10 w-full my-3">
                       <button onClick={()=>{return setHandlerMode([null, null])}} className="absolute h-full w-16 rounded-md bg-red-600/80 mx-auto my-auto left-0 top-0 bottom-0"><XMarkIcon className="h-6 w-6 mx-auto my-auto top-0 right-0 left-0 bottom-0 absolute stroke-[3]"/></button>
                       {/* @ts-ignore */}
                       <button onClick={()=>{functions[handlerMode[0]]()}} className="absolute h-full w-16 rounded-md bg-green-600/80 mx-auto my-auto right-0 top-0 bottom-0"><CheckIcon className="h-6 w-6 mx-auto my-auto top-0 right-0 left-0 bottom-0 absolute stroke-[3]"/></button>
                    </div>
                    </Dialog.Panel>
                </div>
                </Dialog>
            {children}
        </TransactionHandlerCTX.Provider>
    )
}
export function useTransactionHandler(){
    const ctx = useContext(TransactionHandlerCTX)
    if (ctx === undefined) throw new Error("useExpenseCTX must be used within a ExpenseCTXProvider")
    return ctx
}