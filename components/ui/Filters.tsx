import { Popover } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion, useAnimate } from "framer-motion";
import { useEffect, useState } from "react";
import { Button, Card, DateRangePicker, DateRangePickerItem, DateRangePickerValue, MultiSelect, MultiSelectItem, NumberInput, Text } from "@tremor/react";
import { CategorySchema } from "@/types/supabase";
export default function Filters(props: {categories : CategorySchema[], userCurr : string}){
    const Chevron = motion(ChevronRightIcon, {forwardMotionProps : true})
    const MotionCard = motion(Card, {forwardMotionProps : true})
    const [isActive, setIsActive] = useState(false);
    const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
    const date = {y: (new Date()).getFullYear(), m: (new Date()).getMonth(), d: (new Date()).getDate()}
    const [min, setMin] = useState<number|undefined>(undefined)
    const [max, setMax] = useState<number|undefined>(undefined)
    const [canProceed, setCanProceed] = useState(true)
    const [dateRange, setDateRange] = useState<DateRangePickerValue>({
      from: undefined,
      to: undefined,
    });
    function ClearFilters(){
      setFilteredCategories([])
      setDateRange({from : undefined, to: undefined})
      setIsActive(false)
      return
    }
    const variants = {
        hidden: {
          display : "none",
          opacity: 0,
          translate : "0 -50% 0",
        },
        visible: {
          zIndex: 60,
          display : "block",
          opacity : 1
        },
      };
    return (
    <>
      <AnimatePresence>
        {isActive && (<div className=" bg-tremor-background-muted/25 dark:bg-dark-tremor-background-muted/25 top-0 left-0 right-0 bottom-0 z-[999] fixed w-[110vw] h-[110vh]"></div>)}
      </AnimatePresence>

      <AnimatePresence>
          <motion.div animate={isActive ? "isOpen" : "isClosed"} variants={{isOpen : {width : "fit-content"}, isClosed: {width : 0 }}} className="fixed left-0 z-[1000] -translate-x-1 top-0 bottom-0 my-auto h-fit">
            <AnimatePresence>
              <motion.div className="absolute translate-x-[94%] top-0 bottom-0 right-0 w-fit h-fit my-auto z-[999]">
                <Card className="px-1 py-1 rounded-l-none border-y-2 border-r-2 ring-0 dark:border-white cursor-pointer" onClick={()=>setIsActive(!isActive)}>
                  <AnimatePresence>
                    <Chevron animate={!isActive ? "isOpen" : "isClosed"} variants={{isOpen : {rotate : "0deg"}, isClosed: {rotate : "180deg"}}}  className="w-6 cursor-pointer" />
                  </AnimatePresence>
                </Card>
              </motion.div>
            </AnimatePresence>
      <AnimatePresence >
            <MotionCard variants={variants} animate={!isActive ? "hidden" : "visible"} className="w-fit h-fit max-w-md px-4 py-4 bg-white border-2 dark:border-white border-black rounded-r-sm rounded-l-none z-[1000] ring-0">
              <Text className="dark:text-white text-tremor-content-strong text-center">Filters</Text>
              <Text className="dark:text-white ">Category</Text>
              <MultiSelect value={filteredCategories} onValueChange={(e)=>setFilteredCategories(e)}>
                {props.categories.map((category, index : number)=><MultiSelectItem value={String(category.id)} key={index}>{category.category}</MultiSelectItem>)}
              </MultiSelect>
              <Text className="dark:text-white mt-4">Date Range</Text>
              <DateRangePicker enableYearNavigation value={dateRange} onValueChange={(e)=>setDateRange(e)}>
                <DateRangePickerItem value="ytd" key="ytd" from={new Date(date.y-1, date.m, date.d)}>Year-to-date</DateRangePickerItem>
                <DateRangePickerItem value="l_m" key="mtd" from={new Date(date.y, date.m-1, date.d)}>Month-to-date</DateRangePickerItem>{/* last month */}
                <DateRangePickerItem value="s_m" key="sm" from={new Date(date.y, date.m, 1)}>Start of Month</DateRangePickerItem>{/* last month */}
              </DateRangePicker>
              <div className="grid grid-cols-2 mt-4">
                <Text className="dark:text-white col-span-2">Transaction Amount (in <strong>{props.userCurr}</strong>)</Text>
                <div><NumberInput errorMessage="Please set a value!" error={Boolean((!min && max))} value={min} onValueChange={(e)=>setMin(e)} placeholder="Min" className="w-[90%]" enableStepper={false}></NumberInput></div>
                <div><NumberInput errorMessage="Minimum cannot be greater than maximum" error={Boolean(max && min && max < min)} value={max} onValueChange={(e)=>setMax(e)} placeholder="Max" className="w-[90%]" enableStepper={false}></NumberInput></div>
              </div>
            <div className="grid grid-cols-3 h-10 mt-4">
              <button className="mb-2 ml-2 col-start-1 cursor-pointer justify-center rounded-md border border-transparent bg-red-100 h-full text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2" onClick={()=>ClearFilters()}>Clear All Filters</button>
              <button className="mb-2 mr-2 col-start-3 cursor-pointer justify-center rounded-md border border-transparent bg-green-100 h-full text-sm font-medium text-green-900 hover:bg-green-200 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2" disabled={!canProceed}>Apply Filter(s)</button>
            </div>
          </MotionCard>
        </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      
    </>)
}