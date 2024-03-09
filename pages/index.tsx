'use client'
import Image from 'next/image'
import {
    ArrowTrendingDownIcon,
    BanknotesIcon,
    CpuChipIcon,
    CurrencyDollarIcon,
    GlobeAltIcon,
    AcademicCapIcon,
    HomeModernIcon,
    LockClosedIcon,
    EyeSlashIcon,
    ArrowUpOnSquareStackIcon,
    GiftIcon,
} from '@heroicons/react/24/outline'
import { Select, SelectItem, Text, Color } from '@tremor/react'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import DownButtonJump from '@/components/ui/buttons/DownButtonJump'
import { useUser } from '@clerk/nextjs'

export default function Home(props: any) {
    const [value, setValue] = useState('0')
    const { user } = useUser()

    return (
        <>
            <DownButtonJump />
            <div className="w-full overflow-hidden border-t-2 bg-white dark:bg-dark-tremor-background-muted/75">
                <div className="mb-5 h-fit border-b-2 py-5">
                    <div className="mx-auto max-w-fit">
                        <Select
                            enableClear={false}
                            onValueChange={(e) => setValue(e)}
                            defaultValue="0"
                            className="rounded-md dark:border dark:border-white"
                            color="red"
                        >
                            <SelectItem
                                className="px-2 py-3 hover:cursor-pointer"
                                value={'0'}
                            >
                                Everyone
                            </SelectItem>
                            <SelectItem
                                className="px-2 py-3 hover:cursor-pointer"
                                value={'1'}
                            >
                                For Students
                            </SelectItem>
                            <SelectItem
                                className="px-2 py-3 hover:cursor-pointer"
                                value={'2'}
                            >
                                For Parents
                            </SelectItem>
                        </Select>
                    </div>
                </div>
                <div className="mx-auto max-w-[88rem] px-6 lg:px-8">
                    {value == '0' || value == '' ? (
                        <motion.div
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.6 }}
                            className="mx-auto mb-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2"
                        >
                            <div className="col-start-1 lg:pr-8 lg:pt-4">
                                <div className="lg:max-w-lg">
                                    <h2 className="text-lg font-semibold leading-7 text-indigo-600">
                                        LogMoney
                                    </h2>
                                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                                        Save more, spend less.
                                    </p>
                                    <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-white">
                                        A comprehensive financial management
                                        platform to help you regain control of
                                        your finances.
                                    </p>
                                    <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none dark:text-gray-500">
                                        {[
                                            {
                                                name: 'AI Powered Savings (Coming soon!)',
                                                icon: CpuChipIcon,
                                                description:
                                                    'Computer vision and machine learning to help you save money (better).',
                                            },
                                            {
                                                name: 'Expense Tracking',
                                                icon: CurrencyDollarIcon,
                                                icon_color: 'text-red-500',
                                                description:
                                                    'Effortlessly track and categorize your expenses to gain insights into your spending habits.',
                                            },
                                            {
                                                name: 'Income Tracking',
                                                icon: CurrencyDollarIcon,
                                                icon_color: 'text-green-500',
                                                description:
                                                    'Organize your income sources and understand your cash flow for better financial planning.',
                                            },
                                            {
                                                name: 'Upload Receipts',
                                                icon: ArrowUpOnSquareStackIcon,
                                                description:
                                                    'Our dashboard allows you to upload receipts and track your expenses on the go.',
                                            },
                                            {
                                                name: 'Debt Management',
                                                icon: ArrowTrendingDownIcon,
                                                description:
                                                    'Create a debt reduction plan and monitor your progress towards becoming debt-free.',
                                            },
                                            {
                                                name: 'International Currency Support',
                                                icon: GlobeAltIcon,
                                                description:
                                                    'Easily manage your finances in multiple currencies, making it convenient for international transactions and travel.',
                                            },
                                            {
                                                name: 'Secure and Private',
                                                icon: LockClosedIcon,
                                                description:
                                                    'We prioritize your data security and privacy. Your financial information is encrypted and protected. We do not sell your data to third parties, nor do we plan on doing so. Ever.',
                                            },
                                            {
                                                name: 'GDPR Compliance',
                                                icon: GiftIcon,
                                                description:
                                                    "Securing your data, safeguarding your privacy - because your trust is our top priority. We don't sell your data, and we never will. ",
                                            },
                                        ].map((feature) => (
                                            <div
                                                key={feature.name}
                                                className="relative pl-9"
                                            >
                                                <dt className="inline font-semibold text-gray-900 dark:text-gray-300">
                                                    {feature.icon && (
                                                        <feature.icon
                                                            className={`absolute left-1 top-1 h-5 w-5 ${feature.icon_color ? feature.icon_color : 'text-indigo-600'}`}
                                                            aria-hidden="true"
                                                        />
                                                    )}
                                                    {feature.name}
                                                </dt>{' '}
                                                <dd className="inline">
                                                    {feature.description}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>
                            </div>
                            <img
                                src="/marketing/main.png"
                                alt="Product screenshot"
                                className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
                                width={2432}
                                height={1442}
                            />
                        </motion.div>
                    ) : null}
                    {value == '1' ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.6 }}
                            className="mx-auto mb-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2"
                        >
                            <div className="col-start-1 lg:pr-8 lg:pt-4">
                                <div className="lg:max-w-lg">
                                    <h2 className="text-lg font-semibold leading-7 text-indigo-600">
                                        LogMoney
                                    </h2>
                                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                                        Built for students.
                                    </p>
                                    <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                                        Your comprehensive financial management
                                        platform to help YOU regain control of
                                        your finances.
                                    </p>
                                    <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none dark:text-gray-400">
                                        {[
                                            {
                                                name: 'AI Powered Savings (Coming soon!)',
                                                icon: CpuChipIcon,
                                                description:
                                                    'Computer vision and machine learning to help you save money (better).',
                                            },
                                            {
                                                name: 'Daily Budgeting',
                                                icon: BanknotesIcon,
                                                description:
                                                    "Set a daily budget and track your spending to ensure you don't overspend.",
                                            },
                                            {
                                                name: 'Expense Tracking',
                                                icon: CurrencyDollarIcon,
                                                icon_color: 'text-red-500',
                                                description:
                                                    'Effortlessly track and categorize your expenses to gain insights into your spending habits.',
                                            },
                                            {
                                                name: 'Income Tracking',
                                                icon: CurrencyDollarIcon,
                                                icon_color: 'text-green-500',
                                                description:
                                                    'Organize your income sources and understand your cash flow for better financial planning.',
                                            },
                                            {
                                                name: 'Upload Receipts',
                                                icon: ArrowUpOnSquareStackIcon,
                                                description:
                                                    'Our dashboard allows you to upload receipts and track your expenses on the go.',
                                            },
                                            {
                                                name: 'Debt Management',
                                                icon: ArrowTrendingDownIcon,
                                                description:
                                                    'Create a debt reduction plan and monitor your progress towards becoming debt-free.',
                                            },
                                            {
                                                icon: GlobeAltIcon,
                                                name: 'International Currency Support',
                                                description:
                                                    'Easily manage your finances in multiple currencies, making it convenient for international transactions and travel.',
                                            },
                                            {
                                                icon: EyeSlashIcon,
                                                name: 'Privacy',
                                                description:
                                                    "Only share what matters. If you don't want to share your financial information with your parents, you don't have to.",
                                            },
                                            {
                                                name: 'GDPR Compliance',
                                                icon: GiftIcon,
                                                description:
                                                    "Securing your data, safeguarding your privacy - because your trust is our top priority. We don't sell your data, and we never will. ",
                                            },
                                        ].map((feature) => (
                                            <div
                                                key={feature.name}
                                                className="relative pl-9"
                                            >
                                                <dt className="inline font-semibold text-gray-900 dark:text-gray-400">
                                                    {feature.icon && (
                                                        <feature.icon
                                                            className={`absolute left-1 top-1 h-5 w-5 ${feature.icon_color ? feature.icon_color : 'text-indigo-600'}`}
                                                            aria-hidden="true"
                                                        />
                                                    )}
                                                    {feature.name}
                                                </dt>{' '}
                                                <dd className="inline">
                                                    {feature.description}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>
                            </div>
                            <img
                                src="/marketing/main.png"
                                alt="Product screenshot"
                                className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
                                width={2432}
                                height={1442}
                            />
                        </motion.div>
                    ) : null}
                    {value == '2' ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.6 }}
                            className="mx-auto mb-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2"
                        >
                            <div className="col-start-1 lg:pr-8 lg:pt-4">
                                <div className="lg:max-w-lg">
                                    <h2 className="text-lg font-semibold leading-7 text-indigo-600">
                                        LogMoney
                                    </h2>
                                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                                        Built for Parents.
                                    </p>
                                    <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                                        A platform built to help your children
                                        through their journey of financial
                                        literacy.
                                    </p>
                                    <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none dark:text-gray-400">
                                        {[
                                            {
                                                name: 'AI Powered Savings (Coming Soon)',
                                                icon: CpuChipIcon,
                                                description:
                                                    'Computer vision and machine learning to help your kids save money.',
                                            },
                                            {
                                                name: 'Expense Tracking',
                                                icon: CurrencyDollarIcon,
                                                icon_color: 'text-red-500',
                                                description:
                                                    'Effortlessly track and categorize your expenses to gain insights into your spending habits.',
                                            },
                                            {
                                                name: 'Income Tracking',
                                                icon: CurrencyDollarIcon,
                                                icon_color: 'text-green-500',
                                                description:
                                                    'Organize your income sources and understand your cash flow for better financial planning.',
                                            },
                                            {
                                                name: 'Debt Management',
                                                icon: ArrowTrendingDownIcon,
                                                description:
                                                    'Create a debt reduction plan and monitor your progress towards becoming debt-free.',
                                            },
                                            {
                                                icon: GlobeAltIcon,
                                                name: 'International Currency Support',
                                                description:
                                                    "Reduce the hassle of converting currencies, we'll do it for you. Select your preferred currency in three clicks.",
                                            },
                                            {
                                                icon: EyeSlashIcon,
                                                name: 'Privacy',
                                                description:
                                                    "We'll only send you what matters. If your child doesn't want to share certain information with you, they won't have to.",
                                            },
                                            {
                                                name: 'GDPR Compliance',
                                                icon: GiftIcon,
                                                description:
                                                    "Securing your data, safeguarding your privacy - because your trust is our top priority. We don't sell your data, and we never will. ",
                                            },
                                        ].map((feature) => (
                                            <div
                                                key={feature.name}
                                                className="relative pl-9"
                                            >
                                                <dt className="inline font-semibold text-gray-900 dark:text-gray-400">
                                                    {feature.icon && (
                                                        <feature.icon
                                                            className={`absolute left-1 top-1 h-5 w-5 ${feature.icon_color ? feature.icon_color : 'text-indigo-600'}`}
                                                            aria-hidden="true"
                                                        />
                                                    )}
                                                    {feature.name}
                                                </dt>{' '}
                                                <dd className="inline">
                                                    {feature.description}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>
                            </div>
                            <img
                                src="/marketing/main.png"
                                alt="Product screenshot"
                                className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
                                width={2432}
                                height={1442}
                            />
                        </motion.div>
                    ) : null}
                    <div
                        id="cta-box"
                        className="mx-auto mb-10 max-w-3xl rounded-md border px-6 py-12 sm:py-12 lg:px-8 dark:border-2"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            <span className="text-indigo-600">
                                Finances are complicated.
                            </span>
                            <br />
                            <span className="dark:text-white">
                                With LogMoney, it doesn't have to be.
                            </span>
                        </h2>
                        <div className="mt-10 flex items-center gap-x-6">
                            <button className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                {!user && (
                                    <Link href="/sign-up">Get started</Link>
                                )}
                                {user && (
                                    <Link href="/expenditure/overview">
                                        My Dashboard
                                    </Link>
                                )}
                            </button>
                            <Link
                                href="/faq"
                                className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
                            >
                                Learn more <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
