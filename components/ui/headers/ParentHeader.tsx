import { UserButton, UserProfile, useUser } from "@clerk/nextjs";
import { Dialog, Disclosure, Popover, Transition } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
    Bars3Icon,
    BookOpenIcon,
    ChartPieIcon,
    Cog6ToothIcon,
    Cog8ToothIcon,
    ExclamationCircleIcon,
    HomeIcon,
    ReceiptPercentIcon,
    SquaresPlusIcon,
    TableCellsIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon, PlusCircleIcon, CalendarDaysIcon } from '@heroicons/react/20/solid'
import { Fragment, useEffect, useState } from 'react'
import { motion } from "framer-motion";
import { Subtitle } from "@tremor/react";
import BugReport from "@/components/forms/bug";
const products = [
    { name: 'Overview', description: 'Get a better understanding of your expenditure', href: '/expenditure/overview', icon: ChartPieIcon },
    { name: 'My Money', description: 'A list of your income & expenditure', href: '/expenditure/list', icon: TableCellsIcon},
//   { name : 'Debt Management', description: 'Manage your debt', href: '/debt/overview', icon: CreditCardIcon},
]
const reports = [
    { name: 'Overview', description: 'View all generated reports', href: '/reports/view', icon: BookOpenIcon },
    { name: 'Manage Reports', description: 'Manage your reports', href: '/reports', icon: Cog8ToothIcon},
]
const billing = [
    { name: 'Pricing', description: 'Our Pricing Plans', href: '/pricing', icon : ReceiptPercentIcon },
    { name : 'Manage Subscription', description: "", href: '', icon : Cog6ToothIcon}
]

function classNames(...classes : any[]) {
    return classes.filter(Boolean).join(' ')
}


export default function ParentHeader() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    let [isOpen, setIsOpen] = useState<boolean>(false)
    const [bugReport, setBugReport] = useState<boolean>(false)
    let [isIncomeOpen, setIsIncomeOpen] = useState<boolean>(false)
    const {user, isLoaded, isSignedIn} = useUser()
    const router = useRouter()
    return (
    <>
    <header className="bg-white z-50">
    <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">LogMoney.app</span>
                <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="" />
            </Link>
        </div>
        <div className="flex lg:hidden">
            <button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700" onClick={() => setMobileMenuOpen(true)}>
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
        </div>
        <Popover.Group className="hidden lg:flex lg:gap-x-12">
                <Popover className="relative">
                    <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
                        Reports
                    <ChevronDownIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
                    </Popover.Button>

                    <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                    >
                    <Popover.Panel className="absolute -left-8 top-full z-20 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                        <div className="p-4">
                        {reports.map((item) => (
                            <div
                            key={item.name}
                            className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
                            >
                            <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                <item.icon className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" aria-hidden="true" />
                            </div>
                            <div className="flex-auto">
                                <Link href={item.href} className="block font-semibold text-gray-900">
                                {item.name}
                                <span className="absolute inset-0" />
                                </Link>
                                <p className="mt-1 text-gray-600">{item.description}</p>
                            </div>
                            </div>
                        ))}
                        </div>
                    </Popover.Panel>
                    </Transition>
                </Popover>
                <Popover className="relative">
                    <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
                    Billing
                    <ChevronDownIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
                    </Popover.Button>

                    <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                    >
                    <Popover.Panel className="absolute -left-8 top-full z-20 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                        <div className="p-4">
                        {billing.map((item) => (
                            <div
                            key={item.name}
                            className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
                            >
                            <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                <item.icon className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" aria-hidden="true" />
                            </div>
                            <div className="flex-auto">
                                <Link href={item.href} className="block font-semibold text-gray-900">
                                {item.name}
                                <span className="absolute inset-0" />
                                </Link>
                                <p className="mt-1 text-gray-600">{item.description}</p>
                            </div>
                            </div>
                        ))}
                        </div>
                    </Popover.Panel>
                    </Transition>
                </Popover>
            </Popover.Group>
        <motion.div className="hidden lg:flex lg:flex-1 lg:justify-end">
        {user ? <UserButton afterSignOutUrl="/" userProfileUrl='/profile/manage' showName userProfileMode='navigation' />
                    : <motion.button onClick={()=>{router.push('/sign-in')}} className='w-fit py-2 px-4 text-sm bg-indigo-600 rounded-md cursor-pointer text-white'>Log In / Sign Up</motion.button>}
        </motion.div>
    </nav>
    <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">LogMoney.app</span>
            <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt=""
            />
            </a>
            <button
            type="button"
            className="-m-2.5 rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(false)}
            >
            <span className="sr-only">Close menu</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
        </div>
        <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
            <div className="space-y-2 py-6">
                <Disclosure as="div" className="-mx-3">
                {({ open }) => (
                    <>
                    <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                        Product
                        <ChevronDownIcon
                        className={classNames(open ? 'rotate-180' : '', 'h-5 w-5 flex-none')}
                        aria-hidden="true"
                        />
                    </Disclosure.Button>
                    <Disclosure.Panel className="mt-2 space-y-2">
                        {//[...products, ...callsToAction].map((item) => (
                        [...products].map((item) => (
                        <Disclosure.Button
                            key={item.name}
                            as="a"
                            // href={item.href}
                            className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        >
                            {item.name}
                        </Disclosure.Button>
                        ))}
                    </Disclosure.Panel>
                    </>
                )}
                </Disclosure>
                <a
                href="#"
                className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                Features
                </a>
                <a
                href="#"
                className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                Marketplace
                </a>
                <a
                href="#"
                className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                Company
                </a>
            </div>
            <div className="py-6">
                <a
                href="#"
                className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                Log in
                </a>
            </div>
            </div>
        </div>
        </Dialog.Panel>
    </Dialog>
    
    </header>
    <BugReport isOpen={bugReport} setIsOpen={setBugReport}/>
    <div onClick={()=>{setBugReport(true)}} className="w-36 block h-12 z-[100] bg-white hover:bg-gray-200 rounded-full border fixed bottom-0 right-0 mr-10 mb-10 cursor-pointer">
        <div className="h-fit my-auto mx-auto right-0 left-0 bottom-0 top-0 w-fit absolute">
          <ExclamationCircleIcon className="w-8  text-red-500 h-6 ml-0 mb-[2px] -translate-x-1 bottom-0 top-0 right-0 left-0 inline-block" />
          <Subtitle className="inline-block h-full">Report Bug</Subtitle>
        </div>
      </div></>);
}