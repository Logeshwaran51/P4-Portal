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
import "../index.css"

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
      <FormControl
        className="p4-form-control"
        fullWidth
        variant="outlined"
        sx={{ marginTop: "10px" }}
      >
        <InputLabel id="server-select-label" className="p4-input-label">
          Select Server
        </InputLabel>
        <Select
          labelId="server-select-label"
          id="server-select"
          label="Select Server"
          value={selectedServer}
          onChange={handleServerChange}
          className="p4-select"
        >
          {dropDownServer.map((server) => (
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
