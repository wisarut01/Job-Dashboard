// ── Auth API — รวม endpoint เกี่ยวกับ auth ──

// 1. import apiFetch จาก "./client"

// 2. export function login(email, password)
//    - เรียก apiFetch("/login", { method, body })
//    - body ต้อง JSON.stringify({ email, password })

// 3. export function register(data)
//    - POST "/register" พร้อม body เป็น data

// 4. export function logout()
//    - POST "/logout" (ไม่ต้องมี body)

// 5. export function getProfile()
//    - GET "/profile" (default method ของ fetch คือ GET ไม่ต้องระบุ)

import apiFetch from "./client";

export function login(email, password) {
    return apiFetch("/login", {
        method: "POST",
        body: JSON.stringify({email, password}),
    })
}

export function register(data) {
    return res = apiFetch("/register", {
        method: "POST", 
        body: JSON.stringify(data)
    })
}

export function logout() {
    return apiFetch("/logout", {method: "POST"})
}

export function getProfile() {
    return res = apiFetch("/profile")
}
