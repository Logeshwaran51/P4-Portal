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
import Swal from "sweetalert2"
import "../swal-custom.css"

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
      const body = {
        server: inputField
      }
      try {
        const addServer = await axios.post(
          "http://localhost:8080/api/addServer",
          body
        )
        let { data, status } = addServer.data
        if (status) {
          Swal.fire({
            title: "Success!",
            text: data,
            icon: "success",
            background: "#ffffff",
            color: "#262626",
            confirmButtonColor: "#0095f6",
            confirmButtonText: "OK",
            customClass: {
              container: "swal-container",
              popup: "swal-popup",
              title: "swal-title",
              content: "swal-text",
              confirmButton: "swal-confirm"
            }
          })
          setInputField("")
          setServerRequest("")
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
      setInputField("")
    } else if (serverRequest === "REMOVE") {
      const body = {
        server: selectedServer
      }
      try {
        const removeServer = await axios.delete(
          "http://localhost:8080/api/removeServer",
          {
            data: body
          }
        )
        let { data, status } = removeServer.data
        if (status) {
          Swal.fire({
            title: "Success!",
            text: data,
            icon: "success",
            background: "#ffffff",
            color: "#262626",
            confirmButtonColor: "#0095f6",
            confirmButtonText: "OK",
            customClass: {
              container: "swal-container",
              popup: "swal-popup",
              title: "swal-title",
              content: "swal-text",
              confirmButton: "swal-confirm"
            }
          })
          dispatch(setServerReducer(""))
          setServerRequest("")
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
        dispatch(setServerReducer(""))
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
