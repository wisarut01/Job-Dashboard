import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
// import page

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" />
        <Route path="/jobs/:id" />
        <Route path="/login" /> 
        <Route path="/register" />
        {/* <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
        <Route path="/applications" element={
          <ProtectedRoute><Applications /></ProtectedRoute>
        } /> */}
      </Routes>
    </>
  )
}
