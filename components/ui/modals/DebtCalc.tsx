import { Dialog, Transition } from '@headlessui/react'
import { CalculatorIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'
import {
    DatePicker,
    NumberInput,
    Select,
    TextInput,
    Text,
    SelectItem,
} from '@tremor/react'
import { motion } from 'framer-motion'
import { Fragment, useState } from 'react'
import symbols from '@/components/static/symbols.json'
import { getSupabase } from '@/utils/supabase'
import { Database } from '@/types/supabase'
import { clerkClient, useUser } from '@clerk/nextjs'
import { currFormatter } from '@/utils/functions/valueFormatters'
const label = 'block text-sm font-medium leading-6 text-gray-900'
export function AddDebtModal(props: {
    isOpen: boolean
    setIsOpen: React.Dispatch<boolean>
    getToken: (options: any) => Promise<string | null>
}) {
    const { user } = useUser()
    const [debtLabel, setDebtLabel] = useState<undefined | string>(undefined)
    const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
    const [category, setCategory] = useState<undefined | string>(undefined)
    const [initAmount, setInitAmount] = useState<undefined | number>(undefined)
    const [currency, setCurrency] = useState<string | undefined>(undefined)
    const [interestRate, setInterestRate] = useState<number | undefined>(
        undefined
    )
    const [term, setTerm] = useState([undefined, undefined])
    const [isloading, setLoading] = useState<boolean>(false)
    const [hasTried, SetHasTried] = useState(true)
    return (
        <>
            <Transition appear show={props.isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    onClose={() => {
                        props.setIsOpen(false)
                    }}
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
                                <Dialog.Panel className="w-full max-w-lg transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Add a Debt Record
                                    </Dialog.Title>
                                    <div className="p-6 space-y-6">
                                        <div className="text-base leading-relaxed text-gray-500 ">
                                            <div>
                                                <label
                                                    htmlFor="expLabel"
                                                    className={label}
                                                >
                                                    Debt Label
                                                </label>
                                                <div className="mt-2">
                                                    <TextInput
                                                        type="text"
                                                        error={Boolean(
                                                            debtLabel &&
                                                                debtLabel.length ==
                                                                    0
                                                        )}
                                                        required
                                                        placeholder={
                                                            'Credit Card'
                                                        }
                                                        value={debtLabel}
                                                        onChange={(e) => {
                                                            setDebtLabel(
                                                                e.target.value
                                                            )
                                                        }}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 grid-rows-1">
                                                    <div className="mt-2">
                                                        <label
                                                            htmlFor="expLabel"
                                                            className="row-span-1 col-span-1 text-sm font-medium leading-6 text-gray-900 pt-3 "
                                                        >
                                                            Due Date
                                                        </label>
                                                        <DatePicker
                                                            key={'datepicker'}
                                                            weekStartsOn={1}
                                                            value={dueDate}
                                                            onValueChange={(
                                                                e
                                                            ) => {
                                                                setDueDate(e)
                                                            }}
                                                            className="max-w-sm rounded-lg row-span-1 col-span-1 col-start-1 w-fit"
                                                        />
                                                    </div>
                                                    <div className="mt-3">
                                                        <label
                                                            htmlFor="expLabel"
                                                            className=" float-right text-right text-sm font-medium leading-6 text-gray-900 "
                                                        >
                                                            Late Fee
                                                        </label>
                                                        <NumberInput
                                                            pattern="[0-9]^"
                                                            placeholder={`Default: ${currFormatter(0, currency)}`}
                                                            enableStepper={
                                                                false
                                                            }
                                                            className="flex-row-reverse"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 grid-rows-1">
                                                    <div className="mt-3">
                                                        <label
                                                            htmlFor="price"
                                                            className={label}
                                                        >
                                                            Initial Amount
                                                        </label>
                                                        <div className="block relative text-sm font-medium leading-6 text-gray-900">
                                                            <NumberInput
                                                                icon={
                                                                    CurrencyDollarIcon
                                                                }
                                                                max={100}
                                                                min={0}
                                                                className="flex-row-reverse pr-2 w-8"
                                                                placeholder="Loaned Amount"
                                                                enableStepper={
                                                                    false
                                                                }
                                                                step={0.01}
                                                                value={
                                                                    initAmount
                                                                }
                                                                error={Boolean(
                                                                    initAmount &&
                                                                        initAmount <
                                                                            0
                                                                )}
                                                                required
                                                                onValueChange={(
                                                                    e
                                                                ) => {
                                                                    if (
                                                                        e > 100
                                                                    ) {
                                                                        return
                                                                    }
                                                                    setInitAmount(
                                                                        e
                                                                    )
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="mt-3">
                                                        <label
                                                            htmlFor="price"
                                                            className="block text-sm font-medium leading-6 text-right text-gray-900"
                                                        >
                                                            Interest Rate (Per
                                                            Annum)
                                                        </label>
                                                        <div className="block float-right relative text-sm font-medium leading-6 text-gray-900">
                                                            <NumberInput
                                                                icon={() => {
                                                                    return (
                                                                        <div className="mr-6 w-fit">
                                                                            %
                                                                        </div>
                                                                    )
                                                                }}
                                                                max={100}
                                                                min={0}
                                                                className="w-fit float-right flex-row-reverse"
                                                                placeholder="12"
                                                                enableStepper={
                                                                    false
                                                                }
                                                                step={0.01}
                                                                value={
                                                                    interestRate
                                                                }
                                                                error={Boolean(
                                                                    initAmount &&
                                                                        initAmount <
                                                                            0
                                                                )}
                                                                required
                                                                onValueChange={(
                                                                    e
                                                                ) => {
                                                                    if (
                                                                        e > 100
                                                                    ) {
                                                                        return
                                                                    }
                                                                    setInterestRate(
                                                                        e
                                                                    )
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 col-start-1">
                                                        <label
                                                            className={label}
                                                        >
                                                            Term (Months)
                                                        </label>
                                                        <NumberInput
                                                            placeholder="Enter number of months"
                                                            enableStepper={
                                                                false
                                                            }
                                                            className="flex-row-reverse"
                                                        />
                                                    </div>
                                                    <div className="mt-3 col-start-2">
                                                        <label
                                                            className={
                                                                label +
                                                                ' float-right'
                                                            }
                                                        >
                                                            Currency
                                                        </label>
                                                        <Select
                                                            enableClear={false}
                                                            value={currency}
                                                            onValueChange={(
                                                                e
                                                            ) => {
                                                                setCurrency(e)
                                                            }}
                                                            className="w-fit float-right"
                                                        >
                                                            {Object.keys(
                                                                symbols
                                                            ).map(
                                                                (
                                                                    currency: string,
                                                                    index: number
                                                                ) => (
                                                                    <SelectItem
                                                                        className="text-center z-60 mx-auto"
                                                                        value={
                                                                            currency
                                                                        }
                                                                    >
                                                                        {
                                                                            currency
                                                                        }
                                                                    </SelectItem>
                                                                )
                                                            )}
                                                        </Select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative h-12 w-full px-6">
                                        <button
                                            id={'submit'}
                                            data-modal-hide="defaultModal"
                                            type="button"
                                            className={`inline-flex float-right justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2`}
                                            onClick={async () => {
                                                SetHasTried(true)
                                                const supabase =
                                                    await getSupabase(
                                                        await props.getToken({
                                                            template:
                                                                'supabase',
                                                        })!
                                                    )
                                                await supabase
                                                    .from('debts')
                                                    .insert({
                                                        //@ts-ignore
                                                        debt_name: debtLabel,
                                                        due_date:
                                                            dueDate?.toISOString(),
                                                        generic_icon: 'ccard',
                                                        initial_amt: initAmount,
                                                        initial_curr: currency,
                                                        term: term,
                                                        interest_rate: 0.5,
                                                        user_id: user?.id,
                                                        past_pmts: [],
                                                        status: null,
                                                        minimum_mtly: 0,
                                                    })
                                            }}
                                        >
                                            {isloading ? (
                                                <svg
                                                    aria-hidden="true"
                                                    role="status"
                                                    className="w-4 h-4 mr-3  text-white animate-spin dark:text-white"
                                                    viewBox="0 0 100 101"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                        fill="currentColor"
                                                    />
                                                    <path
                                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                        fill="#1C64F2"
                                                    />
                                                </svg>
                                            ) : null}
                                            Add Debt
                                        </button>
                                        <button
                                            id={'cancel'}
                                            data-modal-hide="defaultModal"
                                            type="button"
                                            className={`inline-flex float-left justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2`}
                                            onClick={async () => {
                                                props.setIsOpen(false)
                                            }}
                                        >
                                            Cancel
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
