import { AnimatePresence, motion } from "framer-motion"
import { ArrowTrendingDownIcon, ArrowTrendingUpIcon, CalculatorIcon } from "@heroicons/react/24/outline"
import { useUser } from "@clerk/nextjs"
import { Button, Icon } from "@tremor/react"
export default function Index() {
    const methods = [
        {
            icon: ArrowTrendingDownIcon,
            heading: "Debt Avalanche",
            text: ["For example, if you have $3,000 extra to devote to debt repayment each month, then the debt avalanche method will make your money go the furthest. Imagine that you have the following debts:", "• $10,000 credit card debt at an 18.99% annual percentage rate (APR)", "• $9,000 car loan at 3.00% interest rate", "• $15,000 student loan at 4.50% interest rate", "In this scenario, the avalanche method would have you pay off your credit card debt first, then allow you to pay off your remaining debt in 11 months, paying a total of $1,011.60 in interest. The snowball method would have you tackle the car loan first, becoming debt-free in 11 months, but you would have paid $1,514.97 in interest. By switching the order of your debts, you save hundreds of dollars in interest. For individuals with more significant amounts of debt, the avalanche method can also reduce the time it takes to pay off the debt by a few months."],
            adv : ["• Minimizes the amount of interest you pay","• Lessens the amount of time it takes to get out of debt", "• Good for budget oriented people"],
            dis: ["• Takes discipline and commitment to pull off", "• Requires constant amount of discretionary income"]
        },
        {
            icon: ArrowTrendingUpIcon,
            heading: "Debt Snowball",
            text: ["Let's see how the snowball effect works on our previous debt example. To recap, you have $3,000 extra to devote to debt repayment each month, and you have the following:", "• $10,000 credit card debt at an 18.99% annual percentage rate (APR)", "• $9,000 car loan at 3.00% interest rate", "• $15,000 student loan at 4.50% interest rate", "The snowball method would have you focus on the car loan first because you owe the smallest amount of money on it. You'd settle it in about three months, then tackle the other two. As with the debt avalanche method, you'd become debt-free in about 11 months. However, you would have paid $1,514.97 in interest—about $500 more overall."],
            adv : ["• Builds motivation by settling debts fast", "• Easy to implement"],
            dis: ["• Incurs more interest—more expensive overall", "• Can take longer to become completely debt-free"]
        }
    ]
    const {user, isLoaded, isSignedIn} = useUser()
    const MotionButton = motion(Button)
    if (!isLoaded) return (<div className="mx-auto max-w-[88rem] min-h-screen px-6 lg:px-8  mb-5"></div>)
    if (isLoaded && !isSignedIn) return (
    <motion.div className="mx-auto max-w-[88rem] min-h-screen px-6 lg:px-8  mb-5">
        <Button></Button>
    </motion.div>
    )
    return (
        <AnimatePresence>
            {<div className="mx-auto max-w-[88rem] min-h-screen px-6 lg:px-8  mb-5">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, delay: 1 }}
                    className={`shadow-2xl px-5 rounded-lg bg-slate-300/40 border-2 border-indigo-600 dark:bg-indigo-500/30 w-full mt-5 max-w-[80%] my-auto mx-auto py-5`}
                >
                    <motion.p className="text-4xl mb-4 leading-7">Debt</motion.p>
                    {isSignedIn && <motion.p className="mb-4 leading-7">
                        In today's complex financial landscape, debt has become an integral part of many individuals' and organizations' financial portfolios. Whether it's a mortgage, student loans, credit card debt, or business loans, managing debt effectively is essential for maintaining financial stability and securing a brighter economic future.
                    </motion.p>}
                    <motion.p className="mb-4 leading-7">
                        The importance of debt management cannot be overstated, as it plays a pivotal role in determining one's financial well-being and long-term prosperity.
                        Debt management encompasses a variety of strategies and practices aimed at responsible borrowing, timely repayment, and ultimately achieving financial goals. It involves understanding the various types of debt, evaluating their terms and interest rates, and devising a structured plan to repay them while minimizing interest costs. Furthermore, effective debt management goes beyond mere repayment and extends to building a solid credit history, safeguarding one's credit score, and improving overall financial literacy.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 2 }}
                        className="mx-auto mb-5">
                        <motion.p className="text-4xl mb-3 leading-10">Stuck in debt?</motion.p>
                        <motion.p className="mb-4 text-base leading-7">Paying off debt is no easy task, especially if you pay the minimum amount due each month. To get free and clear, you often have to accelerate payments. There are two distinct strategies to settle outstanding balances.</motion.p>
                    </motion.div>
                    {methods.map((el: {icon : any, heading: string, text : string[], adv : string[], dis: string[]}, index : number)=>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 3 + index}}
                        className="mx-auto my-5 max-w-2xl relative border-[2.5px] border-indigo-300 rounded-md py-2 px-5">
                            <el.icon className="absolute top-5 right-5 h-6 w-6" />
                            <motion.p className="text-2xl mb-3 leading-10 font-semibold">{el.heading}</motion.p>
                            {el.text.map((string)=>{return (<motion.p className="mb-4 text-base leading-7">{string} <br/></motion.p>)})}
                            <div className="grid grid-cols-2 divide-x-2 divide-gray-300 mb-5">
                                <div className="col-span-1 col-start-1 w-full">
                                    <p className="mx-auto w-fit font-bold text-green-500 border-b border-b-green-200">Pros</p>
                                    {el.adv.map((adv : string)=>(
                                        <p className="w-[70%] mx-auto my-3 dark:text-green-200">{adv}</p>
                                    ))}
                                </div>
                                <div className="col-span-1 col-start-2 w-full ">
                                    <p className="mx-auto w-fit font-bold text-red-500 border-b border-b-red-200">Cons</p>
                                    {el.dis.map((adv : string)=>(
                                        <p className="w-[70%] mx-auto my-3 dark:text-red-200">{adv}</p>
                                    ))}
                                </div>
                            </div>
                    </motion.div>)}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 5}}
                        className="">
                    <motion.p className="text-4xl mb-4 leading-7">Debt Calculator</motion.p>
                    <motion.p className="text-sm mt-5">The Debt Calculator is a simple financial tool designed to help you manage your financial obligations. Whether you're trying to understand how to best pay back your credit card bills, looking to pay off existing debt, or simply want to understand your financial commitments better, this calculator provides you with a solution.</motion.p>
                    <motion.p className="text-xs mb-5 mt-1">Keep in mind that this calculator is only a tool to help you understand your debt and how to pay it off. It is not a substitute for professional advice. If you are struggling with debt, you should seek the advice of a professional.</motion.p>
                    <MotionButton icon={CalculatorIcon} iconPosition="right" className="py-2 px-3">Continue to the Debt Calculator</MotionButton>
                    </motion.div>
                    
                </motion.div>
            </div>}
        </AnimatePresence>
    )
}