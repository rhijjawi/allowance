'use client'
import {
    Card,
    Title,
    LineChart,
    Button,
    BarChart,
    Grid,
    Col,
    Color,
    ProgressCircle,
    Metric,
    ProgressBar,
    Subtitle,
    Text,
} from '@tremor/react'
import { PencilIcon } from '@heroicons/react/24/outline'
import { useUser, useAuth, useSignIn } from '@clerk/nextjs'
import { getSupabase } from '../../utils/supabase'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAlerts } from '@/components/contexts/alertHandler'
import {
    currFormatter,
    standardizeCurrency,
    NumToMonth,
    MonthToNum,
    standardizeCurrencyGeneral,
} from '@/utils/functions/valueFormatters'
import { ExpenseType, useExpenses } from '@/components/contexts/expenseCTX'
import { getColor } from '@/components/static/categories'
import { CategorySchema, IncomeSchema } from '@/types/supabase'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { isMobile } from 'react-device-detect'
import { MonthExpenses } from '@/utils/functions/filterData'
import { BudgetStatus, BudgetMath } from '@/utils/functions/math'
import { SavingsModal } from '@/components/forms/savingsDialogue'
import EmergencyFundModal from '@/components/forms/EmergencyFund'
import { useSession } from '@clerk/nextjs'
import { Content, Loader } from '@/components/Common'

const cardVariants = {
    animate: { opacity: 1 },
    initial: { opacity: 0 },
}

const CustomCard = motion(Card, { forwardMotionProps: true })
const CustomBarChart = motion(BarChart, { forwardMotionProps: true })
export default function Expenditure() {
    const { user, isLoaded, isSignedIn } = useUser()
    const [checked, setChecked] = useState(false)
    const [misc, setMisc] = useState<any>(null)
    const { expenseData, categoryData, loading } = useExpenses()
    const [chartData, setChartData] = useState<any>([])
    const [presentCategories, setPresentCategories] = useState<any>([])
    const [percentage, setPercentage] = useState<[number, number]>([0, 0])
    const [hideRent, setHideRent] = useState<boolean>(false)
    const [isSavingsOpen, setIsSavingsOpen] = useState<boolean>(false)
    const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false)
    const [sum, setSum] = useState<number>(0)
    const router = useRouter()
    const { addAlert } = useAlerts()
    useEffect(() => {}, [misc])
    useEffect(() => {
        if (expenseData.length > 0) {
            setSum(0)
            
            MonthExpenses(expenseData, new Date()).forEach((exp: ExpenseType) =>
                setSum((...prev) => prev[0] + exp.standardizedCurrency!)
            )
        }
    }, [expenseData])
    useEffect(() => {
        async function a() {
            await router.push('/')
        }
        if (
            (isLoaded && !isSignedIn) ||
            (isSignedIn && user.publicMetadata.role !== 'student')
        ) {
            a()
        }
        return () => {}
    }, [isLoaded])
    useEffect(() => {
        let active = true
        if (misc == null) {
            fetch('/api/user/misc').then((res) => {
                if (res.status == 200) {
                    res.json().then((data) => {
                        if (active) {
                            setMisc(data)
                        }
                    })
                }
            })
        }
    }, [isLoaded])
    useEffect(() => {
        let active = true
        let categoryList: any = {}
        let expenseList: any = {}
        let data: any = []
        if (categoryData == null || expenseData == null) return
        categoryData.forEach((e: any) => {
            categoryList[e.id] = e.category
        })
        const thisMonth = expenseData.filter((e: ExpenseType) => {
            if (e.recurring) {
                let recurranceDate: Date = new Date(
                    Date.parse(String(e.transaction_date))
                )
                console.log(
                    e.label,
                    recurranceDate.getDate(),
                    new Date().getDate(),
                    recurranceDate.getDate() <= new Date().getDate()
                )
                return recurranceDate.getDate() <= new Date().getDate()
            }
            return (
                Date.parse(String(e.transaction_date)) > new Date().setDate(1)
            )
        })
        thisMonth.forEach(async (i) => {
            let category = categoryData.find((element: any) => {
                return element.id === i.category[0]
            })!.category
            expenseList[
                `${NumToMonth(new Date().getUTCMonth())} ${new Date().getUTCFullYear()}`
            ]
                ? {}
                : (expenseList[
                      `${NumToMonth(new Date().getUTCMonth())} ${new Date().getUTCFullYear()}`
                  ] = {})
            expenseList[
                `${NumToMonth(new Date().getUTCMonth())} ${new Date().getUTCFullYear()}`
            ][category]
                ? (expenseList[
                      `${NumToMonth(new Date().getUTCMonth())} ${new Date().getUTCFullYear()}`
                  ][category] += await standardizeCurrency(
                      i,
                      user!.publicMetadata?.currency as string
                  ))
                : (expenseList[
                      `${NumToMonth(new Date().getUTCMonth())} ${new Date().getUTCFullYear()}`
                  ][category] = await standardizeCurrency(
                      i,
                      user!.publicMetadata.currency as string
                  ))
        })

        Object.keys(expenseList).forEach((i) => {
            let _data = expenseList[i]
            _data.month = i
            data.push(_data)
        })
        if (data.length > 0) {
            if (active) {
                data = data.sort(
                    (a: any, b: any) =>
                        Date.parse(a.transaction_date) -
                        Date.parse(b.transaction_date)
                )
                setChartData(data)
            }
            return () => {
                active = false
            }
        }
    }, [expenseData, categoryData])
    useEffect(() => {
        if (misc == null) {
            return
        }
        async function a() {
            setPercentage([0, 0])
            const budgetMath = await BudgetMath(
                sum,
                user?.publicMetadata.currency as string,
                misc.budget
            )
            setPercentage(budgetMath)
        }
        a()
    }, [sum])
    if (!isLoaded || loading || misc == null) return <Loader />
    return (
        <Content>
            {/* <Card className="relative h-16">
        <div className="absolute left-0 right-0 top-[50%] z-0 m-auto ml-5 w-fit -translate-y-[50%] text-left">
          <Button size="md" className="h-full">
            <PlusCircleIcon className="inline h-6 w-6" />
            <span> Quick Add</span>
          </Button>
        </div>
        <div className="absolute left-0 right-0 top-[50%] z-0 m-auto mr-5 w-fit -translate-y-[50%] text-right">
          <Button size="md" className="h-full">
            <InformationCircleIcon className="inline h-6 w-6 " />
            <span> Read more</span>
          </Button>
        </div>
      </Card> */}
            <Grid
                numItemsMd={3}
                numItemsLg={3}
                numItemsSm={1}
                className="sm:my-5 md:my-5 lg:my-3 w-full gap-x-5 gap-y-0"
            >
                <CustomCard
                    variants={cardVariants}
                    className="min-h-[200px]"
                    animate={!loading ? 'animate' : 'initial'}
                >
                    <Title>Budget Status</Title>
                    {misc.budget[0] == 0 ? (
                        <>
                            <div className="">
                                <p className="text-xl">
                                    Please{' '}
                                    <Link
                                        className="font-bold"
                                        href="/profile/manage"
                                    >
                                        set
                                    </Link>{' '}
                                    a budget
                                </p>
                            </div>
                        </>
                    ) : (
                        <ProgressCircle
                            showAnimation
                            tooltip={`${BudgetStatus(percentage[0])[1]} - ${currFormatter(percentage[1], misc.budget[1])}/${currFormatter(misc.budget[0], misc.budget[1])}`}
                            className="py-5"
                            size="lg"
                            color={BudgetStatus(percentage[0])[0]}
                            value={percentage[0]}
                        />
                    )}
                    {misc.budget[0] !== 0 ? (
                        <Subtitle className={`dark: text-center`}>
                            You have spent <b>{percentage[0].toFixed(2)}</b>% of
                            your budget
                        </Subtitle>
                    ) : null}
                </CustomCard>
                <CustomCard
                    className="relative max-md:h-[200px]"
                    variants={cardVariants}
                    animate={!loading ? 'animate' : 'initial'}
                    transition={{ delay: 3 }}
                >
                    <Title color="green" className="mb-2">
                        Savings Account
                    </Title>
                    {misc.savings[1] == 0 ? (
                        <div className="relative my-auto">
                            <Text className="mx-auto w-fit px-4">
                                To manage your savings, you'll need to set a
                                goal first.
                            </Text>
                        </div>
                    ) : null}
                    <div className="relative bottom-0 mx-auto my-auto">
                        {misc.savings[1] == 0 ? null : (
                            <>
                                <div className=" mx-auto my-2 w-fit rounded-md">
                                    <p className="text-center text-3xl font-semibold">
                                        {currFormatter(
                                            misc.savings[0],
                                            misc.savings[2] as string
                                        )}{' '}
                                        saved
                                    </p>
                                    <ProgressBar
                                        tooltip={`${(misc.savings[0] / misc.savings[1]) * 100}%`}
                                        className=" h-full rounded-md"
                                        value={
                                            (misc.savings[0] /
                                                misc.savings[1]) *
                                            100
                                        }
                                    />
                                </div>
                                <p className="w-full text-center text-3xl font-semibold">
                                    <span className="text-green-400">
                                        {currFormatter(
                                            misc.savings[1],
                                            misc.savings[2] as string
                                        )}
                                    </span>{' '}
                                    goal
                                </p>
                            </>
                        )}
                    </div>
                    <Button
                        className="absolute bottom-0 right-0 float-right mb-3 mr-3 md:mb-5 md:mr-5"
                        iconPosition="right"
                        onClick={() => setIsSavingsOpen(true)}
                        icon={PencilIcon}
                    >
                        Edit
                    </Button>
                    <SavingsModal
                        isOpen={isSavingsOpen}
                        setIsOpen={setIsSavingsOpen}
                        misc={misc}
                        setMisc={setMisc}
                    />
                </CustomCard>
                <CustomCard
                    className="relative max-md:h-[200px]"
                    variants={cardVariants}
                >
                    <Title color="red" className="mb-2">
                        Emergency Fund
                    </Title>
                    <p className="text-left text-2xl font-semibold">
                        {currFormatter(misc.emergency[0], misc.emergency[2])} in
                        cash
                    </p>
                    <p className="text-left text-2xl font-semibold">
                        {currFormatter(misc.emergency[1], misc.emergency[2])} in
                        bank account
                    </p>
                    <EmergencyFundModal
                        misc={misc}
                        setMisc={setMisc}
                        isOpen={isEmergencyOpen}
                        setIsOpen={setIsEmergencyOpen}
                    />
                    {misc.emergency[0] + misc.emergency[1] > 0 && (
                        <Metric className="absolute bottom-0 left-0 m-5">
                            {currFormatter(
                                misc.emergency[0] + misc.emergency[1],
                                misc.emergency[2] as string
                            )}
                        </Metric>
                    )}
                    <Button
                        className="absolute bottom-0 right-0 mb-5 mr-5"
                        iconPosition="left"
                        onClick={() => {
                            setIsEmergencyOpen(true)
                        }}
                        icon={PencilIcon}
                    >
                        Edit
                    </Button>
                </CustomCard>
            </Grid>
            <Card className="relative h-full max-md:h-fit">
                {
                    <>
                        <Title>Overall Expenditure</Title>
                        <div className="absolute right-0 top-0 px-12 py-5">
                            <div
                                className={`${hideRent ? 'text-green-400 hover:text-green-500' : 'text-red-400 hover:text-red-500'} h-fit w-fit select-none dark:text-white dark:hover:text-gray-500`}
                                onClick={() => {
                                    setHideRent(!hideRent)
                                }}
                            >
                                <label className="cursor-pointer  text-sm font-semibold ">
                                    {!hideRent ? 'Hide' : 'Show'} the{' '}
                                    <span className="font-bold ">Rent</span>{' '}
                                    category
                                </label>
                            </div>
                        </div>
                        <div className="">
                            <CustomBarChart
                                animate={{ opacity: 1, width: '99%' }}
                                initial={{ opacity: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1, delay: 1 }}
                                id={'barChart'}
                                className="mt-6 aspect-square min-h-[400px] w-full min-w-fit"
                                data={chartData}
                                enableLegendSlider={isMobile}
                                colors={
                                    categoryData.map((i: CategorySchema) => {
                                        return getColor(i.id!) as Color
                                    })!
                                }
                                categories={categoryData.map((i: any) => {
                                    if (!hideRent) {
                                        return i.category
                                    } else {
                                        if (!(i.category == 'Housing')) {
                                            return i.category
                                        }
                                    }
                                })}
                                index="month"
                                valueFormatter={(number) => {
                                    return currFormatter(
                                        number,
                                        user!.publicMetadata.currency as string
                                    )
                                }}
                            />
                        </div>
                    </>
                }
                {chartData.length == 0 ? (
                    <motion.p className="mt-6">
                        It looks like you haven't recorded any expense data.
                        Click{' '}
                        <Link
                            href="/expenditure/list"
                            className="font-semibold dark:text-black"
                        >
                            here
                        </Link>{' '}
                        to get started
                    </motion.p>
                ) : null}
            </Card>

            {/* <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">

      </div> */}

            <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left"></div>
        </Content>
    )
}
