import React, { Fragment, createContext, use, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

import { useExpenses, ExpenseType } from "@/components/contexts/expenseCTX";
import { Dialog, Transition } from "@headlessui/react";
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
        <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={()=>{setOpen(false)}}>
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/25" />
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
                leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-lg transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                    >
                        Upload a file
                        </Dialog.Title>
                        <div className='p-6 space-y-6'>
                        <div className='text-base leading-relaxed text-gray-500 '>    
                            <div>
                        {resolvedExpense && (
                            <DragAndDrop setOpen={setOpen} exp={resolvedExpense} id={resolvedExpense.id!} user={user?.id}/>
                        )}
                    </div>
                    </div>
                    </div>
                    </Dialog.Panel>
                </Transition.Child>
                </div>
                </div>
            </Dialog>
            </Transition>
            {children}
        </FileManagerCTX.Provider>
    )
}
export function useFileUpload(){
    const ctx = useContext(FileManagerCTX)
    if (ctx === undefined) throw new Error("useExpenseCTX must be used within a ExpenseCTXProvider")
    return ctx
}