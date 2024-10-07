import React, { useState } from "react";
import { Container, Typography } from "@mui/material";
import AccountsTable from "./components/AccountsTable";
import TemplatesTable from "./components/TemplatesTable";
import ScheduledJobsTable from "./components/ScheduledJobsTable";
import ApiField from "./components/ApiField";
import CreatePostDialog from "./components/CreatePostDialog";
import JobsInQueueBadge from "./components/JobsInQueueBadge";

function App() {
  const [newPostData, setNewPostData] = useState();

  return (
    <Container maxWidth="s" style={{ textAlign: "center", marginTop: "30px" }}>
      <Typography variant="h6" gutterBottom>
        Enter API Key
      </Typography>
      <ApiField />
      <Typography variant="h6" gutterBottom>
        Manage your accounts (to add new accounts:
        https://social.recurpost.com/add-social-accounts)
      </Typography>
      <AccountsTable />
      <Typography variant="h6" gutterBottom>
        Manage your templates
      </Typography>
      <TemplatesTable openNewPostDialog={setNewPostData} />
      <Typography variant="h6" gutterBottom>
        Current Scheduled Jobs
      </Typography>
      <ScheduledJobsTable />

      <CreatePostDialog
        open={!!newPostData}
        onClose={() => setNewPostData(null)}
        data={newPostData}
      />
      <JobsInQueueBadge/>
    </Container>
  );
}

export default App;
