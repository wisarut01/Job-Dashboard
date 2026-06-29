import apiFetch from "./client"

export function getCompanies() {
    return apiFetch("/companies")
}

export function getCompany(id) {
    return apiFetch(`/companies/${id}`)
}

export function createCompany(data) {
    return apiFetch("/companies", {
        method: "POST",
        body: JSON.stringify(data),
    })
}

export function updateCompany(id, data) {
    return apiFetch(`/companies/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    })
}

export function deleteCompany(id) {
    return apiFetch(`/companies/${id}`, { method: "DELETE" })
}
