import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
export default function Subscriptions(){
    const {user, isSignedIn, isLoaded} = useUser();
    if (!isLoaded){}

    return (
        <motion.div className="h-screen w-screen relative">
            <motion.div className="bg-white border-2 relative border-indigo-300 h-32 max-w-2xl w-full mx-auto rounded left-0 bottom-0 my-12">
                dsam
            </motion.div>
        </motion.div>
    )
}