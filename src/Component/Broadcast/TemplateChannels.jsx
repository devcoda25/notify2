import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Tooltip, Typography, TablePagination, Radio, RadioGroup, FormControlLabel, Switch, Grid, Box,Chip, Divider 
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import axios from 'axios';
import baseURL from '../../Url';

const TemplateChannels = () => {
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
    const res = await axios.get(`${baseURL}/channels`, { headers, withCredentials: true });
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

  const handleInputChange = (e) => {
  const { name, value } = e.target;

  if (name === 'configuration') {
    try {
      setFormData((prev) => ({ ...prev, configuration: JSON.parse(value) }));
    } catch {
      setFormData((prev) => ({ ...prev, configuration: value })); // Keep raw if invalid
    }
  } else if (name === 'supported_formats') {
    setFormData((prev) => ({
      ...prev,
      supported_formats: value.split(',').map(f => f.trim()),
    }));
  } else {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
};

  const handleSubmit = async () => {
    const url = formData.id
      ? `${baseURL}/channel/update`
      : `${baseURL}/channel/store`;

    await axios.post(url, formData, { headers, withCredentials: true });
    setOpenDialog(false);
    fetchData();
  };

  const handleDelete = async () => {
    await axios.post(`${baseURL}/channel/delete`, { id: deleteId }, { headers, withCredentials: true });
    setOpenDelete(false);
    fetchData();
  };
  
  const handleView = async (id) => {
    const res = await axios.get(`${baseURL}/channel/show?id=${id}`, { headers, withCredentials: true });
    setViewData(res.data?.data);
    setOpenView(true);
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
      <Button variant="contained" sx={{marginBottom:"20px"}} startIcon={<Add />} onClick={() => handleDialogOpen()}>
        Add Channel
      </Button>

<TableContainer component={Paper} elevation={1}>
  <Table size="small">
    <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
      <TableRow>
        <TableCell>Name</TableCell>
        <TableCell>Slug</TableCell>
        <TableCell>Type</TableCell>
        <TableCell>Description</TableCell>
        <TableCell>Supported Formats</TableCell>
        <TableCell>Priority</TableCell>
        <TableCell>Status</TableCell>
        <TableCell align="center">Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
        <TableRow key={row.id} hover>
          <TableCell>{row.name}</TableCell>
          <TableCell>{row.slug}</TableCell>
          <TableCell>{row.type}</TableCell>
          <TableCell sx={{ maxWidth: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {row.description}
          </TableCell>
          <TableCell>
            {Array.isArray(row.supported_formats) ? (
              row.supported_formats.map((format, idx) => (
                <Chip
                  key={idx}
                  label={format}
                  size="small"
                  sx={{ mr: 0.3, mb: 0.3 }}
                />
              ))
            ) : (
              'N/A'
            )}
          </TableCell>
          <TableCell>{row.priority}</TableCell>

          {/* Active/Inactive status in compact row view */}
          <TableCell sx={{ px: 0 }}>
            <RadioGroup
              row
              value={row.is_active ? 'true' : 'false'}
              onChange={(e) =>
                axios
                  .post(`${baseURL}/channel/update`, {
                    ...row,
                    is_active: e.target.value === 'true',
                  }, { headers, withCredentials: true })
                  .then(fetchData)
              }
              sx={{ display: 'flex', gap: 0 }}
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

          {/* Colored action icons */}
          <TableCell align="center">
            <Box display="flex" justifyContent="center" gap={1}>
              <Tooltip title="View">
                <IconButton onClick={() => handleView(row.id)} size="small" sx={{ color: 'info.main' }}>
                  <Visibility fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton onClick={() => handleDialogOpen(row)} size="small" sx={{ color: 'primary.main' }}>
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  onClick={() => {
                    setDeleteId(row.id);
                    setOpenDelete(true);
                  }}
                  size="small"
                  sx={{ color: 'error.main' }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>

  {/* Pagination */}
  <TablePagination
    component="div"
    count={data.length}
    page={page}
    onPageChange={(e, newPage) => setPage(newPage)}
    rowsPerPage={rowsPerPage}
    rowsPerPageOptions={[rowsPerPage]}
    sx={{ px: 2 }}
  />
</TableContainer>



      {/* Add/Edit Dialog */}
 <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="sm">
  <DialogTitle>{formData?.id ? 'Edit Channel' : 'Add Channel'}</DialogTitle>
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
          fullWidth label="Type" name="type"
          value={formData.type || ''} onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Supported Formats (Comma Separated)"
          name="supported_formats"
          value={
            Array.isArray(formData.supported_formats)
              ? formData.supported_formats.join(', ')
              : formData.supported_formats || ''
          }
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth type="number"
          label="Priority" name="priority"
          value={formData.priority || ''} onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth type="number"
          label="Debug" name="debug"
          value={formData.debug || ''} onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={formData.is_active || false}
              onChange={(e) =>
                handleInputChange({
                  target: { name: 'is_active', value: e.target.checked }
                })
              }
            />
          }
          label="Is Active"
        />
      </Grid>
    </Grid>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleDialogClose}>Cancel</Button>
    <Button variant="contained" color="primary" onClick={handleSubmit}>
      Save
    </Button>
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
    Channel Details
  </DialogTitle>

  <DialogContent dividers sx={{ mt: 1 }}>
    {viewData ? (
      <>
        <Field label="Name" value={viewData.name} />
        <Field label="Slug" value={viewData.slug} />
        <Field label="Type" value={viewData.type} />
        <Field label="Description" value={viewData.description || '—'} />
        <Field
          label="Status"
          value={
            <Chip
              label={viewData.is_active ? 'Active' : 'Inactive'}
              color={viewData.is_active ? 'success' : 'default'}
              size="small"
            />
          }
        />
        <Field label="Priority" value={viewData.priority} />
        <Field
          label="Supported Formats"
          value={
            viewData.supported_formats?.length ? (
              viewData.supported_formats.map((fmt, idx) => (
                <Chip
                  key={idx}
                  label={fmt.toUpperCase()}
                  size="small"
                  variant="outlined"
                  sx={{ mr: 0.5 }}
                />
              ))
            ) : (
              '—'
            )
          }
        />
       
        {/* <Divider sx={{ my: 2 }} /> */}
        {/* <Field label="Created At" value={new Date(viewData.created_at).toLocaleString()} />
        <Field label="Updated At" value={new Date(viewData.updated_at).toLocaleString()} /> */}
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

export default TemplateChannels;
