import {
    DocumentChartBarIcon,
    CurrencyDollarIcon,
    ChatBubbleLeftRightIcon,
    Cog8ToothIcon,
    ClipboardDocumentIcon,
} from '@heroicons/react/24/outline'
import {
    Button,
    Select,
    TextInput,
    SelectItem,
    Subtitle,
    Title,
    Card,
} from '@tremor/react'
import langs from '@/components/static/languages.json'
import symbols from '@/components/static/symbols.json'
import { useEffect, useState } from 'react'
import { useAlerts } from '@/components/contexts/alertHandler'
import { useAuth, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import axios from 'axios'
import { fetcher } from '@/utils/fetcher'
import { UserCard, UserAddCard } from '@/components/ui/User/UserCards'
import { User } from '@clerk/clerk-sdk-node'

export default function Index() {
    const { user, isLoaded, isSignedIn } = useUser()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const { addAlert } = useAlerts()
    const [supervisorData, setSupervisorData] = useState<null | {
        oversight: { supervisors: any[]; unconfirmed: any[] }
        supervisorProfiles: User[]
    }>(null)
    const [language, setLanguage] = useState('')
    const [currency, setCurrency] = useState('')
    const [email, setEmail] = useState('')
    const {
        data: data,
        isLoading: loading,
        error: error,
    } = useSWR(`/api/user/assignParent`, fetcher, { revalidateOnFocus: false })
    const [isEmailValid, setIsEmailValid] = useState(false)
    useEffect(() => {
        if (data && !loading) {
            setSupervisorData(data)
        }
    }, [data])
    useEffect(() => {
        if (
            email &&
            email.includes('@') &&
            email.includes('.') &&
            email.split('.').reverse()[0].length > 0
        ) {
            setIsEmailValid(true)
        } else {
            setIsEmailValid(false)
        }
    }, [email])
    useEffect(() => {
        if (user?.publicMetadata.reports) {
            //@ts-ignore
            setLanguage(user.publicMetadata.reports.language ?? 'en')
            //@ts-ignore
            setCurrency(user.publicMetadata.reports.currency ?? 'EUR')
            //@ts-ignore
            setEmail(user.publicMetadata.reports.email ?? '')
        }
    }, [user])
    if (isSignedIn && !user) return router.push('/')
    if (!isLoaded) return <></>
    if (loading) return <></>
    const settings = [
        {
            name: 'Language',
            description: 'Set the language of the reports',
            onChange: (value: string) => {
                setLanguage(value)
            },
            icon: ChatBubbleLeftRightIcon,
            icon_color: 'text-indigo-600 dark:text-white',
            value: language,
            options: langs
                .sort((a, b) => {
                    return a.name.localeCompare(b.name)
                })
                .map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                    </SelectItem>
                )),
        },
        {
            name: 'Home Currency',
            description: 'Set the currency of the reports',
            onChange: (value: string) => {
                setCurrency(value)
            },
            icon: CurrencyDollarIcon,
            icon_color: 'text-green-600 dark:text-green-400',
            value: currency,
            options: Object.keys(symbols).map((key: string) => (
                <SelectItem key={key} value={key}>
                    ({key}) {(symbols as any)[key]}
                </SelectItem>
            )),
        },
    ]

    return (
        <>
            <div className="h-fit w-full overflow-hidden border-t-2 bg-white dark:bg-black">
                <div className="mx-auto mb-5 min-h-screen max-w-[88rem] px-6  lg:px-8">
                    <Card
                        className={`mx-auto my-auto mt-5 w-full max-w-[80%] divide-y divide-gray-200 rounded-lg border-2  bg-slate-300/40 shadow-2xl `}
                    >
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex flex-col">
                                <div className="flex flex-col sm:flex-row">
                                    <div className="relative flex-grow">
                                        <div className="flex w-full items-center">
                                            <DocumentChartBarIcon className="inline-block h-6 align-baseline" />
                                            <h2 className="relative inline align-baseline text-2xl font-medium leading-6 text-gray-900 dark:text-white">
                                                Reports
                                            </h2>
                                        </div>
                                        <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
                                            <p>
                                                Configure reports to be sent to
                                                your parents or guardians
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-6 mt-3 w-full border border-indigo-600/70"></div>
                            <div className="grid grid-cols-2">
                                <Title className="mb-3">Settings</Title>
                                <div className="relative col-span-2 col-start-1 mx-auto mb-5 w-[80%]  rounded-md border-2 border-indigo-500 bg-indigo-200/50 px-4 py-4 shadow-sm dark:border-cyan-500">
                                    <Title>Pair a parent account</Title>
                                    <Subtitle>
                                        Enter the unique ID of the parent
                                        account you want to pair with
                                    </Subtitle>
                                    {supervisorData &&
                                        user?.publicMetadata.role ==
                                            'student' &&
                                        supervisorData.supervisorProfiles
                                            .filter((e) => e !== null)
                                            .map(
                                                (user: User, index: number) => (
                                                    <UserCard
                                                        key={index}
                                                        user={user}
                                                        supervisorDelete={async () => {
                                                            let res
                                                            try {
                                                                res =
                                                                    await axios.delete(
                                                                        '/api/user/assignParent',
                                                                        {
                                                                            data: {
                                                                                supervisor:
                                                                                    user.id,
                                                                            },
                                                                        }
                                                                    )
                                                            } catch (error) {
                                                                return addAlert(
                                                                    'error',
                                                                    "Something happened, we're refreshing the page to clear things up.",
                                                                    3000,
                                                                    () => {
                                                                        router.reload()
                                                                    }
                                                                )
                                                            }
                                                            switch (
                                                                res.status
                                                            ) {
                                                                case 200:
                                                                    addAlert(
                                                                        'success',
                                                                        'Successfully removed parent',
                                                                        2000
                                                                    )

                                                                    setSupervisorData(
                                                                        {
                                                                            oversight:
                                                                                {
                                                                                    supervisors:
                                                                                        supervisorData.oversight.supervisors.filter(
                                                                                            (
                                                                                                e
                                                                                            ) =>
                                                                                                e !==
                                                                                                user.id
                                                                                        ),
                                                                                    unconfirmed:
                                                                                        supervisorData.oversight.unconfirmed.filter(
                                                                                            (
                                                                                                e
                                                                                            ) =>
                                                                                                e !==
                                                                                                user.id
                                                                                        ),
                                                                                },
                                                                            supervisorProfiles:
                                                                                supervisorData.supervisorProfiles.filter(
                                                                                    (
                                                                                        e: User
                                                                                    ) => {
                                                                                        if (
                                                                                            !e
                                                                                        )
                                                                                            return false
                                                                                        return (
                                                                                            e.id !==
                                                                                            user.id
                                                                                        )
                                                                                    }
                                                                                ),
                                                                        }
                                                                    )
                                                                    break
                                                                case 304:
                                                                    addAlert(
                                                                        'error',
                                                                        'Parent was never added',
                                                                        2000
                                                                    )
                                                                    break
                                                                default:
                                                                    addAlert(
                                                                        'error',
                                                                        'Failed to remove parent',
                                                                        2000
                                                                    )
                                                                    break
                                                            }
                                                        }}
                                                    />
                                                )
                                            )}
                                    <div className="">
                                        {supervisorData &&
                                            user?.publicMetadata.role ==
                                                'parent' &&
                                            supervisorData.supervisorProfiles
                                                .filter((e) => e !== null)
                                                .map(
                                                    (
                                                        user: User,
                                                        index: number
                                                    ) => (
                                                        <UserCard
                                                            key={index}
                                                            user={user}
                                                            supervisorDelete={async () => {
                                                                const res =
                                                                    axios.delete(
                                                                        '/api/user/assignParent',
                                                                        {
                                                                            data: {
                                                                                childId:
                                                                                    user.id,
                                                                            },
                                                                        }
                                                                    )
                                                            }}
                                                        />
                                                    )
                                                )}
                                    </div>
                                    <UserAddCard
                                        isReadOnly={
                                            user?.publicMetadata.role ==
                                            'parent'
                                        }
                                    />
                                </div>
                                {user!.publicMetadata.role == 'parent' &&
                                    settings.map((setting) => {
                                        return (
                                            <div className="relative col-span-2 col-start-1 mx-auto mb-5 w-[45%]  rounded-md border-2 border-indigo-500 bg-indigo-200/50 px-4 py-4 shadow-md dark:border-cyan-500">
                                                <setting.icon
                                                    className={`absolute right-3 top-3 h-6 w-6 ${setting.icon_color}`}
                                                />
                                                <p className="inline-block align-baseline">
                                                    {setting.name}
                                                </p>
                                                <Subtitle className="align-baseline">
                                                    {setting.description}
                                                </Subtitle>
                                                <Select
                                                    onValueChange={(val) =>
                                                        setting.onChange(val)
                                                    }
                                                    value={setting.value}
                                                    enableClear={false}
                                                    className="mx-auto my-2 mr-auto max-w-[15rem] cursor-not-allowed rounded-lg shadow-md disabled:bg-gray-300/20 "
                                                >
                                                    {setting.options}
                                                </Select>
                                            </div>
                                        )
                                    })}
                                {user!.publicMetadata.role == 'parent' && (
                                    <div className="relative col-span-2 col-start-1 mx-auto mb-5 w-[45%]  rounded-md border-2 border-indigo-500 bg-indigo-200/50 px-4 py-4 shadow-md dark:border-cyan-500">
                                        <Cog8ToothIcon
                                            className={`absolute right-3 top-3 h-6 w-6`}
                                        />
                                        <p className="inline-block align-baseline">
                                            Contact Details
                                        </p>
                                        <TextInput
                                            required
                                            error={!isEmailValid}
                                            type="email"
                                            placeholder="max@mustermann.com"
                                            value={email}
                                            onValueChange={(val: string) =>
                                                setEmail(val)
                                            }
                                            className={`mx-auto my-2 mr-auto max-w-[20rem] cursor-not-allowed rounded-lg shadow-md disabled:bg-gray-300/20 ${isEmailValid ? 'border-2 !border-green-400' : ''}`}
                                        />
                                    </div>
                                )}
                                {user!.publicMetadata.role == 'parent' && (
                                    <div className="col-span-2 mx-auto w-56">
                                        <Button
                                            disabled={!isEmailValid}
                                            loading={isLoading}
                                            onClick={async (e) => {
                                                setIsLoading(true)
                                                const metaupdate = await fetch(
                                                    '/api/user/metadata',
                                                    {
                                                        method: 'PUT',
                                                        headers: {
                                                            'Content-Type':
                                                                'application/json',
                                                        },
                                                        body: JSON.stringify({
                                                            pub: {
                                                                reports: {
                                                                    language:
                                                                        language,
                                                                    currency:
                                                                        currency,
                                                                    email: email,
                                                                },
                                                            },
                                                        }),
                                                    }
                                                )
                                                if (metaupdate.status === 200) {
                                                    addAlert(
                                                        'success',
                                                        'Successfully saved changes',
                                                        2000
                                                    )
                                                } else {
                                                    addAlert(
                                                        'error',
                                                        'Failed to save changes',
                                                        2000
                                                    )
                                                }
                                                setIsLoading(false)
                                            }}
                                            className="w-full"
                                        >
                                            Save Changes
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    )
}
