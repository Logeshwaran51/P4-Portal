import * as React from "react"
import { useState, useEffect } from "react"
import {
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert
} from "@mui/material"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { setServerReducer } from "../store/p4serverSlice"

const P4ServerDropDown = () => {
  const [dropDownServer, setDropDownServer] = useState([])
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  // Function to fetch the servers
  const getServers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/servers")
      const { data, success, message } = response.data
      if (success) {
        setDropDownServer([...data])
        setMessage(message)
      } else {
        setError(message)
      }
    } catch (error) {
      setError("Failed to fetch servers")
    }
  }

  let dispatch = useDispatch()
  const handleServerChange = (item) => {
    dispatch(setServerReducer(item.target.value))
  }

  let selectedServer = useSelector((state) => {
    return state.p4server
  })

  useEffect(() => {
    getServers()
  }, [])

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ marginBottom: "10px" }}>
          {error}
        </Alert>
      )}
      {message && (
        <Alert severity="success" sx={{ marginBottom: "10px" }}>
          {message}
        </Alert>
      )}
      <FormControl sx={{ minWidth: "100%", marginTop: "10px" }}>
        <InputLabel id="p4servers">Select Server</InputLabel>
        <Select
          labelId="p4servers"
          id="p4servers-select"
          label="Select Server"
          value={selectedServer}
          onChange={handleServerChange}
        >
          {dropDownServer.map((server, index) => (
            <MenuItem key={server._id} value={server.server}>
              {server.server}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  )
}

export default P4ServerDropDown
