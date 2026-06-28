import apiFetch from "./client";

export function login(email, password) {
    return apiFetch("/login", {
        method: "POST",
        body: JSON.stringify({email, password}),
    })
}

export function register(data) {
    return apiFetch("/register", {
        method: "POST", 
        body: JSON.stringify(data)
    })
}

export function logout() {
    return apiFetch("/logout", {method: "POST"})
}

export function getProfile() {
    return apiFetch("/profile")
}
