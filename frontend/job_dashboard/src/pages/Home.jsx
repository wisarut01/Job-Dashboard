import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getJobs } from "../api/jobs"

export default function Home() {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [search, setSearch] = useState("")
    const [filterRemote, setFilterRemote] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchJobs() {
            try {
                const data = await getJobs()
                const list = data.jobs ?? data
                setJobs(Array.isArray(list) ? list : [])
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchJobs()
    }, [])

    const filtered = jobs.filter(j => {
        const q = search.toLowerCase()
        const matchSearch = j.title?.toLowerCase().includes(q) || String(j.company_id).includes(q)
        const matchRemote = !filterRemote || j.remote
        return matchSearch && matchRemote
    })

    return (
        <div className="max-w-[980px] mx-auto px-7">
            {/* Hero */}
            <div className="grid grid-cols-[1.4fr_1fr] gap-12 items-end py-14 border-b border-line">
                <div>
                    <div className="font-mono text-[12px] text-cobalt font-medium tracking-wide mb-4">
                        // curated tech roles · Thailand
                    </div>
                    <h1 className="font-display font-bold text-[44px] leading-[1.08] tracking-[-1.5px] text-ink m-0">
                        The job board that respects your time.
                    </h1>
                    <div className="flex gap-7 mt-5">
                        {[["120", "open roles"], ["40", "teams"], ["฿65k", "median"]].map(([n, l]) => (
                            <div key={l}>
                                <div className="font-mono text-[22px] font-medium text-ink">{n}</div>
                                <div className="text-[12px] text-gray-lt mt-0.5">{l}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <p className="text-[15px] text-gray leading-relaxed">
                    Every listing is posted by a real team that reads applications.
                    No reposts, no expired roles, no ghosting.
                </p>
            </div>

            {/* Filter row */}
            <div className="flex gap-2 py-5 items-center border-b border-line">
                <div className="flex-1 flex items-center gap-2 bg-paper border border-line rounded-lg px-3.5 py-[9px]">
                    <span className="font-mono text-[13px] text-gray-lt">/</span>
                    <input
                        className="flex-1 bg-transparent border-none outline-none text-[14px] text-ink font-body placeholder:text-gray-lt"
                        placeholder="filter by title or company..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => setFilterRemote(false)}
                    className={`text-[13px] font-medium px-3.5 py-2 rounded-lg border cursor-pointer transition-colors ${
                        !filterRemote
                            ? "border-cobalt bg-cobalt-lt text-cobalt"
                            : "border-line bg-white text-gray hover:bg-paper"
                    }`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilterRemote(true)}
                    className={`text-[13px] font-medium px-3.5 py-2 rounded-lg border cursor-pointer transition-colors ${
                        filterRemote
                            ? "border-cobalt bg-cobalt-lt text-cobalt"
                            : "border-line bg-white text-gray hover:bg-paper"
                    }`}
                >
                    Remote only
                </button>
            </div>

            {/* Job list */}
            {loading && <p className="py-8 text-gray text-[15px]">Loading...</p>}
            {error && <p className="py-8 text-rust text-[14px]">Error: {error}</p>}

            {!loading && !error && (
                <div className="border-b border-line">
                    {filtered.length === 0 && (
                        <p className="py-8 text-gray text-[14px]">No roles match your filter.</p>
                    )}
                    {filtered.map((job, i) => (
                        <div
                            key={job.ID}
                            onClick={() => navigate(`/jobs/${job.ID}`)}
                            className="grid grid-cols-[44px_1fr_auto] gap-[18px] items-center px-3 py-[18px] border-t border-line cursor-pointer hover:bg-paper transition-colors"
                        >
                            {/* Monospace number — the signature */}
                            <span className="font-mono text-[13px] text-gray-lt">
                                {String(i + 1).padStart(3, "0")}
                            </span>

                            {/* Job info */}
                            <div>
                                <div className="flex items-center gap-2.5 mb-1">
                                    <span className="font-display text-[16px] font-medium text-ink">
                                        {job.title}
                                    </span>
                                    {job.remote && (
                                        <span className="text-[11px] font-semibold text-sage bg-sage-bg px-2 py-0.5 rounded-[5px]">
                                            Remote
                                        </span>
                                    )}
                                </div>
                                <div className="text-[13px] text-gray">Company #{job.company_id}</div>
                                <div className="flex gap-3.5 mt-1.5 font-mono text-[12px] text-gray-lt">
                                    <span>{job.location}</span>
                                    <span>·</span>
                                    <span>Full-time</span>
                                </div>
                            </div>

                            {/* Salary */}
                            <div className="text-right">
                                <div className="font-mono text-[15px] font-medium text-ink">
                                    ฿{job.salary?.toLocaleString()}
                                </div>
                                <div className="text-[11px] text-gray-lt mt-0.5">per month</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && !error && (
                <div className="py-4 font-mono text-[12px] text-gray-lt px-3">
                    {filtered.length} of {jobs.length} roles shown
                </div>
            )}
        </div>
    )
}
