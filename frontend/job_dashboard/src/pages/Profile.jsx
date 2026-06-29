import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import apiFetch from "../api/client"

export default function Profile() {
    const { user, signout } = useAuth()
    const navigate = useNavigate()
    const [tab, setTab] = useState("profile")

    const [name, setName] = useState(user?.name ?? "")
    const [profileMsg, setProfileMsg] = useState(null)
    const [profileLoading, setProfileLoading] = useState(false)

    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [passwordMsg, setPasswordMsg] = useState(null)
    const [passwordLoading, setPasswordLoading] = useState(false)

    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        setProfileMsg(null)
        setProfileLoading(true)
        try {
            await apiFetch(`/users/${user.id}`, {
                method: "PATCH",
                body: JSON.stringify({ name }),
            })
            setProfileMsg({ ok: true, text: "Saved!" })
        } catch (err) {
            setProfileMsg({ ok: false, text: err.message })
        } finally {
            setProfileLoading(false)
        }
    }

    const handleUpdatePassword = async (e) => {
        e.preventDefault()
        setPasswordMsg(null)
        setPasswordLoading(true)
        try {
            await apiFetch(`/users/${user.id}/password`, {
                method: "PATCH",
                body: JSON.stringify({ oldPassword, newPassword }),
            })
            setPasswordMsg({ ok: true, text: "Password updated!" })
            setOldPassword(""); setNewPassword("")
        } catch (err) {
            setPasswordMsg({ ok: false, text: err.message })
        } finally {
            setPasswordLoading(false)
        }
    }

    const handleSignout = async () => {
        await signout()
        navigate("/")
    }

    const inputClass = "w-full border border-line-dk rounded-lg px-3.5 py-[10px] text-[14px] text-ink font-body outline-none focus:border-cobalt transition-colors"
    const labelClass = "block text-[13px] font-medium text-ink mb-1.5"
    const msgClass = (ok) => `text-[13px] px-3.5 py-2.5 rounded-lg ${ok ? "text-sage bg-sage-bg" : "text-rust bg-rust-bg"}`

    return (
        <div className="max-w-[980px] mx-auto px-7 pb-16">
            <div className="grid grid-cols-[200px_1fr] gap-8 pt-10">
                {/* Sidebar */}
                <div>
                    {/* Avatar */}
                    <div className="flex flex-col items-center mb-5">
                        <div className="w-16 h-16 rounded-full bg-cobalt-lt border-2 border-cobalt flex items-center justify-center text-cobalt font-display font-bold text-2xl mb-3">
                            {user?.name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <div className="font-display font-medium text-[16px] text-ink">{user?.name}</div>
                        <div className="font-mono text-[11px] text-gray-lt mt-0.5">{user?.role}</div>
                    </div>

                    {/* Nav */}
                    <div className="space-y-1">
                        {[["profile", "Profile"], ["password", "Password"]].map(([t, l]) => (
                            <button key={t} onClick={() => setTab(t)}
                                className={`w-full text-left px-3 py-2.5 rounded-[7px] text-[14px] font-medium cursor-pointer border-none transition-colors ${
                                    tab === t
                                        ? "bg-cobalt-lt text-cobalt"
                                        : "bg-transparent text-gray hover:bg-paper"
                                }`}>
                                {l}
                            </button>
                        ))}
                        <button onClick={handleSignout}
                            className="w-full text-left px-3 py-2.5 rounded-[7px] text-[14px] font-medium text-rust bg-transparent border-none cursor-pointer hover:bg-rust-bg transition-colors mt-4">
                            Sign out
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div>
                    {tab === "profile" && (
                        <div>
                            <h2 className="font-display font-bold text-[22px] tracking-tight text-ink m-0 mb-6">
                                Profile
                            </h2>
                            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4 max-w-[440px]">
                                <div>
                                    <label className={labelClass}>Name</label>
                                    <input type="text" className={inputClass} value={name}
                                        onChange={e => setName(e.target.value)} />
                                </div>
                                <div>
                                    <label className={labelClass}>Email</label>
                                    <input type="email" className={inputClass} value={user?.email} disabled
                                        style={{ opacity: 0.6, cursor: "not-allowed" }} />
                                </div>
                                <div>
                                    <label className={labelClass}>Role</label>
                                    <div className="font-mono text-[13px] text-gray-lt px-3.5 py-[10px] bg-paper border border-line rounded-lg">
                                        {user?.role}
                                    </div>
                                </div>
                                {profileMsg && <p className={msgClass(profileMsg.ok)}>{profileMsg.text}</p>}
                                <button type="submit" disabled={profileLoading}
                                    className="w-auto self-start bg-cobalt text-white font-semibold text-[14px] px-5 py-2.5 rounded-lg hover:opacity-90 disabled:opacity-60 cursor-pointer transition-opacity">
                                    {profileLoading ? "Saving..." : "Save changes"}
                                </button>
                            </form>
                        </div>
                    )}

                    {tab === "password" && (
                        <div>
                            <h2 className="font-display font-bold text-[22px] tracking-tight text-ink m-0 mb-6">
                                Password
                            </h2>
                            <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4 max-w-[440px]">
                                <div>
                                    <label className={labelClass}>Current password</label>
                                    <input type="password" className={inputClass} placeholder="••••••••"
                                        value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
                                </div>
                                <div>
                                    <label className={labelClass}>New password</label>
                                    <input type="password" className={inputClass} placeholder="••••••••"
                                        value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                                </div>
                                {passwordMsg && <p className={msgClass(passwordMsg.ok)}>{passwordMsg.text}</p>}
                                <button type="submit" disabled={passwordLoading}
                                    className="w-auto self-start bg-cobalt text-white font-semibold text-[14px] px-5 py-2.5 rounded-lg hover:opacity-90 disabled:opacity-60 cursor-pointer transition-opacity">
                                    {passwordLoading ? "Updating..." : "Update password"}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
