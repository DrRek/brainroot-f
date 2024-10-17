import React from "react";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const MyComponent = ({time, setTime}) => {

  // Convert API date string to a Date object compatible with DateTimePicker
  const initialDate = new Date(time);

  // Handle date changes
  const handleDateChange = (newDate) => {
    // Convert dayjs object to Date object
    const updatedDate = newDate.toDate();
    
    // Format it back to the required API format
    const formattedDate = updatedDate.toUTCString();
    
    // Update form data with formatted date string
    setTime(formattedDate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label="Date"
        value={dayjs(initialDate)} // Convert to dayjs compatible format
        onChange={handleDateChange}
        slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
      />
    </LocalizationProvider>
  );
};

export default MyComponent;
