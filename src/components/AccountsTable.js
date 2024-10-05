// src/AccountsTable.js

import React from "react";
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
} from "@mui/material";
import { list_accounts, set_account, delete_account } from "../util/api"; // Adjust the import according to your file structure

const AccountsTable = () => {
  const { data:accounts, refetch, isFetching } = list_accounts()

  const handleEdit = async (index, field, value) => {
    const updatedAccount = { ...accounts[index], [field]: value };
    try {
      await set_account(updatedAccount); // Call the API to update the account
      // Update local state to reflect the changes
      refetch(); // Fetch updated accounts after editing
    } catch (error) {
      console.error("Error updating account:", error);
    }
  };

  const handleDelete = async (account) => {
    try {
      await delete_account(account); // Call the API to delete the account
      // Update local state to remove the deleted account
      refetch()
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Recurpost ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>
                <Button onClick={refetch} disabled={isFetching}>
                  Refresh
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts?.map((account, index) => (
              <TableRow key={account.id || `index-${index}`}>
                <TableCell>{account.id}</TableCell>
                <TableCell>
                  <Select
                    value={account.type || ""}
                    onChange={(e) => handleEdit(index, "type", e.target.value)}
                  >
                    <MenuItem value="INSTAGRAM">Instagram</MenuItem>
                    <MenuItem value="TIKTOK">TikTok</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={account.recurpost_id || ""}
                    onChange={(e) =>
                      handleEdit(index, "recurpost_id", parseInt(e.target.value))
                    }
                  />
                </TableCell>
                <TableCell>{account.name}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(account)}
                    disabled={!account.id}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default AccountsTable;
