import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Divider,
  Box,
} from "@mui/material";

const USERS = [
  { id: "user-1", name: "Alice Johnson" },
  { id: "user-2", name: "Bob Williams" },
  { id: "user-3", name: "Charlie Brown" },
  { id: "user-4", name: "Diana Miller" },
];

export default function AssignUserModal({ isOpen, onClose, onSave, initialData }) {
  const [assignedUser, setAssignedUser] = useState("");

  useEffect(() => {
    if (isOpen) {
      setAssignedUser(initialData?.assignedUser || "");
    }
  }, [initialData, isOpen]);

  const handleSave = () => {
    onSave({ assignedUser });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Assign User</DialogTitle>
      <Divider />
      <DialogContent>
        <Box mt={2}>
          <FormControl fullWidth>
            <InputLabel id="user-select-label">Select User</InputLabel>
            <Select
              labelId="user-select-label"
              value={assignedUser}
              onChange={(e) => setAssignedUser(e.target.value)}
            >
              {USERS.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Assigned User
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleSave}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
