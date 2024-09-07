import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/auth/Login'
import Navbar from './components/navbar/Navbar';
import Cases from './components/data_col/Cases';
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navbar />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/cases" element={<Cases />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
