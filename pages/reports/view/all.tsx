import { Button } from "@tremor/react";
import { useRouter } from "next/router";

export default function Manage() {
    const router = useRouter()

    return (
        <div className="min-h-screen h-12 flex justify-center align-middle">
            <div className="w-[80%] relative mx-auto my-auto bottom-0 h-[70%] rounded-md border border-indigo-300 bg-white">
                <div className="">
                    <p className="text-center mx-auto text-2xl pt-2"><b>View all reports</b></p>

                </div>
                <Button onClick={()=>{router.push("/reports/manage")}} className="right-0 h-12 top-0 bottom-0 mx-3 my-3 absolute">Manage linked accounts</Button>
            </div>
        </div>
    )
}