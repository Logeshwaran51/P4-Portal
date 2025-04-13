import { useState } from "react"
import "./App.css"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import Home from "./components/Home"
import P4AdminHome from "./components/P4AdminHome"
import P4UserHome from "./components/P4UserHome"

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/p4admin" element={<P4AdminHome />}></Route>
          <Route path="/p4user" element={<P4UserHome />}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
