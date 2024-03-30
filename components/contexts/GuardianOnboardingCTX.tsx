import { useAuth, useUser } from '@clerk/nextjs'
import {
    ArrowRightIcon,
    BellIcon,
    CheckCircleIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import { createContext, useState, useEffect, useContext } from 'react'
import { getSupabase } from '@/utils/supabase'
import { Button } from '@tremor/react'
import { useRouter } from 'next/router'
import { useAlerts } from './alertHandler'
import { auth } from '@clerk/nextjs/server'
import { redirectToSignIn } from '@clerk/nextjs/server'

const GuardianOnboardingContext = createContext<{
    hasValidStripeSubscription: boolean | undefined
    subscriptionId: null | string[]
    hasFinishedOnboarding: boolean | null
}>({
    hasValidStripeSubscription: undefined,
    subscriptionId: null,
    hasFinishedOnboarding: null,
})
const exemptedRoutes = [
    '/subscription/manage',
    '/404',
    '/sign-in/[[...index]]',
    '/sign-in',
    '/sign-up',
    '/sign-up/[[...index]]',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/verify-phone',
    '/',
    '/privacy-policy',
    '/_error',
    '/terms-of-service',
    '/contact-us',
    '/about-us',
    '/faq',
    '/debt/literature',
]

export function GuardianOnboardingProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [hasValidStripeSubscription, setHasValidStripeSubscription] =
        useState<boolean | undefined>(undefined)
    const [subscriptionId, setSubscriptionId] = useState<string[] | null>(null)
    const [hasFinishedOnboarding, setHasFinishedOnboarding] = useState<
        boolean | null
    >(true)
    const { user, isLoaded, isSignedIn } = useUser()
    const { getToken } = useAuth()
    const [loading, setLoading] = useState<boolean>(false)
    const router = useRouter()
    const { addAlert } = useAlerts()
    useEffect(() => {
        async function checkUser() {
            if (isSignedIn && user?.publicMetadata.role !== 'parent') {
                setHasFinishedOnboarding(true)
                setHasValidStripeSubscription(true)
                return
            }
            const { data, error } = await (
                await getSupabase(await getToken({ template: 'supabase' }))
            )
                .from('parents')
                .select('*')
                .eq('clerk_id', user?.id)
            if (error == null && data!.length == 0) {
                setHasFinishedOnboarding(false)
            } else if (
                data![0]['subscription_id'] == null ||
                data![0]['subscription_status'] !== 'active'
            ) {
                // alert(data![0]['subscription_status'])
            } else if (
                data![0]['subscription_id'] != null &&
                data![0]['subscription_status'] === 'active'
            ) {
                fetch('/api/stripe/validateSubscription')
                    .then((res) => {
                        if (res.status === 200) {
                            return res.json()
                        } else {
                            addAlert('error', 'subscription not valid', 5000)
                            setHasValidStripeSubscription(false)
                        }
                    })
                    .then((json: { isActive: boolean; items: string[] }) => {

                        addAlert('success', 'subscription is valid :)', 5000)
                        setSubscriptionId(json.items)
                        setHasValidStripeSubscription(true)
                    })
                    .catch((e) => alert(e))
            }
        }
        if (!isSignedIn) return
        checkUser()
    }, [isSignedIn])

    if (
        exemptedRoutes.includes(router.asPath) ||
        router.pathname == '/_error'
    ) {
        return <>{children}</>
    }
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, delay: 1 }}
                key={'hasValidStripeSubscription'}
                className={`fixed h-full w-full top-0 right-0 left-0 z-[100] bottom-0 ${hasValidStripeSubscription || hasValidStripeSubscription == undefined ? 'hidden' : 'bg-black/40'}`}
            >
                <motion.div className="absolute overflow-hidden rounded-md h-fit max-w-lg w-full bg-white right-0 left-0 top-0 bottom-0 mx-auto my-auto">
                    <motion.div className="top-0 w-full bg-gray-300/90 h-12 ">
                        <p className="font-semibold text-lg text-black py-2 px-4">
                            No Subscription!
                        </p>
                    </motion.div>
                    <motion.div className="bg-white h-fit border-t border-t-black text-black">
                        <p className="py-auto bottom-0 px-4 pt-5">
                            Thank you for signing up to LogMoney!
                            <br />
                            Parents must have a valid subscription to use this
                            service. Please click the button below to continue.
                        </p>
                        <p className="py-auto px-4 py-5">
                            If you are a student and signed up as a parent by
                            mistake, please contact us via the 'Contact Us'
                            page. We'll be happy to help!
                        </p>
                    </motion.div>
                    <motion.div className="bg-gray-300/90 border-t border-t-black h-16 relative">
                        <Button
                            loading={loading}
                            icon={ArrowRightIcon}
                            onClick={() => {
                                setLoading(true)
                                setTimeout(() => {
                                    setLoading(false)
                                }, 2000)
                                router.push('/subscription/manage')
                            }}
                            iconPosition="right"
                            className="my-auto bottom-0 top-0 right-0 absolute h-fit mr-5"
                        >
                            Continue
                        </Button>
                    </motion.div>
                </motion.div>
            </motion.div>
            <GuardianOnboardingContext.Provider
                value={{
                    hasValidStripeSubscription,
                    subscriptionId,
                    hasFinishedOnboarding,
                }}
            >
                {children}
            </GuardianOnboardingContext.Provider>
        </AnimatePresence>
    )
}

export function useGuardianOnboarding() {
    const ctx = useContext(GuardianOnboardingContext)
    if (ctx === undefined)
        throw new Error(
            'GuardingOnboardingContext must be used within a ExpenseCTXProvider'
        )
    return ctx
}
