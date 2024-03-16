import { getAuth } from '@clerk/nextjs/server'
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/20/solid'
import { Button, Card, Icon, Title } from '@tremor/react'
import axios from 'axios'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import { SignedOutAuthObject } from '@clerk/nextjs/server'
import reportFail from '@/utils/functions/discord'
import { useEffect, useState } from 'react'
import { ErrorBoundary } from '@sentry/nextjs'
import { useUser } from '@clerk/nextjs'
import { useAlerts } from '@/components/contexts/alertHandler'

// export const getServerSideProps : GetServerSideProps = async (context: GetServerSidePropsContext) => {
//     let data, error;
//     const user = getAuth(context.req);
//     console.log(user)
//     if (!((user as SignedOutAuthObject)?.userId)) {
//         return {
//             redirect: {
//               permanent: true,
//               destination: `/sign-in?redirect_url=${context.resolvedUrl}`,
//             },
//             props:{},
//         };
//     }
//     if ((user?.sessionClaims?.metadata as {role : string}).role !== "parent"){
//         return {
//             redirect : {
//                 permanent : true,
//                 destination: `/`
//             },
//             props : {}
//         }
//     }
//     try {
//         const res = await axios.post(
//             process.env.NODE_ENV == "development" ? "http://expenses.ramzihijjawi.me:3000/api/reports" : "https://logmoney.app/api/reports", {userId : user.userId});
//       if (res.status == 200){
//         data = res.data.data
//         }
//       else {
//         return {
//             redirect : {
//                 permanent : true,
//                 destination: `/`
//             },
//             props : {}
//         }
//       }
//     } catch (e : unknown) {
//         console.log(e)
//         data = [];
//     }
//     return { props: { reports: data } };
//   };

export default function Manage() {
    const router = useRouter()
    let dateFormatter = new Intl.DateTimeFormat('en', { dateStyle: 'long' })
    const { user, isLoaded, isSignedIn } = useUser()
    const [pages, setPages] = useState(0)
    const [page, setPage] = useState(0)
    const [reports, setReports] = useState<
        | { childFor: string; uuid: string; date_range?: [number, number] }[]
        | null
    >(null)
    const { addAlert } = useAlerts()
    useEffect(() => {
        async function _() {
            let res
            try {
                res = await axios.post(
                    process.env.NODE_ENV == 'development'
                        ? 'http://expenses.ramzihijjawi.me:3000/api/reports?page=' +
                              page
                        : 'https://logmoney.app/api/reports?page=' + page
                )
            } catch (e) {
                setReports([])
                return null
            }
            if (res.status == 200) {
                setReports(res.data.data)
                setPages(Math.ceil(res.data.count / res.data.perpage))
            } else {
                addAlert(
                    'error',
                    'Something terrible happened! Please try again'
                )
            }
        }
        _()
    }, [page])
    useEffect(() => {
        if (typeof navigator === 'undefined') {
        } else {
            dateFormatter = new Intl.DateTimeFormat(navigator.languages[0], {
                dateStyle: 'long',
            })
        }
    }, [typeof navigator])

    return (
        <div className="h-fit w-full overflow-hidden border-t-2 bg-white dark:bg-dark-tremor-background-muted/75">
            <div className="mx-auto mb-5 min-h-screen max-w-[88rem] px-6 lg:px-8">
                <Card
                    className={`mx-auto  my-auto mt-5 w-full max-w-[80%] divide-gray-200 rounded-lg border-2 shadow-2xl `}
                >
                    <Title>All Reports</Title>
                    {reports ? (
                        <div
                            className={`h-fit my-5 grid grid-cols-1 auto-rows-fr`}
                        >
                            {reports.length > 0 ? (
                                <>
                                    {reports.map(
                                        (
                                            report: {
                                                childFor: string
                                                uuid: string
                                                date_range?: [number, number]
                                            },
                                            index: number
                                        ) => {
                                            return (
                                                <>
                                                    <div
                                                        key={index}
                                                        className="px-1 h-fit py-2 mb-3 relative bg-slate-100/30  dark:bg-gray-700 border-black/70 border-2 rounded-md"
                                                    >
                                                        <p className="text-lg ml-2 align-middle">
                                                            Report {report.uuid}
                                                        </p>
                                                        {report.date_range && (
                                                            <p className="h-fit ml-2">
                                                                Data from{' '}
                                                                {dateFormatter.format(
                                                                    new Date(
                                                                        report.date_range[0]
                                                                    )
                                                                )}{' '}
                                                                to{' '}
                                                                {dateFormatter.format(
                                                                    new Date(
                                                                        report.date_range[1]
                                                                    )
                                                                )}
                                                            </p>
                                                        )}
                                                        <button
                                                            className="absolute border-2 dark:border-green-400 mr-3 top-0 right-0 bottom-0 my-auto h-fit justify-center rounded-md border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                                                            onClick={() =>
                                                                router.push(
                                                                    `/report/${report.uuid}`
                                                                )
                                                            }
                                                        >
                                                            View Report
                                                        </button>
                                                    </div>
                                                </>
                                            )
                                        }
                                    )}
                                    {new Array(5 - reports.length)
                                        .fill(null)
                                        .map((item, index) => (
                                            <>
                                                <div
                                                    className="px-1 py-2 mb-3 relative bg-slate-100/30 max-h-[200px]  dark:bg-gray-700 border-black/70 border border-dashed rounded-md"
                                                    key={index + reports.length}
                                                ></div>
                                            </>
                                        ))}
                                </>
                            ) : (
                                <></>
                            )}
                        </div>
                    ) : (
                        <></>
                    )}
                    <div className="mx-auto w-36 relative h-6">
                        {pages > 0 && page > 0 && (
                            <ArrowLeftIcon
                                onClick={() => {
                                    setPage((pg) => pg - 1)
                                }}
                                className="left-0 h-6 inline cursor-pointer"
                            />
                        )}
                        <div className="w-fit mx-auto select-none inline-block absolute right-0 left-0">
                            <span className="mr-1">Page</span>
                            <span className="mr-1">{page + 1}</span>
                            <span className="mr-2">of</span>
                            <span>{pages}</span>
                        </div>
                        {pages > 0 && page + 1 < pages && (
                            <ArrowRightIcon
                                onClick={() => {
                                    setPage((pg) => pg + 1)
                                }}
                                className="h-6 absolute right-0  inline cursor-pointer"
                            />
                        )}
                    </div>
                </Card>
            </div>
        </div>
    )
}
