import React, { createContext, use, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

import { useExpenses, ExpenseType } from "@/components/contexts/expenseCTX";
import { Dialog } from "@headlessui/react";
import { DragAndDrop } from "@/components/forms/uploadFile";
import { Bold, Text } from "@tremor/react";


const FileManagerCTX = createContext<any>([])
export function FileManagerProvider({children} : {children: React.ReactNode}){
    const [loading, setLoading] = useState<boolean>(true)
    const [_error, _setError] = useState<boolean>(false)
    const { user, isSignedIn, isLoaded } = useUser()
    const [open, setOpen] = useState<boolean>(false)
    const { expenseData,  } = useExpenses()
    const [expense, setExpense] = useState<ExpenseType|null>(null)
    const [resolvedExpense, setResolvedExpense] = useState<ExpenseType|null>(null)
    useEffect(() => {
        expenseData.forEach((e : ExpenseType) => {

            if (e.id == Number(expense)){
                setResolvedExpense(e)
            }
        })
    }, [expense])
    useEffect(() => {
        if (resolvedExpense){ 
            setOpen(true)
        }
    }, [resolvedExpense])
    useEffect(() => {
        if (open){}
        else {
            setExpense(null)
            setResolvedExpense(null)
        }}, [open])
    return (
        <FileManagerCTX.Provider value={{_error, loading, setExpense}}>
            <Dialog open={open}onClose={() => {setOpen(false)}
                } className="">
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/70">
                    <Dialog.Panel className="max-w-sm rounded-md h-fit w-96 aspect-square bg-white border-2 border-black py-3 px-2">
                    <Dialog.Title className="text-black text-2xl font-semibold">
                        Upload a file
                    </Dialog.Title>
                    <div className="w-full h-0.5 bg-gray-600 my-2"></div>
                    <div className="text-black divide-y-8">
                        {resolvedExpense && (
                        <div className="flex flex-col text-lg">
                            <div className=" w-fit min-w-[40%] max-w-full">
                                <div className="text-black">Transaction Label</div>
                                <div className="text-black bg-gray-800/20 py-2 px-2 break-words border border-black rounded-md">{resolvedExpense.label}</div>
                            </div>
                            <div className=" w-fit min-w-[40%] max-w-full py-3">
                                <div className="text-black">Transaction Amount</div>
                                <div className="text-black bg-gray-800/20 py-2 px-2 break-words border border-black rounded-md">{new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: resolvedExpense.currency,
                            }).format(resolvedExpense.amount)}</div>
                            </div>
                            <div className=" w-fit min-w-[40%] max-w-full py-3">
                                <Text>This transaction took place on <Bold>{new Date(resolvedExpense.transaction_date).toLocaleDateString()}</Bold>.</Text>
                            </div>
                            <div className="min-w-full py-3">
                                <DragAndDrop id={resolvedExpense.id!} user={user?.id}/>
                            </div>
                        </div>
                        )}
                    </div>
                    </Dialog.Panel>
                </div>
                </Dialog>
            {children}
        </FileManagerCTX.Provider>
    )
}
export function useFileUpload(){
    const ctx = useContext(FileManagerCTX)
    if (ctx === undefined) throw new Error("useExpenseCTX must be used within a ExpenseCTXProvider")
    return ctx
}