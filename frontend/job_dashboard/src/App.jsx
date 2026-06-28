import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
// import page

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element= {<Home />}/>
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
