import { useAuth, useUser } from '@clerk/nextjs'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, createContext, useContext, useEffect, useState } from 'react'
import { ExpenseType, useExpenses } from './expenseCTX'
import { Card, Metric, Subtitle, Text, Title, Callout } from '@tremor/react'
import { ExclamationCircleIcon } from '@heroicons/react/24/solid'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { getSupabase } from '@/utils/supabase'
import ModifyCategory from '@/components/forms/ModifyCategory'
import { useAlerts } from './alertHandler'
import { currFormatter } from '@/utils/functions/valueFormatters'
const TransactionHandlerCTX = createContext<any>([])
export function TransactionHandlerProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, isSignedIn, isLoaded } = useUser()
    const { addAlert } = useAlerts()
    const { getToken } = useAuth()
    const [handlerMode, setHandlerMode] = useState<
        [null | 'delete' | 'edit' | 'modifyCategory' | 'add', number[]]
    >([null, []])
    const [resolvedExpense, setResolvedExpense] = useState<ExpenseType[]>([])
    const [loading, setIsLoading] = useState<true | false | null>(null)
    const { expenseData, setExpenseData } = useExpenses()

    const functions: { [key: string]: () => Promise<any> } = {
        delete: async (): Promise<undefined> => {
            setIsLoading(true)
            await (await getSupabase(await getToken({ template: 'supabase' })))
                .from('expenses')
                .delete()
                .in('id', handlerMode[1])
            setExpenseData(
                expenseData.filter(
                    (e: ExpenseType) => handlerMode[1].indexOf(e.id!) == -1
                )
            )
            if (handlerMode[1].length > 1)
                addAlert(
                    'success',
                    `Successfully deleted ${handlerMode[1].length} transactions`
                )
            else addAlert('success', `Successfully deleted the transaction`)
            setIsLoading(false)
            setHandlerMode([null, []])
        },
        edit: async (): Promise<undefined> => {},
        add: async (): Promise<undefined> => {},
        modifyCategory: async (): Promise<
            undefined | { data: null; error: any }
        > => {
            if (resolvedExpense.length == 0) {
                return
            }
            const { data, error } = await (
                await getSupabase(await getToken({ template: 'supabase' }))
            )
                .from('expenses')
                .update({ category: resolvedExpense[0].category })
                .in('id', handlerMode[1])
            if (!error) {
                addAlert('success', 'Category updated successfully.')
                setHandlerMode([null, []])
                setExpenseData(
                    expenseData.map((e: ExpenseType) => {
                        if (handlerMode[1].indexOf(e.id!) != -1) {
                            return {
                                ...e,
                                category: resolvedExpense[0].category,
                            }
                        }
                        return e
                    })
                )
                return { data: data, error: error }
            } else {
                await addAlert(
                    'warning',
                    'There was an error updating the category. Please try again later.'
                )
            }
        },
    }
    useEffect(() => {
        setResolvedExpense(
            expenseData.filter(
                (e: ExpenseType) => handlerMode[1].indexOf(e.id!) !== -1
            )
        )
    }, [handlerMode])
    return (
        <TransactionHandlerCTX.Provider value={{ handlerMode, setHandlerMode }}>
            {handlerMode[0] == 'modifyCategory' ? (
                <ModifyCategory
                    handlerMode={handlerMode}
                    resolvedExpense={resolvedExpense}
                    setHandlerMode={setHandlerMode}
                    setResolvedExpense={setResolvedExpense}
                    _function={functions['modifyCategory']}
                />
            ) : null}
            <>
                <Transition
                    appear
                    show={handlerMode[0] == 'delete'}
                    as={Fragment}
                >
                    <Dialog
                        as="div"
                        className="relative z-10"
                        onClose={() => setHandlerMode([null, []])}
                    >
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
                                            Delete{' '}
                                            {resolvedExpense.length > 1
                                                ? 'these transactions'
                                                : 'this transaction'}
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <>
                                                <p className="text-sm mb-2 text-gray-500">
                                                    Confirm that you'd like to
                                                    delete{' '}
                                                    {resolvedExpense.length > 1
                                                        ? `${resolvedExpense.length} transactions`
                                                        : 'this transaction'}{' '}
                                                    using the buttons below.
                                                </p>
                                                {/* <select onChange={(e : any)=>{setCategory(JSON.parse(e.target.value))}
                            } value={String(JSON.stringify(category))} className='max-w-sm h-fit px-2 outline-none text-left whitespace-nowrap truncate focus:ring-2 transition duration-100 rounded-tremor-default flex flex-nowrap shadow-tremor-input focus:border-tremor-brand-subtle dark:shadow-dark-tremor-input dark:focus:border-dark-tremor-brand-subtle pl-3 pr-8 py-2 border bg-tremor-background dark:bg-dark-tremor-background hover:bg-tremor-background-muted dark:hover:bg-dark-tremor-background-muted text-tremor-content dark:text-dark-tremor-content border-tremor-border dark:border-dark-tremor-border'>
                            {categoryData.map((a : CategorySchema, indexa : number)=>{ 
                                return (<optgroup label={a.category} key={indexa}>{a.subcategories.map((b : any, indexb : number)=>{return (<option key={indexb} value={JSON.stringify([indexa, indexb]) as string}>{b}</option>)})}
                            </optgroup>)})}
                        </select> */}
                                                <div className="grid grid-cols-1 grid-rows-3 my-2">
                                                    {resolvedExpense.length ==
                                                    1 ? (
                                                        <>
                                                            <p className="text-sm mb-2 text-gray-500 ">
                                                                Label:{' '}
                                                                {
                                                                    resolvedExpense[0]
                                                                        .label
                                                                }
                                                            </p>
                                                            <p className="text-sm mb-2 text-gray-500 ">
                                                                Amount:{' '}
                                                                {currFormatter(
                                                                    resolvedExpense[0]
                                                                        .amount,
                                                                    resolvedExpense[0]
                                                                        .currency
                                                                )}
                                                            </p>
                                                            <p className="text-sm mb-2 text-gray-500 ">
                                                                Date:{' '}
                                                                {new Date(
                                                                    resolvedExpense[0].transaction_date
                                                                ).toLocaleDateString()}
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className="text-sm mb-2 text-gray-500 ">
                                                                {
                                                                    resolvedExpense.length
                                                                }{' '}
                                                                transactions
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            </>
                                        </div>
                                        <div className="float-left">
                                            <button
                                                type="button"
                                                className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                                                onClick={() =>
                                                    setHandlerMode([null, []])
                                                }
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                        <div className="float-right">
                                            <button
                                                type="button"
                                                disabled={loading == true}
                                                className="inline-flex disabled:bg-green-100/60 disabled:cursor-wait justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                                                onClick={async () => {
                                                    await functions['delete']()
                                                }}
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
            {children}
        </TransactionHandlerCTX.Provider>
    )
}
export function useTransactionHandler() {
    const ctx = useContext(TransactionHandlerCTX)
    if (ctx === undefined)
        throw new Error(
            'TransactionHandlerCTX must be used within a TransactionHandlerProvider'
        )
    return ctx
}
