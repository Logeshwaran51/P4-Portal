import React, { useState } from "react"
import axios from "axios"
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Alert
} from "@mui/material"
import { AddTask } from "@mui/icons-material"
import "../JiraTicketCreator.css"
import Swal from "sweetalert2"
import "../swal-custom.css"

const JiraTicketCreator = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: ""
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post(
        "http://localhost:8080/api/jira/create-ticket",
        {
          title: formData.title,
          description: formData.description
        }
      )

      const { data, status, error } = response.data

      if (status) {
        Swal.fire({
          title: "Success!",
          html: `
                <div class="swal-success-content">
                  <p>JIRA ticket created successfully!</p>
                  <a href="${data}" target="_blank" class="swal-ticket-link">
                    ${data}
                  </a>
                </div>
              `,
          icon: "success",
          background: "#ffffff",
          color: "#262626",
          confirmButtonColor: "#0095f6",
          confirmButtonText: "OK",
          customClass: {
            container: "swal-container",
            popup: "swal-popup",
            title: "swal-title",
            htmlContainer: "swal-text",
            confirmButton: "swal-confirm"
          }
        })

        // Reset form on success
        setFormData({ title: "", description: "" })
      } else {
        throw new Error(error || "Failed to create ticket")
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.error || error.message,
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
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p4-container">
      <Card className="p4-form-container">
        <CardContent>
          <Typography className="p4-title" variant="h5" gutterBottom>
            Create JIRA Ticket
          </Typography>

          {loading && <LinearProgress className="p4-progress" />}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              className="p4-text-field"
              fullWidth
              label="Title*"
              name="title"
              value={formData.title}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
            />

            <TextField
              className="p4-text-field"
              fullWidth
              label="Description*"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
              required
              disabled={loading}
            />

            <Button
              className="p4-submit-button"
              type="submit"
              variant="contained"
              startIcon={<AddTask />}
              disabled={loading || !formData.title || !formData.description}
              fullWidth
              sx={{ mt: 2 }}
            >
              {loading ? "Creating..." : "Create Ticket"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </div>
  )
}

export default JiraTicketCreator
