import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";

export default function WebhookModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}) {
  const [method, setMethod] = useState(initialData?.method || "GET");
  const [url, setUrl] = useState(initialData?.url || "https://");
  const [showHeaders, setShowHeaders] = useState(
    !!initialData?.headers?.length
  );
  const [headers, setHeaders] = useState(initialData?.headers || []);
  const [showBody, setShowBody] = useState(!!initialData?.body);
  const [body, setBody] = useState(initialData?.body || "");
  const [showTest, setShowTest] = useState(false);
  const [testVars, setTestVars] = useState([]);

  const handleSave = () => {
    const dataToSave = {
      method,
      url,
      headers: showHeaders ? headers : [],
      body: showBody ? body : "",
    };
    onSave(dataToSave);
    onClose();
  };

  const handleHeaderChange = (index, key, value) => {
    const updated = [...headers];
    updated[index][key] = value;
    setHeaders(updated);
  };

  const handleAddHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const handleRemoveHeader = (index) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const handleTestVarChange = (index, key, value) => {
    const updated = [...testVars];
    updated[index][key] = value;
    setTestVars(updated);
  };

  const handleAddTestVar = () => {
    setTestVars([...testVars, { key: "", value: "" }]);
  };

  const handleRemoveTestVar = (index) => {
    setTestVars(testVars.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Webhook</DialogTitle>
      <DialogContent dividers>
        {/* URL & Method */}
        <Typography variant="subtitle1" gutterBottom>
          URL & Method
        </Typography>
        <Box display="flex" gap={2} mb={3}>
          <Select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="GET">GET</MenuItem>
            <MenuItem value="POST">POST</MenuItem>
            <MenuItem value="PUT">PUT</MenuItem>
            <MenuItem value="PATCH">PATCH</MenuItem>
            <MenuItem value="DELETE">DELETE</MenuItem>
          </Select>
          <TextField
            fullWidth
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://"
          />
        </Box>

        {/* Headers */}
        <Box mb={3}>
          <FormControlLabel
            control={
              <Switch
                checked={showHeaders}
                onChange={(e) => setShowHeaders(e.target.checked)}
              />
            }
            label="Customize Headers"
          />
          {showHeaders && (
            <Box>
              {headers.map((h, index) => (
                <Box key={index} display="flex" gap={1} mb={1}>
                  <TextField
                    label="Key"
                    value={h.key}
                    onChange={(e) =>
                      handleHeaderChange(index, "key", e.target.value)
                    }
                    fullWidth
                  />
                  <TextField
                    label="Value"
                    value={h.value}
                    onChange={(e) =>
                      handleHeaderChange(index, "value", e.target.value)
                    }
                    fullWidth
                  />
                  <IconButton onClick={() => handleRemoveHeader(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleAddHeader}
              >
                Add Header
              </Button>
            </Box>
          )}
        </Box>

        {/* Body */}
        <Box mb={3}>
          <FormControlLabel
            control={
              <Switch
                checked={showBody}
                onChange={(e) => setShowBody(e.target.checked)}
              />
            }
            label="Customize Body"
          />
          {showBody && (
            <TextField
              fullWidth
              multiline
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder='{ "key": "value" }'
              margin="normal"
            />
          )}
        </Box>

        {/* Test Variables */}
        <Box mb={3}>
          <FormControlLabel
            control={
              <Switch
                checked={showTest}
                onChange={(e) => setShowTest(e.target.checked)}
              />
            }
            label="Test Your Request"
          />
          {showTest && (
            <Box>
              {testVars.map((tv, index) => (
                <Box key={index} display="flex" gap={1} mb={1}>
                  <TextField
                    label="Variable"
                    value={tv.key}
                    onChange={(e) =>
                      handleTestVarChange(index, "key", e.target.value)
                    }
                    fullWidth
                  />
                  <TextField
                    label="Value"
                    value={tv.value}
                    onChange={(e) =>
                      handleTestVarChange(index, "value", e.target.value)
                    }
                    fullWidth
                  />
                  <IconButton onClick={() => handleRemoveTestVar(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleAddTestVar}
              >
                Add Variable
              </Button>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => alert("Test request sent!")}
        >
          Test the request
        </Button>
        <Box display="flex" gap={2}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
