import {
  Box,
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from "@mui/material"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import axios from "axios"

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
        sx={{ width: "100%", marginTop: "10px" }}
      >
        {/* Radio Group for client request */}
        <FormControl fullWidth sx={{ marginBottom: "20px" }}>
          <FormLabel id="clients-radio-group-label">Client Request</FormLabel>
          <RadioGroup
            aria-labelledby="clients-radio-group-label"
            name="clients-radio-group"
            value={clientRequest}
            onChange={handleSetClientRequest}
          >
            {ClientRequestType.map((item, index) => (
              <FormControlLabel
                key={index}
                value={item}
                control={<Radio />}
                label={item}
              />
            ))}
          </RadioGroup>
        </FormControl>

        {/* Select dropdown for clients */}
        {clientsDropdown.length !== 0 && (
          <FormControl
            fullWidth
            variant="outlined"
            sx={{ marginBottom: "20px" }}
          >
            <InputLabel id="p4clients-label">Select Clients</InputLabel>
            <Select
              labelId="p4clients-label"
              id="p4clients-select"
              value={p4clients}
              onChange={handleClientSelection}
              label="Select Clients"
            >
              {clientsDropdown.map((item, index) => (
                <MenuItem key={index} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Submit button */}
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </Box>
    </>
  )
}

export default P4ClientRequest
