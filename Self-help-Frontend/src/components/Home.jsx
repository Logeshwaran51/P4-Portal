import React, { useState } from "react"
import {
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton
} from "@mui/material"
import "../home.css"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const Home = () => {
  const [loginType, setLoginType] = useState("admin")
  const [isRegistering, setIsRegistering] = useState(false)
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  })

  const handleTypeChange = (event, newType) => {
    if (newType !== null) {
      setLoginType(newType)
      setIsRegistering(false)
    }
  }

  let navigate = useNavigate()
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCredentials((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loginType === "user" && isRegistering) {
      if (credentials.password !== credentials.confirmPassword) {
        alert("Passwords don't match!")
        return
      } else {
        try {
          const body = {
            userName: credentials.username,
            userPassword: credentials.password
          }
          let userRegisterResponse = await axios.post(
            "http://localhost:8080/api/userRegister",
            body
          )
          console.log(userRegisterResponse.data)
          if (userRegisterResponse.data === true) {
            alert("Registered Successful!")
            setIsRegistering(false)
          } else {
            alert("Already Registered!")
          }
        } catch (error) {
          if (error.response && error.response.status === 401) {
            console.log(error.response.data)
          } else {
            alert("Server Error!")
          }
        }
      }
    } else if (loginType === "admin") {
      try {
        const body = {
          userName: credentials.username,
          userPassword: credentials.password
        }
        let adminLoginResponse = await axios.post(
          "http://localhost:8080/api/adminLogin",
          body
        )
        if (adminLoginResponse.data === true) {
          alert("Login Successful!")
          navigate("/p4admin")
        } else {
          alert("Login Failed!")
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert("Invalid username or password!")
        } else {
          alert("Server Error!")
        }
      }
    } else {
      try {
        const body = {
          userName: credentials.username,
          userPassword: credentials.password
        }
        let userLoginResponse = await axios.post(
          "http://localhost:8080/api/userLogin",
          body
        )
        if (userLoginResponse.data === true) {
          alert("Login Successful!")
          navigate("/p4user")
        } else {
          alert("Login Failed!")
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert("Invalid username or password!")
        } else {
          alert("Server Error!")
        }
      }
    }
  }

  return (
    <div className="login-container">
      <h1 className="login-title">P4SH Login</h1>

      <ToggleButtonGroup
        value={loginType}
        exclusive
        onChange={handleTypeChange}
        className="login-toggle"
      >
        <ToggleButton value="admin" className="toggle-btn">
          Perforce Admin
        </ToggleButton>
        <ToggleButton value="user" className="toggle-btn">
          P4 User
        </ToggleButton>
      </ToggleButtonGroup>

      {loginType === "user" && (
        <div className="register-toggle">
          <Button
            variant={isRegistering ? "text" : "outlined"}
            onClick={() => setIsRegistering(false)}
          >
            Login
          </Button>
          <Button
            variant={!isRegistering ? "text" : "outlined"}
            onClick={() => setIsRegistering(true)}
          >
            Register
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="login-form">
        <TextField
          className="login-input"
          label={`${loginType === "admin" ? "Admin" : "User"} Username`}
          variant="outlined"
          name="username"
          value={credentials.username}
          onChange={handleInputChange}
          fullWidth
          required
        />
        <TextField
          className="login-input"
          label="Password"
          variant="outlined"
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleInputChange}
          fullWidth
          required
          margin="normal"
        />

        {loginType === "user" && isRegistering && (
          <TextField
            className="login-input"
            label="Confirm Password"
            variant="outlined"
            type="password"
            name="confirmPassword"
            value={credentials.confirmPassword}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
          />
        )}

        <Button
          type="submit"
          variant="contained"
          className="login-submit-btn"
          fullWidth
        >
          {loginType === "admin"
            ? "Login as Admin"
            : isRegistering
            ? "Register"
            : "Login as User"}
        </Button>
      </form>
    </div>
  )
}

export default Home
