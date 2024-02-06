import { Button, Card, Title } from "@tremor/react";
import { useRouter } from "next/router";

export default function Manage() {
    const router = useRouter()

    return (
        <div className="h-fit w-full overflow-hidden border-t-2 bg-white dark:bg-black">
            <div className="mx-auto mb-5 min-h-screen max-w-[88rem] px-6  lg:px-8">
            <Card className={`mx-auto  my-auto mt-5 w-full max-w-[80%] divide-y divide-gray-200 rounded-lg border-2 shadow-2xl `}>
                <Title>All Reports</Title>
                
            </Card>
            </div>
        </div>
    )
}