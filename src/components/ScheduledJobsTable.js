import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { list_scheduledjobs, delete_scheduledjob } from "../util/api"; // Adjust import according to your structure

const ScheduledJobsTable = () => {
  const { data: scheduledJobs, refetch, isFetching } = list_scheduledjobs();

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    job: null,
  });

  const handleDelete = async () => {
    try {
      await delete_scheduledjob(deleteDialog.job);
      refetch(); // Refresh scheduled jobs after deletion
      setDeleteDialog({ open: false, job: null });
    } catch (error) {
      console.error("Error deleting scheduled job:", error);
    }
  };

  const handleDeleteClick = (job) => {
    setDeleteDialog({ open: true, job });
  };

  // Sort jobs by time
  const sortedJobs =
    scheduledJobs
      ?.slice()
      .sort((a, b) => new Date(a.time) - new Date(b.time)) || [];

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Send</TableCell>
              <TableCell>Video URL</TableCell>
              <TableCell>Caption</TableCell>
              <TableCell>Template</TableCell>
              <TableCell>
                <Button onClick={refetch} disabled={isFetching}>
                  Refresh
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedJobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell>{job.id}</TableCell>
                <TableCell>{new Date(job.time).toLocaleString()}</TableCell>
                <TableCell>{job.send ? "Yes" : "No"}</TableCell>
                <TableCell>
                  {job.data?.video_url ? (
                    <a
                      href={job.data.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {job.data.video_url}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell>{job.data?.caption || "N/A"}</TableCell>
                <TableCell>{job.data?.template || "N/A"}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteClick(job)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, job: null })}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this scheduled job?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, job: null })}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ScheduledJobsTable;
