import { BellIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import { createContext, useState, useEffect, useContext } from 'react'
const alertContext = createContext<any>([])

export function AlertProvider({children} : {children: React.ReactNode}){
    const [alerts, setAlerts] = useState<{id: number, type: "success"|"warning"|"error", message: string, timeout : number}[]>([])
    async function addAlert(type: "success"|"warning"|"error", message: string, arbitraryResoleTimeoutms : number = 2000){
        setAlerts((prevState) => {
            const id = prevState.length > 0 ? prevState[prevState.length - 1].id + 1 : 0
            return [...prevState, {id: id, type: type, message: message, timeout : arbitraryResoleTimeoutms}]
        })
        return new Promise(resolve => {
            setTimeout(()=>{ resolve(void(0))}, arbitraryResoleTimeoutms);
        }); 
    }
    const theme : {[key: string] : {color: string, icon : any} } = {
        success : {
            color: 'green',
            icon: CheckCircleIcon
        },
        warning: {
            color: 'yellow',
            icon: BellIcon
        },
        error: {
            color: 'red',
            icon: XMarkIcon
        },
    }
    useEffect(() => {
        if (alerts.length > 0) {
          // Create a timer for each alert to remove it after 5 seconds
          const alertTimers = alerts.map((alert) =>
            setTimeout(() => {
              setAlerts((prevState) => prevState.filter((a) => a.id !== alert.id));
            }, alert.timeout)
          );
    
          // Clear all the timers when the component unmounts
          return () => {
            alertTimers.forEach((timer) => clearTimeout(timer));
          };
        }
      }, [alerts]);
    return (
    <alertContext.Provider value={{alerts: alerts, addAlert: addAlert, setAlerts: setAlerts}}>
        <div className="fixed h-fit z-[50] right-3 top-5 grid grid-cols-1 gap-2">
        <AnimatePresence initial={true}>
            {alerts.map((alert)=>{
                const Icon = theme[alert.type].icon
                return (
                    <motion.div
                        onClick={() => {
                            let _alerts = Object.assign([], alerts)
                            delete _alerts[alerts.indexOf(alert)]
                            setAlerts(_alerts)
                        } }
                        key={alert.id}
                        initial={{ opacity: 0, x: 200 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 200 }}
                        transition={{ duration: 0.7 }}
                        className={`relative cursor-pointer w-[30rem] rounded-md border-2 border-${theme[alert.type].color}-500 bg-${theme[alert.type].color}-300 bg-opacity-90 px-3 py-3`}>
                        <div className="pt-0">
                            <Icon className="inline-block h-5 w-5 align-middle" />
                            <p className="inline pl-1 align-middle font-bold">{alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}</p>
                            {/* <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="absolute right-0 top-0 mr-2 mt-2 h-5 w-5 cursor-pointer text-black/60"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> */}
                            <span className="h-full align-middle pl-2">{alert.message}</span>
                        </div>
                    </motion.div>)
            })}
        </AnimatePresence>
        </div>
        {children}
        
    </alertContext.Provider>
    )
}
export function useAlerts(){
    const ctx = useContext(alertContext)
    if (ctx === undefined) throw new Error("useAlerts must be used within an AlertProvider")
    return ctx
}