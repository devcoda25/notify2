import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableRow, TableContainer,
  Paper, IconButton, Tooltip, Button, Dialog, DialogTitle, DialogContent,
  TextField, DialogActions, Typography, RadioGroup, FormControlLabel,
  Radio, TablePagination
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import axios from 'axios';
import baseURL from '../../Url';

const TemplateCategories = () => {
  const [templateData, setTemplateData] = useState([]);
  const [formData, setFormData] = useState({
    id: null, name: '', slug: '', description: '',
    icon: '', color: '#4A90E2', is_active: true, sort_order: 1
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [searchText, setSearchText] = useState('');

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
    GetTemplateCategories();
  }, []);

  const GetTemplateCategories = async () => {
    try {
      const res = await axios.get(`${baseURL}/categories`, { headers, withCredentials: true });
      setTemplateData(res.data?.data?.values || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleOpenDialog = (item = null) => {
    setFormData(item ? { ...item } : {
      id: null, name: '', slug: '', description: '',
      icon: '', color: '#4A90E2', is_active: true, sort_order: 1
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const url = formData.id
        ? `${baseURL}/category/update`
        : `${baseURL}/category/store`;

      await axios.post(url, formData, { headers, withCredentials: true });
      handleCloseDialog();
      GetTemplateCategories();
    } catch (err) {
      console.error("Error saving category:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.post(`${baseURL}/category/delete`, { id: deleteId }, { headers, withCredentials: true } );
      setOpenDeleteConfirm(false);
      GetTemplateCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  const handleViewCategory = async (id) => {
    try {
      const res = await axios.get(`${baseURL}/category/show?id=${id}`, { headers, withCredentials: true });
      setViewData(res.data?.data);
      setOpenViewDialog(true);
    } catch (err) {
      console.error("Error viewing category:", err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
  try {
    const updated = templateData.find((item) => item.id === id);
    if (!updated) return;

    const payload = { ...updated, is_active: newStatus };

    await axios.post(`${baseURL}/category/update`, payload, { headers, withCredentials: true });
    GetTemplateCategories();
  } catch (err) {
    console.error("Error updating status:", err);
  }
};


  const filteredData = templateData.filter(item =>
  item.name.toLowerCase().includes(searchText.toLowerCase()) ||
  item.slug.toLowerCase().includes(searchText.toLowerCase()) 
//   item.slug.toLowerCase().includes(searchText.toLowerCase()) ||
//   item.description.toLowerCase().includes(searchText.toLowerCase())
);


const Field = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
    <Typography fontWeight={500} color="text.secondary">{label}</Typography>
    <Typography>{value}</Typography>
  </div>
);


  return (
    <div className="p-4">
      <Typography variant="h5" className="mb-4 font-bold">Template Categories</Typography>
      <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
      <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()} sx={{ mb: 2 }}>
        Add Category
      </Button>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
        <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            />
        </div>
            </div>

  <TableContainer component={Paper} elevation={1}>
  <Table size="small">
    <TableHead>
      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
        <TableCell>Name</TableCell>
        <TableCell>Description</TableCell>
        <TableCell>Slug</TableCell>
        <TableCell>Status</TableCell>
        <TableCell>Updated</TableCell>
        <TableCell align="center">Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {filteredData
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((row) => (
          <TableRow key={row.id} hover>
            <TableCell sx={{ py: 0.5, fontSize: 13 }}>{row.name}</TableCell>
            <TableCell sx={{ py: 0.5, fontSize: 13 }}>{row.description}</TableCell>
            <TableCell sx={{ py: 0.5, fontSize: 13 }}>{row.slug}</TableCell>
            <TableCell sx={{ py: 0.5 }}>
              <RadioGroup
                row
                value={row.is_active ? 'true' : 'false'}
                onChange={(e) =>
                  handleStatusChange(row.id, e.target.value === 'true')
                }
              >
                <FormControlLabel
                  value="true"
                  control={<Radio size="small" color="success" />}
                  label={<span style={{ fontSize: 12 }}>Active</span>}
                />
                <FormControlLabel
                  value="false"
                  control={<Radio size="small" color="error" />}
                  label={<span style={{ fontSize: 12 }}>Inactive</span>}
                />
              </RadioGroup>
            </TableCell>
            <TableCell sx={{ py: 0.5, fontSize: 13 }}>
              {new Date(row.updated_at).toLocaleDateString()}
            </TableCell>
            <TableCell align="center" sx={{ py: 0.5 }}>
              <Tooltip title="View">
                <IconButton onClick={() => handleViewCategory(row.id)} color="info" size="small">
                  <Visibility fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton onClick={() => handleOpenDialog(row)} color="success" size="small">
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  onClick={() => {
                    setDeleteId(row.id);
                    setOpenDeleteConfirm(true);
                  }}
                  color="error"
                  size="small"
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
    </TableBody>
  </Table>

  <TablePagination
    component="div"
    count={filteredData.length}
    page={page}
    onPageChange={(e, newPage) => setPage(newPage)}
    rowsPerPage={rowsPerPage}
    rowsPerPageOptions={[rowsPerPage]}
    sx={{ mt: 1, fontSize: 13 }}
  />
</TableContainer>


      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{formData.id ? 'Edit Category' : 'Add Category'}</DialogTitle>
        <DialogContent dividers>
          <TextField margin="dense" name="name" label="Category Name" fullWidth value={formData.name} onChange={handleChange} />
          <TextField margin="dense" name="slug" label="Slug" fullWidth value={formData.slug} onChange={handleChange} />
          <TextField margin="dense" name="description" label="Description" fullWidth multiline minRows={2} value={formData.description} onChange={handleChange} />
          <TextField margin="dense" name="icon" label="Icon (e.g. fa-tag)" fullWidth value={formData.icon} onChange={handleChange} />
          <TextField margin="dense" name="color" label="Color" type="color" fullWidth value={formData.color} onChange={handleChange} InputLabelProps={{ shrink: true }} />
          <TextField margin="dense" name="sort_order" label="Sort Order" type="number" fullWidth value={formData.sort_order} onChange={handleChange} />
          <RadioGroup
            row name="is_active"
            value={formData.is_active ? 'true' : 'false'}
            onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.value === 'true' }))}
            sx={{ mt: 2 }}
          >
            <FormControlLabel value="true" control={<Radio color="success" />} label="Active" />
            <FormControlLabel value="false" control={<Radio color="error" />} label="Inactive" />
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>{formData.id ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteConfirm} onClose={() => setOpenDeleteConfirm(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this category?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteConfirm(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* View Category Modal */}
 <Dialog
  open={openViewDialog}
  onClose={() => setOpenViewDialog(false)}
  PaperProps={{
    sx: {
      borderRadius: 3,
      p: 2,
      width: 400,
      boxShadow: 6,
    }
  }}
>
  <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '1.3rem' }}>
    Category Details
  </DialogTitle>

  <DialogContent dividers sx={{ pt: 1 }}>
    {viewData ? (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Field label="Name" value={viewData.name} />
        <Field label="Slug" value={viewData.slug} />
        <Field label="Description" value={viewData.description} />
        <Field label="Icon" value={viewData.icon} />
        <Field label="Color" value={
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 16, height: 16, borderRadius: '50%',
              backgroundColor: viewData.color,
              border: '1px solid #ccc'
            }} />
            {viewData.color}
          </span>
        } />
        <Field label="Sort Order" value={viewData.sort_order} />
        <Field
          label="Status"
          value={
            <span style={{
              padding: '2px 10px',
              borderRadius: 20,
              fontSize: 12,
              backgroundColor: viewData.is_active ? '#e6f4ea' : '#fdecea',
              color: viewData.is_active ? '#2e7d32' : '#c62828',
              fontWeight: 500
            }}>
              {viewData.is_active ? 'Active' : 'Inactive'}
            </span>
          }
        />
        <Field label="Updated At" value={new Date(viewData.updated_at).toLocaleString()} />
      </div>
    ) : (
      <Typography>Loading...</Typography>
    )}
  </DialogContent>

  <DialogActions sx={{ justifyContent: 'center' }}>
    <Button
      onClick={() => setOpenViewDialog(false)}
      variant="outlined"
      size="small"
      sx={{ borderRadius: 2 }}
    >
      Close
    </Button>
  </DialogActions>
</Dialog>


    </div>
  );
};

export default TemplateCategories;
