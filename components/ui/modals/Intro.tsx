import { Dialog, Transition } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { Fragment, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
export default function Introduction() {
    const [isOpen, setIsOpen] = useState(false)
    const [page, setPage] = useState(0)
    const router = useRouter()
    const ignoredPaths = ["/sign-in"]
    async function closeModal() {
        localStorage.setItem(
            'modals',
            JSON.stringify(
                JSON.parse(localStorage.getItem('modals')!)
                    .filter((item: string) => item != 'intro')
                    .concat('intro')
            )
        )
        setIsOpen(false)
    }
    useEffect(() => {
        if (typeof localStorage === 'undefined') return
        for (let ignored of ignoredPaths){
            console.log(router.asPath, router.asPath.match(ignored))
            if (router.asPath.match(ignored)){
                return undefined
            }
        }
        const hasSeenIntro =
            localStorage.getItem('modals')?.indexOf('intro') != -1
        setIsOpen(!hasSeenIntro)
    }, [])
    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    onClose={() => {
                        closeModal()
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
                                <Dialog.Panel className="w-full overflow-hidden max-w-md transform  rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg mb-6 font-medium leading-6 text-gray-900"
                                    >
                                        Welcome to LogMoney.app 😄
                                    </Dialog.Title>
                                    <AnimatePresence>
                                        {page == 0 && (
                                            <motion.div
                                                className="inline-block text-slate-600"
                                                exit={{
                                                    x: '-120%',
                                                    position: 'absolute',
                                                }}
                                            >
                                                <p className="text-sm font-thin mb-2">
                                                    LogMoney.app is designed to
                                                    simplify remittances and
                                                    make managing finances a
                                                    breeze. I believe it will
                                                    significantly enhance how
                                                    you track finances,
                                                    especially for parents
                                                    managing funds for
                                                    dependents away from home.
                                                </p>
                                                <p className="text-sm font-light mb-2">
                                                    If you experience any issues
                                                    with this site. Please reach
                                                    out to me via{' '}
                                                    <Link
                                                        className="underline text-blue-600"
                                                        href="mailto:admin@logmoney.app"
                                                    >
                                                        email
                                                    </Link>
                                                    .
                                                </p>
                                                <p className="text-xs leading-6 text-gray-500/40">
                                                    You're exploring
                                                    LogMoney.app's Beta version,
                                                    where features are evolving
                                                    (or buggy) and your feedback
                                                    shapes our journey.
                                                </p>
                                            </motion.div>
                                        )}
                                        <div className="absolute bottom-0 right-0 left-0 mx-auto translate-y-[-400%] w-fit ">
                                            <div className="rounded-full relative bg-blue-500 h-2 aspect-square"></div>
                                        </div>
                                    </AnimatePresence>
                                    <div className="float-right mt-2">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                                            onClick={async () => {
                                                closeModal()
                                            }}
                                        >
                                            Okay!
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
