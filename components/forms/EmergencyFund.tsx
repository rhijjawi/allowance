import { Dialog } from "@headlessui/react";
import { CurrencyDollarIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { Button, Callout, NumberInput, Subtitle, Text } from "@tremor/react";
import { Dispatch, useState } from "react";
import * as symbols from '@/components/static/symbols.json'
export default function EmergencyFundModal({isOpen, setIsOpen} : {isOpen : boolean, setIsOpen : Dispatch<React.SetStateAction<boolean>>}){
    const [loading, setLoading] = useState<boolean>(false);
    const [GoalAmount, setGoalAmount] = useState<number>(0);
    const [currency, setCurrency] = useState<string>('USD');
    const handleSave : () => void = () => {

    };
    return (
        <Dialog open={true} onClose={() => setIsOpen(false)} className={'relative z-[500] '}>
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className='fixed inset-0 flex w-screen items-center justify-center p-4 '>
            <Dialog.Panel className={`rounded-md  bg-white dark:bg-black relative w-full max-w-2xl max-h-full border-2 border-orange-500 dark:border-white`}>
                <Dialog.Title className={'flex items-start bg-orange-400 justify-between p-4 border-b rounded-t dark:text-black text-black'}>Your Emergency Fund</Dialog.Title>
                <div className='p-6 dark:bg-slate-600/80 h-96'>
                    <Callout className='' icon={ExclamationCircleIcon} title={"Reminder"} color="amber">
                        <Text>If you don't have an emergency fund, you should start one.</Text>
                        <Text>Cash is the only guaranteed access you have to money. </Text>
                        <Text>You should have at least 3 months of expenses saved up in case of an emergency. <i>Anything can happen.</i></Text>
                        <Text>An "emergency fund" can also be considered a pot for large expenses such as traveling for when big transactions need to be made.</Text>
                    </Callout>
                    <div className="mx-auto w-[70%] h-full py-3`">
                    <div className="block relative text-sm font-medium leading-6 text-gray-900 dark:text-white">
                        <NumberInput
                            icon={CurrencyDollarIcon}
                            placeholder="Amount..."
                            enableStepper={false}
                            value={GoalAmount}
                            error={GoalAmount < 0 ? true : false}
                            onValueChange={(e)=>{
                                setGoalAmount(e);
                            }}
                        />
                        <label htmlFor="currency" className="sr-only">
                            Currency
                        </label>
                        <select
                            id="currency"
                            name="currency"
                            onChange={(e)=>{
                                setCurrency(e.target.value)
                            }
                                }
                            className="h-full absolute right-0 top-0 float-right rounded-md border-0 bg-transparent text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                            value={currency}
                        >
                            {Object.keys(symbols).map((currency:string, index:number) => (
                                <option key={index} value={currency}>{currency}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <Button className={`float-left ml-4 mb-4`} disabled={loading} onClick={() => setIsOpen(false)}> Cancel </Button>
                <Button className={`float-right mr-4 mb-4`} disabled={loading} onClick={() => handleSave()}> Save </Button>
                </div>
            </Dialog.Panel>
          </div>
        </Dialog>
    );
}