import { fetcher } from "@/utils/fetcher";
import { Dialog } from "@headlessui/react";
import { Button, NumberInput, Subtitle, Title } from "@tremor/react";
import { useState } from "react";
import useSWR from "swr";
import * as symbols from '@/components/static/symbols.json'
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
export function SavingsModal({ isOpen, setIsOpen, misc} : {isOpen : boolean, setIsOpen : any, misc : any}){
    
    const [GoalAmount, setGoalAmount] = useState<number>(misc.savings[1]);
    const [saved, setSaved] = useState<number>(misc.savings[0]);
    const [currency, setCurrency] = useState<string>(misc.savings[2]);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSave = () => {
      // onSave(newGoal, newAmount);
      setLoading(true);  
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    };
  
    return (
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className={'relative z-[500] '}>
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className='fixed inset-0 flex w-screen items-center justify-center p-4 '>
          <Dialog.Panel className={`rounded-md  bg-white dark:bg-black relative w-full max-w-2xl max-h-full border-2 border-orange-500 dark:border-white`}>
              <Dialog.Title className={'flex items-start bg-orange-400 justify-between p-4 border-b rounded-t dark:text-black text-black'}>Your Savings Goals</Dialog.Title>
              <div className='p-6 space-y-6 dark:bg-slate-600/80 '>
              <div className={'text-base leading-relaxed text-gray-500 '}>   
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
                    <Subtitle className={`dark:text-white text-black`}>Goal</Subtitle>
                  </div>
                    <div className="relative w-full">
                      <Button className={`bg-orange-500 hover:bg-orange-600 text-white px-4 mt-3 rounded-md mx-auto w-16 py-2 float-left mb-5`} disabled={loading} onClick={() => setGoalAmount(GoalAmount + 1)}> Cancel </Button>
                      <Button className={`bg-orange-500 hover:bg-orange-600 text-white px-3 mt-3 rounded-md mx-auto w-16 py-2 float-right mb-5`} disabled={loading} onClick={() => handleSave()}> Save </Button>
                    </div>
              </div>
              </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    );
  };