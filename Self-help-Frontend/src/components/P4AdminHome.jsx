import * as React from "react"
import { useState, useEffect } from "react"
import {
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Box,
  TextField
} from "@mui/material"
import axios from "axios"
import P4ServerRequest from "./P4ServerRequest"
import P4DepotRequest from "./P4DepotRequest"
import P4Sanity from "./P4Sanity"

const P4AdminHome = () => {
  const P4RequestType = ["Server Request", "Depot Request", "Sanity Request"]
  const [dropDownRequestType, setdropDownRequestType] = useState("")
  const [serverRequestBool, setServerRequestBool] = useState(false)
  const [depotRequestBool, setDepotRequestBool] = useState(false)
  const [sanityBool, setSanityBool] = useState(false)

  let handleRequestTypeChange = (item) => {
    setdropDownRequestType(item.target.value)
    if (item.target.value === "Server Request") {
      setServerRequestBool(true)
      setDepotRequestBool(false)
    } else if (item.target.value === "Depot Request") {
      setServerRequestBool(false)
      setDepotRequestBool(true)
    } else if (item.target.value === "Sanity Request") {
      setServerRequestBool(false)
      setSanityBool(true)
      setDepotRequestBool(false)
    } else {
      console.log("No Request")
    }
  }

  return (
    <>
      <h1>P4 Admin SH</h1>
      <FormGroup>
        <FormControl fullWidth sx={{ marginBottom: "20px" }}>
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
        {serverRequestBool && <P4ServerRequest />}
        {depotRequestBool && <P4DepotRequest />}
        {sanityBool && <P4Sanity />}
      </FormGroup>
    </>
  )
}

export default P4AdminHome
