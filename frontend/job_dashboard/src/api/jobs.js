import apiFetch from "./client";

export function GetJobs() {
    return apiFetch(
        "/jobs",
        {
            method: "GET"
        }
    )
}

export function GetJob(id) {
    return apiFetch("/jobs/${id}", 
        {
            method: "GET"
        }
    )
}

export function CreateJob(data) {
    return apiFetch("/jobs", 
        {
            method: "POST",
            body: JSON.stringify(data)
        }
    )
}

export function UpdateJob(id, data) {
    return apiFetch("/jobs/${id}", 
        {
            method: "PATCH",
            body: JSON.stringify(data)
        }
    )
}

export function CloseJob(id) {
    return apiFetch("/jobs/${id}", 
        {
            method: "DELETE"
        }
    )
}
