import apiFetch from "./client";

export function getApplications() {
    return apiFetch("/applications")
} 

export function createApplication(jobId) {
    return apiFetch("/applications", {
        method: "POST",
        body: JSON.stringify({ job_id: jobId })
    })
}

export function deleteApplication(id) {
    return apiFetch(`/applications/${id}`, {
        method: "DELETE"
    })
}
