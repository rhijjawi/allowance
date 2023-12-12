import { useAuth, useUser } from "@clerk/nextjs"
import {getSupabase} from "@/utils/supabase"
import { get } from "http"
import { useAlerts } from "@/components/contexts/alertHandler"
import { useEffect, useState } from "react"
import { Button } from "@tremor/react"
import { PlusCircleIcon } from "@heroicons/react/24/outline"

export default function Manage(){
    const {user, isLoaded, isSignedIn} = useUser()
    const {getToken} = useAuth()
    const {addAlert} = useAlerts()
    const [data, setData] = useState<null|{}>(null)
    const [childAccounts, setChildAccounts] = useState<string[]>([])
    useEffect(() => {
        if (!isLoaded){return}
        getToken({template: "supabase"}).then((token) => {return getSupabase(token)}).then((supabase)=>{return supabase.from('reports').select('*').eq('parent_id', user?.id)}).then(({data, error}) => {
            if (error){
                addAlert("error", error.message, 5000)
            }
            if (data!.length === 0){
                addAlert("error", "No reports found", 5000)
            }
            setChildAccounts(data![0]['child_accounts'])
            setData(data![0])
            return
        });
    }, [isLoaded])
    if (!isLoaded) return (<div>Loading...</div>)
    if (!isSignedIn) return (<div>Not signed in</div>)
    return (
        <div className="min-h-screen relative h-12 flex flex-1 justify-center align-middle">
            <div className="relative rounded-md border-2 border-indigo-500 max-w-2xl w-[80%] h-80 right-0 left-0 top-0 bottom-0 my-auto mx-auto">
                <div className="w-full h-full bg-white rounded-md">
                    <div className="w-full h-fit flex flex-col justify-start items-center pt-5">
                        <p className="text-2xl font-semibold text-black">Manage</p>
                    </div>
                    <div className="w-full h-full flex flex-col justify-start items-center pt-5">
                        <p className="text-2xl font-semibold text-black">Linked Accounts</p>
                        <div className="mx-2 my-3">
                            {childAccounts?.map((childAccount) => {
                                return (
                                    <div className=" select-none rounded-md  border border-indigo-300">
                                        <Button tooltip="Remove linked account" onClick={()=>{
                                            let c = confirm("Click OK to remove this account. The account will be removed from your linked accounts and you will no longer be able to see their reports. You can always request to add them back later.\n")
                                            if(c){
                                                setChildAccounts(childAccounts.filter((account) => {return account !== childAccount}))
                                            }
                                            }}><p className="text-lg font-semibold text-white">{childAccount}</p></Button>
                                    </div>
                                )
                            })}

                        </div>
                        <Button icon={PlusCircleIcon} tooltip="Link account" className="relative text-white items-center right-0 left-0 mx-auto w-[20%]" onClick={()=>{
                            prompt("Enter the")
                        }}></Button>
                            
                    </div>  
                </div>
            </div>
        </div>
    )
}