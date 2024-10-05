import React, { useState } from "react";
import { Container, Typography } from "@mui/material";
import AccountsTable from "./components/AccountsTable";
import TemplatesTable from "./components/TemplatesTable";
import ScheduledJobsTable from "./components/ScheduledJobsTable";
import ApiField from "./components/ApiField";
import CreatePostDialog from "./components/CreatePostDialog";

function App() {
  const [newPostData, setNewPostData] = useState({
    caption:
      "Embrace the uncertainties and potential that 'maybe' offers. It's the first step towards new beginnings and adventures. #Possibilities #EmbraceTheUnknown #AdventureAwaits #EndlessPotential #NewBeginnings #DreamBig #ThinkPositive #TakeChances #LifeJourney #Explore",
    duration: 30,
    overlay: '"Maybe...it\'s full of endless possibilities."',
    recurpost_ids: [1, 2],
    start_at_seconds: 0,
    success: true,
    template_id: 1,
    time: "Mon, 07 Oct 2024 16:57:00 GMT",
    youtube_video_url: "https://www.youtube.com/watch?v=nb6iN6nGSgo",
  });

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
      <AccountsTable openNewPostDialog={setNewPostData} />
      <Typography variant="h6" gutterBottom>
        Manage your templates
      </Typography>
      <TemplatesTable />
      <Typography variant="h6" gutterBottom>
        Current Scheduled Jobs
      </Typography>
      <ScheduledJobsTable />

      <CreatePostDialog
        open={!!newPostData}
        onClose={() => setNewPostData(null)}
        data={newPostData}
      />
    </Container>
  );
}

export default App;
