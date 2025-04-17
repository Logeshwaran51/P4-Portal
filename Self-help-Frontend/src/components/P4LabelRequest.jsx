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

  const handleLabelSelection = (item) => {
    setp4Labels(item.target.value)
  }

  const getLabels = async () => {
    try {
      const data = {
        server: selectedServer,
        user: "ulaga"
      }
      let response = ""
      if (labelRequest === "Reload") {
        response = await axios.post(
          "http://localhost:8080/api/labelsReloadList",
          data
        )
      } else {
        response = await axios.post("http://localhost:8080/api/labels", data)
      }

      let { labels } = response.data
      setlabelsDropdown([...labels])

      if (!labels.includes(p4labels)) {
        setp4Labels("")
      }
    } catch (error) {
      console.error("Error posting client data:", error)
    }
  }

  let handleLabelSubmit = async () => {
    try {
      const data = {
        server: selectedServer,
        user: "ulaga",
        labels: [p4labels]
      }
      let labelSubmitResponse = ""
      if (labelRequest === "Delete") {
        labelSubmitResponse = await axios.delete(
          "http://localhost:8080/api/labelDelete",
          {
            data: data
          }
        )
      } else if (labelRequest === "Unload") {
        labelSubmitResponse = await axios.post(
          "http://localhost:8080/api/labelUnload",
          data
        )
      } else if (labelRequest === "Reload") {
        labelSubmitResponse = await axios.post(
          "http://localhost:8080/api/labelReload",
          data
        )
      } else {
        console.log("No API")
      }

      if (labelSubmitResponse.data) {
        console.log(labelSubmitResponse.data)
        setp4Labels("")
      }
      setlabelRequest("")
    } catch (error) {
      console.error("Error posting client data:", error)
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
