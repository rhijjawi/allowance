import { Dialog } from "@headlessui/react";
import { CurrencyDollarIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { Button, Callout, NumberInput, Select, SelectItem, Subtitle, Text } from "@tremor/react";
import React, { Dispatch, useState } from "react";
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
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className={'relative z-[500] '}>
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" onClick={()=>setIsOpen(false)} />
          <div className='fixed inset-0 flex w-screen items-center justify-center p-4 '>
            <Dialog.Panel className={`rounded-md  bg-white dark:bg-black relative w-full max-w-3xl max-h-full border-2 border-orange-500 dark:border-white`}>
                <Dialog.Title className={'flex items-start bg-orange-400 justify-between p-4 border-b rounded-t dark:text-black text-black'}>Your Emergency Fund</Dialog.Title>
                <div className='p-6 dark:bg-slate-600/80 h-96'>
                    <Callout className='' icon={ExclamationCircleIcon} title={"Reminder"} color="amber">
                        <Text className="dark:text-slate-300">If you don't have an emergency fund, you should start one.</Text>
                        <Text className="dark:text-slate-300">Cash is the only currency with guaranteed access. </Text>
                        <Text className="dark:text-slate-300">You should have at least 3 months of expenses saved up in case of an emergency. <i>Anything can happen.</i></Text>
                        <Text className="dark:text-slate-300">An "emergency fund" can also be considered a pot for large expenses such as traveling for when big transactions need to be made.</Text>
                    </Callout>
                    <div className="grid grid-cols-3 grid-rows-1 py-5 gap-x-5">
                        <div className="col-start-1 w-fit justify-center">
                            <div className="w-full text-sm font-medium leading-6 text-gray-900 dark:text-white">
                                <Text className="text-center dark:text-white">Amount Accessible by Card</Text>
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
                            <Text className="text-center dark:text-white">Cash-on-Hand</Text>
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
                            <Text className="text-center dark:text-white">Currency</Text>
                            <Select enableClear={false} value={currency} onValueChange={(e)=>{setCurrency(e)}} className="w-full">
                                {Object.keys(symbols).map((currency:string, index:number) => (<SelectItem className="text-center mx-auto text-red-400" value={currency}>{currency}</SelectItem>))}
                            </Select>
                        </div>
                    </div>
                <Button className={`float-left ml-4 mb-4 my-5`} disabled={loading} onClick={() => setIsOpen(false)}> Cancel </Button>
                <Button className={`float-right mr-4 mb-4 my-5`} disabled={loading} onClick={async() => await handleSave()}> Save </Button>
                </div>
            </Dialog.Panel>
          </div>
        </Dialog>
    );
}