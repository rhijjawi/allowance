import { Content } from "@/components/Common";
import { Button, Card, Title } from "@tremor/react";

export default function Page(){
    return (<Content>
        <Card className="min-h-[fit]">
            <Title>Cryptocurrencies</Title>
            <div className="w-full">
                <Button className="mx-auto w-fit block">MetaMask</Button>
            </div>
        </Card>
    </Content>)
}
