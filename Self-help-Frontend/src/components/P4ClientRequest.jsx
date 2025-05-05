import {
  Box,
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Button,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  IconButton
} from "@mui/material"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import axios from "axios"
import "../index.css"
import P4ServerDropDown from "./P4ServerDropDown"
import Swal from "sweetalert2"
import "../swal-custom.css"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import CancelIcon from "@mui/icons-material/Cancel"

const P4ClientRequest = () => {
  const [p4clients, setp4Clients] = useState([])
  const [clientsDropdown, setclientsDropdown] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  const ClientRequestType = ["Delete", "Reload", "Unload"]
  const [clientRequest, setclientRequest] = useState("")

  const selectedServer = useSelector((state) => state.p4server)
  const userName = useSelector((state) => state.userName)

  const handleSetClientRequest = (item) => {
    setclientRequest(item.target.value)
  }

  const handleOpenDropdown = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseDropdown = () => {
    setAnchorEl(null)
  }

  const handleClientSelect = (client) => {
    setp4Clients((prev) => [...prev, client])
    setclientsDropdown((prev) => prev.filter((item) => item !== client))
    handleCloseDropdown()
  }

  const handleRemoveClient = (client) => {
    setp4Clients((prev) => prev.filter((item) => item !== client))
    setclientsDropdown((prev) => [...prev, client])
  }

  const getClients = async () => {
    try {
      const body = {
        server: selectedServer,
        user: userName
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

      const { data, status } = response.data
      if (status) {
        setclientsDropdown(data)
        setp4Clients([])
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.error || "Failed to fetch clients",
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

  const handleClientSubmit = async () => {
    try {
      const body = {
        server: selectedServer,
        user: userName,
        clients: p4clients
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
        console.log("No API called.")
        return
      }

      const { data, status } = clientSubmitResponse.data
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
        setp4Clients([])
      }
      setclientRequest("")
    } catch (error) {
      console.error("Error posting client data:", error)
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.error || "Submission failed",
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
      setclientsDropdown([])
      getClients()
    }
  }, [clientRequest, selectedServer])

  return (
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

      {/* Custom Client Selector */}
      <FormControl
        className="p4-form-control"
        fullWidth
        sx={{ marginBottom: "20px" }}
      >
        <FormLabel className="p4-form-label">Select Clients</FormLabel>
        <Button
          variant="outlined"
          endIcon={<ArrowDropDownIcon />}
          onClick={handleOpenDropdown}
          sx={{ textTransform: "none", marginBottom: "10px" }}
        >
          {clientsDropdown.length === 0
            ? "No Clients Available"
            : "Choose from list"}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseDropdown}
        >
          {clientsDropdown.map((client, index) => (
            <MenuItem key={index} onClick={() => handleClientSelect(client)}>
              {client}
            </MenuItem>
          ))}
        </Menu>

        {/* Selected clients as removable chips */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, marginTop: 1 }}>
          {p4clients.map((client, index) => (
            <Chip
              key={index}
              label={client}
              onDelete={() => handleRemoveClient(client)}
              deleteIcon={<CancelIcon />}
              variant="outlined"
              sx={{ fontSize: "14px" }}
            />
          ))}
        </Box>
      </FormControl>

      <Button className="p4-submit-button" variant="contained" type="submit">
        Submit
      </Button>
    </Box>
  )
}

export default P4ClientRequest
