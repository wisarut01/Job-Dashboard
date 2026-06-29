import { useNavigate } from "react-router-dom"

export default function JobCard({ job }) {
    const navigate = useNavigate()

    return (
        <div onClick={() => navigate(`/jobs/${job.id}`)}>
            <div>
                <h3>{job.title}</h3>
                <p>{job.company_id}</p>
            </div>
            <div>
                <p>{job.location}</p>
                {job.remote && <span>Remote</span>}
            </div>
            <div>
                <p>฿{job.salary}</p>
            </div>
        </div>
    )
}
