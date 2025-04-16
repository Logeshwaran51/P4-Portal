import * as React from "react"
import { useState, useEffect } from "react"
import {
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert
} from "@mui/material"
import axios from "axios"
import P4ServerDropDown from "./P4ServerDropDown"
import { useSelector } from "react-redux"

function P4DepotDropDown({ selectDepot, setSelectDepot }) {
  const [dropDownDepot, setDropDownDepot] = useState([])
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  let selectedServer = useSelector((state) => {
    return state.p4server
  })

  // Function to fetch the servers
  const getDepots = async () => {
    try {
      const body = {
        server: selectedServer,
        user: "ulaga"
      }
      const response = await axios.post(
        "http://localhost:8080/api/listDepots",
        body
      )
      const { data, success, message } = response.data
      console.log(response.data)
      if (success) {
        setDropDownDepot([...data])
        setMessage(message)
      } else {
        console.log(message)
        setError(message)
      }
    } catch (error) {
      setError("Failed to fetch Depots")
    }
  }

  const handleDepotChange = (item) => {
    setSelectDepot(item.target.value)
  }

  useEffect(() => {
    if (selectedServer) {
      getDepots()
    }
  }, [selectedServer])

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ marginBottom: "10px" }}>
          {error}
        </Alert>
      )}
      {message && (
        <Alert severity="success" sx={{ marginBottom: "10px" }}>
          {message}
        </Alert>
      )}

      {dropDownDepot.length !== 0 && (
        <FormControl sx={{ minWidth: "100%", marginTop: "10px" }}>
          <InputLabel id="p4depots">Select Depot</InputLabel>
          <Select
            labelId="p4depots"
            id="p4depots-select"
            label="Select depot"
            value={selectDepot}
            onChange={handleDepotChange}
          >
            {dropDownDepot.map((depot, index) => (
              <MenuItem key={index} value={depot}>
                {depot}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </>
  )
}

export default P4DepotDropDown
