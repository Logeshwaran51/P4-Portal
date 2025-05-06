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
  Chip
} from "@mui/material"
import CancelIcon from "@mui/icons-material/Cancel"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import axios from "axios"
import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import "../index.css"
import P4ServerDropDown from "./P4ServerDropDown"
import Swal from "sweetalert2"
import "../swal-custom.css"

const P4LabelRequest = () => {
  const [p4labels, setp4Labels] = useState([])
  const [labelsDropdown, setlabelsDropdown] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  const LabelRequestType = ["Delete", "Reload", "Unload"]
  const [labelRequest, setlabelRequest] = useState("")

  const selectedServer = useSelector((state) => state.p4server)
  const userName = useSelector((state) => state.userName)

  const handleSetLabelRequest = (item) => {
    setlabelRequest(item.target.value)
  }

  const handleOpenDropdown = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseDropdown = () => {
    setAnchorEl(null)
  }

  const handleLabelSelect = (label) => {
    setp4Labels((prev) => [...prev, label])
    setlabelsDropdown((prev) => prev.filter((item) => item !== label))
    handleCloseDropdown()
  }

  const handleRemoveLabel = (label) => {
    setp4Labels((prev) => prev.filter((item) => item !== label))
    setlabelsDropdown((prev) => [...prev, label])
  }

  const getLabels = async () => {
    try {
      const body = {
        server: selectedServer,
        user: userName
      }

      let response = ""
      if (labelRequest === "Reload") {
        response = await axios.post(
          "http://localhost:8080/api/labelsReloadList",
          body
        )
      } else {
        response = await axios.post("http://localhost:8080/api/labels", body)
      }

      const { data, status } = response.data
      if (status) {
        setlabelsDropdown(data)
        setp4Labels([])
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.error || "Failed to fetch labels",
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

  const handleLabelSubmit = async () => {
    try {
      const body = {
        server: selectedServer,
        user: userName,
        labels: p4labels
      }

      let labelSubmitResponse = ""
      let operation = ""

      if (labelRequest === "Delete") {
        operation = "deleted"
        labelSubmitResponse = await axios.delete(
          "http://localhost:8080/api/labelDelete",
          { data: body }
        )
      } else if (labelRequest === "Unload") {
        operation = "unloaded"
        labelSubmitResponse = await axios.post(
          "http://localhost:8080/api/labelUnload",
          body
        )
      } else if (labelRequest === "Reload") {
        operation = "reloaded"
        labelSubmitResponse = await axios.post(
          "http://localhost:8080/api/labelReload",
          body
        )
      } else {
        console.log("No API called.")
        return
      }

      const { data, status } = labelSubmitResponse.data
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
        setp4Labels([])
      }
      setlabelRequest("")
    } catch (error) {
      console.error("Error posting label data:", error)
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
      setlabelsDropdown([])
      getLabels()
    }
  }, [labelRequest, selectedServer])

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault()
        handleLabelSubmit()
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
          <FormLabel className="p4-form-label" id="labels-radio-group-label">
            Label Request
          </FormLabel>
          <RadioGroup
            className="p4-radio-group"
            aria-labelledby="labels-radio-group-label"
            name="labels-radio-group"
            value={labelRequest}
            onChange={handleSetLabelRequest}
          >
            {LabelRequestType.map((item, index) => (
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

      {/* Label Dropdown */}
      <FormControl
        className="p4-form-control"
        fullWidth
        sx={{ marginBottom: "20px" }}
      >
        <FormLabel className="p4-form-label">Select Labels</FormLabel>
        <Button
          variant="outlined"
          endIcon={<ArrowDropDownIcon />}
          onClick={handleOpenDropdown}
          sx={{ textTransform: "none", marginBottom: "10px" }}
        >
          {labelsDropdown.length === 0
            ? "No Labels Available"
            : "Choose from list"}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseDropdown}
        >
          {labelsDropdown.map((label, index) => (
            <MenuItem key={index} onClick={() => handleLabelSelect(label)}>
              {label}
            </MenuItem>
          ))}
        </Menu>

        {/* Selected labels as chips */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, marginTop: 1 }}>
          {p4labels.map((label, index) => (
            <Chip
              key={index}
              label={label}
              onDelete={() => handleRemoveLabel(label)}
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

export default P4LabelRequest
