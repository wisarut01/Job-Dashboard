import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Login() {
    const { signin } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            await signin(email, password)
            navigate("/")
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-[380px] mx-auto px-7 mt-[72px]">
            <div className="font-mono text-[12px] text-cobalt mb-3">auth/login</div>
            <h1 className="font-display font-bold text-[28px] tracking-tight text-ink m-0 mb-1.5">
                Welcome back
            </h1>
            <p className="text-[14px] text-gray mb-7">
                Log in to apply and track your applications.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block text-[13px] font-medium text-ink mb-1.5">Email</label>
                    <input
                        type="email"
                        required
                        className="w-full border border-line-dk rounded-lg px-3.5 py-[10px] text-[14px] text-ink font-body outline-none focus:border-cobalt transition-colors"
                        placeholder="you@email.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-[13px] font-medium text-ink mb-1.5">Password</label>
                    <input
                        type="password"
                        required
                        className="w-full border border-line-dk rounded-lg px-3.5 py-[10px] text-[14px] text-ink font-body outline-none focus:border-cobalt transition-colors"
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>

                {error && (
                    <div className="text-[13px] text-rust bg-rust-bg border border-rust border-opacity-20 rounded-lg px-3.5 py-2.5">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-cobalt text-white font-semibold text-[14px] py-[11px] rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer mt-1"
                >
                    {loading ? "Logging in..." : "Log in"}
                </button>
            </form>

            <p className="text-[13px] text-gray text-center mt-5">
                No account yet?{" "}
                <Link to="/register" className="text-cobalt font-semibold no-underline hover:underline">
                    Create one
                </Link>
            </p>
        </div>
    )
}
