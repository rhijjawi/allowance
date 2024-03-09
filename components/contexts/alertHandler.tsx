import {
    BellIcon,
    CheckCircleIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import {
    createContext,
    useState,
    useEffect,
    useContext,
    useCallback,
} from 'react'
import { AlertProvider } from '../interfaces/alertProviderType'
const alertContext = createContext<AlertProvider>(
    [] as unknown as AlertProvider
)

export function AlertProvider({ children }: { children: React.ReactNode }) {
    const [alerts, setAlerts] = useState<
        {
            id: number
            type: 'success' | 'warning' | 'error'
            message: string
            timeout: number
            callback?: (() => Promise<any>) | (() => void)
        }[]
    >([])
    const addAlert = useCallback(
        async (
            type: 'success' | 'warning' | 'error',
            message: string,
            arbitraryResoleTimeoutms: number = 2000,
            callback?: (() => Promise<any>) | (() => void)
        ) => {
            setAlerts((prevState) => {
                const id =
                    prevState.length > 0
                        ? prevState[prevState.length - 1].id + 1
                        : 1
                return [
                    ...prevState,
                    {
                        id: id,
                        type: type,
                        message: message,
                        timeout: arbitraryResoleTimeoutms,
                        callback: callback,
                    },
                ]
            })
            return new Promise((resolve) => {
                setTimeout(() => {
                    if (callback) {
                        callback()
                    }
                }, arbitraryResoleTimeoutms + 500)
            })
        },
        []
    )
    async function clearAlerts() {
        setAlerts((prevState) => {
            return []
        })
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(void 0)
            }, 100)
        })
    }
    const theme: { [key: string]: { color: string; icon: any } } = {
        success: {
            color: 'green',
            icon: CheckCircleIcon,
        },
        warning: {
            color: 'yellow',
            icon: BellIcon,
        },
        error: {
            color: 'red',
            icon: XMarkIcon,
        },
    }
    useEffect(() => {
        if (alerts.length > 0) {
            const alertTimers = alerts.map((alert) =>
                setTimeout(() => {
                    setAlerts((prevState) =>
                        prevState.filter((a) => a.id !== alert.id)
                    )
                }, alert.timeout)
            )

            return () => {
                alertTimers.forEach((timer) => clearTimeout(timer))
            }
        }
    }, [alerts])
    return (
        <alertContext.Provider
            value={{ addAlert: addAlert, clearAlerts: clearAlerts }}
        >
            <div className="fixed right-3 top-5 z-[10000] grid h-fit grid-cols-1 gap-2">
                <AnimatePresence initial={true}>
                    {alerts.map((alert) => {
                        const Icon = theme[alert.type].icon
                        return (
                            <motion.div
                                onClick={() => {
                                    let _alerts = Object.assign([], alerts)
                                    _alerts = _alerts.filter((_alert) => {
                                        alert.id != alert.id
                                    })
                                    setAlerts(_alerts)
                                }}
                                key={alert.id}
                                initial={{ opacity: 0, x: 200 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 200 }}
                                transition={{ duration: 0.5 }}
                                className={`relative z-[1000] w-[30rem] cursor-pointer rounded-md border-2 border-${theme[alert.type].color}-500 bg-${theme[alert.type].color}-300 bg-opacity-90 px-3 py-3`}
                            >
                                <div className="z-[1000] pt-0">
                                    <Icon className="inline-block h-5 w-5 align-middle" />
                                    <p className="inline pl-1 align-middle font-bold dark:text-black">
                                        {alert.type.charAt(0).toUpperCase() +
                                            alert.type.slice(1)}
                                    </p>
                                    <span className="h-full pl-2 align-middle dark:text-black">
                                        {alert.message}
                                    </span>
                                </div>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
            </div>
            {children}
        </alertContext.Provider>
    )
}
export function useAlerts() {
    const ctx = useContext(alertContext)
    if (ctx === undefined)
        throw new Error('useAlerts must be used within an AlertProvider')
    return ctx
}
