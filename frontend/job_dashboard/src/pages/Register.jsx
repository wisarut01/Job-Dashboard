import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { register } from "../api/auth"

export default function Register() {
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("jobseeker")
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            await register({ name, email, password, role })
            navigate("/login")
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const inputClass = "w-full border border-line-dk rounded-lg px-3.5 py-[10px] text-[14px] text-ink font-body outline-none focus:border-cobalt transition-colors"
    const labelClass = "block text-[13px] font-medium text-ink mb-1.5"

    return (
        <div className="max-w-[380px] mx-auto px-7 mt-[72px]">
            <div className="font-mono text-[12px] text-cobalt mb-3">auth/register</div>
            <h1 className="font-display font-bold text-[28px] tracking-tight text-ink m-0 mb-1.5">
                Create your account
            </h1>
            <p className="text-[14px] text-gray mb-7">
                Takes about a minute. No credit card.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className={labelClass}>Name</label>
                    <input type="text" required className={inputClass} placeholder="Wisarut"
                        value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div>
                    <label className={labelClass}>Email</label>
                    <input type="email" required className={inputClass} placeholder="you@email.com"
                        value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div>
                    <label className={labelClass}>Password</label>
                    <input type="password" required className={inputClass} placeholder="8+ characters"
                        value={password} onChange={e => setPassword(e.target.value)} />
                </div>

                {/* Role selector */}
                <div>
                    <label className={labelClass}>I'm here to</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => setRole("jobseeker")}
                            className={`text-[13px] font-medium py-2.5 rounded-lg border cursor-pointer transition-colors ${
                                role === "jobseeker"
                                    ? "border-cobalt bg-cobalt-lt text-cobalt"
                                    : "border-line bg-white text-gray hover:bg-paper"
                            }`}
                        >
                            Find a job
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole("employer")}
                            className={`text-[13px] font-medium py-2.5 rounded-lg border cursor-pointer transition-colors ${
                                role === "employer"
                                    ? "border-cobalt bg-cobalt-lt text-cobalt"
                                    : "border-line bg-white text-gray hover:bg-paper"
                            }`}
                        >
                            Hire people
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="text-[13px] text-rust bg-rust-bg rounded-lg px-3.5 py-2.5">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-cobalt text-white font-semibold text-[14px] py-[11px] rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer mt-1"
                >
                    {loading ? "Creating account..." : "Create account"}
                </button>
            </form>

            <p className="text-[13px] text-gray text-center mt-5">
                Already have one?{" "}
                <Link to="/login" className="text-cobalt font-semibold no-underline hover:underline">
                    Log in
                </Link>
            </p>
        </div>
    )
}
