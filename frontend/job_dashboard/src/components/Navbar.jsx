import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Navbar() {
    const { user, signout } = useAuth()
    const navigate = useNavigate()
    
    const handleSignout = async () => {
        await signout()
        navigate("/")
    }

    return (
        <nav>
            <Link to="/">workroot</Link>
            {
                user ? (
                    <div>
                        <Link to="/applications">Applications</Link>
                        <Link to="/profile">Profile</Link>
                        <button onClick={handleSignout}>Sign Out</button>
                    </div>
                ) : (
                    <div>
                        <Link to="/login">Log in</Link>
                        <Link to="/register">Create account</Link>
                    </div>
                )
            }
        </nav>
    )
}
