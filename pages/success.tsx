'use client'
import { Card, Grid, Title, Text } from "@tremor/react"
import { useRouter } from "next/router"
import { useEffect } from "react"
export default function Success(){
    const {session_id} = useRouter().query
    const router = useRouter()
    useEffect(() => {
        setTimeout(() => {
            router.push('/reports/manage')
        }, 5000);
    },[])
    return (
        <div className="min-h-screen md:px-24 pt-12 -z-[100] bg-dark-tremor-background-muted/75">
        <Card className="w-full gap-y-5 flex-1">
            <Title className="h mx-auto text-4xl leading-7">Success!</Title>
            <Text className="text-black select-none mt-3">Your transaction was successful. You will be redirected shortly.</Text>
            <Text className="text-black select-none mt-3">If you are not redirected, please click <b><a className="cursor-pointer" onClick={()=>{router.push('/')}}>here</a></b>.</Text>
            <Text className="text-black select-none mt-3">If you have any questions or concerns, please contact us via the <b><a className="cursor-pointer" onClick={()=>{window.open(`mailto:${atob('c3VwcG9ydEBsb2dtb25leS5hcHA=')}`, "_blank")}}>Contact Us</a></b> page.</Text>
        </Card>
    </div>   
        )
}