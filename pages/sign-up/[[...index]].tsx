import { SignOutButton, SignUp, useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { Button, Select, SelectItem, Subtitle } from '@tremor/react'
import symbols from '@/components/static/symbols.json'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'
function SignUpPage() {
    const { user, isLoaded, isSignedIn } = useUser()
    const router = useRouter()
    const [roleType, setRoleType] = useState<0 | 1 | 2>(0)
    const [boardingcomplete, setBoardingComplete] = useState<boolean>(false)
    const [preferredCurr, setPreferredCurr] = useState<string>('EUR')
    const [onboardingStep, setOnboardingStep] = useState<number>(0)
    const currencies = Object.keys(symbols).map((key: string) => [
        (symbols as any)[key],
        key,
    ])
    if (!isLoaded) return <div>Loading...</div>
    if (user) {
        return (
            <div className="">
                <div className="absolute top-0 bottom-0 right-0 left-0 w-screen h-screen bg-white z-[50]"></div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 1, ease: 'linear', delay: 1 }}
                    className="absolute top-0 bottom-0 right-0 left-0 w-screen h-screen bg-black/40 z-[52]"
                >
                    <div className="mx-auto my-auto bottom-0 right-0 top-0 left-0 absolute max-w-md max-h-fit h-fit min-w-2xl py-6 px-8 bg-white dark:bg-black rounded-md outline-indigo-500 outline">
                        <p className="mb-3">
                            You are already signed in. To sign up, you'll need
                            to sign out first.
                        </p>
                        <SignOutButton
                            signOutCallback={() => {
                                router.push('/')
                            }}
                        >
                            <Button>Sign Out</Button>
                        </SignOutButton>
                    </div>
                </motion.div>
            </div>
        )
    }
    return (
        <div className="">
            <div className="absolute top-0 bottom-0 right-0 left-0 w-screen h-screen bg-white z-[50]"></div>
            <div className="absolute top-0 bottom-0 right-0 left-0 w-screen h-screen bg-black/40 z-[52]">
                {onboardingStep == 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 1, ease: 'linear', delay: 1 }}
                        className="mx-auto my-auto bottom-0 right-0 top-0 left-0 absolute max-w-md max-h-fit h-fit min-w-2xl py-6 px-8 bg-white dark:bg-black rounded-md outline-indigo-500 outline"
                    >
                        <p className="font-bold leading-7 text-lg text-black dark:text-white py-2">
                            Are you a Parent or Student?
                        </p>
                        <div className="py-5">
                            <div className="grid grid-cols-2">
                                <Button
                                    className={`col-start-1 w-[80%] mx-auto bg-black hover:bg-gray-900/90 ${roleType == 2 ? '!bg-green-500 !hover:bg-green-500' : ''}`}
                                    onClick={() => {
                                        setRoleType(Number(2) as 0 | 1 | 2)
                                    }}
                                >
                                    Spender
                                </Button>
                                <Button
                                    className={`col-start-2 w-[80%] mx-auto bg-black hover:bg-gray-900/90 ${roleType == 1 ? '!bg-green-500 !hover:bg-green-500' : ''}`}
                                    onClick={() => {
                                        setRoleType(Number(1) as 0 | 1 | 2)
                                    }}
                                >
                                    Supervisor/Guardian
                                </Button>
                            </div>
                        </div>
                        {/* <Subtitle>If you are not a parent, select no.</Subtitle> */}
                        <Button
                            icon={ArrowRightIcon}
                            iconPosition="right"
                            disabled={roleType == 0}
                            className="float-right dark:text-white"
                            onClick={() => {
                                if (roleType != 0) {
                                    setOnboardingStep(1)
                                } else if (roleType == 0)
                                    setBoardingComplete(false)
                            }}
                        >
                            Continue
                        </Button>
                    </motion.div>
                )}
                {onboardingStep == 1 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 1, ease: 'linear', delay: 1 }}
                        className="mx-auto my-auto bottom-0 right-0 top-0 left-0 absolute max-w-md max-h-fit h-fit w-fit py-6 px-8 bg-white dark:bg-black rounded-md outline-indigo-500 outline"
                    >
                        <div className="py-3">
                            <p className="text-bold text-lg text-black dark:text-white py-2">
                                What is your preferred currency?
                            </p>
                            <Select
                                value={preferredCurr}
                                enableClear={false}
                                className="w-64 mx-auto border-2 rounded-lg border-indigo-600 bg-indigo-600 !focus:outline-none focus:border-none"
                                onValueChange={(e) => {
                                    setPreferredCurr(e)
                                }}
                            >
                                {currencies.map((i: any, index: number) => {
                                    return (
                                        <SelectItem key={index} value={i[1]}>
                                            ({i[1]}) {i[0]}
                                        </SelectItem>
                                    )
                                })}
                            </Select>
                        </div>
                        <p className="my-2">
                            This doesn't have to be the currency of the country
                            you're residing in, just one you're comfortable with
                            and can interpret easily
                        </p>
                        <Button
                            disabled={roleType == 0}
                            className="float-right py-2"
                            onClick={() => {
                                if (roleType != 0) {
                                    setOnboardingStep(2)
                                    setBoardingComplete(true)
                                } else if (roleType == 0)
                                    setBoardingComplete(false)
                            }}
                        >
                            Continue to Sign Up
                        </Button>
                    </motion.div>
                )}
                {onboardingStep == 2 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, size: 0 }}
                        transition={{ duration: 1, ease: 'linear', delay: 1 }}
                        className="mx-auto my-auto bottom-0 right-0 top-0 left-0 absolute max-w-fit max-h-fit h-fit w-fit"
                    >
                        <SignUp
                            unsafeMetadata={{
                                role: `${['parent', 'student'][Number(roleType) - 1]}`,
                                currency: `${preferredCurr}`,
                            }}
                            appearance={{
                                elements: {
                                    formButtonPrimary: 'bg-indigo-600',
                                    formFieldInput:
                                        'rounded-md border border-indigo-600/30',
                                    card: 'overflow-hidden m-0',
                                },
                            }}
                            path="/sign-up"
                            routing="virtual"
                            signInUrl="/sign-in"
                        />
                    </motion.div>
                )}
            </div>
        </div>
    )
}
export default SignUpPage
