// 1. import useState, useEffect จาก "react"

// 2. import useNavigate จาก "react-router-dom"

// 3. import getJobs จาก "../api/jobs"

// 4. สร้าง component Home

// 5. สร้าง states:
//    - jobs (array, เริ่มเป็น [])
//    - loading (boolean, เริ่มเป็น true)
//    - error (string, เริ่มเป็น null)
//    - search (string, เริ่มเป็น "")
//    - filterRemote (boolean, เริ่มเป็น false)

// 6. useEffect — fetch jobs ตอน mount:
//    - เรียก getJobs()
//    - setJobs ด้วยข้อมูลที่ได้
//    - ถ้า error → setError(err.message)
//    - finally → setLoading(false)
//    hint: backend return { jobs: [...] } หรือ array ตรงๆ
//          ดู handler ของ backend ว่า return อะไร

// 7. สร้าง filteredJobs:
//    กรองจาก jobs โดย:
//    - title หรือ company ตรงกับ search (case insensitive)
//    - ถ้า filterRemote เป็น true → เอาแค่ remote: true

// 8. สร้าง navigate = useNavigate()

// 9. return JSX:
//    - search input ที่ผูกกับ state search
//    - ปุ่ม toggle filterRemote ("All" / "Remote only")
//    - ถ้า loading → แสดง "Loading..."
//    - ถ้า error → แสดง error message
//    - map filteredJobs แต่ละ job แสดง:
//        title, company, salary, location, remote badge
//        onClick → navigate(`/jobs/${job.id}`)
//    - อย่าลืม key={job.id}

// 10. export default Home

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GetJobs } from "../api/jobs";

export default function Home() {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [search, setSearch] = useState("")
    const [filterRemote, setFilterRemote] = useState(false)

    useEffect(() => {
        async function fetchJobs() {
            const data = await GetJobs()
            if (data instanceof Error) {
                setError(data.message)
            } else {
                setJobs(data.jobs ?? data)
            }
            setLoading(false)
        }
        fetchJobs()
    }, [])

    const filteredJobs = jobs.filter((job) => {
        const matchesSearch =
            job.title.toLowerCase().includes(search.toLowerCase()) ||
            job.company.toLowerCase().includes(search.toLowerCase())
        const matchesRemote = !filterRemote || job.remote
        return matchesSearch && matchesRemote
    })

    const navigate = useNavigate()

    return (
        <>
            Search{" "}
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={() => setFilterRemote(!filterRemote)}>
                {filterRemote ? "Remote only" : "All"}
            </button>

            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}

            {!loading &&
                !error &&
                filteredJobs.map((job) => (
                    <div key={job.id} onClick={() => navigate(`/jobs/${job.id}`)}>
                        <h3>{job.title}</h3>
                        <p>{job.company}</p>
                        <p>{job.salary}</p>
                        <p>{job.location}</p>
                        {job.remote && <span>Remote</span>}
                    </div>
                ))}
        </>
    )
}