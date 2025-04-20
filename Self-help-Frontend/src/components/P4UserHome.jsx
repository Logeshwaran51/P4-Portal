import * as React from "react"
import { useState } from "react"

import {
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material"

import P4ClientRequest from "./P4ClientRequest"
import P4LabelRequest from "./P4LabelRequest"
import "../index.css"
import { useDispatch, useSelector } from "react-redux"
import { setServerReducer } from "../store/p4serverSlice"
import Navbar from "./Navbar"

const P4UserHome = () => {
  const [dropDownRequestType, setDropDownRequestType] = useState("")
  const [clientBool, setClientBool] = useState(false)
  const [labelBool, setLabelBool] = useState(false)
  const [username, setUsername] = useState("admin_user")

  const P4RequestType = ["Client Request", "Label Request"]

  let selectedServer = useSelector((state) => {
    return state.p4server
  })

  let dispatch = useDispatch()

  const handleLogout = () => {
    // Add your logout logic here
    console.log("User logged out")
  }

  const handleRequestTypeChange = (item) => {
    if (item.target.value === "Client Request") {
      setClientBool(true)
      setLabelBool(false)
      if (selectedServer) {
        dispatch(setServerReducer(""))
      }
    } else if (item.target.value === "Label Request") {
      setLabelBool(true)
      setClientBool(false)
      if (selectedServer) {
        dispatch(setServerReducer(""))
      }
    }
    setDropDownRequestType(item.target.value)
  }

  return (
    <>
      <Navbar username={username} onLogout={handleLogout} />
      <div className="p4-container">
        <FormGroup className="p4-form-group">
          <FormControl className="p4-form-control" sx={{ minWidth: "100%" }}>
            <InputLabel id="request-type">Select Request Type</InputLabel>
            <Select
              labelId="request-type"
              id="request-type-select"
              label="Select Request Type"
              value={dropDownRequestType}
              onChange={handleRequestTypeChange}
            >
              {P4RequestType.map((item, index) => (
                <MenuItem key={index} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {clientBool && <P4ClientRequest className="p4-subcomponent" />}

          {labelBool && <P4LabelRequest className="p4-subcomponent" />}
        </FormGroup>
      </div>
    </>
  )
}

export default P4UserHome
