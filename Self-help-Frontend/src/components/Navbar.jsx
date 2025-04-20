import React from "react"
import { ExitToApp } from "@mui/icons-material"
import "../navbar.css"
const Navbar = ({ username, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar__content">
        {/* Left side - Title */}
        <div className="navbar__title">P4SH Portal</div>

        {/* Right side - User info and logout */}
        <div className="navbar__user-section">
          <span className="navbar__username">{username}</span>
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
