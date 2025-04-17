import * as React from "react"
import { useState } from "react"
import {
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material"

import P4ServerRequest from "./P4ServerRequest"
import P4DepotRequest from "./P4DepotRequest"
import P4Sanity from "./P4Sanity"
import "../index.css"
import { useDispatch, useSelector } from "react-redux"
import { setServerReducer } from "../store/p4serverSlice"

const P4AdminHome = () => {
  const P4RequestType = ["Server Request", "Depot Request", "Sanity Request"]
  const [dropDownRequestType, setdropDownRequestType] = useState("")
  const [serverRequestBool, setServerRequestBool] = useState(false)
  const [depotRequestBool, setDepotRequestBool] = useState(false)
  const [sanityBool, setSanityBool] = useState(false)

  let selectedServer = useSelector((state) => {
    return state.p4server
  })

  let dispatch = useDispatch()

  let handleRequestTypeChange = (item) => {
    setdropDownRequestType(item.target.value)
    if (item.target.value === "Server Request") {
      setServerRequestBool(true)
      setDepotRequestBool(false)
      setSanityBool(false)
      if (selectedServer) {
        dispatch(setServerReducer(""))
      }
    } else if (item.target.value === "Depot Request") {
      setServerRequestBool(false)
      setDepotRequestBool(true)
      setSanityBool(false)
      if (selectedServer) {
        dispatch(setServerReducer(""))
      }
    } else if (item.target.value === "Sanity Request") {
      setServerRequestBool(false)
      setSanityBool(true)
      setDepotRequestBool(false)
      if (selectedServer) {
        dispatch(setServerReducer(""))
      }
    } else {
      console.log("No Request")
    }
  }

  return (
    <>
      <div className="p4-container">
        <h1 className="p4-title">P4 Admin SH</h1>

        <FormGroup className="p4-form-group">
          <FormControl className="p4-form-control" fullWidth>
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

          {serverRequestBool && <P4ServerRequest className="p4-subcomponent" />}
          {depotRequestBool && <P4DepotRequest className="p4-subcomponent" />}
          {sanityBool && <P4Sanity className="p4-subcomponent" />}
        </FormGroup>
      </div>
    </>
  )
}

export default P4AdminHome
