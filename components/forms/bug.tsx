import { useUser } from '@clerk/nextjs'
import { Transition, Dialog } from '@headlessui/react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import React, { Dispatch, Fragment } from 'react'

export default function ReportABug({
    isOpen,
    setIsOpen,
}: {
    isOpen: boolean
    setIsOpen: Dispatch<boolean>
}) {
    const { user, isSignedIn } = useUser()
    const router = useRouter()
    const postURL = isSignedIn
        ? 'https://eoq198g7ikfeqsy.m.pipedream.net/submit-bug?user=' + user?.id
        : 'https://eoq198g7ikfeqsy.m.pipedream.net/submit-bug'
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-10"
                onClose={() => setIsOpen(false)}
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
                                    Report a Bug
                                </Dialog.Title>
                                <form
                                    onSubmit={(e) => {
                                        const formData = new FormData()
                                        formData.append(
                                            'bugTitle',
                                            (e.target as any).bugTitle.value
                                        )
                                        formData.append(
                                            'bugDescription',
                                            (e.target as any).bugDescription
                                                .value
                                        )
                                        formData.append(
                                            'screenshot',
                                            (e.target as any).screenshot
                                                .files[0]
                                        )
                                        formData.append(
                                            'currentUrl',
                                            router.route
                                        )
                                        fetch(postURL, {
                                            method: 'POST',
                                            headers: {
                                                contentType:
                                                    'multipart/form-data',
                                            },
                                            body: formData,
                                        })
                                        setIsOpen(false)
                                        e.stopPropagation()
                                        e.preventDefault()
                                    }}
                                    className="space-y-4"
                                >
                                    <div className="mt-2">
                                        <label
                                            htmlFor="bugTitle"
                                            className="block text-sm font-medium dark:text-white text-gray-900"
                                        >
                                            Bug Title
                                        </label>
                                        <input
                                            type="text"
                                            id="bugTitle"
                                            name="bugTitle"
                                            className="mt-1 p-2 w-full border rounded-md text-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="bugDescription"
                                            className="block text-sm font-medium dark:text-white text-gray-900"
                                        >
                                            Bug Description
                                        </label>
                                        <textarea
                                            id="bugDescription"
                                            name="bugDescription"
                                            rows={4}
                                            className="mt-1 p-2 w-full border rounded-md text-indigo-400"
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="screenshot"
                                            className="block text-sm font-medium dark:text-white text-gray-900"
                                        >
                                            Screenshot
                                        </label>
                                        <input
                                            type="file"
                                            id="screenshot"
                                            name="screenshot"
                                            accept="image/*"
                                            className="mt-1 p-2 w-full border dark:text-white text-gray-900 rounded-md"
                                        />
                                        <p className="text-xs mt-2 dark:text-white text-gray-900">
                                            Upload a screenshot (image format).
                                        </p>
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            className="bg-blue-500 text-white px-4 py-2 rounded-md float-right"
                                        >
                                            Submit Bug Report
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
