import { getSupabase } from "@/utils/supabase";
import { useAuth } from "@clerk/nextjs";
import { PlusIcon, ReceiptPercentIcon } from "@heroicons/react/24/outline";
import { Spinner } from "@nextui-org/react";
import { Title } from "@tremor/react";
import { useEffect, useState } from "react";

export default function SavedForLater(){
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any[]>([])
    const {getToken} = useAuth()
    useEffect(()=>{
        async function a(){
            const supabase = await getSupabase(await getToken({template : "supabase"}))
            const {data, error} = await supabase.from("unassigned").select("*")
            if (data){
                setLoading(false)
                setData(data)
            }
        }
        a();
    }, [])
    if (loading){
        return (
            <div className="h-12 relative border-dotted border rounded-md">
                <Spinner className="absolute right-0 left-0 top-0 bottom-0 mx-auto my-auto"/>
            </div>
        )
    }
    return (<>
    <div className="h-fit p-2 border-1 w-fit absolute right-5 top-5 rounded-md cursor-pointer hover:bg-slate-200/50"><PlusIcon className="h-8 inline-block translate-x-1"/><ReceiptPercentIcon className="h-8 inline-block"/></div>
    <div className="flex flex-row gap-y-2 justify-evenly flex-wrap align-middle">
        {data.map((item, index)=>{
            return (
            <div className="rounded-md justify-evenly p-2 border flex flex-grow flex-col max-w-[20rem] h-fit" key={`${index}_UA`}>
                <div className="h-fit">
                    <img className="rounded-sm h-auto max-w-full w-full" src={item.images[0]} />
                </div>
                {item.label && <Title className="text-center">{item.label.toUpperCase()}</Title>}
                <p className="text-center">Added on: {new Date(item.created_at).toDateString()}</p>
            </div>
            )
        })}
    </div>
    </>)
}