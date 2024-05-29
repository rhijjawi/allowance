import { Dialog, Transition } from '@headlessui/react'
import {
    CurrencyDollarIcon,
    ExclamationCircleIcon,
} from '@heroicons/react/24/outline'
import {
    Button,
    Callout,
    NumberInput,
    Select,
    SelectItem,
    Subtitle,
    Text,
} from '@tremor/react'
import React, { Dispatch, Fragment, useState } from 'react'
import symbols from '@/components/static/symbols.json'
import { useAlerts } from '../contexts/alertHandler'
export default function EmergencyFundModal({
    isOpen,
    setIsOpen,
    misc,
    setMisc,
}: {
    isOpen: boolean
    setIsOpen: Dispatch<React.SetStateAction<boolean>>
    misc: any
    setMisc: Dispatch<React.SetStateAction<any>>
}) {
    const [loading, setLoading] = useState<boolean>(false)
    const [onhand, setOnhand] = useState<number>(misc.emergency[0])
    const [notphysical, setNotPhysical] = useState<number>(misc.emergency[1])
    const [currency, setCurrency] = useState<string>(misc.emergency[2])
    const { addAlert } = useAlerts()
    const handleSave: () => Promise<void> = async () => {
        setLoading(true)
        setMisc({ ...misc, emergency: [onhand, notphysical, currency] })
        fetch('/api/user/misc', {
            headers: { 'Content-Type': 'application/json' },
            method: 'PUT',
            body: JSON.stringify(misc),
        }).then((res) => {
            if (res.status !== 200) {
                addAlert('error', 'Error updating emergency fund.', 2000)
                return
            }
        })
        addAlert('success', 'Emergency fund updated!', 2000)
        setTimeout(() => {
            setIsOpen(false)
            setLoading(false)
        }, 2000)
    }
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-10"
                onClose={() => setIsOpen(false)}
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
                            <Dialog.Panel className="max-w-[45%] w-fit min-w-md transform  rounded-2xl bg-white dark:bg-dark-tremor-background-subtle p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                                >
                                    Your Emergency Fund
                                </Dialog.Title>
                                <div className="mt-2 gap-x-2 w-[95%]">
                                    <div className="block relative text-sm font-medium leading-6 text-gray-900 dark:text-white">
                                        <Callout
                                            className=""
                                            icon={ExclamationCircleIcon}
                                            title={'Reminder'}
                                            color="amber"
                                        >
                                            <Text className="dark:text-slate-300">
                                                If you don&apos;t have an emergency
                                                fund, you should start one.
                                            </Text>
                                            <Text className="dark:text-slate-300">
                                                Cash is the only currency with
                                                guaranteed access.{' '}
                                            </Text>
                                            <Text className="dark:text-slate-300">
                                                It is advised to have at least 3
                                                months of expenses saved up in
                                                case of an emergency.{' '}
                                                <i>Anything can happen.</i>
                                            </Text>
                                            <Text className="dark:text-slate-300">
                                                An &quot;emergency fund&quot; can also be
                                                considered a &quot;rainy day fund&quot;;
                                                enough money to cover life&apos;s
                                                small emergencies.{' '}
                                            </Text>
                                        </Callout>
                                        <div className="py-5 grid grid-cols-3 grid-rows-2">
                                            <Text className="text-center col-start-1 row-start-1 dark:text-white">
                                                Amount (Virtually Accessible via
                                                Card, Bank, etc)
                                            </Text>
                                            <div className="w-full text-sm col-start-1 row-start-2 font-medium leading-6 text-gray-900 dark:text-white">
                                                <NumberInput
                                                    icon={CurrencyDollarIcon}
                                                    placeholder="Amount..."
                                                    className="w-[90%] mx-auto"
                                                    enableStepper={false}
                                                    value={notphysical}
                                                    error={notphysical < 0}
                                                    onValueChange={(e) => {
                                                        setNotPhysical(e)
                                                    }}
                                                />
                                            </div>

                                            <Text className="text-center col-start-2 row-start-1 dark:text-white">
                                                Physical Money
                                            </Text>
                                            <div className="text-sm font-medium col-start-2 row-start-2 leading-6 text-gray-900 dark:text-white">
                                                <NumberInput
                                                    icon={CurrencyDollarIcon}
                                                    placeholder="Amount..."
                                                    enableStepper={false}
                                                    value={onhand}
                                                    className="w-[90%] mx-auto"
                                                    error={onhand < 0}
                                                    onValueChange={(e) => {
                                                        setOnhand(e)
                                                    }}
                                                />
                                            </div>
                                            <Text className="text-center col-start-3 row-start-1 dark:text-white">
                                                Currency
                                            </Text>
                                            <div className="col-start-3 row-start-2 w-full justify-center">
                                                <div className="w-fit float-right">
                                                    <Select
                                                        enableClear={false}
                                                        value={currency}
                                                        onValueChange={(e) => {
                                                            setCurrency(e)
                                                        }}
                                                        className="w-fit z-[60] float-right"
                                                    >
                                                        {Object.keys(
                                                            symbols
                                                        ).map(
                                                            (
                                                                currency: string,
                                                                index: number
                                                            ) => (
                                                                <SelectItem
                                                                    key={`currency_sel_${index}`}
                                                                    className="text-center z-60 mx-auto"
                                                                    value={
                                                                        currency
                                                                    }
                                                                >
                                                                    {currency}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            className={`float-left ml-4 mb-4 my-5`}
                                            disabled={loading}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {' '}
                                            Cancel{' '}
                                        </Button>
                                        <Button
                                            className={`float-right mr-4 mb-4 my-5`}
                                            disabled={loading}
                                            onClick={async () =>
                                                await handleSave()
                                            }
                                        >
                                            {' '}
                                            Save{' '}
                                        </Button>
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
