import { Dialog } from "@headlessui/react";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { NumberInput } from "@tremor/react";
import { motion } from "framer-motion";

export function AddDebtModal(props: {open : boolean, setIsOpen : React.Dispatch<boolean>}){
    return (
        <Dialog open={props.open} onClose={() => props.setIsOpen(false)}className="relative z-50">
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-sm rounded bg-white">
                <Dialog.Title>Complete your order</Dialog.Title>
                <Dialog.Description>
                <motion.div className="">
                    <div className="mx-auto max-w-[88rem] min-h-fit px-6 lg:px-8  mb-5">
                        <div className="gap-6">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <h2 className="text-lg font-medium text-gray-900 mr-4">Debt Calculator</h2>
                                    </div>
                                    
                                </div>
                                <div className="mt-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <h3 className="text-sm font-medium text-gray-900 mr-4">Debt Amount</h3>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        {/* @ts-ignore */}
                                        <NumberInput prefix="USD" className="w-full" name="number-input" min={0} max={100000} step={1}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
                </Dialog.Description>
                </Dialog.Panel>
            </div>
        </Dialog>
    )
}

