import { Disclosure } from "@headlessui/react";
import { MinusIcon, PlusIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
export default function FAQ() {
    const pVariants = {
        hidden: {
            opacity: 0,
            height: 0,
            transition: { duration: 0.3, delay : 0 }
        },
        visible: {
            opacity: 1,
            height: "fit-content",
            transition: { duration: 0.3, delay : 0 }
        }
    }

    const faqs = [
        {
            "question": "What is LogMoney?",
            "answer": "LogMoney is a financial management platform designed to help you oversee and track your expenses, income, and debt whether at home or abroad."
        },
        {
            "question": "How can I sign up for an account?",
            "answer": "To create an account, click on the 'Sign Up' button on the homepage, and follow the registration process."
        },
        {
            "question": "How much does LogMoney.app cost?",
            "answer": "Great news! Logmoney.app is free for everyone. The only products we charge for are for the monthly reports that are sent to parents."
        },
        {
            "question": "Is my financial data secure?",
            "answer": "Yes, we take data security seriously. Your financial information is encrypted and protected. We use industry-standard security practices to keep your data safe. We will be implementing 2FA, and E2EE in the near future."
        },
        {
            "question": "How do I track my expenses?",
            "answer": "Using the expenses tab above, you can add your expenses and categorize them. You can also add your income and track your savings."
        },
        {
            "question": "Can I import my expenses from my bank?",
            "answer": "We have added the ability to import expenses from your bank account! More banks soon to come."
        },
        {
            "question": "How can I track my debt and set up a debt reduction plan?",
            "answer": "You can add your debt accounts, including loans and credit cards, and set up a debt reduction plan in the 'Debt Management' section of your dashboard. Our system will provide personalized recommendations to help you pay off debt faster while encouraging you to choose a plan that works for you."
        },
        {
            "question": "What should I do if I have questions or need support?",
            "answer": "If you have any questions or need assistance, please contact our support team via the 'Contact Us' page. We're here to help!"
        }
    ]
    let isOpenObj: { [key: number]: boolean } = {}
    faqs.forEach((faq : {question : string, answer: string}, index: number) => {
        isOpenObj[index] = false
    })
    const [isOpen, setIsOpen] = useState(isOpenObj)
    return (
        <>
            <div className="h-fit w-full overflow-hidden border-t-2 bg-white dark:bg-dark-tremor-background-muted/75">
                <div className="mx-auto max-w-7xl px-6 py-12 sm:py-32 lg:px-8 lg:py-40">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1, ease: "linear", height: { duration: 1 }, opacity: { duration: 1, delay: 0.15 } }}
                        className="mx-auto relative max-w-4xl border-4 border-indigo-600 py-5 px-5 rounded-md">
                        <QuestionMarkCircleIcon className="h-12 w-12 absolute right-5 top-5 rounded-lg dark:text-cyan-300/80" />
                        <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900 dark:text-white">Frequently Asked Questions</h2>
                        <dl className=" space-y-6 mt-5">
                            {faqs.map((faq, index: number) => (
                                <div className="">
                                    <dt className="border-2 rounded-md dark:!border-indigo-500 h-12">
                                        <div className="flex w-full h-full relative items-start justify-between text-left text-gray-900 dark:text-slate-100 px-2">
                                            <div className="absolute z-10 w-full h-full top-0 left-0 right-0 bottom-0 cursor-pointer" onClick={() => {
                                            setIsOpen({ ...isOpen, [index]: !isOpen[index] })
                                        }}></div>
                                            <span className="text-base font-semibold leading-7 my-2">{faq.question}</span>
                                            <span className="ml-6 flex h-7 items-center my-auto">
                                                {isOpen[index] ? (
                                                    <MinusIcon className="h-6 w-6" aria-hidden="true" />
                                                ) : (
                                                    <PlusIcon className="h-6 w-6" aria-hidden="true" />
                                                )}
                                            </span>
                                        </div>
                                    </dt>
                                    <dd className="">
                                        <AnimatePresence>
                                            <motion.p
                                                animate={isOpen[index] ? "visible" : "hidden"}
                                                initial="hidden"
                                                variants={pVariants}
                                                className="text-base leading-7 text-gray-600 dark:text-slate-300 px-3 mt-1">
                                                {faq.answer}
                                            </motion.p>
                                        </AnimatePresence>
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </motion.div>
                </div>
            </div>
        </>
    )
}