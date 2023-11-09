import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

const footerItems = [
    [
        {name : "About", link: "/about"}, {name: "FAQ", link: "/faq"}, {name: "Privacy Policy", link: "/privacy-policy"}, {name: "Terms of Service", link: "/terms-of-service"}
    ],
    [
        {name: "Blog", link: "/blog"}, {name: "Careers", link: "/careers"}, {name: "Press", link: "/press"}
    ],
    [
        {name: "Contact", link: "/contact"}, {name: "Donate", link: "https://buy.stripe.com/cN25lTc8w0D7eyY6oo"}
    ],
]

// return (<motion.div className={`${["col-start-2","col-start-4","col-start-6"][index]} col-span-1`}>
                        
//                     </motion.div>)

export default function Footer(){
    return (
        <AnimatePresence>
            <footer className="flex flex-col w-full h-fit border-t bg-white dark:bg-gray-800 dark:border-gray-700">
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, delay: 1 }}
                className="w-full h-full grid grid-cols-7">
                    {footerItems.map((item, index) => {
                        console.log("item", item)
                        return (
                        <motion.div key={index} className={`${["col-start-2","col-start-4","col-start-6"][index]} col-span-1`}>
                            <motion.ul className="py-8">
                                {item.map((subitem, subindex) => {
                                    console.log(subitem)
                                return (
                                        <motion.li key={`${index}.${subindex}`} className="py-1">
                                                <Link className="text-base" href={subitem.link}>{subitem.name}</Link>
                                        </motion.li>
                                )
                                })}
                            </motion.ul>
                        </motion.div>

                        )
                    }
                    )}
                </motion.div>
            </footer>
        </AnimatePresence>
    )
}