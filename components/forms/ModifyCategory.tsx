import { Dialog, Transition } from "@headlessui/react";
import { ExpenseType, useExpenses } from "@/components/contexts/expenseCTX";
import { Text, Callout} from "@tremor/react";
import { ExclamationCircleIcon, XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import { currFormatter } from "@/utils/functions/valueFormatters";
import { CategorySchema } from "@/types/supabase";
import { useEffect, useState, Fragment } from "react";
export default function ModifyCategory({handlerMode, setHandlerMode, resolvedExpense, setResolvedExpense, _function} : {handlerMode: any[], setHandlerMode: any, resolvedExpense: ExpenseType[], setResolvedExpense: any, _function: Function}){
    const {expenseData, categoryData, loading} = useExpenses()
    const [category, setCategory] = useState<any>([0,0])
    useEffect(()=>{
        if (category[0] == 0 && category[1] == 0){return}
        setResolvedExpense((prev : ExpenseType[])=>
            resolvedExpense.map((expense : ExpenseType)=>{
                expense.category = category;
                return expense
            })
        );
    }, [category])
    return (
        <>    
          <Transition appear show={true} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={()=>setHandlerMode([null, []])}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
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
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full max-w-md transform  rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Change the category of this transaction
                      </Dialog.Title>
                      <div className="mt-2"> 
                       <>
                        <p className="text-sm mb-2 text-gray-500">
                        Change categories using the picker below
                        </p>
                        <select onChange={(e : any)=>{setCategory(JSON.parse(e.target.value))}
                            } value={String(JSON.stringify(category))} className='max-w-sm h-fit px-2 outline-none text-left whitespace-nowrap truncate focus:ring-2 transition duration-100 rounded-tremor-default flex flex-nowrap shadow-tremor-input focus:border-tremor-brand-subtle dark:shadow-dark-tremor-input dark:focus:border-dark-tremor-brand-subtle pl-3 pr-8 py-2 border bg-tremor-background dark:bg-dark-tremor-background hover:bg-tremor-background-muted dark:hover:bg-dark-tremor-background-muted text-tremor-content dark:text-dark-tremor-content border-tremor-border dark:border-dark-tremor-border'>
                            {categoryData.map((a : CategorySchema, indexa : number)=>{ 
                                return (<optgroup label={a.category} key={indexa}>{a.subcategories.map((b : any, indexb : number)=>{return (<option key={indexb} value={JSON.stringify([indexa, indexb]) as string}>{b}</option>)})}
                            </optgroup>)})}
                        </select>
                        <div className="grid grid-cols-1 grid-rows-3 my-2">
                            {resolvedExpense.length == 1 ? 
                            <>
                                <p className="text-sm mb-2 text-gray-500 ">Label: {resolvedExpense[0].label}</p>
                                <p className="text-sm mb-2 text-gray-500 ">Amount: {currFormatter(resolvedExpense[0].amount, resolvedExpense[0].currency)}</p>
                                <p className="text-sm mb-2 text-gray-500 ">Date: {(new Date(resolvedExpense[0].transaction_date)).toLocaleDateString()}</p>
                            </> 
                            : <>
                                <p className="text-sm mb-2 text-gray-500 ">{resolvedExpense.length} transactions</p>
                            </>}
                        </div>
                       </>
                      </div>
    
                      <div className="float-left my-1">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                          onClick={()=>setHandlerMode([null, []])}
                        >
                          Cancel
                        </button>
                      </div>
                      <div className="float-right">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                          onClick={async()=>{await _function()}}
                        >
                          Confirm
                        </button>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        </>
      )
}