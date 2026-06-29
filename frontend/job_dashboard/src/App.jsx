import { Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import JobDetail from "./pages/JobDetail"
import MyApplications from "./pages/MyApplications"
import Profile from "./pages/Profile"

export default function App() {
    return (
        <>
            <Navbar />
            <Routes>
                {/* Public */}
                <Route path="/" element={<Home />} />
                <Route path="/jobs/:id" element={<JobDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected */}
                <Route path="/applications" element={
                    <ProtectedRoute><MyApplications /></ProtectedRoute>
                } />
                <Route path="/profile" element={
                    <ProtectedRoute><Profile /></ProtectedRoute>
                } />
            </Routes>
        </>
    )
}
