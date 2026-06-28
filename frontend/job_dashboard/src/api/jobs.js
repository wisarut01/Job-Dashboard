import apiFetch from "./client";

export function getJobs() {
    return apiFetch(
        "/jobs",
        {
            method: "GET"
        }
    )
}

export function getJob(id) {
    return apiFetch(`/jobs/${id}`, 
        {
            method: "GET"
        }
    )
}

export function createJob(data) {
    return apiFetch("/jobs", 
        {
            method: "POST",
            body: JSON.stringify(data)
        }
    )
}

export function updateJob(id, data) {
    return apiFetch(`/jobs/${id}`, 
        {
            method: "PATCH",
            body: JSON.stringify(data)
        }
    )
}

export function closeJob(id) {
    return apiFetch(`/jobs/${id}`, 
        {
            method: "DELETE"
        }
    )
}
