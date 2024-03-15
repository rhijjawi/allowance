import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
    Text,
    Badge,
    TextInput,
    Card,
    Button,
    DateRangePickerValue,
    DateRangePickerProps,
} from '@tremor/react'
import {  Column, flexRender,  getCoreRowModel,  getSortedRowModel,  useReactTable,} from '@tanstack/react-table';
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import { TrashIcon } from '@heroicons/react/24/solid'
import HoverSwitchCurr from '../ui/buttons/hoverSwitchCurr'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
    getColor,
    getIcon,
    getBadgeByCategoryName,
    getIDByCategoryName,
} from '../static/categories'
import { useExpenses } from '../contexts/expenseCTX'
import { useTransactionHandler } from '../contexts/transactionHandler'
import { currFormatter } from '@/utils/functions/valueFormatters'
import { useUser } from '@clerk/nextjs'
import { FileHover } from '@/components/ui/buttons/FileHover'
import Filters from '../ui/Filters'
import { ExpenseSchema } from '@/types/supabase'
let TableHeadStyle = [
    'dark:bg-black bg-white select-none relative border-x-2 dark:border-l-white border-x-black',
    'h-6 relative right-0 bottom-0 top-0 left-0 mx-auto my-auto',
]
let ChevronStyle = [
    'absolute w-8 aspect-square rounded-full right-0 bottom-0 top-0 my-auto mr-4',
    'w-8 h-8 border-2 rounded-full absolute',
]
const chevrons = [
    null,
    <ChevronUpIcon className={ChevronStyle[1]} />,
    <ChevronDownIcon className={ChevronStyle[1]} />,
]

interface EXP_Filters {
    date: DateRangePickerValue
    range: [number | undefined, number | undefined]
    categories: string[]
}

function getPaginatedDataWithFilters(
    data: ExpenseSchema[],
    filters: EXP_Filters
) {
    // Early exit if no filters are applied
    if (!areFiltersApplied(filters)) {
        return data
    }

    return data.filter((expense) => {
        return (
            isCategoryMatch(expense, filters) &&
            isInRange(expense, filters) &&
            isDateMatch(expense, filters)
        )
    })
}

function areFiltersApplied(filters: EXP_Filters) {
    return (
        filters.categories.length > 0 ||
        filters.range[0] ||
        filters.range[1] ||
        (filters.date as DateRangePickerValue).from ||
        (filters.date as DateRangePickerValue).to
    )
}

function isCategoryMatch(expense: ExpenseSchema, filters: EXP_Filters) {
    if (filters.categories.length === 0) return true
    return filters.categories.includes(String(expense.category[0]))
}

function isInRange(expense: ExpenseSchema, filters: EXP_Filters) {
    if (!filters.range[0] && !filters.range[1]) return true
    const amount = expense.standardizedCurrency!
    return amount >= filters.range[0]! && amount <= filters.range[1]!
}

function isDateMatch(expense: ExpenseSchema, filters: EXP_Filters) {
    const transactionDate = new Date(expense.transaction_date)
    const fromDate = filters.date.from!
    const toDate = filters.date.to!
    if (!fromDate && !toDate) return true
    return transactionDate >= fromDate && transactionDate <= toDate
}

export default function ExpTable({
    filter,
    sortBy,
    setSortBy,
    setExpenseFU,
}: {
    filter?: 'uncategorized' | 0 | 1 | 2 | 3
    sortBy: [number, number]
    setSortBy: Dispatch<SetStateAction<[number, number]>>
    setExpenseFU: Dispatch<SetStateAction<number>>
}) {
    const { handlerMode, setHandlerMode } = useTransactionHandler() as {
        handlerMode: string | null
        setHandlerMode: React.Dispatch<
            React.SetStateAction<
                [null | 'delete' | 'edit' | 'modifyCategory' | 'add', number[]]
            >
        >
    }
    const { expenseData, categoryData, incomeData, _error, setExpenseData } =
        useExpenses()
    const [data, setData] = useState<ExpenseSchema[]>([])
    const [selected, setSelected] = useState<number[]>([] as number[])
    const [paginatedData, setPaginatedData] = useState<
        [ExpenseSchema[], number]
    >([[], 0])
    const [page, setPage] = useState(0)
    const [search, setSearch] = useState('')
    const [filters, setFilters] = useState<EXP_Filters>({
        date: { from: undefined, to: undefined },
        range: [undefined, undefined] as [
            number | undefined,
            number | undefined,
        ],
        categories: [] as string[],
    })
    const pageSize = 25
    const { user } = useUser()

    useEffect(() => {
        if (filter) {
            switch (filter) {
                case 'uncategorized':
                    setData(
                        expenseData.filter((expense: ExpenseSchema) => {
                            return (
                                expense.category[0] == 0 &&
                                expense.category[1] == 0
                            )
                        })
                    )
                    break
                default:
                    setData(expenseData)
                    break
            }
        } else {
            setData(expenseData)
        }
        setPage(0)
    }, [expenseData])
    useEffect(() => {
        const filteredData = getPaginatedDataWithFilters(data, filters).filter(
            (exp) => {
                if (search.toLowerCase().length == 0) {
                    return true
                }
                return exp.label
                    .trim()
                    .toLowerCase()
                    .match(search.toLowerCase())
                    ? true
                    : false
            }
        )
        setPaginatedData([
            filteredData.slice(page * pageSize, (page + 1) * pageSize),
            filteredData.length,
        ])
    }, [page, data, search, filters])
    const columns = [
        {
            header: 'Selected',
            accessorKey : 'selected',
            enableSorting: false,
            
        },
        {
            header: 'Label',
            accessorKey: 'label',
            enableSorting: true,
        },
        {
            header: 'Recurring',
            accessorKey: 'recurring',
            enableSorting: true,
        },
        {
            header: 'Category',
            accessorKey: 'category',
            enableSorting: true,
        },
        {
            header: 'Date',
            accessorKey: 'date',
            enableSorting: true,
        },
        {
            header: 'Amount',
            accessorKey: 'amount',
            enableSorting: true,
        },
        {
            header: 'Reciept(s)',
            accessorKey: 'reciepts',
            enableSorting: false,
        },
    ]
    const table = useReactTable({
        data: expenseData,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        initialState: {
            sorting: [{
                id: 'date',
                desc: false,
            }],
        }, 
    });
    return (
        <>
            <Filters
                categories={categoryData}
                userCurr={
                    (user?.publicMetadata as { currency: string }).currency!
                }
                setFilters={setFilters}
                filters={filters}
            />
            <TextInput
                value={search}
                placeholder="Search your expenses"
                onValueChange={(e) => setSearch(e as string)}
                className="relative top-0 translate-y-[-50%] float-right h-10 w-52"
                icon={MagnifyingGlassIcon}
            />
            {selected.length > 0 && (
                <Card className="fixed bottom-5 left-5 z-50 max-h-fit min-h-[4rem] max-w-fit rounded-md border border-neutral-900">
                    <p>
                        Average:{' '}
                        <strong>
                            {currFormatter(
                                expenseData
                                    .filter((exp) => selected.includes(exp.id!))
                                    .map((exp: ExpenseSchema) => {
                                        return exp.standardizedCurrency
                                    })
                                    .reduce((b, a) => b! + a!, 0)! /
                                    selected.length,
                                (user!.publicMetadata as { currency: string })
                                    .currency
                            )}
                        </strong>
                    </p>
                    Total:{' '}
                    <strong>
                        {currFormatter(
                            expenseData
                                .filter((exp) => selected.includes(exp.id!))
                                .map((exp: ExpenseSchema) => {
                                    return exp.standardizedCurrency
                                })
                                .reduce((b, a) => b! + a!, 0)!,
                            (user!.publicMetadata as { currency: string })
                                .currency
                        )}
                    </strong>
                </Card>
            )}
            {paginatedData[1] > 0 ? (
                <Table className="relative mt-5 grid w-full overflow-visible rounded-md rounded-b-md border-2">
                    {selected.length > 0 ? (
                        <>
                            <div
                                key={'_0'}
                                className="absolute -top-16 left-0 right-0 z-0 mx-auto h-fit w-fit rounded-md"
                            >
                                <span
                                    key={'_0_0'}
                                    className="isolate inline-flex rounded-md shadow-sm"
                                >
                                    <button
                                        key={'_0_1'}
                                        type="button"
                                        className="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                                        onClick={() => setSelected([])}
                                    >
                                        Clear Selection
                                    </button>
                                    <button
                                        key={'_0_2'}
                                        type="button"
                                        className="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                                        onClick={() =>
                                            setHandlerMode(['delete', selected])
                                        }
                                    >
                                        Bulk Delete
                                    </button>
                                    <button
                                        key={'_0_3'}
                                        type="button"
                                        className="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                                    >
                                        Bulk Rename
                                    </button>
                                    <button
                                        key={'_0_4'}
                                        type="button"
                                        className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                                        onClick={() =>
                                            setHandlerMode([
                                                'modifyCategory',
                                                selected,
                                            ])
                                        }
                                    >
                                        Bulk Edit Categories
                                    </button>
                                </span>
                            </div>
                        </>
                    ) : null}
                    <TableHead>
                        <TableRow className="border-b-2 border-b-black dark:border-b-white">
                            <TableHeaderCell
                                className={`relative w-16 ${TableHeadStyle[0]} border-l-0`}
                            >
                                <div
                                    className={`h-full w-fit ${TableHeadStyle[1]}`}
                                >
                                    <Button
                                        onClick={() => {
                                            const selectedOnPage =
                                                selected.filter((id) =>
                                                    paginatedData[0]
                                                        .flatMap(
                                                            (exp) => exp.id
                                                        )
                                                        .includes(id)
                                                )
                                            const selectedNotOnPage =
                                                selected.filter(
                                                    (val) =>
                                                        !paginatedData[0]
                                                            .flatMap(
                                                                (exp) => exp.id!
                                                            )
                                                            .includes(val)
                                                )
                                            const flatMapPaginated =
                                                paginatedData[0].flatMap(
                                                    (val) => val.id!
                                                )
                                            if (
                                                selectedOnPage.length !=
                                                paginatedData[0].length
                                            ) {
                                                setSelected([
                                                    ...selectedNotOnPage,
                                                    ...flatMapPaginated,
                                                ])
                                            } else if (
                                                selectedOnPage.length ==
                                                paginatedData[0].length
                                            ) {
                                                setSelected([
                                                    ...selectedNotOnPage,
                                                ])
                                            }
                                            // else {
                                            //   setSelected([...selectedNotOnPage, ...flatMapPaginated])
                                            // }
                                        }}
                                        className="px-1 py-[0.1875rem]"
                                        tooltip="Select all transactions on page"
                                    >
                                        ＊
                                    </Button>
                                </div>
                            </TableHeaderCell>
                            <TableHeaderCell
                                className={`relative w-64 border-x  ${TableHeadStyle[0]}`}
                            >
                                <div
                                    className={`w-fit ${TableHeadStyle[1]}`}
                                    onClick={() => {
                                        setSortBy([1, (sortBy[1] + 1) % 3])
                                    }}
                                >
                                    <Text className="h-full w-fit text-black hover:cursor-pointer hover:text-gray-300 dark:text-white dark:hover:text-stone-300">
                                        Label
                                    </Text>
                                </div>
                                <div className={ChevronStyle[0]}>
                                    {sortBy[0] == 1
                                        ? chevrons[sortBy[1]]
                                        : null}
                                </div>
                            </TableHeaderCell>
                            <TableHeaderCell
                                className={`relative w-64 border-x ${TableHeadStyle[0]}`}
                            >
                                <div className={`w-fit ${TableHeadStyle[1]}`}>
                                    <Text className="h-full w-fit text-black hover:cursor-pointer hover:text-gray-300 dark:text-white dark:hover:text-stone-300">
                                        Recurring
                                    </Text>
                                </div>
                            </TableHeaderCell>
                            <TableHeaderCell
                                className={`relative w-24 border-x  ${TableHeadStyle[0]}`}
                            >
                                <div className={`w-fit ${TableHeadStyle[1]}`}>
                                    <Text className="h-full w-fit text-black hover:text-gray-300 dark:text-white dark:hover:text-stone-300">
                                        Category
                                    </Text>
                                </div>
                            </TableHeaderCell>
                            <TableHeaderCell
                                className={`w-64 border-x   ${TableHeadStyle[0]}`}
                            >
                                <div
                                    className={`w-fit ${TableHeadStyle[1]}`}
                                    onClick={() => {
                                        setSortBy([2, (sortBy[1] + 1) % 3])
                                    }}
                                >
                                    <p className="w-fit text-black hover:cursor-pointer hover:text-gray-300 dark:text-white dark:hover:text-stone-300">
                                        Date
                                    </p>
                                </div>
                                <div className={ChevronStyle[0]}>
                                    {sortBy[0] == 2
                                        ? chevrons[sortBy[1]]
                                        : null}
                                </div>
                            </TableHeaderCell>
                            <TableHeaderCell
                                className={`w-16   ${TableHeadStyle[0]}`}
                            >
                                <div
                                    className={`w-fit ${TableHeadStyle[1]}`}
                                    onClick={() => {
                                        setSortBy([3, (sortBy[1] + 1) % 3])
                                    }}
                                >
                                    <Text className="w-fit text-black hover:cursor-pointer hover:text-gray-300 dark:text-white dark:hover:text-stone-300">
                                        Amount
                                    </Text>
                                </div>
                                <div className={ChevronStyle[0]}>
                                    {sortBy[0] == 3
                                        ? chevrons[sortBy[1]]
                                        : null}
                                </div>
                            </TableHeaderCell>
                            <TableHeaderCell
                                className={`w-8   ${TableHeadStyle[0]}`}
                            >
                                <div className={`w-fit ${TableHeadStyle[1]}`}>
                                    <Text className="w-fit break-words text-black  dark:text-white">
                                        Receipt
                                    </Text>
                                </div>
                            </TableHeaderCell>
                            <TableHeaderCell
                                className={`w-8 border-r-0  ${TableHeadStyle[0]}`}
                            >
                                <TrashIcon className="absolute bottom-0 left-0 right-0 top-0 mx-auto my-auto h-5 w-5 " />
                            </TableHeaderCell>
                        </TableRow>
                    </TableHead>

                    <TableBody className="h-fit divide-y divide-black  dark:divide-white">
                        {paginatedData[0].map(
                            (item: ExpenseSchema, index: number) => {
                                const daystoMs = [
                                    1209600000, 2678400000, 31557600000,
                                ]
                                if (Number.isInteger(filter) && filter != 0) {
                                    const filterTime = new Date(
                                        Number(new Date()) -
                                            daystoMs[Number(filter) - 1]
                                    )
                                    if (
                                        !(
                                            new Date(item.transaction_date) >=
                                                filterTime &&
                                            new Date(item.transaction_date) <=
                                                new Date()
                                        )
                                    )
                                        return <></>
                                }
                                let date = 'unknown'
                                let formatter = Intl.NumberFormat('en-US', {})
                                if (data.length == 0) {
                                    return (
                                        <TableRow key={item.id}>
                                            <TableCell
                                                key={`${item.id}.1`}
                                                className="w-full"
                                            >
                                                <Text className="right-0 mx-auto w-fit">
                                                    No Expenses
                                                </Text>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                                if (!data[0].transaction_date) {
                                } else {
                                    date = new Intl.DateTimeFormat(
                                        navigator.languages[0],
                                        {
                                            dateStyle: 'long',
                                        }
                                    ).format(new Date(item.transaction_date))
                                    formatter = new Intl.NumberFormat(
                                        navigator.languages[0],
                                        {
                                            currency: item.currency,
                                            style: 'currency',
                                        }
                                    )
                                }
                                return (
                                    <TableRow
                                        key={item.id}
                                        onClick={(e) => {
                                            if (
                                                selected.indexOf(item.id!) == -1
                                            )
                                                setSelected((prev) =>
                                                    prev.concat(item.id!)
                                                )
                                            else
                                                setSelected((prev) =>
                                                    prev.filter(
                                                        (id) => id != item.id
                                                    )
                                                )
                                        }}
                                        className={
                                            'cursor-pointer divide-x divide-black dark:divide-white ' +
                                            [
                                                'bg-white dark:bg-black/10 ',
                                                'bg-gray-800/10 dark:bg-slate-800',
                                            ][index % 2]
                                        }
                                    >
                                        <TableCell
                                            key={`${item.id}.2`}
                                            className="relative mx-0 my-auto w-8"
                                        >
                                            <input
                                                readOnly
                                                id="comments"
                                                checked={
                                                    selected.indexOf(
                                                        item.id!
                                                    ) !== -1
                                                }
                                                aria-describedby="comments-description"
                                                name="comments"
                                                type="checkbox"
                                                className="h-4 w-4 absolute bottom-0 left-0 right-0 top-0 mx-auto my-auto rounded border-gray-300 dark:bg-slate-600 text-indigo-600 focus:ring-indigo-600"
                                            />
                                        </TableCell>
                                        <TableCell
                                            key={`${item.id}.4`}
                                            className="relative mx-auto grid h-full grid-cols-10"
                                        >
                                            <div
                                                className={`relative col-span-8 h-[100%]`}
                                            >
                                                {/*"float-left relative bottom-0 top-0 left-0 mx-auto my-auto max-w-fit whitespace-pre-wrap break-words h-fit */}
                                                <Text className="absolute bottom-0 top-0 my-auto h-fit w-full whitespace-pre-wrap break-words px-2 py-4 text-lg text-black dark:text-white">
                                                    {item.label}
                                                </Text>
                                            </div>
                                            <div className="relative col-span-2 col-start-9 ml-2 aspect-square h-10"></div>
                                            {/* <div className={`col-span-2 col-start-9 ml-2 relative h-10 aspect-square rounded-md ${!(item.id == CurrentlyEditing) ? 'bg-white/20' : 'bg-green-400'}`} onClick={(e)=>{
                        if (item.id == CurrentlyEditing){setCurrentlyEditing(null); return}; setCurrentlyEditing(item.id)}}>
                        {!(item.id == CurrentlyEditing) ? (<PencilIcon className="w-4 h-4 bottom-0 right-0 left-0 top-0 absolute mx-auto dark:text-white my-auto"/>) : (<CheckIcon className="w-4 h-4 bottom-0 right-0 left-0 top-0 absolute mx-auto my-auto" />)}
                    </div> */}
                                        </TableCell>
                                        <TableCell
                                            key={`${item.id}.3`}
                                            className="relative mx-auto my-auto w-8"
                                        >
                                            <div className="absolute bottom-0 left-0 right-0 top-0 mx-auto my-auto h-4 w-4">
                                                <input
                                                    checked={item.recurring}
                                                    readOnly
                                                    disabled
                                                    id="checked-checkbox"
                                                    type="checkbox"
                                                    value=""
                                                    className="absolute aspect-square w-full  rounded border-gray-300 bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell
                                            key={`${item.id}.5`}
                                            className="relative text-center"
                                        >
                                            <Badge
                                                id="noclick"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setHandlerMode([
                                                        'modifyCategory',
                                                        [item.id!],
                                                    ])
                                                }}
                                                tooltip={
                                                    //@ts-ignore
                                                    String(
                                                        categoryData.find(
                                                            (element) => {
                                                                return (
                                                                    element.id ===
                                                                    item
                                                                        .category[0]
                                                                )
                                                            }
                                                        )!.subcategories[
                                                            item.category[1]
                                                        ]
                                                    )
                                                }
                                                size={'md'}
                                                color={getColor(
                                                    categoryData.find(
                                                        (element) => {
                                                            return (
                                                                element.id ===
                                                                item.category[0]
                                                            )
                                                        }
                                                    )!.id
                                                )}
                                                className={`select-none hover:bg-${getColor(
                                                    categoryData.find(
                                                        (element) => {
                                                            return (
                                                                element.id ===
                                                                item.category[0]
                                                            )
                                                        }
                                                    )!.id
                                                )}-200 border hover:cursor-pointer dark:bg-black/0 border-${getColor(
                                                    categoryData.find(
                                                        (element) => {
                                                            return (
                                                                element.id ===
                                                                item.category[0]
                                                            )
                                                        }
                                                    )!.id
                                                )}-500`}
                                                icon={getIcon(
                                                    categoryData.find(
                                                        (element) => {
                                                            return (
                                                                element.id ===
                                                                item.category[0]
                                                            )
                                                        }
                                                    )!.id
                                                )}
                                            >
                                                {
                                                    categoryData.find(
                                                        (element) => {
                                                            return (
                                                                element.id ===
                                                                item.category[0]
                                                            )
                                                        }
                                                    )!.category
                                                }
                                            </Badge>
                                        </TableCell>
                                        <TableCell
                                            key={`${item.id}.6`}
                                            className="mx-auto border-x"
                                        >
                                            <Text className="left-0 right-0 mx-auto w-fit text-black dark:text-white">
                                                {String(date)}
                                            </Text>
                                        </TableCell>
                                        <TableCell
                                            key={`${item.id}.7`}
                                            className="mx-auto "
                                        >
                                            <Text className="left-0 right-0 mx-auto w-fit text-black dark:text-white">
                                                <HoverSwitchCurr
                                                    size={'md'}
                                                    expense={item}
                                                />
                                            </Text>
                                        </TableCell>
                                        <TableCell
                                            key={`${item.id}.8`}
                                            className="mx-auto"
                                        >
                                            <FileHover
                                                onClick={() => {
                                                    setExpenseFU(item.id!)
                                                }}
                                                expense={item}
                                                size={'md'}
                                            />
                                        </TableCell>
                                        <TableCell
                                            key={`${item.id}.9`}
                                            className="relative mx-auto"
                                        >
                                            <div
                                                className="relative bottom-0 left-0 right-0 top-0 mx-auto my-auto aspect-square w-10 cursor-pointer rounded-md border-2 border-gray-300 text-gray-600 hover:text-red-600 focus:ring-indigo-600"
                                                onClick={(e) => {
                                                    setHandlerMode([
                                                        'delete',
                                                        [item.id!],
                                                    ])
                                                    e.stopPropagation()
                                                }}
                                            >
                                                <TrashIcon className="absolute bottom-0 left-0 right-0 top-0 mx-auto my-auto h-5 w-5" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            }
                        )}
                    </TableBody>
                </Table>
            ) : (
                <div className="w-full relative h-36  mt-5">
                    <div className="absolute text-center text-lg top-0 bottom-0 right-0 left-0 w-fit mx-auto my-auto h-12">
                        {search.length > 0 && [
                            `The search: `,
                            <i>{search}</i>,
                            ` has no results.`,
                            <br />,
                            `Try a different query`,
                        ]}
                    </div>
                </div>
            )}
            <div className="relative mx-auto mt-6 grid w-fit grid-cols-[auto_fit-content(100%)_auto] gap-x-2">
                <Button
                    iconPosition={'left'}
                    onClick={() => {
                        setPage((prev) => prev - 1)
                    }}
                    disabled={page < 1}
                    icon={ArrowLeftIcon}
                    tooltip="Previous Page"
                >
                    Previous
                </Button>
                <div className="my-auto h-fit w-fit">
                    <p className="h-fit whitespace-nowrap align-middle">
                        Page <strong>{page + 1}</strong> of{' '}
                        <strong>
                            {Math.ceil(paginatedData[1] / pageSize)}
                        </strong>
                    </p>
                </div>
                <Button
                    iconPosition={'right'}
                    tooltip="Next Page"
                    onClick={() => {
                        setPage((prev) => prev + 1)
                    }}
                    disabled={
                        page >= Math.ceil(paginatedData[1] / pageSize) - 1
                    }
                    icon={ArrowRightIcon}
                >
                    Next
                </Button>
            </div>
        </>
    )
}
