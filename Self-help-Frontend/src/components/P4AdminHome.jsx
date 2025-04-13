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

const P4AdminHome = () => {
  const P4RequestType = ["Server Request", "Depot Request", "Sanity Request"]
  const [dropDownRequestType, setdropDownRequestType] = useState("")

  let handleRequestTypeChange = (item) => {
    setdropDownRequestType(item.target.value)
  }
  return (
    <>
      <h1>P4 Admin SH</h1>
      <FormGroup>
        <FormControl sx={{ minWidth: "100%" }}>
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
      </FormGroup>
    </>
  )
}

export default P4AdminHome
