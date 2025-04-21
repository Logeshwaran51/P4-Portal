import React from "react"
import { ExitToApp } from "@mui/icons-material"
import "../navbar.css"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { setUserReducer } from "../store/userSlice"

const Navbar = () => {
  let userName = useSelector((state) => {
    return state.userName
  })

  let dispatch = useDispatch()
  let navigate = useNavigate()
  const onLogout = () => {
    dispatch(setUserReducer(""))
    navigate("/")
  }
  return (
    <nav className="navbar">
      <div className="navbar__content">
        {/* Left side - Title */}
        <div className="navbar__title">P4SH Portal</div>

        {/* Right side - User info and logout */}
        <div className="navbar__user-section">
          <span className="navbar__username">Welcome {userName}</span>
          <button className="navbar__logout-btn" onClick={onLogout}>
            <ExitToApp className="navbar__logout-icon" />
            <span>Logout</span>
          </button>
        </div>
      </div>
      <div className="navbar__divider"></div>
    </nav>
  )
}

export default Navbar
