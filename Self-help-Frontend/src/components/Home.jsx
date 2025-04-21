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
import { useDispatch, useSelector } from "react-redux"
import { setUserReducer } from "../store/userSlice"
import Swal from "sweetalert2"
import "../swal-custom.css"

const Home = () => {
  const [loginType, setLoginType] = useState("admin")
  const [isRegistering, setIsRegistering] = useState(false)
  const [credentials, setCredentials] = useState({
    password: "",
    confirmPassword: ""
  })

  let userName = useSelector((state) => {
    return state.userName
  })
  const dispatch = useDispatch()

  const handleTypeChange = (event, newType) => {
    if (newType !== null) {
      setLoginType(newType)
      setIsRegistering(false)
    }
  }

  let navigate = useNavigate()
  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === "username") {
      dispatch(setUserReducer(value))
    } else {
      setCredentials((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loginType === "user" && isRegistering) {
      if (credentials.password !== credentials.confirmPassword) {
        Swal.fire({
          title: "Error!",
          text: "Password Mismatch!!",
          icon: "error",
          background: "#ffffff",
          color: "#262626",
          confirmButtonColor: "#d32f2f",
          confirmButtonText: "Try Again",
          customClass: {
            container: "swal-container",
            popup: "swal-popup",
            title: "swal-title",
            content: "swal-text",
            confirmButton: "swal-confirm"
          }
        })
        return
      } else {
        try {
          const body = {
            userName: userName,
            userPassword: credentials.password
          }
          let userRegisterResponse = await axios.post(
            "http://localhost:8080/api/userRegister",
            body
          )
          let { data, status } = userRegisterResponse.data
          if (status) {
            Swal.fire({
              title: "Success!",
              text: data,
              icon: "success",
              background: "#ffffff",
              color: "#262626",
              confirmButtonColor: "#0095f6",
              confirmButtonText: "OK",
              customClass: {
                container: "swal-container",
                popup: "swal-popup",
                title: "swal-title",
                content: "swal-text",
                confirmButton: "swal-confirm"
              }
            }).then((result) => {
              if (result.isConfirmed) {
                setIsRegistering(false)
              }
            })
          }
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: error.response.data.error,
            icon: "error",
            background: "#ffffff",
            color: "#262626",
            confirmButtonColor: "#d32f2f",
            confirmButtonText: "Try Again",
            customClass: {
              container: "swal-container",
              popup: "swal-popup",
              title: "swal-title",
              content: "swal-text",
              confirmButton: "swal-confirm"
            }
          })
        }
      }
    } else if (loginType === "admin") {
      try {
        const body = {
          userName: userName,
          userPassword: credentials.password
        }
        console.log(body)
        let adminLoginResponse = await axios.post(
          "http://localhost:8080/api/adminLogin",
          body
        )
        console.log(adminLoginResponse.data)
        let { data, status } = adminLoginResponse.data
        if (status) {
          Swal.fire({
            title: "Success!",
            text: data,
            icon: "success",
            background: "#ffffff",
            color: "#262626",
            confirmButtonColor: "#0095f6",
            confirmButtonText: "OK",
            customClass: {
              container: "swal-container",
              popup: "swal-popup",
              title: "swal-title",
              content: "swal-text",
              confirmButton: "swal-confirm"
            }
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/p4admin")
            }
          })
        }
      } catch (error) {
        console.log(error.response.data)
        Swal.fire({
          title: "Error!",
          text: error.response.data.error,
          icon: "error",
          background: "#ffffff",
          color: "#262626",
          confirmButtonColor: "#d32f2f",
          confirmButtonText: "Try Again",
          customClass: {
            container: "swal-container",
            popup: "swal-popup",
            title: "swal-title",
            content: "swal-text",
            confirmButton: "swal-confirm"
          }
        })
      }
    } else {
      try {
        const body = {
          userName: userName,
          userPassword: credentials.password
        }
        let userLoginResponse = await axios.post(
          "http://localhost:8080/api/userLogin",
          body
        )
        let { data, status } = userLoginResponse.data
        if (status) {
          Swal.fire({
            title: "Success!",
            text: data,
            icon: "success",
            background: "#ffffff",
            color: "#262626",
            confirmButtonColor: "#0095f6",
            confirmButtonText: "OK",
            customClass: {
              container: "swal-container",
              popup: "swal-popup",
              title: "swal-title",
              content: "swal-text",
              confirmButton: "swal-confirm"
            }
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/p4user")
            }
          })
        }
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error.response.data.error,
          icon: "error",
          background: "#ffffff",
          color: "#262626",
          confirmButtonColor: "#d32f2f",
          confirmButtonText: "Try Again",
          customClass: {
            container: "swal-container",
            popup: "swal-popup",
            title: "swal-title",
            content: "swal-text",
            confirmButton: "swal-confirm"
          }
        })
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
          value={userName}
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
