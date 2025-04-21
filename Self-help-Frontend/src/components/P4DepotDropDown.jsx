import * as React from "react"
import { useState, useEffect } from "react"
import { FormControl, InputLabel, Select, MenuItem, Alert } from "@mui/material"
import axios from "axios"
import { useSelector } from "react-redux"
import "../index.css"
import Swal from "sweetalert2"
import "../swal-custom.css"

function P4DepotDropDown({ selectDepot, setSelectDepot }) {
  const [dropDownDepot, setDropDownDepot] = useState([])

  let selectedServer = useSelector((state) => {
    return state.p4server
  })
  let userName = useSelector((state) => {
    return state.userName
  })

  // Function to fetch the servers
  const getDepots = async () => {
    try {
      const body = {
        server: selectedServer,
        user: userName
      }
      const response = await axios.post(
        "http://localhost:8080/api/listDepots",
        body
      )
      const { data, status } = response.data
      console.log(response.data)
      if (status) {
        setDropDownDepot([...data])
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
      {dropDownDepot.length !== 0 && (
        <FormControl
          className="p4-form-control"
          sx={{ minWidth: "100%", marginTop: "10px" }}
        >
          <InputLabel className="p4-input-label" id="p4depots">
            Select Depot
          </InputLabel>
          <Select
            className="p4-select"
            labelId="p4depots"
            id="p4depots-select"
            label="Select depot"
            value={selectDepot}
            onChange={handleDepotChange}
          >
            {dropDownDepot.map((depot, index) => (
              <MenuItem className="p4-menu-item" key={index} value={depot}>
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
