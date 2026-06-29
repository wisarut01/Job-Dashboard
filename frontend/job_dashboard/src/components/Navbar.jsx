import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Navbar() {
    const { user, signout } = useAuth()
    const navigate = useNavigate()

    const handleSignout = async () => {
        await signout()
        navigate("/")
    }

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-line flex items-center justify-between px-7 h-[60px]">
            {/* Brand */}
            <Link to="/" className="flex items-center gap-2 no-underline">
                <span className="font-mono text-[13px] text-white bg-cobalt px-[7px] py-[3px] rounded-[5px] font-medium">
                    wr
                </span>
                <span className="font-display font-bold text-[19px] tracking-tight text-ink">
                    workroot
                </span>
            </Link>

            {/* Nav links */}
            <div className="flex items-center gap-1">
                {user ? (
                    <>
                        <Link to="/applications" className="text-[14px] font-medium text-gray px-[13px] py-[7px] rounded-[7px] hover:bg-paper hover:text-ink no-underline transition-colors">
                            Applications
                        </Link>
                        <Link to="/profile" className="text-[14px] font-medium text-gray px-[13px] py-[7px] rounded-[7px] hover:bg-paper hover:text-ink no-underline transition-colors">
                            Profile
                        </Link>
                        <button
                            onClick={handleSignout}
                            className="text-[14px] font-semibold text-ink border border-line-dk px-4 py-2 rounded-[7px] bg-white hover:bg-paper transition-colors cursor-pointer"
                        >
                            Sign out
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-[14px] font-medium text-gray px-[13px] py-[7px] rounded-[7px] hover:bg-paper hover:text-ink no-underline transition-colors">
                            Log in
                        </Link>
                        <Link to="/register" className="text-[14px] font-semibold text-white bg-cobalt px-4 py-2 rounded-[7px] no-underline hover:opacity-90 transition-opacity">
                            Create account
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}
