import {
    Card,
    Badge,
    Button,
    Table,
    TabPanel,
    TabPanels,
    Grid,
    Divider,
    TabGroup,
    TableHead,
    TableHeaderCell,
    TableBody,
    TableRow,
    TableCell,
    TableFoot,
    TableFooterCell,
    Title,
    Select,
    SelectItem,
    Text,
    BarChart,
    AreaChart,
    TabList,
    Tab,
    TextInput,
    Col,
    Metric,
    LineChart,
    Subtitle,
    Callout,
} from '@tremor/react'
import { use, useEffect, useState } from 'react'
import { useExpenses, ExpenseType } from '@/components/contexts/expenseCTX'
import {
    ArrowDownOnSquareIcon,
    BanknotesIcon,
    CalendarDaysIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    ClipboardDocumentIcon,
    CurrencyYenIcon,
    ExclamationCircleIcon,
    EyeIcon,
    MagnifyingGlassCircleIcon,
    MagnifyingGlassIcon,
    PlusCircleIcon,
    QuestionMarkCircleIcon,
    TableCellsIcon,
} from '@heroicons/react/24/outline'
import { useFileUpload } from '@/components/contexts/fileManagerCTX'
import { useTransactionHandler } from '@/components/contexts/transactionHandler'
import { useUser } from '@clerk/nextjs'
import UpcomingTable from '@/components/charts/UpcomingTable'
import DonutCategory from '@/components/charts/DonutCategory'
import MIMO from '@/components/charts/MoneyInMoneyOut'
import badges, { getIcon, getColor } from '@/components/static/categories'
import {
    ExpenditureDialog,
    IncomeDialogue,
} from '@/components/forms/QuickForms'
import getPrevious from '@/functions/getPrevious'
import { CategorySchema, ExpenseSchema, IncomeSchema } from '@/types/supabase'
import {
    ExpenditureDelta,
    IncomeDelta,
} from '@/components/charts/ExpenditureDelta'
import { LastPeriodDates } from '@/utils/functions/filterData'
import { motion } from 'framer-motion'
import { NumToMonth, currFormatter } from '@/utils/functions/valueFormatters'
import ExpenseTable from '@/components/charts/ExpenseTable'
import React from 'react'
import { Autocomplete, AutocompleteItem } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { useAlerts } from '@/components/contexts/alertHandler'
import { Content } from '@/components/Common'

let ChevronStyle = [
    'absolute w-8 aspect-square rounded-full right-0 bottom-0 top-0 my-auto mr-4',
    'w-8 h-8 border-2 rounded-full absolute',
]

export default function ListPage() {
    const { user, isSignedIn, isLoaded } = useUser()
    const router = useRouter()
    const [filtermode, setFiltermode] = useState<0 | 1 | 2 | 3>(0) // 0: all, 1: past 2 weeks, 2: past month, 3: past year
    const filterlabels = [
        'All Expenditure',
        'Expenditure in the past 2 weeks',
        'Expenditure in the past month',
        'Expenditure in the past year',
    ]

    const selectLabels = ['All', '14 days', '30 days', '365 days']
    const [supportedBanks, setSupportedBanks] = useState<string[]>([])

    const { expenseData, categoryData, incomeData, _error, setExpenseData } =
        useExpenses()
    const [sortBy, setSortBy] = useState<[number, number]>([0, 0])

    const [CurrentlyEditing, setCurrentlyEditing] = useState<any>(null)
    const previousEditing = getPrevious(CurrentlyEditing)
    const [label, setLabel] = useState<string>('')
    const [tab, setTab] = useState(0)
    const [sum, setSum] = useState<any[] | null>(null)

    const chevrons = [
        null,
        <ChevronUpIcon className={ChevronStyle[1]} />,
        <ChevronDownIcon className={ChevronStyle[1]} />,
    ]
    const { addAlert } = useAlerts()
    const { error: error, loading, setExpense } = useFileUpload()
    const { handlerMode, setHandlerMode } = useTransactionHandler() as {
        handlerMode: string | null
        setHandlerMode: React.Dispatch<React.SetStateAction<[string, number[]]>>
    }
    const [categorySums, setCategorySums] = useState([{}])
    const [uncategorized, setUncategorized] = useState<ExpenseSchema[]>([])
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isIncomeOpen, setIncomeIsOpen] = useState<boolean>(false)
    const categoryBadges = badges()
    const past6months = [1, 2, 3, 4, 5, 6]
        .map((i) => {
            let date = new Date()
            let month = new Date(
                date.setUTCMonth(date.getMonth() - i)
            ).getMonth()
            let year = new Date(
                date.setUTCMonth(date.getMonth() - i)
            ).getFullYear()
            return [month, year]
        })
        .reverse()

    const [bank, setBank] = useState<string | undefined>(undefined)
    useEffect(() => {})
    useEffect(() => {
        fetch('/api/expenses/supported').then((res) => {
            if (res.status === 200) {
                res.json().then((data) => {
                    setSupportedBanks(data.banks)
                })
            }
        })
    }, [])
    const sendForm = async () => {
        if (!bank) {
            addAlert('warning', 'Please select a bank!')
            return
        }
        const form = new FormData()
        const file = (document.getElementById('file') as HTMLInputElement)
            .files![0]
        if (file.type !== 'text/csv') {
            addAlert('warning', 'Please upload a .csv file!')
            return
        }
        form.append('csvFile', file as File)
        form.append('bank', bank as string)
        console.log(form)
        const res = await fetch('/api/expenses/add', {
            method: 'POST',
            body: form,
        })
        if (res.status === 200) {
            res.json().then((data) => {
                console.log(data.results.length)
                if (data.results.length > 0) {
                    addAlert(
                        'success',
                        'Sucessfully added transactions from file',
                        3500,
                        () => {
                            setTab(0)
                        }
                    )
                    setExpenseData([...expenseData, ...data.results])
                } else {
                    addAlert(
                        'warning',
                        `Not a valid ${bank.charAt(0).toUpperCase() + bank.slice(1)} transaction file.`
                    )
                }
            })
            return
        }
    }
    useEffect(() => {
        if (!expenseData) {
            return
        }
        setSum([])
        past6months.forEach((month) => {
            let expenses = expenseData.filter((exp: ExpenseSchema) => {
                if (exp.recurring) {
                    let date = new Date(
                        Date.parse(String(exp.transaction_date))
                    )
                    if (
                        date.getUTCMonth() >= month[0] &&
                        date.getUTCFullYear() >= month[1]
                    ) {
                        return true
                    }
                }
                return (
                    new Date(exp.transaction_date).getUTCMonth() == month[0] &&
                    new Date(exp.transaction_date).getUTCFullYear() == month[1]
                )
            })
            let sum = expenses.reduce(
                (a: number, b: ExpenseSchema) => a + b.standardizedCurrency!,
                0
            )
            setSum((prev) => [
                ...prev!,
                {
                    month: `${NumToMonth(month[0])} ${month[1]}`,
                    Expenditure: Number(sum.toFixed(2)),
                },
            ])
        })
    }, [expenseData])
    useEffect(() => {
        if (!expenseData) {
            return
        }
        setUncategorized(
            expenseData.filter((item) => {
                return item.category[0] == 0
            })
        )
    }, [expenseData])
    useEffect(() => {
        const updateFunction = async () => {
            // await (await getSupabase(user!.accessToken)).from('expenses').update({label: label}).eq(id, id)
        }
        if (CurrentlyEditing == null && typeof previousEditing == 'number') {
            //
        }
    }, [previousEditing])
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
    const daterange = LastPeriodDates()
    if (!isLoaded) return null
    return (
        <>
            <Content>
                <ExpenditureDialog isOpen={isOpen} setIsOpen={setIsOpen} />
                <IncomeDialogue
                    isOpen={isIncomeOpen}
                    setIsOpen={setIncomeIsOpen}
                />
                <Title className="text-white">Dashboard 🏦</Title>
                <Text className="text-slate-300">
                    A detailed overview of your finances.
                </Text>

                <TabGroup className="mt-6" index={tab} onIndexChange={setTab}>
                    <TabList>
                        <Tab
                            icon={EyeIcon}
                            className="text-white hover:text-slate-400"
                        >
                            Overview
                        </Tab>
                        <Tab
                            icon={TableCellsIcon}
                            className="text-white hover:text-slate-400"
                        >
                            Table
                        </Tab>
                        <Tab
                            icon={CalendarDaysIcon}
                            className="text-white hover:text-slate-400"
                        >
                            Month-to-date
                        </Tab>
                        <Tab
                            icon={ArrowDownOnSquareIcon}
                            className="text-white hover:text-slate-400"
                        >
                            Import
                        </Tab>
                        {uncategorized.length > 0 ? (
                            <Tab
                                icon={QuestionMarkCircleIcon}
                                className="text-white hover:text-slate-400"
                            >
                                Uncategorized
                            </Tab>
                        ) : (
                            <></>
                        )}
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Grid
                                numItemsMd={2}
                                numItemsSm={1}
                                numItemsLg={3}
                                className="mt-6 gap-6"
                            >
                                <Card className="h-fit border-2 border-slate-400 bg-white">
                                    {user ? (
                                        <DonutCategory
                                            expenseData={expenseData}
                                            categoryData={categoryData}
                                        />
                                    ) : null}
                                    <motion.div
                                        variants={{
                                            hidden: { opacity: 0 },
                                            visible: { opacity: 1 },
                                        }}
                                        initial="hidden"
                                        transition={{ duration: 1.2 }}
                                        animate={
                                            uncategorized.length > 0
                                                ? 'visible'
                                                : 'hidden'
                                        }
                                    >
                                        <Subtitle className="select-none text-center dark:text-slate-300">
                                            It seems that you have{' '}
                                            <b>
                                                {currFormatter(
                                                    expenseData
                                                        .filter((item) => {
                                                            return (
                                                                item
                                                                    .category[0] ==
                                                                0
                                                            )
                                                        })
                                                        .reduce((a, b) => {
                                                            return (
                                                                a +
                                                                b.standardizedCurrency!
                                                            )
                                                        }, 0),
                                                    user?.publicMetadata
                                                        .currency as string
                                                )}
                                            </b>{' '}
                                            in uncategorized expenses. Click{' '}
                                            <a
                                                className="cursor-pointer text-blue-500 hover:underline"
                                                onClick={() => {
                                                    setTab(4)
                                                }}
                                            >
                                                here
                                            </a>{' '}
                                            to assign them categories.
                                        </Subtitle>
                                    </motion.div>
                                </Card>
                                <div className="flex flex-col h-full">
                                    <Card className="h-fit min-h-16 border-2 border-slate-400 bg-white shadow-md">
                                        <Title>Upcoming Transactions</Title>
                                        <UpcomingTable />
                                    </Card>
                                    {/* <Card className="mt-3 grid flex-grow grid-cols-3 border-2 border-slate-400 bg-white shadow-md">
                    <Title className="col-span-1 col-start-1">
                      Copy your invite code
                    </Title>
                    <Button
                      icon={ClipboardDocumentIcon}
                      size={"lg"}
                      className="col-start-3 float-right w-full text-sm"
                    >
                      Copy
                    </Button>
                  </Card> */}
                                    {/* <Card className="mt-3 grid maxh-80 flex-grow grid-cols-3 border-2 border-slate-400 bg-white shadow-md">
                    <Button
                      className="col-start-1 h-12"
                      icon={PlusCircleIcon}
                      color="red"
                      onClick={() => setIsOpen(true)}
                    >
                      Add Expense
                    </Button>
                    <Button
                      className="col-start-3 h-12"
                      icon={PlusCircleIcon}
                      color="emerald"
                      onClick={() => setIncomeIsOpen(true)}
                    >
                      Add Income
                    </Button>
                  </Card> */}
                                    <Card className="w-full flex-grow mt-3 border-2 border-slate-400 bg-white shadow-md">
                                        {sum && (
                                            <>
                                                <Title>
                                                    Total Spending in the last 6
                                                    months
                                                </Title>
                                                <LineChart
                                                    yAxisWidth={60}
                                                    showXAxis={false}
                                                    data={sum!}
                                                    valueFormatter={(e) => {
                                                        return currFormatter(
                                                            e,
                                                            user?.publicMetadata
                                                                .currency as string
                                                        )
                                                    }}
                                                    categories={['Expenditure']}
                                                    index={'month'}
                                                    colors={['emerald']}
                                                />
                                            </>
                                        )}
                                    </Card>
                                </div>
                                <Card className="w-full border-2 border-slate-400 bg-white shadow-md">
                                    <Title>Money In vs. Money Out</Title>
                                    <MIMO
                                        income={incomeData}
                                        currency={
                                            user!.publicMetadata
                                                .currency as string
                                        }
                                    />
                                </Card>
                                <Col numColSpan={3} numColSpanLg={3}>
                                    {/* <Card className="w-full border-2 border-slate-400 bg-white shadow-md">
                    {sum && (
                      <div className="whitespace-pre-line">
                        <Title>Total Spending in the last 6 months</Title>
                        <LineChart
                          rotateLabelX={{
                            angle: 90,
                            verticalShift: 50,
                            xAxisHeight: 100,
                          }}
                          yAxisWidth={60}
                          className="mt-6 w-full"
                          data={sum!}
                          valueFormatter={(e) => {
                            return currFormatter(
                              e,
                              user?.publicMetadata.currency as string,
                            );
                          }}
                          categories={["Expenditure"]}
                          index={"month"}
                          colors={["emerald"]}
                        />
                      </div>
                    )}
                  </Card> */}
                                </Col>
                            </Grid>
                        </TabPanel>
                        <TabPanel>
                            <Col
                                numColSpan={1}
                                numColSpanLg={3}
                                className="mt-6 gap-6"
                            >
                                <Card className="mt-6 border-2 border-slate-400 bg-white">
                                    <div className="flex justify-between">
                                        <Title className="relative float-left w-fit">
                                            {filterlabels[filtermode]}
                                        </Title>
                                        {/* @ts-ignore */}
                                        {/* <Select
                    className="relative top-1 float-right h-12 w-[20%]"
                    value={String(filtermode)}
                    onValueChange={(v) => {
                      setFiltermode(Number(v) as 0|1|2|3);
                    }}
                  >
                    {selectLabels.map((item, index) => {
                      return (
                        <SelectItem
                          key={index}
                          className="text-stone-700 hover:cursor-pointer"
                          value={String(index)}
                        >
                          {item}
                        </SelectItem>
                      );
                    })}
                  </Select> */}
                                    </div>
                                    <div className="block ">
                                        <ExpenseTable
                                            filter={filtermode}
                                            setSortBy={setSortBy}
                                            setExpenseFU={setExpense}
                                            sortBy={sortBy}
                                        />
                                    </div>
                                </Card>
                            </Col>
                        </TabPanel>
                        <TabPanel>
                            <Grid
                                numItemsSm={1}
                                numItemsMd={1}
                                numItemsLg={3}
                                className="mt-6 gap-6 "
                            >
                                <Col numColSpan={1} numColSpanLg={3}>
                                    <Card className=" relative dark:border-2">
                                        <div className="my-5 ml-5 w-full">
                                            <Text className="inline-block pr-2">
                                                Previous Period:
                                            </Text>
                                            <Text className="inline-block dark:text-white">
                                                {' '}
                                                {new Intl.DateTimeFormat(
                                                    'en-DE',
                                                    {
                                                        dateStyle: 'long',
                                                    }
                                                ).format(daterange[0])}{' '}
                                                -{' '}
                                                {new Intl.DateTimeFormat(
                                                    'en-DE',
                                                    {
                                                        dateStyle: 'long',
                                                    }
                                                ).format(daterange[1])}
                                            </Text>
                                            <div>
                                                <Text className="inline-block pr-2">
                                                    Current Period:
                                                </Text>
                                                <Text className="inline-block dark:text-white">
                                                    {' '}
                                                    {new Intl.DateTimeFormat(
                                                        'en-DE',
                                                        {
                                                            dateStyle: 'long',
                                                        }
                                                    ).format(daterange[2])}{' '}
                                                    -{' '}
                                                    {new Intl.DateTimeFormat(
                                                        'en-DE',
                                                        {
                                                            dateStyle: 'long',
                                                        }
                                                    ).format(daterange[3])}
                                                </Text>
                                            </div>
                                        </div>
                                        <div className="relative grid grid-cols-1 md:lg:grid-cols-3">
                                            {categoryData.map(
                                                (
                                                    item: CategorySchema,
                                                    index: number
                                                ) => {
                                                    return (
                                                        <ExpenditureDelta
                                                            category={item}
                                                            key={index}
                                                            expenses={
                                                                expenseData
                                                            }
                                                        />
                                                    )
                                                }
                                            )}
                                            <IncomeDelta
                                                category={{
                                                    category: 'Income',
                                                    id: 0,
                                                    subcategories: [],
                                                }}
                                                incomes={incomeData}
                                            />
                                        </div>
                                    </Card>
                                </Col>
                            </Grid>
                        </TabPanel>
                        <TabPanel>
                            <Grid
                                numItemsSm={1}
                                numItemsMd={1}
                                numItemsLg={1}
                                className="mt-6 gap-6"
                            >
                                <Card className="mx-auto aspect-[3/1] w-[32rem] border-2">
                                    <div className="float-right aspect-square h-9">
                                        <ArrowDownOnSquareIcon className="float-right aspect-square h-full w-fit" />
                                    </div>
                                    <Title className="mb-4">
                                        Import Transactions (.csv)
                                    </Title>
                                    <Callout
                                        className="mt-4 h-fit"
                                        title="This feature is currently in development."
                                        icon={ExclamationCircleIcon}
                                        color="orange"
                                    >
                                        The list of supported banks is
                                        constantly growing, so if you don't see
                                        your bank, please submit a request via
                                        the Report Bug button in the bottom
                                        right corner.
                                    </Callout>
                                    <Subtitle className="my-2 select-none">
                                        You can import transactions from your
                                        bank account by selecting your bank from
                                        the dropdown below.
                                    </Subtitle>
                                    <Select
                                        className="my-3"
                                        value={bank}
                                        onValueChange={(e) => setBank(e)}
                                    >
                                        {supportedBanks.length > 0 &&
                                            supportedBanks
                                                .sort()
                                                .map((bank) => (
                                                    <SelectItem
                                                        className="cursor-pointer"
                                                        value={bank}
                                                    >
                                                        {bank
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            bank.slice(1)}
                                                    </SelectItem>
                                                ))}
                                    </Select>
                                    <motion.div
                                        variants={{
                                            hidden: {
                                                display: 'none',
                                                height: 0,
                                                opacity: 0,
                                            },
                                            visible: {
                                                display: 'block',
                                                style: {
                                                    height: 'h-fit',
                                                    opacity: 1,
                                                },
                                            },
                                        }}
                                        animate={
                                            supportedBanks.indexOf(
                                                bank as string
                                            ) == -1
                                                ? 'hidden'
                                                : 'visible'
                                        }
                                        className="my-3 h-fit w-full"
                                    >
                                        <input
                                            accept=".csv"
                                            type={'file'}
                                            id={'file'}
                                            className="mx-auto block h-fit max-h-full w-fit max-w-full rounded-md bg-indigo-400 px-3 py-2"
                                        />
                                    </motion.div>
                                    <div className="block w-full">
                                        <Button
                                            className="left-0 right-0 mx-auto block "
                                            onClick={async () => {
                                                await sendForm()
                                            }}
                                        >
                                            Import Bank Statement
                                        </Button>
                                    </div>
                                </Card>
                            </Grid>
                        </TabPanel>
                        <TabPanel>
                            <Col
                                numColSpan={1}
                                numColSpanLg={3}
                                className="mt-6 gap-6 "
                            >
                                <Card className="mt-6 border-2 border-slate-400 bg-white">
                                    <div className="flex justify-between">
                                        <Title className="mb-0">
                                            Uncategorized Transactions
                                        </Title>
                                    </div>
                                    {!(uncategorized.length > 0) ? (
                                        <>
                                            <Subtitle className="cursor-pointer select-none">
                                                You have no uncategorized
                                                transactions. These should only
                                                appear when you have imported
                                                transactions through a bank
                                                statement.
                                            </Subtitle>
                                            <Subtitle>
                                                Click{' '}
                                                <b>
                                                    <a
                                                        className="cursor-pointer "
                                                        onClick={() =>
                                                            setTab(1)
                                                        }
                                                    >
                                                        here
                                                    </a>
                                                </b>{' '}
                                                to return
                                            </Subtitle>
                                        </>
                                    ) : null}
                                        <ExpenseTable
                                            filter={'uncategorized'}
                                            sortBy={sortBy}
                                            setSortBy={setSortBy}
                                            setExpenseFU={setExpense}
                                        />
                                </Card>
                            </Col>
                        </TabPanel>
                    </TabPanels>
                </TabGroup>
            </Content>
        </>
    )
}
