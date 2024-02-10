export type AlertProvider = {
    addAlert: (type: "success"|"warning"|"error", message: string, arbitraryResoleTimeoutms? : number, callback? : (()=>Promise<any>)|(()=>void)) => void,
    clearAlerts: () => void,
}