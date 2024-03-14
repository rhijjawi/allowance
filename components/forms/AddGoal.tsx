import { Dialog, Transition } from '@headlessui/react'
import {
    NumberInput,
    SearchSelect,
    SearchSelectItem,
    Select,
    SelectItem,
    TextInput,
} from '@tremor/react'
import { Fragment, useState } from 'react'
import symbols from '@/components/static/symbols.json'
import { Input, Tooltip } from '@nextui-org/react'
import { ExclamationTriangleIcon, FolderIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@clerk/nextjs'
import { getSupabase } from '@/utils/supabase'
import { useAlerts } from '../contexts/alertHandler'


export function DeletePrompt(props : {id : string|number|null, setId : React.Dispatch<React.SetStateAction<string|number|null>>, user : string, delete : (id : string|number) => Promise<void>}){
    return (<Transition.Root show={!!(props.id)} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={()=>props.setId(null)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
  
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        Delete Savings Goal
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                        This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
						type="button"
						className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
						onClick={() => {
								props.delete(Number(props.id))
								props.setId(null)
						}}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => props.setId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>)
}

export function GoalModal(props: {
    user: string
    defaultCurrency?: string
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    setGoals: React.Dispatch<React.SetStateAction<any[]>>
}) {
    const [savedGoal, setSavedGoal] = useState<number | undefined>(undefined)
    const [goal, setGoal] = useState<number | undefined>(undefined)
    const [currency, setCurrency] = useState(props.defaultCurrency ?? "USD")
    const [label, setLabel] = useState<undefined | string>()
    const [loading, setIsLoading] = useState(false)
    const { getToken } = useAuth()
    const { addAlert } = useAlerts()
    return (
        <Transition appear show={props.isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-10"
                onClose={() => props.setIsOpen(false)}
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
                            <Dialog.Panel className="w-full flex flex-col gap-y-2 max-w-md transform  rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900 mb-2"
                                >
                                    Create a Saving Goal
                                </Dialog.Title>
                                <Tooltip
                                    delay={100}
                                    closeDelay={100}
                                    content="Coming soon..."
                                >
                                    <div className="w-full h-fit flex flex-col align-middle justify-center">
                                        <div className="mx-auto border relative h-24 w-24 cursor-not-allowed rounded-md  bg-white hover:bg-slate-100/20 block">
                                            <FolderIcon className="h-[50%] translate-x-[50%] translate-y-[50%] text-orange-300" />
                                        </div>
                                        <span className="w-fit mx-auto text-black/40">
                                            Upload an Icon
                                        </span>
                                    </div>
                                </Tooltip>
                                <TextInput
                                    value={label}
                                    onValueChange={(e) => {
                                        setLabel(e)
                                    }}
                                    placeholder="Label"
                                />
                                <SearchSelect
                                    value={currency}
                                    onValueChange={(e) => {
                                        setCurrency(e)
                                    }}
                                >
                                    {Object.keys(symbols).map((curr) => {
                                        //@ts-ignore
                                        return (
                                            <SearchSelectItem
                                                value={curr}
                                                //@ts-ignore
                                            >{`(${curr}) ${symbols[curr]}`}</SearchSelectItem>
                                        )
                                    })}
                                </SearchSelect>
                                <div className="mt-2">
                                    <NumberInput
                                        placeholder="Saved thus far"
                                        icon={() => (
                                            <span className="w-fit select-none ml-2 mr-1 text-xs ">
                                                {(0)
                                                    .toLocaleString(
                                                        navigator
                                                            ? navigator
                                                                  .languages[0]
                                                            : 'en-US',
                                                        {
                                                            style: 'currency',
                                                            currency,
                                                            minimumFractionDigits: 0,
                                                            maximumFractionDigits: 0,
                                                        }
                                                    )
                                                    .replace(/\d/g, '')
                                                    .trim()}
                                            </span>
                                        )}
                                        min={0}
                                        value={savedGoal}
                                        onValueChange={(e) => {
                                            setSavedGoal(e)
                                        }}
                                    />
                                    <span className="text-tiny text-foreground-400 mt-0">
                                        How much have you saved?
                                    </span>
                                </div>
                                <div className="mt-2">
                                    <NumberInput
                                        placeholder="Total Amount"
                                        icon={() => (
                                            <span className="w-fit select-none ml-2 mr-1 text-xs ">
                                                {(0)
                                                    .toLocaleString(
                                                        navigator
                                                            ? navigator
                                                                  .languages[0]
                                                            : 'en-US',
                                                        {
                                                            style: 'currency',
                                                            currency,
                                                            minimumFractionDigits: 0,
                                                            maximumFractionDigits: 0,
                                                        }
                                                    )
                                                    .replace(/\d/g, '')
                                                    .trim()}
                                            </span>
                                        )}
                                        min={0}
                                        value={goal}
                                        onValueChange={(e) => {
                                            setGoal(e)
                                        }}
                                    />
                                    <span className="text-tiny text-foreground-400 mt-0">
                                        How much do you need to save?
                                    </span>
                                </div>
                                <div className="h-12">
                                    <div className="float-left">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                                            onClick={() =>
                                                props.setIsOpen(false)
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
                                                const supabase =
                                                    await getSupabase(
                                                        await getToken({
                                                            template:
                                                                'supabase',
                                                        })
                                                    )
                                                const { data, error } =
                                                    await supabase
                                                        .from('goals')
                                                        .insert({
                                                            user_id: props.user,
                                                            label,
                                                            amount_saved:
                                                                savedGoal,
                                                            amount_total: goal,
                                                            currency,
                                                        })
                                                        .eq(
                                                            'user_id',
                                                            props.user
                                                        )
                                                        .select('*')
                                                if (data && !error) {
                                                    props.setIsOpen(false)
                                                    return props.setGoals(
                                                        (prev) => [
                                                            ...prev,
                                                            data[0],
                                                        ]
                                                    )
                                                }
                                                if (error) {
                                                    addAlert(
                                                        'error',
                                                        error.message,
                                                        5000
                                                    )
                                                }
                                            }}
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
