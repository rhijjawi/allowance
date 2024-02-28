import { Dialog, Transition } from "@headlessui/react";
import { CurrencyDollarIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { Button, Callout, NumberInput, Select, SelectItem, Subtitle, Text } from "@tremor/react";
import React, { Dispatch, Fragment, useState } from "react";
import symbols from '@/components/static/symbols.json'
import { useAlerts } from "../contexts/alertHandler";
export default function EmergencyFundModal({isOpen, setIsOpen, misc, setMisc} : {isOpen : boolean, setIsOpen : Dispatch<React.SetStateAction<boolean>>, misc : any, setMisc : Dispatch<React.SetStateAction<any>>}){
    const [loading, setLoading] = useState<boolean>(false);
    const [onhand, setOnhand] = useState<number>(misc.emergency[0]);
    const [notphysical, setNotPhysical] = useState<number>(misc.emergency[1]);
    const [currency, setCurrency] = useState<string>(misc.emergency[2]);
    const {addAlert} = useAlerts();
    const handleSave : () => Promise<void> = async() => {
        setLoading(true);
        fetch('/api/user/misc', {method: "PUT"}).then((res) => {
            if (res.status !== 200){
                addAlert("error", "Error updating emergency fund.", 2000);
                return;
            }
        });
        setMisc({...misc, emergency: [onhand, notphysical, currency]});
        addAlert("success", "Emergency fund updated!", 2000);
        setTimeout(() => {
            setIsOpen(false);
            setLoading(false);
        }, 2000);
    };
    return (
        <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={()=>setIsOpen(false)}>
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
            >Your Emergency Fund</Dialog.Title>
            <div className="mt-2 gap-x-2 w-[95%]">
            <div className="block relative text-sm font-medium leading-6 text-gray-900 dark:text-white">
                <Callout className='' icon={ExclamationCircleIcon} title={"Reminder"} color="amber">
                    <Text className="dark:text-slate-300">If you don't have an emergency fund, you should start one.</Text>
                    <Text className="dark:text-slate-300">Cash is the only currency with guaranteed access. </Text>
                    <Text className="dark:text-slate-300">You should have at least 3 months of expenses saved up in case of an emergency. <i>Anything can happen.</i></Text>
                    <Text className="dark:text-slate-300">An "emergency fund" can also be considered a pot for large expenses such as traveling for when big transactions need to be made.</Text>
                </Callout>
                    <div className="py-5 grid grid-cols-3">
                        <div className="col-start-1 w-fit justify-center">
                            <div className="w-full text-sm font-medium leading-6 text-gray-900 dark:text-white">
                                <Text className="text-center dark:text-white">Amount (Virtually Accessible via Card, Bank, etc)</Text>
                                <NumberInput
                                    icon={CurrencyDollarIcon}
                                    placeholder="Amount..."
                                    enableStepper={false}
                                    value={notphysical}
                                    error={notphysical < 0}
                                    onValueChange={(e)=>{
                                        setNotPhysical(e);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-start-2 w-fit justify-center">
                            <div className="text-sm font-medium leading-6 text-gray-900 dark:text-white">
                            <Text className="text-center dark:text-white">Physical Money</Text>
                                <NumberInput
                                    icon={CurrencyDollarIcon}
                                    placeholder="Amount..."
                                    enableStepper={false}
                                    value={onhand}
                                    error={onhand < 0}
                                    onValueChange={(e)=>{
                                        setOnhand(e);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-start-3 w-full justify-center">
                            <div className="w-fit float-right">
                            <Text className="text-center  dark:text-white">Currency</Text>
                            <Select enableClear={false} value={currency} onValueChange={(e)=>{setCurrency(e)}} className="w-fit z-[60] float-right">
                                {Object.keys(symbols).map((currency:string, index:number) => (<SelectItem className="text-center z-60 mx-auto" value={currency}>{currency}</SelectItem>))}
                            </Select>
                            </div>
                        </div>
                    </div>
                <Button className={`float-left ml-4 mb-4 my-5`} disabled={loading} onClick={() => setIsOpen(false)}> Cancel </Button>
                <Button className={`float-right mr-4 mb-4 my-5`} disabled={loading} onClick={async() => await handleSave()}> Save </Button>
                </div>
                </div>
            </Dialog.Panel>
            </Transition.Child>
            </div>
        </div>
        </Dialog>
        </Transition>
    );
}