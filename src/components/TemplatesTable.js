import React, { useEffect, useState, useCallback } from "react";
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
} from "@mui/material";
import {
  list_accounts,
  list_templates,
  set_template,
  delete_template,
  generate_post_proposal,
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

  const handleGeneratePrompt = async (template) => {
    while (true) {
      console.log("getting a proposal");
      const proposal = await generate_post_proposal({
        template_id: template.id,
        ai_prompt: template.ai_prompt,
        recurpost_ids: template.accounts
          .map((accountId) => accounts.find((acc) => acc.id === accountId))
          .map((acc) => acc.recurpost_id),
      });

      if (proposal.success) {
        openNewPostDialog(proposal);
        return;
      }
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
    </Paper>
  );
};

export default TemplatesTable;
