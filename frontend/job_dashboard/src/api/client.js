const BASE_URL = "http://localhost:8080"

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
