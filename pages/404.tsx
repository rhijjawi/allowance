"use client";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";


export const getStaticProps: GetStaticProps<any> = () => {
    return { props: {} };
};
export default function FourOhFour(){
    const router = useRouter();
    return (
        <div>
            <h1>404</h1>
            <p>Page not found : {router.asPath}/{router.pathname}</p>
        </div>
    )
}