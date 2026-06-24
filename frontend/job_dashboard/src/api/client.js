 // ── API Client — ฟังก์ชันกลางสำหรับเรียก backend ทุกที่ ──

// 1. ประกาศ const BASE_URL ชี้ไปที่ backend (http://localhost:8000)

// 2. สร้าง async function ชื่อ apiFetch(path, options = {})
//    - รับ path เช่น "/login" และ options (method, body, ...)

// 3. ภายใน function ใช้ fetch(`${BASE_URL}${path}`, {...})
//    - spread options เข้าไป
//    - เพิ่ม credentials: "include"  ← สำคัญ! ส่ง httpOnly cookie ไปด้วย
//    - เพิ่ม headers: { "Content-Type": "application/json", ...options.headers }

// 4. await response แล้วเช็ค ถ้า !res.ok ให้ throw error
//    - ดึง error message จาก body: (await res.json()).error

// 5. return res.json()

// 6. export function นี้ออกไป

const BASE_URL = "http://localhost:8000"

export default async function apiFetch(path, options = {}) {
    try {
        const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        }
        })

        if (!res.ok) {
            const message = await res.json()
            throw Error(message.error)
        }

        return res.json()
    } catch (error) {
        console.error(error)
        return error
    }
}
