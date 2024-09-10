// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/auth/Login'
import Cases from './components/data_col/Cases';
import Dashboard from './components/dashboard/Dashboard';
import Unlock from './components/auth/Unlock';
import Forget from "./components/auth/Forget";
import Reset from "./components/auth/Reset";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Home from "./components/homepage/Home";
import './App.css'
import { Fragment } from "react";
function App() {
  return (
    <Fragment>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/unlock" element={<Unlock />}></Route>
          <Route path="/forgot" element={<Forget />}></Route>
          <Route path="/reset" element={<Reset />}></Route>
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>}></Route>
          <Route path="/cases" element={<ProtectedRoute><Cases /></ProtectedRoute>}></Route>
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </Fragment>
  )
}

export default App
