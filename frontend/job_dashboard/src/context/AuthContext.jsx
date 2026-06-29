import { createContext, useContext, useState, useEffect } from "react";
import { getProfile, login, logout } from "../api/auth";

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser]       = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function checkSession() {
            try {
                const res = await getProfile()
                setUser(res.user)
            } catch (error) {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        checkSession()
    }, [])

    const signin = async (email, password) => {
        await login(email, password)           // set cookie
        const data = await getProfile()        // แล้วดึง profile
        setUser(data.user)
    }

    const signout = async () => {
        await logout()
        setUser(null)
    }

    if (loading) {
        return null
    }

    return (
    <AuthContext.Provider value={{ user, signin, signout }}>
        {children}
    </AuthContext.Provider>
    )
}   

export function useAuth() {
    return useContext(AuthContext)
}
