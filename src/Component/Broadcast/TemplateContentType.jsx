import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Tooltip, Typography, TablePagination, Radio, RadioGroup, FormControlLabel, Switch, Grid, Box, Chip
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import axios from 'axios';
import baseURL from '../../Url';

const TemplateContentType = () => {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    id: null, name: '', slug: '', description: '', is_active: true,
    supports_versioning: false, supports_translation: false
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  const getAuthIdFromUrl = () => {
    const parts = window.location.pathname.split('/');
    return parts[2] || 0;
  };

  // const headers = {
  //   'Accept': 'application/json',
  //   'Content-Type': 'application/json',
  //   'X-Authuser': getAuthIdFromUrl(),
  //   'X-Request-Agent': 'APP',
  //   'X-SID': 'sid_r3fCxGnrMOp07mKQaCiS',
  //   'X-MUID': 'mut_XHujrA2WUG51hx3uOLL8'
  // };

     const headers = { 'Accept': 'application/json', "X-Authuser": getAuthIdFromUrl() };


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.get(`${baseURL}/content-types`, { headers, withCredentials: true });
    setData(res.data?.data?.values || []);
  };

  const handleDialogOpen = (item = null) => {
    setFormData(item ? { ...item } : {
      id: null, name: '', slug: '', description: '',
      supports_versioning: false, supports_translation: false, is_active: true
    });
    setOpenDialog(true);
  };

  const handleDialogClose = () => setOpenDialog(false);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const url = formData.id
      ? `${baseURL}/content-type/update`
      : `${baseURL}/content-type/store`;

    await axios.post(url, formData, { headers, withCredentials: true });
    setOpenDialog(false);
    fetchData();
  };

  const handleDelete = async () => {
    await axios.post(`${baseURL}/content-type/delete`, { id: deleteId }, { headers, withCredentials: true });
    setOpenDelete(false);
    fetchData();
  };
  
  const handleView = async (id) => {
    const res = await axios.get(`${baseURL}/content-type/show?id=${id}`, { headers, withCredentials: true });
    setViewData(res.data?.data);
    setOpenView(true);
  };

  const handleStatusChange = async (row, isActive) => {
  const payload = {
    ...row,
    is_active: isActive,
    field_schema: ensureJSONString(row.field_schema),
    validation_rules: ensureJSONString(row.validation_rules),
    default_values: ensureJSONString(row.default_values),
  };

  try {
    await axios.post(`${baseURL}/content-type/update`, payload, { headers, withCredentials: true });
    fetchData(); 
  } catch (err) {
    console.error("Status update failed:", err.response?.data || err.message);
  }
};

const ensureJSONString = (value) => {
  try {
    return typeof value === 'string' ? value : JSON.stringify(value);
  } catch {
    return '{}';
  }
};


 const Field = ({ label, value }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
      {label}
    </Typography>
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      {value}
    </Typography>
  </Box>
);


  return (
    <div className="p-4">
      <Typography variant="h5" gutterBottom>Templates</Typography>
      <Button variant="contained" startIcon={<Add />} onClick={() => handleDialogOpen()}>
        Add Content-Type
      </Button>

      <TableContainer component={Paper} sx={{ my: 2 }}>
  <Table size="small">
    <TableHead>
      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
        <TableCell sx={{ py: 1, px: 1 }}>Name</TableCell>
        <TableCell sx={{ py: 1, px: 1 }}>Slug</TableCell>
        <TableCell sx={{ py: 1, px: 1 }}>Description</TableCell>
        <TableCell sx={{ py: 1, px: 1 }}>Status</TableCell>
        <TableCell sx={{ py: 1, px: 1 }} align="center">Actions</TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {data
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((row) => (
          <TableRow key={row.id} hover>
            <TableCell sx={{ py: 0.5, px: 1 }}>{row.name}</TableCell>
            <TableCell sx={{ py: 0.5, px: 1 }}>{row.slug}</TableCell>
            <TableCell sx={{ py: 0.5, px: 1 }}>{row.description}</TableCell>
            <TableCell sx={{ py: 0.5, px: 1 }}>
              <RadioGroup
                row
                value={row.is_active ? 'true' : 'false'}
                onChange={(e) => handleStatusChange(row, e.target.value === 'true')}
              >
                <FormControlLabel
                  value="true"
                  control={<Radio size="small" color="success" />}
                  label="Active"
                  sx={{ mr: 1 }}
                />
                <FormControlLabel
                  value="false"
                  control={<Radio size="small" color="error" />}
                  label="Inactive"
                />
              </RadioGroup>
            </TableCell>

            <TableCell sx={{ py: 0.5, px: 1 }} align="center">
              <Box display="flex" justifyContent="center" gap={1}>
                <Tooltip title="View">
                  <IconButton size="small" onClick={() => handleView(row.id)}>
                    <Visibility sx={{ color: '#1976d2' }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton size="small" onClick={() => handleDialogOpen(row)}>
                    <Edit sx={{ color: '#2e7d32' }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton size="small" onClick={() => {
                    setDeleteId(row.id);
                    setOpenDelete(true);
                  }}>
                    <Delete sx={{ color: '#d32f2f' }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </TableCell>
          </TableRow>
        ))}
    </TableBody>
  </Table>

  <TablePagination
    component="div"
    count={data.length}
    page={page}
    onPageChange={(e, newPage) => setPage(newPage)}
    rowsPerPage={rowsPerPage}
    rowsPerPageOptions={[rowsPerPage]}
  />
</TableContainer>


      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="sm">
      <DialogTitle>{formData?.id ? 'Edit' : 'Add'} Template</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth label="Name" name="name"
              value={formData.name || ''} onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth label="Slug" name="slug"
              value={formData.slug || ''} onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth multiline rows={2}
              label="Description" name="description"
              value={formData.description || ''} onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth multiline rows={2}
              label="Field Schema (JSON)" name="field_schema"
              value={formData.field_schema || ''} onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth multiline rows={2}
              label="Validation Rules (JSON)" name="validation_rules"
              value={formData.validation_rules || ''} onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth multiline rows={2}
              label="Default Values (JSON)" name="default_values"
              value={formData.default_values || ''} onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.supports_versioning || false}
                  onChange={e => handleInputChange({
                    target: { name: 'supports_versioning', value: e.target.checked }
                  })}
                />
              }
              label="Supports Versioning"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.supports_translation || false}
                  onChange={e => handleInputChange({
                    target: { name: 'supports_translation', value: e.target.checked }
                  })}
                />
              }
              label="Supports Translation"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active || false}
                  onChange={e => handleInputChange({
                    target: { name: 'is_active', value: e.target.checked }
                  })}
                />
              }
              label="Is Active"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.debug || false}
                  onChange={e => handleInputChange({
                    target: { name: 'debug', value: e.target.checked ? 1 : 0 }
                  })}
                />
              }
              label="Debug Mode"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">Save</Button>
      </DialogActions>
    </Dialog>

      {/* View Dialog */}
   <Dialog
  open={openView}
  onClose={() => setOpenView(false)}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: 3,
      p: 2,
      backgroundColor: '#fafafa',
    },
  }}
>
  <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.4rem', pb: 0 }}>
    Template Details
  </DialogTitle>

  <DialogContent dividers sx={{ mt: 1 }}>
    {viewData ? (
      <>
        <Field label="Name" value={viewData.name} />
        <Field label="Slug" value={viewData.slug} />
        <Field label="Description" value={viewData.description || '—'} />
        <Field
          label="Supports Versioning"
          value={
            <Chip
              label={viewData.supports_versioning ? 'Yes' : 'No'}
              color={viewData.supports_versioning ? 'success' : 'default'}
              size="small"
            />
          }
        />
        <Field
          label="Supports Translation"
          value={
            <Chip
              label={viewData.supports_translation ? 'Yes' : 'No'}
              color={viewData.supports_translation ? 'success' : 'default'}
              size="small"
            />
          }
        />
        <Field
          label="Validation Rules"
          value={
            <Box
              component="pre"
              sx={{
                backgroundColor: '#f0f0f0',
                p: 2,
                borderRadius: 2,
                fontSize: 13,
                mt: 1,
                overflowX: 'auto',
              }}
            >
              {JSON.stringify(viewData.validation_rules, null, 2)}
            </Box>
          }
        />
        <Field
          label="Default Values"
          value={
            <Box
              component="pre"
              sx={{
                backgroundColor: '#f0f0f0',
                p: 2,
                borderRadius: 2,
                fontSize: 13,
                mt: 1,
                overflowX: 'auto',
              }}
            >
              {JSON.stringify(viewData.default_values, null, 2)}
            </Box>
          }
        />
        <Field
          label="Field Schema"
          value={
            <Box
              component="pre"
              sx={{
                backgroundColor: '#f0f0f0',
                p: 2,
                borderRadius: 2,
                fontSize: 13,
                mt: 1,
                overflowX: 'auto',
              }}
            >
              {JSON.stringify(viewData.field_schema?.fields, null, 2)}
            </Box>
          }
        />
      </>
    ) : (
      <Typography>Loading...</Typography>
    )}
  </DialogContent>

  <DialogActions>
    <Button variant="outlined" onClick={() => setOpenView(false)}>
      Close
    </Button>
  </DialogActions>
</Dialog>


      {/* Delete Confirm */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this template?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TemplateContentType;
