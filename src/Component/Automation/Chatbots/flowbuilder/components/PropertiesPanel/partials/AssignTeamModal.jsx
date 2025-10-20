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

const TEAMS = [
  { id: "team-1", name: "Support Tier 1" },
  { id: "team-2", name: "Sales Team" },
  { id: "team-3", name: "Technical Support" },
  { id: "team-4", name: "Billing Department" },
];

export default function AssignTeamModal({ isOpen, onClose, onSave, initialData }) {
  const [assignedTeam, setAssignedTeam] = useState("");

  useEffect(() => {
    if (isOpen) {
      setAssignedTeam(initialData?.assignedTeam || "");
    }
  }, [initialData, isOpen]);

  const handleSave = () => {
    onSave({ assignedTeam });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Assign Team</DialogTitle>
      <Divider />
      <DialogContent>
        <Box mt={2}>
          <FormControl fullWidth>
            <InputLabel id="team-select-label">Select Team</InputLabel>
            <Select
              labelId="team-select-label"
              value={assignedTeam}
              onChange={(e) => setAssignedTeam(e.target.value)}
            >
              {TEAMS.map((team) => (
                <MenuItem key={team.id} value={team.id}>
                  {team.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Assigned Team
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
