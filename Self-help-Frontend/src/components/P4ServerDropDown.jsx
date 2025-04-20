import * as React from "react"
import { useState, useEffect } from "react"
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { setServerReducer } from "../store/p4serverSlice"
import "../index.css"
import Swal from "sweetalert2"
import "../swal-custom.css"

const P4ServerDropDown = () => {
  const [dropDownServer, setDropDownServer] = useState([])

  let dispatch = useDispatch()
  const handleServerChange = (item) => {
    dispatch(setServerReducer(item.target.value))
  }

  let selectedServer = useSelector((state) => {
    return state.p4server
  })
  // Function to fetch the servers
  const getServers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/servers")
      let { data, status } = response.data
      if (status) {
        if (data.length === 0) {
          Swal.fire({
            title: "Error!",
            text: "No Servers in DB",
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
        setDropDownServer([...data])
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
          value={
            dropDownServer.some((server) => server.server === selectedServer)
              ? selectedServer
              : ""
          }
          onChange={handleServerChange}
          className="p4-select"
        >
          {dropDownServer.length === 0 ? (
            <MenuItem disabled>Loading servers...</MenuItem>
          ) : (
            dropDownServer.map((server) => (
              <MenuItem key={server._id} value={server.server}>
                {server.server}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>
    </>
  )
}

export default P4ServerDropDown
