import {
  Box,
  FormGroup,
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
import P4ServerDropDown from "./P4ServerDropDown"

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
      const data = {
        server: selectedServer,
        user: "ulaga"
      }
      let response = ""
      if (clientRequest === "Reload") {
        response = await axios.post(
          "http://localhost:8080/api/clientsReloadList",
          data
        )
      } else {
        response = await axios.post("http://localhost:8080/api/clients", data)
      }

      let { clients } = response.data
      setclientsDropdown([...clients])

      if (!clients.includes(p4clients)) {
        setp4Clients("")
      }
    } catch (error) {
      console.error("Error posting client data:", error)
    }
  }

  let handleClientSubmit = async () => {
    try {
      const data = {
        server: selectedServer,
        user: "ulaga",
        clients: [p4clients]
      }
      let clientSubmitResponse = ""
      if (clientRequest === "Delete") {
        clientSubmitResponse = await axios.delete(
          "http://localhost:8080/api/clientDelete",
          {
            data: data
          }
        )
      } else if (clientRequest === "Unload") {
        clientSubmitResponse = await axios.post(
          "http://localhost:8080/api/clientUnload",
          data
        )
      } else if (clientRequest === "Reload") {
        clientSubmitResponse = await axios.post(
          "http://localhost:8080/api/clientReload",
          data
        )
      } else {
        console.log("No API")
      }

      if (clientSubmitResponse.data) {
        console.log(clientSubmitResponse.data)
        setp4Clients("")
      }
      setclientRequest("")
    } catch (error) {
      console.error("Error posting client data:", error)
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
