import * as React from "react"
import { useState, useEffect } from "react"
import {
  FormControl,
  Button,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Box,
  TextField
} from "@mui/material"
import axios from "axios"
import P4ServerDropDown from "./P4ServerDropDown"
import { useDispatch, useSelector } from "react-redux"
import { setServerReducer } from "../store/p4serverSlice"
import "../index.css"

const P4ServerRequest = () => {
  const [serverRequest, setServerRequest] = useState("")
  const [serverAddBool, setServerAddBool] = useState(false)
  const [inputField, setInputField] = useState("")
  const [serverRemoveBool, setServerRemoveBool] = useState(false)
  const ServerRequestType = ["ADD", "REMOVE"]

  let handleSetServerRequest = (item) => {
    setServerRequest(item.target.value)
  }

  let selectedServer = useSelector((state) => {
    return state.p4server
  })

  let serverAdd = () => {
    setServerAddBool(true)
    setServerRemoveBool(false)
  }

  let serverRemove = () => {
    setServerRemoveBool(true)
    setServerAddBool(false)
  }

  let handleInputField = (item) => {
    setInputField(item.target.value)
  }

  let dispatch = useDispatch()

  const handleClientSubmit = async () => {
    if (serverRequest === "ADD") {
      const data = {
        server: inputField
      }
      try {
        const addServer = await axios.post(
          "http://localhost:8080/api/addServer",
          data
        )
        const responseAddServer = addServer.data
        if (responseAddServer) {
          console.log(responseAddServer)
          setInputField("")
          setServerRequest("")
        } else {
          console.log("Not added!!")
        }
      } catch (error) {
        console.log(error)
      }
    } else if (serverRequest === "REMOVE") {
      const data = {
        server: selectedServer
      }
      try {
        const removeServer = await axios.post(
          "http://localhost:8080/api/removeServer",
          data
        )
        const responseRemoveServer = removeServer.data
        if (responseRemoveServer) {
          console.log(responseRemoveServer)
          dispatch(setServerReducer(""))
          setServerRequest("")
        } else {
          console.log("Not deleted!!")
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    if (serverRequest === "ADD") {
      serverAdd()
    } else if (serverRequest === "REMOVE") {
      serverRemove()
    }
  }, [serverRequest])

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
        className="p4-form-container"
        sx={{ width: "100%", marginTop: "10px" }}
      >
        <FormControl
          className="p4-form-control"
          fullWidth
          sx={{ marginBottom: "20px" }}
        >
          <FormLabel className="p4-form-label" id="servers-radio-group-label">
            Server Request
          </FormLabel>
          <RadioGroup
            className="p4-radio-group"
            aria-labelledby="servers-radio-group-label"
            name="servers-radio-group"
            value={serverRequest}
            onChange={handleSetServerRequest}
          >
            {ServerRequestType.map((item, index) => (
              <FormControlLabel
                key={index}
                className="p4-radio-option"
                value={item}
                control={<Radio className="p4-radio-button" />}
                label={item}
              />
            ))}
          </RadioGroup>
        </FormControl>

        {serverAddBool && (
          <FormControl
            className="p4-form-control"
            fullWidth
            sx={{ marginBottom: "20px" }}
          >
            <TextField
              className="p4-text-field"
              id="filled-basic"
              label="Enter a Server (Eg: localhost:1669)"
              variant="filled"
              value={inputField}
              onChange={handleInputField}
            />
          </FormControl>
        )}

        {serverRemoveBool && (
          <FormControl
            className="p4-form-control"
            fullWidth
            sx={{ marginBottom: "20px" }}
          >
            <P4ServerDropDown className="p4-subcomponent" />
          </FormControl>
        )}
        <Button className="p4-submit-button" variant="contained" type="submit">
          Submit
        </Button>
      </Box>
    </>
  )
}

export default P4ServerRequest
