import { useAuth, useUser } from "@clerk/nextjs";
import { Dialog } from "@headlessui/react";
import { createContext, useContext, useEffect, useState } from "react";
import { ExpenseType, useExpenses } from "./expenseCTX";
import { Card, Metric, Subtitle, Text, Title, Callout} from "@tremor/react";
import { ExclamationCircleIcon} from "@heroicons/react/24/solid";
import {CheckIcon, XMarkIcon} from "@heroicons/react/24/outline";
import { getSupabase } from "@/utils/supabase";
import ModifyCategory from "@/components/forms/ModifyCategory";
import { useAlerts } from "./alertHandler";
const TransactionHandlerCTX = createContext<any>([])
export function TransactionHandlerProvider({children} : {children: React.ReactNode}){
    const { user, isSignedIn, isLoaded } = useUser()
    const { addAlert } = useAlerts()
    const {getToken} = useAuth()
    const [handlerMode, setHandlerMode] = useState<any[]>([null, null])
    const [resolvedExpense, setResolvedExpense] = useState<ExpenseType|null>(null)

    const { expenseData, setExpenseData } = useExpenses()

    const functions : { [key: string]: () => Promise<any> } = {
        'delete' : async() : Promise<undefined> => {
            await (await getSupabase(await getToken({template: "supabase"}))).from('expenses').delete().eq('id', handlerMode[1])
            setExpenseData(expenseData.filter((e : ExpenseType) => {return e.id != Number(handlerMode[1])}))
            setHandlerMode([null, null]);
            return;
        },
        'edit' : async() : Promise<undefined> => {

        }, 
        'add' : async() : Promise<undefined> => {
            
        },
        'modifyCategory' : async() : Promise<undefined|{data : null, error: any}> => {
            console.log(handlerMode,resolvedExpense)
            if (!resolvedExpense){return};
            const {data, error} = await (await getSupabase(await getToken({template: "supabase"}))).from('expenses').update({category: resolvedExpense!.category}).eq('id', handlerMode[1])
            if (!error){
                addAlert("success", "Category updated successfully.")
                setHandlerMode([null, null]);
                setExpenseData(expenseData.map((e : ExpenseType) => {
                    if (e.id == Number(handlerMode[1])){
                        return {...e, category : resolvedExpense!.category}
                    }
                    else {
                        return e
                    }
                }));
                return {data : data, error : error};
            }
            else {
                await addAlert("warning", "There was an error updating the category. Please try again later.");
            }
        },
    }
    useEffect(() => {
        expenseData.forEach((e : ExpenseType) => {
            if (e.id == Number(handlerMode[1])){
                setResolvedExpense(e)
            }
            if (e.id == Number(handlerMode[1]) && handlerMode[0] == "modifyCategory"){
                setResolvedExpense(e)
            }
        })
    }, [handlerMode])
    return (
        <TransactionHandlerCTX.Provider value={{handlerMode, setHandlerMode}}>
            {handlerMode[0] == "modifyCategory" ? <ModifyCategory handlerMode={handlerMode} resolvedExpense={resolvedExpense!} setHandlerMode={setHandlerMode} setResolvedExpense={setResolvedExpense} _function={functions['modifyCategory']} />: null}
            <Dialog open={(handlerMode[0] == 'delete')} onClose={() => {setHandlerMode([null, null])}
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
                        <Text>{new Intl.NumberFormat(navigator.languages[0], {style: 'currency', currency: resolvedExpense.currency,}).format(resolvedExpense.amount)}</Text>
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
    if (ctx === undefined) throw new Error("TransactionHandlerCTX must be used within a TransactionHandlerProvider")
    return ctx
}