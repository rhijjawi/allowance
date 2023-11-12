export type AlertProvider = {
    addAlert: (type: "success"|"warning"|"error", message: string, arbitraryResoleTimeoutms? : number)=>void,
    clearAlerts: () => void,
}