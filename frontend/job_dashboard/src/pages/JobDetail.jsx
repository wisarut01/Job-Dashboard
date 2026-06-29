import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getJob } from "../api/jobs"
import { createApplication } from "../api/applications"
import { useAuth } from "../context/AuthContext"

export default function JobDetail() {
    const { id } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [job, setJob] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [applying, setApplying] = useState(false)
    const [applied, setApplied] = useState(false)

    useEffect(() => {
        async function fetchJob() {
            try {
                const data = await getJob(id)
                setJob(data.job ?? data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchJob()
    }, [id])

    const handleApply = async () => {
        if (!user) { navigate("/login"); return }
        setApplying(true)
        try {
            await createApplication(Number(id))
            setApplied(true)
        } catch (err) {
            alert(err.message)
        } finally {
            setApplying(false)
        }
    }

    if (loading) return <div className="max-w-[980px] mx-auto px-7 py-8 text-gray text-[15px]">Loading...</div>
    if (error)   return <div className="max-w-[980px] mx-auto px-7 py-8 text-rust text-[14px]">Error: {error}</div>
    if (!job)    return <div className="max-w-[980px] mx-auto px-7 py-8 text-gray text-[14px]">Job not found</div>

    return (
        <div className="max-w-[980px] mx-auto px-7 pb-16">
            {/* Back */}
            <div className="pt-5 pb-0">
                <button
                    onClick={() => navigate("/")}
                    className="text-[13px] font-medium text-gray border border-line-dk bg-white px-3.5 py-1.5 rounded-lg hover:bg-paper transition-colors cursor-pointer"
                >
                    ← Back
                </button>
            </div>

            {/* Header */}
            <div className="py-8 border-b border-line">
                <div className="font-mono text-[13px] text-cobalt mb-2.5">role/{String(id).padStart(3, "0")}</div>
                <h1 className="font-display font-bold text-[32px] tracking-[-1px] text-ink m-0 mb-2">
                    {job.title}
                </h1>
                <div className="text-[15px] text-gray font-medium">
                    Company #{job.company_id} · {job.location}
                </div>
                <div className="flex gap-2 mt-4 flex-wrap">
                    {job.remote && (
                        <span className="text-[13px] font-semibold text-sage bg-sage-bg px-3.5 py-1.5 rounded-full">
                            Remote ok
                        </span>
                    )}
                </div>
            </div>

            {/* Content grid */}
            <div className="grid grid-cols-[1fr_280px] gap-10 pt-7">
                {/* Left */}
                <div>
                    <h3 className="font-display text-[17px] font-medium text-ink m-0 mb-3">The role</h3>
                    <p className="text-[14px] text-gray leading-relaxed mb-6">
                        {job.description || `Join our team as a ${job.title}. You'll own features end to end, work closely with a small team that ships fast, and have real say in how things get built.`}
                    </p>
                    <h3 className="font-display text-[17px] font-medium text-ink m-0 mb-3">You'll fit if</h3>
                    <p className="text-[14px] text-gray leading-relaxed">
                        You've shipped something real and can explain the tradeoffs you made. You write code others can read. You ask questions before assuming.
                    </p>
                </div>

                {/* Sidebar */}
                <div className="border border-line rounded-[10px] p-5 self-start sticky top-[80px]">
                    <div className="font-mono text-[28px] font-medium text-ink">
                        ฿{job.salary?.toLocaleString()}
                        <span className="text-[14px] text-gray-lt font-normal ml-1">/mo</span>
                    </div>
                    <div className="text-[13px] text-gray-lt mb-5">plus benefits</div>

                    {/* Apply CTA */}
                    {!user && (
                        <button onClick={() => navigate("/login")}
                            className="w-full bg-ink text-white font-semibold text-[14px] py-[11px] rounded-full hover:opacity-90 transition-opacity cursor-pointer mb-2">
                            Log in to apply
                        </button>
                    )}
                    {user?.role === "jobseeker" && !applied && (
                        <button onClick={handleApply} disabled={applying}
                            className="w-full bg-cobalt text-white font-semibold text-[14px] py-[11px] rounded-full hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer">
                            {applying ? "Applying..." : "Apply for this role"}
                        </button>
                    )}
                    {user?.role === "jobseeker" && applied && (
                        <div className="text-center">
                            <p className="text-[14px] text-sage font-medium mb-3">Application sent!</p>
                            <button onClick={() => navigate("/applications")}
                                className="w-full border border-line-dk text-ink font-medium text-[14px] py-[11px] rounded-full hover:bg-paper transition-colors cursor-pointer">
                                View my applications
                            </button>
                        </div>
                    )}

                    {/* Meta */}
                    <div className="mt-5 divide-y divide-line">
                        {[["location", job.location], ["remote", job.remote ? "yes" : "no"], ["salary", `฿${job.salary?.toLocaleString()}`]].map(([k, v]) => (
                            <div key={k} className="flex justify-between py-2">
                                <span className="font-mono text-[12px] text-gray-lt">{k}</span>
                                <span className="text-[13px] text-ink font-medium">{v}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
