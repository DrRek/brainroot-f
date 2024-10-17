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
import {
  generate_post_schedule,
  generate_post_proposal_get_suggested_time,
  generate_post_proposal_get_suggested_texts,
  generate_post_proposal_get_suggested_video,
} from "../util/api";

const EditJobDialog = ({ open, data, onClose }) => {
  const [formData, setFormData] = useState({ start_at_seconds:0, duration: 30, ...data });
  const [loading, setLoading] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const requestTimeSuggestion = async (template_id) => {
    if (template_id) {
      const response = await generate_post_proposal_get_suggested_time({
        template_id,
      });
      setFormData((prev) => ({
        ...prev,
        time: response.time,
      }));
    }
  };

  const requestTextsSuggestion = async () => {
    if (data?.id, data?.ai_prompt) {
      const response = await generate_post_proposal_get_suggested_texts({
        template_id: data?.id,
        ai_prompt: data?.ai_prompt,
      });
      setFormData((prev) => ({
        ...prev,
        caption: response.caption.trim().replace(/^"|"$/g, '').trim(),
        overlay: response.overlay.trim().replace(/^"|"$/g, '').trim(),
        youtube_search: response.youtube_search.trim().replace(/^"|"$/g, '').trim(),
      }));
    }
  };

  const requestVideoSuggestion = async () => {
    if (data.id && formData.youtube_search) {
      const response = await generate_post_proposal_get_suggested_video({
        template_id: data.id,
        youtube_search: formData.youtube_search,
      });
      setFormData((prev) => ({
        ...prev,
        youtube_video_url: response.youtube_video_url,
      }));
    }
  };

  useEffect(() => {
    requestTimeSuggestion(data?.id);
  }, [data?.id]);

  useEffect(() => {
    requestTextsSuggestion();
  }, [data?.ai_prompt, data?.id]);

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

        {/* Retry button */}
        <Button
          variant="contained"
          color="primary"
          onClick={requestTextsSuggestion}          
        >
          Regenerate Texts
        </Button>
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

        <TextField
          fullWidth
          margin="normal"
          label="Youtube Search"
          name="youtube_search"
          multiline={true}
          value={formData.youtube_search || ""}
          onChange={handleInputChange}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={requestVideoSuggestion}          
        >
          Find Video
        </Button>

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
