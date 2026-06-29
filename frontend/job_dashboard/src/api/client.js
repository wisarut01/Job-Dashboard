const BASE_URL = "http://localhost:8080"

export default async function apiFetch(path, options = {}) {
    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    })

    if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Something went wrong")
    }

    return res.json()
}
