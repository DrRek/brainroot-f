import React, { useState, useEffect, useMemo } from "react";
import { Box, Badge, CircularProgress } from "@mui/material";
import { get_post_in_generation } from "../util/api";

const JobStatusBadge = () => {
  const [jobs, setJobs] = useState({});
  const [loading, setLoading] = useState(true);

  // Function to fetch the job count from the server
  const fetchJobCount = async () => {
    try {
      const response = await get_post_in_generation();
      console.log(response);
      setJobs(response || {});
    } catch (error) {
      console.error("Error fetching job count:", error);
    } finally {
      setLoading(false);
    }
  };

  // Poll the server every 5 seconds to get the job count
  useEffect(() => {
    fetchJobCount(); // Initial fetch
    const interval = setInterval(fetchJobCount, 20000); // Fetch every 5 seconds
    return () => clearInterval(interval); // Clean up the interval on unmount
  }, []);

  const jobCount = useMemo(() => Object.keys(jobs).length, [jobs]);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: 50,
          height: 50,
          borderRadius: "50%",
          backgroundColor: `${
            jobCount === 0
              ? "#ccc"
              : jobCount <= 2
              ? "#008000"
              : jobCount <= 4
              ? "#FFA500"
              : "#FF0000"
          }`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: 3,
        }}
        color="white"
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          Object.keys(jobs).length
        )}
      </Box>
    </Box>
  );
};

export default JobStatusBadge;
