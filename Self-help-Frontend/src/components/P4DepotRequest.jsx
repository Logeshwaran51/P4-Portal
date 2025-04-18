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
import P4DepotDropDown from "./P4DepotDropDown"
import { useDispatch, useSelector } from "react-redux"
import P4ServerDropDown from "./P4ServerDropDown"
import { setServerReducer } from "../store/p4serverSlice"
import "../index.css"

const P4DepotRequest = () => {
  const [depotRequest, setDepotRequest] = useState("")
  const [inputDepotField, setDepotInputField] = useState("")
  const DepotRequestType = ["Create", "Remove"]
  const [depotCreationBool, setdepotCreationBool] = useState(false)
  const [depotRemoveBool, setdepotRemoveBool] = useState(false)
  const [selectDepot, setSelectDepot] = useState("")

  const handleSetDepotRequest = (item) => {
    console.log(item.target.value)
    setDepotRequest(item.target.value)
    if (item.target.value === "Create") {
      setdepotCreationBool(true)
      setdepotRemoveBool(false)
    } else if (item.target.value === "Remove") {
      setdepotRemoveBool(true)
      setdepotCreationBool(false)
    }
  }

  const handleDepotInputField = (item) => {
    setDepotInputField(item.target.value)
  }

  let selectedServer = useSelector((state) => {
    return state.p4server
  })

  let dispatch = useDispatch()

  const handleClientSubmit = async () => {
    if (depotRequest === "Create") {
      try {
        const body = {
          server: selectedServer,
          user: "ulaga",
          depotName: inputDepotField,
          depotMap: inputDepotField + "/..."
        }

        let serverCreationResponse = await axios.post(
          "http://localhost:8080/api/createDepots",
          body
        )

        const { data, success, message } = serverCreationResponse.data
        if (success) {
          console.log(data)
          setDepotRequest("")
          setDepotInputField("")
          dispatch(setServerReducer(""))
        } else {
          console.log(message)
        }
      } catch (error) {
        console.log(error)
      }
    } else if (depotRequest === "Remove") {
      try {
        const body = {
          server: selectedServer,
          user: "ulaga",
          depotName: [selectDepot]
        }

        let serverDeletionResponse = await axios.delete(
          "http://localhost:8080/api/deleteDepots",
          { data: body }
        )
        const { data, success, message } = serverDeletionResponse.data

        if (success) {
          console.log(data)
          setDepotRequest("")
          setSelectDepot("")
          dispatch(setServerReducer(""))
        } else {
          console.log(message)
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log("No Request")
    }
  }
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

      <FormControl
        className="p4-form-control"
        fullWidth
        sx={{ marginBottom: "20px", marginTop: "20px" }}
      >
        <FormLabel className="p4-form-label" id="depots-radio-group-label">
          Depot Request
        </FormLabel>
        <RadioGroup
          className="p4-radio-group"
          aria-labelledby="depots-radio-group-label"
          name="depots-radio-group"
          value={depotRequest}
          onChange={handleSetDepotRequest}
        >
          {DepotRequestType.map((item, index) => (
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

      {depotCreationBool && (
        <FormControl
          className="p4-form-control"
          fullWidth
          sx={{ marginBottom: "20px" }}
        >
          <TextField
            className="p4-text-field"
            id="filled-basic"
            label="Enter a Depot Name (Eg: frontend)"
            variant="filled"
            value={inputDepotField}
            onChange={handleDepotInputField}
          />
        </FormControl>
      )}

      {depotRemoveBool && (
        <P4DepotDropDown
          className="p4-subcomponent"
          selectDepot={selectDepot}
          setSelectDepot={setSelectDepot}
        />
      )}

      <Button
        className="p4-submit-button"
        variant="contained"
        type="submit"
        sx={{ marginTop: "20px" }}
      >
        Submit
      </Button>
    </Box>
  )
}

export default P4DepotRequest
