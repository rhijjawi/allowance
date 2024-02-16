import { getAuth } from "@clerk/nextjs/server";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button, Card, Icon, Title } from "@tremor/react";
import axios from "axios";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { SignedOutAuthObject } from "@clerk/nextjs/server";
import reportFail from "@/utils/functions/discord";
import { useEffect } from "react";
import { ErrorBoundary } from "@sentry/nextjs";

export const getServerSideProps : GetServerSideProps = async (context: GetServerSidePropsContext) => {
    let data, error;
    const user = getAuth(context.req);
    console.log(user)
    if (!((user as SignedOutAuthObject)?.userId)) {
        return {
            redirect: {
              permanent: true,
              destination: `/sign-in?afterlogin=${context.resolvedUrl}`,
            },
            props:{},
        };
    }
    if ((user?.sessionClaims?.metadata as {role : string}).role !== "parent"){
        return {
            redirect : {
                permanent : true,
                destination: `/`
            },
            props : {}
        }
    }
    try {
        const res = await axios.post(
            process.env.NODE_ENV == "development" ? "http://expenses.ramzihijjawi.me:3000/api/reports" : "https://logmoney.app/api/reports", {userId : user.userId});
      if (res.status == 200){
        data = res.data.data
        }
      else {
        return {
            redirect : {
                permanent : true,
                destination: `/`
            },
            props : {}
        }
      }
    } catch (e : unknown) {
        console.log(e)
        data = [];
    }
    return { props: { reports: data } };
  };

export default function Manage({ reports, error } : {reports : {childFor : string, uuid : string, date_range? : [number, number]}[], error? : string}) {
    const router = useRouter()
    let dateFormatter = new Intl.DateTimeFormat("en", {dateStyle : 'long'})
    useEffect(()=>{
        if (typeof navigator === "undefined"){
        }
        else {
            dateFormatter = new Intl.DateTimeFormat(navigator.languages[0], {dateStyle : 'long'})
        }
    }, [typeof navigator])
    useEffect(()=>{console.log(reports)},[reports])
    return (
        <div className="h-fit w-full overflow-hidden border-t-2 bg-white dark:bg-black">
            <div className="mx-auto mb-5 min-h-screen max-w-[88rem] px-6 lg:px-8">
            <Card className={`mx-auto  my-auto mt-5 w-full max-w-[80%] divide-gray-200 rounded-lg border-2 shadow-2xl `}>
                <Title>All Reports</Title>
                {reports ? <div className={`grid grid-cols-1 grid-rows-[${reports.length}] h-fit divide-y-5 divide-white/100 dark:divide-white/80`}>
                {reports.length > 0 ? reports.map((report : {childFor : string, uuid : string, date_range? : [number, number]}, index : number)=>{
                    return (
                        <>
                            <div key={index} className="px-1 py-2 relative bg-slate-100 rounded-md">
                                <p className="text-lg align-middle">Report {report.uuid}</p>
                                {report.date_range && <p className="h-fit">Data from {dateFormatter.format(new Date(report.date_range[0]))} to {dateFormatter.format(new Date(report.date_range[1]))}</p>}
                                <button className="absolute mr-3 top-0 right-0 bottom-0 my-auto h-fit justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2" onClick={()=>router.push(`/report/${report.uuid}`)}>View Report</button>
                            </div>
                            
                        </>
                    )
                }) : <p className="text-center mt-5 text-red-400">No Reports to display</p>}
                </div> : <></>}
            </Card>
            </div>
        </div>
        )
}