import React, { useState, useEffect } from 'react';
import { TextField } from "@mui/material";

const ApiField = () => {
  const [apiKey, setApiKey] = useState("");

  // Update API_KEY global variable and store in local storage
  const handleSaveApiKey = (key) => {
    localStorage.setItem("API_KEY", key); // Store in local storage
    setApiKey(key);
  };

  // Load stored API key from local storage on component mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem("API_KEY");
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  return (
    <TextField
      label="API Key"
      variant="outlined"
      fullWidth
      value={apiKey}
      onChange={(e) => handleSaveApiKey(e.target.value)} // Update state on change
      sx={{ mb: 2 }} // Add some margin bottom
    />
  );
};

export default ApiField