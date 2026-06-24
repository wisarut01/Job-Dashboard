// ── AuthContext — เก็บ login state ให้ทุก component ใช้ร่วมกัน ──

// 1. import สิ่งที่ต้องใช้จาก react:
//    createContext, useContext, useState, useEffect

// 2. import getProfile, login, logout จาก "../api/auth"

// 3. สร้าง context ด้วย createContext()
//    เก็บใน const ชื่อ AuthContext

// 4. สร้าง component ชื่อ AuthProvider ที่รับ { children } เป็น prop
//    นี่คือ wrapper ที่จะ wrap ทั้งแอปใน main.jsx

//    4.1 สร้าง state: user (เริ่มเป็น null = ยังไม่ login)
//    4.2 สร้าง state: loading (เริ่มเป็น true)
//        → ใช้เช็คว่ายัง fetch profile อยู่ไหม (กัน flash ของหน้า login)

//    4.3 useEffect ที่รัน 1 ครั้งตอน mount:
//        → เรียก getProfile()
//        → ถ้าสำเร็จ setUser(data.user) หรือ field ที่ backend return มา
//        → ถ้า error (ยังไม่ login) setUser(null)
//        → ท้ายสุด setLoading(false) ใน finally

//    4.4 สร้าง function signin(email, password):
//        → เรียก login(email, password)
//        → setUser ด้วยข้อมูลที่ได้กลับมา

//    4.5 สร้าง function signout():
//        → เรียก logout()
//        → setUser(null)

//    4.6 ถ้า loading เป็น true ให้ return null
//        (ไม่ render อะไรจนกว่าจะรู้ว่า login อยู่ไหม)

//    4.7 return AuthContext.Provider ที่มี value={{ user, signin, signout }}
//        โดย wrap {children} ไว้ข้างใน

// 5. สร้าง custom hook ชื่อ useAuth():
//    → return useContext(AuthContext)
//    → export ออกไป

// 6. export AuthProvider

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
