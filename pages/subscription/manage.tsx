import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Stripe from "stripe";
import { Button } from "@tremor/react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useAlerts } from "@/components/contexts/alertHandler";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
export const getStaticProps = (async (context : any) => {
    let data;
    try {
        const res = await fetch('http://expenses.ramzihijjawi.me:3000/api/stripe/getProds')
        data = await res.json()
    }
    catch (e){
        data = {}
    }
    return {props: {prods : data}, revalidate: 60}
})

const MotionButton = motion(Button)

export default function Subscriptions({prods} : {prods : Stripe.Price[]}){
    const {user, isSignedIn, isLoaded} = useUser();
    const {addAlert} = useAlerts()
    const [loading, setLoading] = useState<any>({})
    const [disabled, setDisabled] = useState<any>({})
    const router = useRouter()
    useEffect(()=>{
        async function a(){
            await router.push('/')
        }
        if ((isLoaded && !isSignedIn) || (isSignedIn && user.publicMetadata.role !== 'parent')){
            a()
        }
        return () => {}
    }, [isLoaded])
    if (!isLoaded){
        return <>Loading...</>
    }

    return (
        <motion.div className="min-h-screen h-fit w-screen relative">
            <motion.div className="bg-white aspect-[3/1] border-4 relative border-indigo-500 h-full max-w-4xl w-full mx-auto rounded left-0 bottom-0 my-12">
                <motion.div className="flex flex-col items-center justify-start h-fit mt-5">
                    <motion.h1 className="text-2xl font-semibold text-gray-900">Subscription Plans</motion.h1>
                    <motion.p className="text-gray-500 max-w-[90%] my-2">Choose what makes sense for you and/or your dependents.</motion.p>
                    <motion.p className="text-gray-500 break-words max-w-[90%] text-center">If you made it here by mistake, please click <Link href="/" className="text-black font-semibold">here</Link> to return to a familiar place 😉.</motion.p>
                </motion.div>
                <motion.div className="grid grid-cols-3 h-full">
                    {prods.map((i : Stripe.Price, index: number)=>{
                        const formatter = Intl.NumberFormat(navigator.languages[0], {currency : i.currency, style : "currency"})
                        return (
                            <>
                                <motion.div className="border-2 border-indigo-500 bg-slate-200 shadow-md rounded-md m-5 p-5 max-h-fit">
                                    {/*@ts-ignore */}
                                    <motion.h1 className="font-semibold text-xl text-black select-none">{i.product.name.split(' - ')[1]}</motion.h1>
                                    {/* @ts-ignore */}
                                    <motion.p className="text-black select-none text-xs">{i.product.description}</motion.p>
                                    <motion.p className="text-emerald-500 py-1 select-none">{i.billing_scheme == "per_unit" && formatter.format(i.unit_amount!/100)} {i.type == "recurring" ? `per ${i.recurring?.interval}` : "one time"}</motion.p>
                                    <MotionButton loading={loading[i.id]} disabled={loading[i.id] }
                                     onClick={async()=>{
                                        setLoading({...loading, [i.id] : true})
                                        fetch('/api/stripe/createCheckoutSession', {method: "POST", body: JSON.stringify({item : [i.id, Boolean(i.type == "recurring")]}) as any})
                                        .then(async(res)=>{
                                            if (res.status == 200){
                                                setLoading({...loading, [i.id] : false})
                                                const resp =  await res.json()
                                                console.log(resp)
                                                window.open(resp.goto, "_self")
                                            }
                                            else{
                                                addAlert("error", "Something went wrong. Please try again later, or contact us if the problem persists.", 5000)
                                            }
                                        })
                                        }} className="bg-indigo-500 text-white rounded-md px-3 py-1 mt-5 mx-auto right-0 left-0" icon={ArrowRightIcon} iconPosition="right">{i.type == "recurring" ? `Subscribe` : "Pay"}</MotionButton>
                                </motion.div>
                            </>
                        )
                    })}
                </motion.div>
            </motion.div>
        </motion.div>
    )
}