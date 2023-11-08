import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NumberInput, Switch } from "@tremor/react";
import { AddDebtModal } from "@/components/ui/modals/DebtCalc";
export default function Calculator(){
    const [isOpen, setIsOpen] = useState<boolean>(false)
    return (
        <AnimatePresence>
            
            <AddDebtModal open={isOpen} setIsOpen={setIsOpen} />
            <button onClick={()=>{setIsOpen(true)}} className="inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Add Debt</button>
            <div className="mx-auto max-w-[88rem] min-h-screen px-6 lg:px-8  mb-5">
            </div>
        </AnimatePresence>
    )
}