import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
export default function Subscriptions(){
    const {user, isSignedIn, isLoaded} = useUser();
    if (!isLoaded){
        return (
            <motion.div className="h-screen">
                <motion.div>
                    
                </motion.div>
            </motion.div>
        )
    }

    return (
        <motion.div className="h-screen">
            
        </motion.div>
    )
}