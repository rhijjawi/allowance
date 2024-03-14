import { Spinner } from '@nextui-org/react'
import { ComponentPropsWithRef, PropsWithChildren } from 'react'

export function Content({
    children,
}: {
    children: JSX.Element | JSX.Element[]
}) {
    return (
        <>
            <main className="bg-dark-tremor-background-muted/75 min-h-screen h-screen relative p-12">
                {children}
            </main>
        </>
    )
}

export function Loader() {
    return (
        <Content>
            <div className="h-24 w-24 absolute top-0 bottom-0 right-0 left-0 mx-auto my-auto">
                <Spinner className="relative" size="lg" />
            </div>
        </Content>
    )
}
