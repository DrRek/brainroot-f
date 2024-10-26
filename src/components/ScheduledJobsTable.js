import React, { useMemo, useState } from "react";
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
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import {
  list_scheduledjobs,
  delete_scheduledjob,
  set_scheduledJob,
  send_now_scheduledjob
} from "../util/api"; // Adjust import according to your structure
import DateTimeField from "./DateTimeField";

const TableRowCustom = ({ job, handleDeleteClick, handleUpdate, handleSendClick }) => {
  const [newTime, setNewTime] = useState(null);
  const [newSent, setNewSent] = useState(null);
  const data = JSON.parse(job?.data) || {};
  const handleSaveClick = () => {
    const jobUpdated = {
      id: job.id,
    };
    if (newTime !== null) jobUpdated["time"] = newTime;
    if (newSent != null) jobUpdated["sent"] = newSent;
    handleUpdate(jobUpdated);
    setNewTime(null);
    setNewSent(null);
  };
  return (
    <TableRow key={job.id}>
      <TableCell>{job.id}</TableCell>
      <TableCell onClick={() => !newTime && setNewTime(job?.time)}>
        {!newTime ? (
          new Date(job.time).toLocaleString()
        ) : (
          <DateTimeField time={newTime} setTime={setNewTime} />
        )}
      </TableCell>
      <TableCell onClick={() => newSent === null && setNewSent(job?.sent)}>
        {newSent === null ? (
          job.sent ? (
            "Yes"
          ) : (
            "No"
          )
        ) : (
          <Select value={newSent} onChange={(e) => setNewSent(e.target.value)}>
            <MenuItem value={true}>Yes</MenuItem>
            <MenuItem value={false}>No</MenuItem>
          </Select>
        )}
      </TableCell>
      <TableCell>{job.template || "N/A"}</TableCell>
      <TableCell>
        {data?.video_path ? (
          <a href={data?.video_path} target="_blank" rel="noopener noreferrer">
            {data?.video_path}
          </a>
        ) : (
          "N/A"
        )}
      </TableCell>
      <TableCell>{data?.caption || "N/A"}</TableCell>
      <TableCell>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleSaveClick(job)}
          disabled={newTime === null && newSent === null}
        >
          Save
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSendClick(job)}
        >
          Send Now
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleDeleteClick(job)}
        >
          Delete
        </Button>
      </TableCell>
    </TableRow>
  );
};

const ScheduledJobsTable = () => {
  const [filters, setFilters] = useState({
    id: "",
    timeType: "after", // "before" or "after"
    timeValue: "",
    sent: "false", // "true", "false", or "null"
  });

  const handleFilterChange = (field) => (event) => {
    const value = event?.target ? event.target.value : event;
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
  };

  const backendFilters = useMemo(() => {
    const parsedFilters = {};
    if (filters.id !== "") parsedFilters["id"] = filters.id;
    if (filters.timeValue !== "") {
      parsedFilters["timeValue"] = filters.timeValue;
    }
    if (filters.sent !== "null")
      parsedFilters["sent"] = filters.sent === "true";
    return parsedFilters
  }, [filters])

  const { data: scheduledJobs, refetch, isFetching } = list_scheduledjobs(backendFilters);

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    job: null,
  });

  const [sendDialog, setSendDialog] = useState({
    open: false,
    job: null,
  });

  const handleSend = async () => {
    try {
      await send_now_scheduledjob(sendDialog.job);
      refetch(); // Refresh scheduled jobs after deletion
      setSendDialog({ open: false, job: null });
    } catch (error) {
      console.error("Error deleting scheduled job:", error);
    }
  };

  const handleSendClick = (job) => {
    console.log(job)
    setSendDialog({ open: true, job });
  };

  const handleDelete = async () => {
    try {
      await delete_scheduledjob(deleteDialog.job);
      refetch(); // Refresh scheduled jobs after deletion
      setDeleteDialog({ open: false, job: null });
    } catch (error) {
      console.error("Error deleting scheduled job:", error);
    }
  };

  const handleUpdate = async (job) => {
    try {
      await set_scheduledJob(job);
      refetch();
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
              <TableCell>Sent</TableCell>
              <TableCell>Template</TableCell>
              <TableCell>Video URL</TableCell>
              <TableCell>Caption</TableCell>
              <TableCell>
                <Button onClick={refetch} disabled={isFetching}>
                  Refresh
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <TextField
                  label="ID"
                  value={filters.id}
                  onChange={handleFilterChange("id")}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Select
                  value={filters.timeType}
                  onChange={handleFilterChange("timeType")}
                  size="small"
                >
                  <MenuItem value="after">After</MenuItem>
                  <MenuItem value="before">Before</MenuItem>
                </Select>
                <DateTimeField
                  label="Time"
                  time={filters.timeValue}
                  setTime={handleFilterChange("timeValue")}
                />
              </TableCell>
              <TableCell>
                <Select
                  label="Sent"
                  value={filters.sent}
                  onChange={handleFilterChange("sent")}
                  size="small"
                >
                  <MenuItem value={"null"}>Both</MenuItem>
                  <MenuItem value={"true"}>Yes</MenuItem>
                  <MenuItem value={"false"}>No</MenuItem>
                </Select>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedJobs.map((job, index) => {
              return (
                <TableRowCustom
                  key={index}
                  job={job}
                  handleDeleteClick={handleDeleteClick}
                  handleUpdate={handleUpdate}
                  handleSendClick={handleSendClick}
                />
              );
            })}
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

      {/* Send Now Confirmation Dialog */}
      <Dialog
        open={sendDialog.open}
        onClose={() => setSendDialog({ open: false, job: null })}
      >
        <DialogTitle>Confirm you want to send the post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to send this post now?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSendDialog({ open: false, job: null })}>
            Cancel
          </Button>
          <Button onClick={handleSend} color="secondary">
            Send The Post
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ScheduledJobsTable;
