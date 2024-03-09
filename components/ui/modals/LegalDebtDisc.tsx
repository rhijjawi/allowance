import { useAlerts } from '@/components/contexts/alertHandler'
import { Dialog, Transition } from '@headlessui/react'
import { useRouter } from 'next/router'
import React, { Fragment, useState } from 'react'

export default function LegalModal(props: {
    isOpen: boolean
    setIsOpen: React.Dispatch<boolean>
}) {
    const router = useRouter()
    const { addAlert } = useAlerts()
    async function accept() {
        localStorage.setItem(
            'modals',
            JSON.stringify(
                JSON.parse(localStorage.getItem('modals')!).concat('disclaimer')
            )
        )
        props.setIsOpen(false)
    }
    async function reject() {
        localStorage.setItem(
            'modals',
            JSON.stringify(
                JSON.parse(localStorage.getItem('modals')!).filter(
                    (item: string) => item != 'disclaimer'
                )
            )
        )
        props.setIsOpen(false)
        await addAlert(
            'error',
            'You did not agree to the disclaimer. You will be redirected.',
            2500,
            () => {
                router.push('/')
            }
        )
    }
    return (
        <>
            <Transition appear show={props.isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    onClose={() => {
                        reject()
                    }}
                >
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
                                <Dialog.Panel className="w-full max-w-md transform  rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Legal Disclaimer
                                    </Dialog.Title>
                                    <div className="mt-2 grid grid-rows-3 gap-y-2">
                                        <p className="text-sm font-semibold leading-6 text-gray-500">
                                            The information provided herein is
                                            for general informational and
                                            educational purposes only and is not
                                            intended as legal, financial, or
                                            professional advice.
                                        </p>
                                        <p className="text-sm leading-6 text-gray-500">
                                            The content of this "advice" is not
                                            to be interpreted as a promise or
                                            guarantee of debt resolution or
                                            financial improvement.
                                        </p>
                                        <p className="text-sm leading-6 text-gray-500">
                                            The financial strategies and debt
                                            repayment plans suggested are based
                                            on theoretical scenarios and may not
                                            be applicable to your individual
                                            situation.
                                        </p>
                                        <p className="text-xs leading-6 text-gray-500/40">
                                            Your agreement is implicit. By
                                            visiting this page you understand
                                            the conditions.
                                        </p>
                                    </div>

                                    <div className="float-right mt-2">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                                            onClick={async () => {
                                                accept()
                                            }}
                                        >
                                            I agree
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}
