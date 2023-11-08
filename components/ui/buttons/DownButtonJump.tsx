import { ArrowDownIcon } from "@heroicons/react/24/outline"
import { useEffect, useState } from "react"

export default function CircleJumpingButton(){
    const [visiblity, setVisiblity] = useState(true)

    function changeVis(){
        console.log(window.scrollY, document.getElementById('cta-box')?.getBoundingClientRect()!.y!, window.scrollY < document.getElementById('cta-box')?.getBoundingClientRect()!.y!)
        console.log(window.scrollY, document.getElementById('cta-box')?.getClientRects()[0]!.y!, window.scrollY < document.getElementById('cta-box')?.getClientRects()[0]!.y!, document.getElementById('cta-box')?.getClientRects()[0]!.y!-window.scrollY)
        if (document.getElementById('cta-box')?.getClientRects()[0]!.y!-window.scrollY > 500){
            setVisiblity(true)
        }
        else{
            setVisiblity(false)
        }
    }
    useEffect(() => {
        window.addEventListener("scroll", changeVis);
        return () => {
            window.removeEventListener("scroll", changeVis);
        };
    }, []);
    
    const scrolltoBottom = () => {
        window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})
        setVisiblity(false)
    }
    return (
        <>
            {visiblity && <div onClick={()=>{scrolltoBottom()}} className="w-12 h-12 z-[100] bg-white rounded-full border border-indigo-40/30 fixed bottom-0 left-0 right-0 mx-auto mb-10 cursor-pointer">
                <ArrowDownIcon className="w-6 animate-bounce text-indigo-500 h-6 mx-auto my-auto bottom-0 top-0 right-0 left-0 absolute" />
            </div>}
        </>
    )
}