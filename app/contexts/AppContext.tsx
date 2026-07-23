import { createContext, useContext } from "react"

interface AppContextValue {

}
const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider = () => {
    const value = {}
    return (
        <AppContext.Provider value={value}></AppContext.Provider>
    )
}

export const useAppContext = () => {
    const context = useContext(AppContext);

    if (!context) throw new Error("useAppContext must be within AppProvider")
    return context
}
