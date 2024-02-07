import { Dialog } from "@headlessui/react";
import { ExpenseType, useExpenses } from "@/components/contexts/expenseCTX";
import { Text, Callout} from "@tremor/react";
import { ExclamationCircleIcon, XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import { currFormatter } from "@/utils/functions/valueFormatters";
import { CategorySchema } from "@/types/supabase";
import { useEffect, useState } from "react";
export default function ModifyCategory({handlerMode, setHandlerMode, resolvedExpense, setResolvedExpense, _function} : {handlerMode: any[], setHandlerMode: any, resolvedExpense: ExpenseType, setResolvedExpense: any, _function: Function}){
    const {expenseData, categoryData, loading} = useExpenses()
    const [category, setCategory] = useState<any>([0,0])
    useEffect(()=>{
        if (category[0] == 0 && category[1] == 0){return}
        setResolvedExpense({...resolvedExpense, category: category});
    }, [category])
    return (
        <Dialog open={(handlerMode[0] == "modifyCategory")} onClose={() => {setHandlerMode([null, null])}} className="">
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/70"/>
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4 z-20">
                <Dialog.Panel className="max-w-md w-max z-30 rounded-md h-fit bg-white border-slate-400 border-2 py-3 px-2">
                    <Dialog.Title className="text-black text-2xl font-semibold">
                        Change the category of this transaction
                    </Dialog.Title>
                    <div className="w-full h-0.5 bg-gray-600 my-2"></div>
                    <Dialog.Description className="text-black">
                       {resolvedExpense && 
                       <>
                        <Text>Change categories using the picker below</Text><br/>
                        <select onChange={(e : any)=>{setCategory(JSON.parse(e.target.value))}
                            } value={String(JSON.stringify(category))} className='max-w-sm h-fit px-2 outline-none text-left whitespace-nowrap truncate focus:ring-2 transition duration-100 rounded-tremor-default flex flex-nowrap shadow-tremor-input focus:border-tremor-brand-subtle dark:shadow-dark-tremor-input dark:focus:border-dark-tremor-brand-subtle pl-3 pr-8 py-2 border bg-tremor-background dark:bg-dark-tremor-background hover:bg-tremor-background-muted dark:hover:bg-dark-tremor-background-muted text-tremor-content dark:text-dark-tremor-content border-tremor-border dark:border-dark-tremor-border'>
                            {categoryData.map((a : CategorySchema, indexa : number)=>{ 
                                return (<optgroup label={a.category} key={indexa}>{a.subcategories.map((b : any, indexb : number)=>{return (<option key={indexb} value={JSON.stringify([indexa, indexb]) as string}>{b}</option>)})}
                            </optgroup>)})}
                        </select>
                        <Text>{resolvedExpense.label}</Text><br/>
                        {/* Category picker, import from category useExpenses */}

                       </>
                       }
                    </Dialog.Description>
                    <div className="relative h-10 w-full my-3">
                       <button onClick={()=>{return setHandlerMode([null, null])}} className="absolute h-full w-16 rounded-md bg-red-600/80 mx-auto my-auto left-0 top-0 bottom-0"><XMarkIcon className="h-6 w-6 mx-auto my-auto top-0 right-0 left-0 bottom-0 absolute stroke-[3]"/></button>
                       <button onClick={async()=>{await _function()}} className="absolute h-full w-16 rounded-md bg-green-600/80 mx-auto my-auto right-0 top-0 bottom-0"><CheckIcon className="h-6 w-6 mx-auto my-auto top-0 right-0 left-0 bottom-0 absolute stroke-[3]"/></button>
                    </div>
                    </Dialog.Panel>
                    </div>
            </Dialog>
    )
}