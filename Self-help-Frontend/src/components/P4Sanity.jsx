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
import P4DepotDropDown from "./P4DepotDropDown"
import { useDispatch, useSelector } from "react-redux"
import P4ServerDropDown from "./P4ServerDropDown"
import { setServerReducer } from "../store/p4serverSlice"

function P4Sanity() {
  const [inputP4PathField, setInputP4PathField] = useState("")

  const handleP4PathInputField = (item) => {
    setInputP4PathField(item.target.value)
  }

  let selectedServer = useSelector((state) => {
    return state.p4server
  })

  let dispatch = useDispatch()

  const handleClientSubmit = async () => {
    try {
      const body = {
        server: selectedServer,
        user: "ulaga",
        p4Path: inputP4PathField
      }
      let response = await axios.post("http://localhost:8080/api/sanity", body)
      const { data, success, message } = response.data
      if (success) {
        console.log(data)
        console.log(message)
        dispatch(setServerReducer(""))
        setInputP4PathField("")
      } else {
        console.log(message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault()
          handleClientSubmit()
        }}
        sx={{ width: "100%", marginTop: "10px" }}
      >
        <P4ServerDropDown />

        <FormControl fullWidth sx={{ marginBottom: "20px", marginTop: "20px" }}>
          <TextField
            id="filled-basic"
            label="Enter a Path (Eg: //depot/...)"
            variant="filled"
            value={inputP4PathField}
            onChange={handleP4PathInputField}
          />
        </FormControl>

        <Button variant="contained" type="submit" sx={{ marginTop: "20px" }}>
          Submit
        </Button>
      </Box>
    </>
  )
}

export default P4Sanity
