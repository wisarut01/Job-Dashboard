import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getApplications, deleteApplication } from "../api/applications"

const STATUS = {
    pending:  { label: "Waiting",  color: "text-amber  bg-amber-bg" },
    accepted: { label: "Accepted", color: "text-sage   bg-sage-bg"  },
    rejected: { label: "Closed",   color: "text-rust   bg-rust-bg"  },
}

export default function MyApplications() {
    const navigate = useNavigate()
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetch_() {
            try {
                const data = await getApplications()
                const apps = data.applications ?? data
                setApplications(Array.isArray(apps) ? apps : [])
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetch_()
    }, [])

    const handleDelete = async (id) => {
        if (!confirm("Cancel this application?")) return
        try {
            await deleteApplication(id)
            setApplications(prev => prev.filter(a => a.ID !== id))
        } catch (err) {
            alert(err.message)
        }
    }

    if (loading) return <div className="max-w-[980px] mx-auto px-7 py-8 text-gray text-[15px]">Loading...</div>
    if (error)   return <div className="max-w-[980px] mx-auto px-7 py-8 text-rust text-[14px]">Error: {error}</div>

    return (
        <div className="max-w-[980px] mx-auto px-7 pb-16">
            <div className="pt-9 pb-2">
                <div className="font-mono text-[12px] text-cobalt mb-2.5">applications</div>
                <h1 className="font-display font-bold text-[28px] tracking-tight text-ink m-0">
                    Where you've applied
                </h1>
            </div>

            {/* Stats */}
            <div className="flex gap-10 py-5 border-b border-line">
                {[
                    [applications.length, "applied"],
                    [applications.filter(a => a.Status === "accepted").length, "accepted"],
                    [applications.filter(a => a.Status === "pending").length, "waiting"],
                ].map(([n, l]) => (
                    <div key={l}>
                        <div className="font-mono text-[22px] font-medium text-ink">{n}</div>
                        <div className="text-[12px] text-gray-lt mt-0.5">{l}</div>
                    </div>
                ))}
            </div>

            {/* List */}
            {applications.length === 0 ? (
                <div className="py-12 text-center">
                    <p className="text-[15px] text-gray mb-4">No applications yet.</p>
                    <button onClick={() => navigate("/")}
                        className="text-[14px] font-semibold text-white bg-cobalt px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity cursor-pointer">
                        Browse jobs
                    </button>
                </div>
            ) : (
                <div className="divide-y divide-line">
                    {applications.map((app, i) => {
                        const s = STATUS[app.Status] ?? { label: app.Status, color: "text-gray bg-paper" }
                        return (
                            <div key={app.ID} className="flex justify-between items-center py-[18px]">
                                <div>
                                    <div className="flex items-center gap-2.5 mb-1">
                                        <span className="font-mono text-[13px] text-gray-lt">
                                            {String(i + 1).padStart(3, "0")}
                                        </span>
                                        <span className="font-display text-[15px] font-medium text-ink">
                                            Job #{app.JobId}
                                        </span>
                                    </div>
                                    <div className="font-mono text-[12px] text-gray-lt ml-[42px]">
                                        applied {new Date(app.CreatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`font-mono text-[12px] font-medium px-2.5 py-1 rounded-md ${s.color}`}>
                                        {s.label}
                                    </span>
                                    {app.Status === "pending" && (
                                        <button onClick={() => handleDelete(app.ID)}
                                            className="text-[13px] text-gray border border-line-dk px-3 py-1.5 rounded-lg hover:bg-paper transition-colors cursor-pointer">
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
