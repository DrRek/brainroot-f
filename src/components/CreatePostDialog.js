import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import YouTube from "react-youtube";
import DateTimeField from "./DateTimeField";
import { generate_post_schedule } from "../util/api";

const EditJobDialog = ({ open, data, onClose }) => {
  const [formData, setFormData] = useState({ duration: 30, ...data });
  const [loading, setLoading] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  useEffect(() => {
    if (data) setFormData(data);
  }, [data]);

  // Handle input changes for editable fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle the submission of the job
  const handleSubmit = async () => {
    setLoading(true);
    setNotificationOpen(true); // Notify user that the background task has started
    try {
      await generate_post_schedule(formData); // Submit the formData
    } catch (error) {
      console.error("Error submitting the job:", error);
    } finally {
      setLoading(false); // Stop loading indicator
      setNotificationOpen(false); // Close the notification after submission
      onClose(); // Close dialog
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Create Post</DialogTitle>
      <DialogContent dividers>
        {/* Editable Caption Field */}
        <TextField
          fullWidth
          margin="normal"
          label="Caption"
          name="caption"
          value={formData.caption || ""}
          onChange={handleInputChange}
          multiline={true}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Overlay"
          name="overlay"
          multiline={true}
          value={formData.overlay || ""}
          onChange={handleInputChange}
        />

        {/* Editable Time Field (DateTime Picker) */}
        <DateTimeField
          time={formData.time}
          setTime={(time) =>
            handleInputChange({
              target: {
                name: "time",
                value: time,
              },
            })
          }
        />

        {/* Editable YouTube Video URL */}
        <TextField
          fullWidth
          margin="normal"
          label="YouTube Video URL"
          name="youtube_video_url"
          value={formData.youtube_video_url || ""}
          onChange={handleInputChange}
        />

        {/* Editable Start At Seconds Field */}
        <TextField
          fullWidth
          margin="normal"
          label="Start at (Seconds)"
          name="start_at_seconds"
          type="number"
          value={formData.start_at_seconds || ""}
          onChange={handleInputChange}
        />

        {/* Embed YouTube Video */}
        {formData.youtube_video_url && (
          <YouTube
            videoId={formData.youtube_video_url.split("v=")[1]} // Extract video ID from URL
            opts={{
              width: "100%",
              playerVars: {
                start: 0,
              },
            }}
            onPlay={(event) =>
              handleInputChange({
                target: {
                  name: "start_at_seconds",
                  value: parseInt(event.target.getCurrentTime()),
                },
              })
            }
          />
        )}

        {/* Editable Duration Field */}
        <TextField
          fullWidth
          margin="normal"
          label="Duration (Seconds)"
          name="duration"
          type="number"
          value={formData.duration || ""}
          onChange={handleInputChange}
        />

        {/* Editable Duration Field */}
        <TextField
          fullWidth
          margin="normal"
          label="Account Targets (Recurpost)"
          name="recurpost_ids"
          disabled={true}
          value={formData.recurpost_ids || ""}
          onChange={handleInputChange}
        />

        {/* Editable Duration Field */}
        <TextField
          fullWidth
          margin="normal"
          label="Used template"
          name="template_id"
          type="number"
          disabled={true}
          value={formData.template_id || ""}
          onChange={handleInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={loading} // Disable button while loading
        >
          {loading ? <CircularProgress size={24} /> : "Submit"}
        </Button>
      </DialogActions>

      {/* Snackbar for background task notification */}
      <Snackbar
        open={notificationOpen}
        autoHideDuration={6000}
        message="Submitting job, please wait..."
      />
    </Dialog>
  );
};

export default EditJobDialog;
