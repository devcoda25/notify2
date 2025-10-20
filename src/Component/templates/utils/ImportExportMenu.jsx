// Path: src/Component/templates/utils/ImportExportMenu.jsx
import React from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
} from "@mui/material";
  import { Download, Upload } from "lucide-react";

export default function ImportExportMenu({
  getData,             // () => any   (required for export)
  onImport,            // (obj) => void
  iconButtonProps = {}, // props for the trigger IconButton
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [snack, setSnack] = React.useState({ open: false, msg: "", severity: "success" });
  const fileInputRef = React.useRef(null);

  const open = Boolean(anchorEl);
  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const exportJSON = () => {
    try {
      const data = getData?.();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "template.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setSnack({ open: true, msg: "Exported JSON.", severity: "success" });
    } catch (e) {
      setSnack({ open: true, msg: "Failed to export.", severity: "error" });
    } finally {
      handleClose();
    }
  };

  const importJSON = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const obj = JSON.parse(String(reader.result || "{}"));
        onImport?.(obj);
        setSnack({ open: true, msg: "Imported JSON.", severity: "success" });
      } catch {
        setSnack({ open: true, msg: "Invalid JSON.", severity: "error" });
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <IconButton size="small" onClick={handleClick} {...iconButtonProps}>
        <Download size={16} />
      </IconButton>
      <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
        <MenuItem onClick={exportJSON}>
          <ListItemIcon><Download size={16} /></ListItemIcon>
          <ListItemText>Export JSON</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            fileInputRef.current?.click();
          }}
        >
          <ListItemIcon><Upload size={16} /></ListItemIcon>
          <ListItemText>Import JSON</ListItemText>
        </MenuItem>
      </Menu>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          importJSON(f);
          e.target.value = "";
        }}
      />

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
      >
        <Alert severity={snack.severity} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </>
  );
}
