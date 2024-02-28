import { fetcher } from "@/utils/fetcher";
import { Dialog, Transition } from "@headlessui/react";
import { Button, NumberInput, Subtitle, Title } from "@tremor/react";
import { Fragment, SetStateAction, useState } from "react";
import symbols from '@/components/static/symbols.json'
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { useAlerts } from "@/components/contexts/alertHandler";
import axios from "axios";
export function SavingsModal({ isOpen, setIsOpen, misc, setMisc} : {isOpen : boolean, setIsOpen : React.Dispatch<SetStateAction<boolean>>, misc : any, setMisc : React.Dispatch<SetStateAction<any>>}){
    const {addAlert} = useAlerts();
    const [GoalAmount, setGoalAmount] = useState<number>(misc.savings[1]);
    const [saved, setSaved] = useState<number>(misc.savings[0]);
    const [currency, setCurrency] = useState<string>(misc.savings[2]);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSave = async() => {
      setLoading(true); 
      console.log(misc.savings, saved, GoalAmount, currency)
      if (misc.savings[0] == saved && misc.savings[1] == GoalAmount && misc.savings[2] == currency){
        setIsOpen(false)
        addAlert("warning", "Nothing changed.", 2000);
        return
      }
      setMisc({...misc, savings: [saved, GoalAmount, currency]});
      axios.put("/api/user/misc", misc).then((res)=>{
        if (res.status == 200){
          addAlert("success", "Savings goal updated!", 2000);
        }
        else {
          addAlert("error", "Something went wrong.", 2000);
        }
      })
      setIsOpen(false);
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
          <Dialog.Panel className="max-w-[45%] w-fit min-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-dark-tremor-background-subtle p-6 text-left align-middle shadow-xl transition-all z-30">
            <Dialog.Title
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
            >
              Your Savings Goals
              </Dialog.Title>
              <div className="mt-2 grid grid-cols-3 gap-x-2 w-[95%]">
              <div className="block relative text-sm font-medium leading-6 text-gray-900 dark:text-white">
              <NumberInput
                icon={CurrencyDollarIcon}
                placeholder="Amount Saved"
                enableStepper={false}
                value={saved}
                className="h-12"
                error={saved < 0 || Number.isNaN(saved)}
                onValueChange={(e)=>{
                    setSaved(e);
              }}/>
              {/* <select
                  id="currency"
                  name="currency"
                  onChange={(e)=>{
                      setCurrency(e.target.value)
                  }
                      }
                  className="h-full absolute -right-7 top-0 float-right rounded-md border-0 bg-transparent text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  value={currency}
              >
                  {Object.keys(symbols).map((currency:string, index:number) => (
                      <option key={index} value={currency}>{currency}</option>
                  ))}
              </select> */}
                </div>
                
                <div className="block relative text-sm font-medium leading-6 text-gray-900 dark:text-white">
              <NumberInput
                size={20}
                icon={CurrencyDollarIcon}
                placeholder={`Goal in ${currency}`}
                enableStepper={false}
                value={GoalAmount}
                className="max-w-full w-full h-12"
                error={GoalAmount < 0 || Number.isNaN(GoalAmount)}
                onValueChange={(e)=>setGoalAmount(e)}/>
                </div>
              <div className="relative w-full">
              <select
                  id="currency"
                  name="currency"
                  onChange={(e)=>{
                      setCurrency(e.target.value)
                  }
                      }
                  className="w-full dark:bg-dark-tremor-background h-12 rounded-md focus:ring-2 border-gray-400/20 border-2"
                  value={currency}
              >
                  {Object.keys(symbols).map((currency:string, index:number) => (
                      <option key={index} value={currency}>{currency}</option>
                  ))}
              </select>
              </div>
              
              </div>
                <div className="h-12 mt-5 align-bottom ">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                          onClick={()=>setIsOpen(false)}
                        >
                          Cancel
                        </button>
                      <button
                        type="button"
                        className="float-right bottom-0 disabled:bg-green-100/60 disabled:cursor-not-allowed justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                        disabled={loading || GoalAmount < 0 || Number.isNaN(GoalAmount) || saved < 0 || Number.isNaN(saved)} onClick={() => handleSave()}
                      >
                        Save
                      </button>
                </div>
              </Dialog.Panel>
              </Transition.Child>
              </div>
        </div>
      </Dialog>
      </Transition>
    );
  };