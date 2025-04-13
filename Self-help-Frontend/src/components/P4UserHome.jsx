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
import P4ServerDropDown from "./P4ServerDropDown"
import P4ClientRequest from "./P4ClientRequest"
import P4LabelRequest from "./P4LabelRequest"

const P4UserHome = () => {
  const [dropDownRequestType, setDropDownRequestType] = useState("")
  const [clientBool, setClientBool] = useState(false)
  const [labelBool, setLabelBool] = useState(false)

  const P4RequestType = ["Client Request", "Label Request"]

  const handleRequestTypeChange = (item) => {
    if (item.target.value === "Client Request") {
      setClientBool(true)
      setLabelBool(false)
    } else if (item.target.value === "Label Request") {
      setLabelBool(true)
      setClientBool(false)
    }
    setDropDownRequestType(item.target.value)
  }

  return (
    <>
      <h1>P4 User SH</h1>
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
        <P4ServerDropDown />
        {clientBool && (
          <>
            <P4ClientRequest />
          </>
        )}
        {labelBool && (
          <>
            <P4LabelRequest />
          </>
        )}
      </FormGroup>
    </>
  )
}

export default P4UserHome
