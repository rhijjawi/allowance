import { DocumentChartBarIcon, CurrencyDollarIcon, ChatBubbleLeftRightIcon, Cog8ToothIcon, ClipboardDocumentIcon } from "@heroicons/react/24/outline"
import { Button, Select, TextInput,  SelectItem, Subtitle, Title } from "@tremor/react"
import * as langs from "@/components/static/languages.json"
import symbols from "@/components/static/symbols.json"
import { motion, AnimatePresence, useAnimate } from "framer-motion";
import { use, useEffect, useState } from "react"
import { useAlerts } from "@/components/contexts/alertHandler"
import { clerkClient, useAuth, useUser } from "@clerk/nextjs";
import { getSupabase } from "@/utils/supabase";
export default function Index() {
    const {user, isLoaded, isSignedIn} = useUser()
    if (!isLoaded)return <></>
    const [isLoading, setIsLoading] = useState(false)
    const { addAlert } = useAlerts()
    //@ts-ignore
    const [language, setLanguage] = useState(user?.publicMetadata.reports.language)
    //@ts-ignore
    const [currency, setCurrency] = useState(user?.publicMetadata.reports.currency)
    //@ts-ignore
    const [email, setEmail] = useState(user.publicMetadata.reports.email)
    const {getToken} = useAuth()
    const [isEmailValid, setIsEmailValid] = useState(false)
    useEffect(()=>{
        if (email && email.includes('@') && email.includes('.') && email.split('.').reverse()[0].length > 0){
            setIsEmailValid(true)
        }
        else {
            setIsEmailValid(false)
        }
    }, [email])
    
    const settings = [
        {
            name: "Language",
            description: "Set the language of the reports",
            onChange: (value : string)=>{setLanguage(value)},
            icon: ChatBubbleLeftRightIcon,
            icon_color: "text-indigo-600 dark:text-white",
            value: language,
            options: langs.sort((a, b)=>{return a.name.localeCompare(b.name)}).map((lang)=><SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>)
        },
        {
            name: "Home Currency",
            description: "Set the currency of the reports",
            onChange: (value : string)=>{setCurrency(value)},
            icon: CurrencyDollarIcon,
            icon_color: "text-green-600 dark:text-green-400",
            value: currency,
            options: Object.keys(symbols).map((key : string)=><SelectItem key={key} value={key}>({key}) {(symbols as any)[key]}</SelectItem>)
        },
    ]
    
    return (
    <>
    <div className="overflow-hidden bg-white dark:bg-black w-full border-t-2 h-fit">
        <div className="mx-auto max-w-[88rem] min-h-screen px-6 lg:px-8  mb-5">
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{duration: 1}}
            className={`divide-y divide-gray-200 shadow-2xl rounded-lg bg-slate-300/40 border-2 border-indigo-600 dark:bg-indigo-500/30 w-full mt-5 max-w-[80%] my-auto mx-auto`}>
                <div className="px-4 py-5 sm:p-6">
                    <div className="flex flex-col">
                        <div className="flex flex-col sm:flex-row">
                            <div className="flex-grow relative">
                                <div className="flex items-center w-full">
                                    <DocumentChartBarIcon className="h-6 inline-block align-baseline"/>
                                    <h2 className="text-2xl font-medium leading-6 text-gray-900 dark:text-white relative inline align-baseline">Reports</h2>
                                </div>
                                <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
                                    <p>Configure reports to be sent to your parents or guardians</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full border mt-3 mb-6 border-indigo-600/70"></div>
                    <div className="grid grid-cols-2">
                    <Title className="mb-3">Settings</Title>
                    <div className="mb-5 py-4 px-4 relative border-2 border-indigo-500  dark:border-cyan-500 bg-indigo-200/50 col-start-1 col-span-2 mx-auto w-[45%] rounded-md shadow-md">
                        Your unique ID: <p className="font-bold inline-block align-middle">{user!.id}</p>
                        <Subtitle>This ID is used for pairing parents/guardians with your account.</Subtitle>
                        {navigator.clipboard && <Button onClick={()=>{
                            addAlert("success", "Copied to clipboard")
                            navigator.clipboard.writeText(user!.id)
                        }} className="float-right" icon={ClipboardDocumentIcon}></Button>}
                    </div>
                    {user!.publicMetadata.role=='parent' && (
                    settings.map((setting)=>
                        {
                            return (
                        <div className="mb-5 py-4 px-4 relative border-2 border-indigo-500  dark:border-cyan-500 bg-indigo-200/50 col-start-1 col-span-2 mx-auto w-[45%] rounded-md shadow-md">
                            <setting.icon className={`absolute w-6 h-6 right-3 top-3 ${setting.icon_color}`}/>
                            <p className="align-baseline inline-block">{setting.name}</p>
                            <Subtitle className="align-baseline">{setting.description}</Subtitle>
                            {/* @ts-ignore */}
                            <Select onValueChange={(val)=>setting.onChange(val)} value={setting.value} enableClear={false} className="disabled:bg-gray-300/20 shadow-md rounded-lg cursor-not-allowed max-w-[15rem] mr-auto my-2 mx-auto ">
                                {setting.options}
                            </Select>
                        </div>)}
                    )
                    
                    )}
                    {user!.publicMetadata.role=='parent' && 
                    <div className="mb-5 py-4 px-4 relative border-2 border-indigo-500  dark:border-cyan-500 bg-indigo-200/50 col-start-1 col-span-2 mx-auto w-[45%] rounded-md shadow-md">
                            <Cog8ToothIcon className={`absolute w-6 h-6 right-3 top-3`}/>
                            <p className="align-baseline inline-block">Contact Details</p>
                            <TextInput required error={!isEmailValid} type="email" placeholder="max@mustermann.com" value={email} onValueChange={(val : string)=>setEmail(val)} className={`disabled:bg-gray-300/20 shadow-md rounded-lg cursor-not-allowed max-w-[20rem] mr-auto my-2 mx-auto ${isEmailValid ? "border-2 !border-green-400" : ""}`}/>
                    </div>
                    }
                    {user!.publicMetadata.role == 'parent' && (
                    <div className="col-span-2 w-56 mx-auto">
                        <Button disabled={!isEmailValid} loading={isLoading} onClick={async(e)=>{
                            setIsLoading(true)
                            const metaupdate = await fetch('/api/user/metadata', {method: 'PUT', headers: {"Content-Type": "application/json"},
                            body : JSON.stringify(
                                {
                                    pub: {
                                        reports: {
                                            language: language,
                                            currency: currency,
                                            email: email
                                        },
                                }}
                            )})
                            if (metaupdate.status === 200){
                                addAlert("success", "Successfully saved changes", 2000)
                            }
                            else {
                                addAlert("error", "Failed to save changes", 2000)
                            }
                            setIsLoading(false)
                            }} className="w-full">Save Changes</Button>
                    </div>
                    )}
                    
                    </div>

                </div>
            </motion.div>
        </div>
    </div>
    </>
    )
}