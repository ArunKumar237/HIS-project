// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/auth/Login'
import Navbar from './components/navbar/Navbar';
import Cases from './components/data_col/Cases';
import Dashboard from './components/dashboard/Dashboard';
import Unlock from './components/auth/Unlock';
import Forget from "./components/auth/Forget";
import Reset from "./components/auth/Reset";
import Logout from "./components/auth/Logout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import './App.css'
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navbar />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/logout" element={<Logout />}></Route>
          <Route path="/cases" element={<Cases />}></Route>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/unlock" element={<Unlock />}></Route>
          <Route path="/forgot" element={<Forget />}></Route>
          <Route path="/reset" element={<Reset />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
