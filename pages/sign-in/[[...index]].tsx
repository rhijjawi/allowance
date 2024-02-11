'use client'
import { SignIn } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
export function SignInPage() {
    const params = useSearchParams()
    useEffect(()=>{
        console.log()
    }, [params])
    return (
        <div className="">
            <div className="absolute top-0 bottom-0 right-0 left-0 w-screen h-screen bg-white z-[50]">
            </div>
            <div className="absolute top-0 bottom-0 right-0 left-0 w-screen h-screen bg-black/50 z-[52]">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, size: 0 }}
                    transition={{ duration: 1, ease: "linear", delay: 0.2 }}
                    className="mx-auto my-auto bottom-0 right-0 top-0 left-0 absolute max-w-fit max-h-fit h-fit w-fit">
                    <SignIn
                        afterSignInUrl={params.get("afterlogin") ? params.get("afterlogin") : undefined}
                        appearance={{
                            elements: {
                                formButtonPrimary: "bg-indigo-600",
                                formFieldInput: "rounded-md border border-indigo-600/30",
                                card: "overflow-hidden m-0"
                            }
                        }}
                        path="/sign-in" routing="path" signUpUrl="/sign-up" />
                </motion.div>
            </div>
        </div>

    );
};
export default SignInPage;