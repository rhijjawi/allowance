import { getAuth } from "@clerk/nextjs/server";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button, Card, Icon, Title } from "@tremor/react";
import axios from "axios";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

export const getServerSideProps : GetServerSideProps = async (context: GetServerSidePropsContext) => {
    let data;
    const user = getAuth(context.req);
    if ((user?.sessionClaims?.metadata as {role : string}).role !== "parent"){
        return {
            redirect : {
                permanent : true,
                destination: `/`
            }
        }
    }
    if (!user.userId) {
        return {
            redirect: {
              permanent: false,
              destination: `/sign-in?afterlogin=${context.resolvedUrl}`,
            },
            props:{},
        };
    }
    try {
      const res = await axios.post(
        process.env.NODE_ENV == "development" ? "http://expenses.ramzihijjawi.me:3000/api/reports" : "https://logmoney.app/api/reports"
      , {userId : user.userId});
      data = res.data.data
    } catch (e) {
        data = [];
    }
    return { props: { reports: data } };
    //[Number(new Date()), Number(new Date((new Date()).setMonth((new Date()).getMonth() - 1)))].reverse()
  };

export default function Manage({ reports } : {reports : {childFor : string, uuid : string, date_range? : [number, number]}[]}) {
    const router = useRouter()
    const dateFormatter = new Intl.DateTimeFormat(navigator.languages[0], {dateStyle : 'long'})
    return (
        <div className="h-fit w-full overflow-hidden border-t-2 bg-white dark:bg-black">
            <div className="mx-auto mb-5 min-h-screen max-w-[88rem] px-6 lg:px-8">
            <Card className={`mx-auto  my-auto mt-5 w-full max-w-[80%] divide-gray-200 rounded-lg border-2 shadow-2xl `}>
                <Title>All Reports</Title>
                <div className={`grid grid-cols-1 grid-rows-[${reports.length}] h-fit divide-y-5 divide-white/100 dark:divide-white/80`}>
                {reports.length > 0 ? reports.map((report : {childFor : string, uuid : string, date_range? : [number, number]}, index : number)=>{
                    return (
                        <>
                            <div className="px-1 py-2 relative bg-slate-100 rounded-md">
                                <p className="text-lg align-middle">Report {report.uuid}</p>
                                {report.date_range && <p className="h-fit">Data from {dateFormatter.format(new Date(report.date_range[0]))} to {dateFormatter.format(new Date(report.date_range[1]))}</p>}
                                <button className="absolute mr-3 top-0 right-0 bottom-0 my-auto h-fit justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2" onClick={()=>router.push(`/report/${report.uuid}`)}>View Report</button>
                            </div>
                            
                        </>
                    )
                }) : <p className="text-center mt-5 text-red-400">No Reports to display</p>}
                </div>
            </Card>
            </div>
        </div>
    )
}