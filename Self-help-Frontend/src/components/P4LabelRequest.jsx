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
import axios from "axios"
import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import "../index.css"
import P4ServerDropDown from "./P4ServerDropDown"
import Swal from "sweetalert2"
import "../swal-custom.css"

const P4LabelRequest = () => {
  const [p4labels, setp4Labels] = useState("")
  const [labelsDropdown, setlabelsDropdown] = useState([])
  const LabelRequestType = ["Delete", "Reload", "Unload"]
  const [labelRequest, setlabelRequest] = useState("")

  let handleSetLabelRequest = (item) => {
    setlabelRequest(item.target.value)
  }

  let selectedServer = useSelector((state) => {
    return state.p4server
  })

  let userName = useSelector((state) => {
    return state.userName
  })

  const handleLabelSelection = (item) => {
    setp4Labels(item.target.value)
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
      console.log(response.data)
      let { data, status } = response.data
      if (status) {
        setlabelsDropdown([...data])
      }
      if (!data.includes(p4labels)) {
        setp4Labels("")
      }
    } catch (error) {
      console.log("The error is", error.response.data)
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
  }

  let handleLabelSubmit = async () => {
    try {
      const body = {
        server: selectedServer,
        user: userName,
        labels: [p4labels]
      }
      let labelSubmitResponse = ""
      let operation = ""
      if (labelRequest === "Delete") {
        operation = "deleted"
        labelSubmitResponse = await axios.delete(
          "http://localhost:8080/api/labelDelete",
          {
            data: body
          }
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
        console.log("No API")
      }

      let { data, error, status } = labelSubmitResponse.data
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
        setp4Labels("")
      }
      setlabelRequest("")
    } catch (error) {
      console.error("Error posting label data:", error)
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
  }

  useEffect(() => {
    console.log(labelRequest)
    if (selectedServer) {
      getLabels()
    }
  }, [labelRequest])

  return (
    <>
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

        {labelsDropdown.length !== 0 && (
          <FormControl
            className="p4-form-control"
            fullWidth
            variant="outlined"
            sx={{ marginBottom: "20px" }}
          >
            <InputLabel className="p4-input-label" id="p4labels">
              Select Labels
            </InputLabel>
            <Select
              className="p4-select"
              labelId="p4labels"
              id="p4labels-select"
              label="Select Labels"
              value={p4labels}
              onChange={handleLabelSelection}
            >
              {labelsDropdown.map((item, index) => (
                <MenuItem className="p4-menu-item" key={index} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <Button className="p4-submit-button" variant="contained" type="submit">
          Submit
        </Button>
      </Box>
    </>
  )
}

export default P4LabelRequest
