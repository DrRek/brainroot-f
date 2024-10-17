import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Select,
  MenuItem,
  TextField,
  Paper,
  Checkbox,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import {
  list_accounts,
  list_templates,
  set_template,
  delete_template,
} from "../util/api"; // Adjust import according to your structure

const TemplatesTable = ({ openNewPostDialog }) => {
  const { data: accounts, isFetching: isFetchingAccounts } = list_accounts();
  const { data: templates, refetch, isFetching } = list_templates();

  const [editableTemplates, setEditableTemplates] = useState([]);

  useEffect(() => {
    setEditableTemplates(templates);
  }, [templates]);

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    template: null,
  });

  const saveTemplate = async (updatedTemplate) => {
    await set_template(updatedTemplate);
    refetch(); // Refresh templates after update
  };

  const handleEdit = (index, field, value) => {
    const updatedTemplates = [...editableTemplates];
    updatedTemplates[index][field] = value;
    updatedTemplates[index]["was_edited"] = true;
    setEditableTemplates(updatedTemplates);
  };

  const handleEditAccounts = (index, value) => {
    const updatedTemplates = [...editableTemplates];
    updatedTemplates[index]["accounts"] = value.filter((i) =>
      accounts?.some((a) => a.id === i)
    );
    templates[index]["was_edited"] = true;
    setEditableTemplates(updatedTemplates);
  };

  const handleCreate = async () => {
    try {
      await set_template({ ai_prompt: "", accounts: [] });
      refetch();
    } catch (error) {
      console.error("Error creating template:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await delete_template(deleteDialog.template);
      refetch();
      setDeleteDialog({ open: false, template: null });
    } catch (error) {
      console.error("Error deleting template:", error);
    }
  };

  const [isGeneratingPost, setIsGeneratingPost] = useState(false);
  const handleGeneratePrompt = async (template) => {
    if(template.was_edited) // save the template if the user made same changes and forgot to click on save
      await saveTemplate(template)

    setIsGeneratingPost(true);
    try {
      openNewPostDialog(template);
    } finally {
      setIsGeneratingPost(false);
    }
  };

  const handleDeleteClick = (template) => {
    setDeleteDialog({ open: true, template });
  };

  const renderAccountSelect = (selectedAccounts, index) => {
    return (
      <Select
        multiple
        disabled={isFetchingAccounts}
        value={selectedAccounts}
        onChange={(e) => handleEditAccounts(index, e.target.value)}
        renderValue={(selected) =>
          selected
            .map((accountId) => {
              const account = accounts.find((acc) => acc.id === accountId);
              return account
                ? `${account.type} - ${account.name}`
                : "Unknown Account";
            })
            .join(", ")
        }
      >
        {accounts.map((account, index) => (
          <MenuItem key={index} value={account.id} disabled={!account.id}>
            <Checkbox checked={selectedAccounts.indexOf(account.id) > -1} />
            <ListItemText primary={`${account.type} - ${account.name}`} />
          </MenuItem>
        ))}
      </Select>
    );
  };

  const checkForMissingAccounts = (templateAccounts) => {
    return templateAccounts.some(
      (accountId) => !accounts.find((acc) => acc.id === accountId)
    );
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>AI Prompt</TableCell>
              <TableCell>Accounts</TableCell>
              <TableCell>
                <Button onClick={refetch} disabled={isFetching}>
                  Refresh
                </Button>
                <Button onClick={handleCreate}>Add</Button>
                <Button
                  onClick={() =>
                    openNewPostDialog({
                      caption:
                        "Take a moment to center yourself with meditation. Just a few minutes can transform your day. \ud83c\udf3f\ud83e\uddd8\u200d\u2642\ufe0f #MindfulMoments #MeditationBreak #StayCentered #PeaceWithin #CalmTheMind #RelaxAndReflect #InnerPeace #FindYourCalm #BreatheInBreatheOut #PauseAndReset",
                      duration: 30,
                      overlay: "Pause. Breathe. Reflect.",
                      recurpost_ids: [167957, 167956],
                      start_at_seconds: 0,
                      success: true,
                      template_id: 1,
                      time: "Mon, 07 Oct 2024 09:45:00 GMT",
                      youtube_video_url:
                        "https://www.youtube.com/watch?v=BHACKCNDMW8",
                    })
                  }
                >
                  Sample Proposal
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {editableTemplates?.map((template, index) => (
              <TableRow key={template.id || `index-${index}`}>
                <TableCell>{template.id}</TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    value={template.ai_prompt || ""}
                    onChange={(e) =>
                      handleEdit(index, "ai_prompt", e.target.value)
                    }
                    multiline={true}
                  />
                </TableCell>
                <TableCell>
                  {renderAccountSelect(template.accounts, index)}
                  {checkForMissingAccounts(template.accounts) && (
                    <div style={{ color: "red" }}>
                      Warning: Some accounts no longer exist.
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => saveTemplate(template)}
                    disabled={!template.was_edited}
                  >
                    Save
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleGeneratePrompt(template)}
                  >
                    Generate Prompt
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteClick(template)}
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
        onClose={() => setDeleteDialog({ open: false, template: null })}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this template?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, template: null })}
          >
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* Loader */}
      <Backdrop open={isGeneratingPost} style={{ zIndex: 1000 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Paper>
  );
};

export default TemplatesTable;
