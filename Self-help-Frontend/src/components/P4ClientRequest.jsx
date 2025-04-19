import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from "@mui/material"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import axios from "axios"
import "../index.css"
import "../swal-custom.css"
import P4ServerDropDown from "./P4ServerDropDown"
import Swal from "sweetalert2"

const P4ClientRequest = () => {
  const [p4clients, setp4Clients] = useState("")
  const [clientsDropdown, setclientsDropdown] = useState([])
  const ClientRequestType = ["Delete", "Reload", "Unload"]
  const [clientRequest, setclientRequest] = useState("")

  let handleSetClientRequest = (item) => {
    setclientRequest(item.target.value)
  }

  let selectedServer = useSelector((state) => {
    return state.p4server
  })

  const handleClientSelection = (item) => {
    setp4Clients(item.target.value)
  }

  const getClients = async () => {
    try {
      const body = {
        server: selectedServer,
        user: "ulaga"
      }
      let response = ""
      if (clientRequest === "Reload") {
        response = await axios.post(
          "http://localhost:8080/api/clientsReloadList",
          body
        )
      } else {
        response = await axios.post("http://localhost:8080/api/clients", body)
      }

      let { data, error, status } = response.data
      console.log(response.data)
      if (status) {
        setclientsDropdown([...data])
      } else {
        Swal.fire({
          title: "Error!",
          text: error,
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

      if (!data.includes(p4clients)) {
        setp4Clients("")
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error,
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

  let handleClientSubmit = async () => {
    try {
      const body = {
        server: selectedServer,
        user: "ulaga",
        clients: [p4clients]
      }

      let clientSubmitResponse = ""
      let operation = ""

      if (clientRequest === "Delete") {
        operation = "deleted"
        clientSubmitResponse = await axios.delete(
          "http://localhost:8080/api/clientDelete",
          { data: body }
        )
      } else if (clientRequest === "Unload") {
        operation = "unloaded"
        clientSubmitResponse = await axios.post(
          "http://localhost:8080/api/clientUnload",
          body
        )
      } else if (clientRequest === "Reload") {
        operation = "reloaded"
        clientSubmitResponse = await axios.post(
          "http://localhost:8080/api/clientReload",
          body
        )
      } else {
        console.log("No API")
        return
      }

      let { data, error, status } = clientSubmitResponse.data
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
        console.log(clientSubmitResponse.data)
        setp4Clients("")
      } else {
        Swal.fire({
          title: "Error!",
          text: error,
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
      setclientRequest("")
    } catch (error) {
      console.error("Error posting client data:", error)
      Swal.fire({
        title: "Error!",
        text: `Failed to ${clientRequest.toLowerCase()} client: ${
          error.message
        }`,
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
    if (selectedServer) {
      getClients()
    }
  }, [clientRequest])

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
        <P4ServerDropDown className="p4-subcomponent" />
        {/* Radio Group for client request */}

        {selectedServer && (
          <FormControl
            className="p4-form-control"
            fullWidth
            sx={{ marginBottom: "20px", marginTop: "20px" }}
          >
            <FormLabel className="p4-form-label" id="clients-radio-group-label">
              Client Request
            </FormLabel>
            <RadioGroup
              className="p4-radio-group"
              aria-labelledby="clients-radio-group-label"
              name="clients-radio-group"
              value={clientRequest}
              onChange={handleSetClientRequest}
            >
              {ClientRequestType.map((item, index) => (
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
        )}
        {/* Select dropdown for clients */}
        {clientsDropdown.length !== 0 && (
          <FormControl
            className="p4-form-control"
            fullWidth
            variant="outlined"
            sx={{ marginBottom: "20px" }}
          >
            <InputLabel className="p4-input-label" id="p4clients-label">
              Select Clients
            </InputLabel>
            <Select
              className="p4-select"
              labelId="p4clients-label"
              id="p4clients-select"
              value={p4clients}
              onChange={handleClientSelection}
              label="Select Clients"
            >
              {clientsDropdown.map((item, index) => (
                <MenuItem className="p4-menu-item" key={index} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Submit button */}
        <Button className="p4-submit-button" variant="contained" type="submit">
          Submit
        </Button>
      </Box>
    </>
  )
}

export default P4ClientRequest
