"use client";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import Error from "next/error";
import { useUser } from "@clerk/nextjs";
import { useExpenses } from "@/components/contexts/expenseCTX";
import { useEffect } from "react";

export const getStaticProps = ({ res }: {res: any}) => {
    return { props: {errorCode : 404}};
};
export default function FourOhFour({ errorCode } : {errorCode : number}){
    const {user, isLoaded, isSignedIn} = useUser();
    const {_error, _setError} = useExpenses()
    const router = useRouter();
    if (!isLoaded) return <></>
    useEffect(()=>{
        _setError(true)
    }, [isLoaded])
    return (
        <>
            <div className="min-h-screen bg-gray-500/10">
                <div className="bg-white dark:bg-gray-600/20 border border-black dark:border-white h-fit w-fit absolute right-0 left-0 top-0 bottom-0 mx-auto my-auto pt-3 pb-8 px-5 rounded-md">
                    <div className="w-full text-black dark:text-white">
                        <p className="text-2xl font-bold">/404</p>
                        <p className="font-bold">Page Not Found</p>
                        <p className="text-sm">The page you are looking for does not exist.</p>
                        <button onClick={() => router.push('/')} className=" bg-orange-500 hover:bg-orange-600 text-white px-3 mt-3 rounded-md mx-auto w-fit py-2 right-0">Go Home</button>
                        <button hidden={!isSignedIn} onClick={() => router.push('/expenditure/overview')} className="bg-orange-500 hover:bg-orange-600 text-white px-3 mt-3 rounded-md mx-auto w-fit py-2 right-0 float-right">Go to Dashboard</button>
                    </div>
                </div>
            </div>
            <div className="" hidden>
                <Error statusCode={errorCode}></Error>
            </div>
        </>
        
    )
}