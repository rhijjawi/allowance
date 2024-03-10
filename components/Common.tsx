import { ComponentPropsWithRef, PropsWithChildren } from "react";

export function Content({children} : {children : JSX.Element|JSX.Element[]}){
    return (
        <>
        <main className="bg-dark-tremor-background-muted/75 min-h-screen p-12">
            {children}
        </main>
        </>
    )
}