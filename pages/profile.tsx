import { useUser } from "@auth0/nextjs-auth0/client";
import { ReactElement, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
function Card(props : any, {...rest}){
    console.log(rest, props.children)
    return(
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow w-full">
    <div className="px-4 py-5 sm:px-6 text-lg">
      {props.header}
    </div>
    <div className=" py-5 sm:py-6">{props.children}</div>
    <div className="px-4 py-4 sm:px-6">
      {props.footer}
    </div>
  </div>)
}
export default function Profile() {
    const {user,error, isLoading} = useUser()
    
    return (<>
    <Card header={<h1>Profile</h1>} footer={<span className="text-stone-500">Change your profile picture on <a target="_blank" className="text-[rgb(29,79,196)]" href={'https://gravatar.com/'}>Gravatar</a><br/>If you're running into any issues, feel free to contact us at: <a className="text-blue-300 underline" href={`mailto:expenses@ramzihijjawi.me`}>expenses@ramzihijjawi.me</a></span>}>
        <div className="w-24 h-24 right-0 left-0 mx-auto">
        <div className="relative z-10 text-center inline-flex h-full aspect-square items-center justify-center rounded-full bg-gray-500">
            <span className="relative text-center inline-flex h-full aspect-square items-center justify-center rounded-lg bg-gray-500 overflow-hidden">
                {user?.picture ? <Image alt={""} src={user.picture} width={1000} height={1000}></Image> : <span className="text-md font-medium leading-none text-white">{user?.name?.split(' ').map((i)=>{return i[0]+""})}</span>}
            </span>
        </div>
        </div>
        <div className="relative w-full right-0 h-12 block">
            <div className="w-fit right-0 absolute left-0 mx-auto">
                <p className="text-xl">Hi, <b>{user?.name}</b></p>
            </div>
        </div>
    </Card>
    </>)
}