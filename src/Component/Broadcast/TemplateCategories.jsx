import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableRow, TableContainer,
  Paper, IconButton, Tooltip, Button, Dialog, DialogTitle, DialogContent,
  TextField, DialogActions, Typography, RadioGroup, FormControlLabel,
  Radio, TablePagination, Alert, Chip
} from '@mui/material';
import { Add, Edit, Delete, Visibility, CheckCircle, Error } from '@mui/icons-material';
import axios from 'axios';
import { addCategory, deleteCategory, fetchCategories, showCategory, updateCategory } from '../../Url';
import { config } from '../../Url';

const TemplateCategories = ({fetchCategoryData, categoryData}) => {
  // const [categoryData, setcategoryData] = useState([]);
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
  
  // Validation states
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rowsPerPage = 5;


  // const validateField = (name, value, allData = formData) => {
  //   switch (name) {
  //     case 'name':
  //       if (!value || value.trim().length === 0) {
  //         return 'Category name is required';
  //       }
  //       if (value.trim().length < 2) {
  //         return 'Category name must be at least 2 characters';
  //       }
  //       if (value.trim().length > 100) {
  //         return 'Category name must be less than 100 characters';
  //       }
  //       // Check for duplicate names (excluding current item during edit)
  //       const isDuplicate = categoryData.some(item => 
  //         item.name.toLowerCase() === value.toLowerCase() && item.id !== allData.id
  //       );
  //       if (isDuplicate) {
  //         return 'Category name already exists';
  //       }
  //       return '';

  //     case 'slug':
  //       if (!value || value.trim().length === 0) {
  //         return 'Slug is required';
  //       }
  //       if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
  //         return 'Slug must contain only lowercase letters, numbers, and hyphens';
  //       }
  //       if (value.length < 2) {
  //         return 'Slug must be at least 2 characters';
  //       }
  //       if (value.length > 50) {
  //         return 'Slug must be less than 50 characters';
  //       }
  //       // Check for duplicate slugs (excluding current item during edit)
  //       const isSlugDuplicate = categoryData.some(item => 
  //         item.slug.toLowerCase() === value.toLowerCase() && item.id !== allData.id
  //       );
  //       if (isSlugDuplicate) {
  //         return 'Slug already exists';
  //       }
  //       return '';

  //     case 'description':
  //       if (!value || value.trim().length === 0) {
  //         return 'Description is required';
  //       }
  //       if (value.trim().length < 10) {
  //         return 'Description must be at least 10 characters';
  //       }
  //       if (value.trim().length > 500) {
  //         return 'Description must be less than 500 characters';
  //       }
  //       return '';

  //     case 'icon':
  //       if (!value || value.trim().length === 0) {
  //         return 'Icon is required';
  //       }
  //       if (!/^fa-[a-zA-Z0-9-]+$/.test(value)) {
  //         return 'Icon must be in format: fa-icon-name';
  //       }
  //       return '';

  //     case 'color':
  //       if (!value) {
  //         return 'Color is required';
  //       }
  //       if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
  //         return 'Please enter a valid hex color';
  //       }
  //       return '';

  //     case 'sort_order':
  //       if (!value && value !== 0) {
  //         return 'Sort order is required';
  //       }
  //       const numValue = parseInt(value);
  //       if (isNaN(numValue) || numValue < 0) {
  //         return 'Sort order must be a positive number';
  //       }
  //       if (numValue > 1000) {
  //         return 'Sort order must be less than 1000';
  //       }
  //       return '';

  //     default:
  //       return '';
  //   }
  // };

  // const validateForm = (data = formData) => {
  //   const newErrors = {};
  //   const fields = ['name', 'slug', 'description', 'icon', 'color', 'sort_order'];
    
  //   fields.forEach(field => {
  //     const error = validateField(field, data[field], data);
  //     if (error) {
  //       newErrors[field] = error;
  //     }
  //   });

  //   return newErrors;
  // };

  // const isFormValid = () => {
  //   const formErrors = validateForm();
  //   return Object.keys(formErrors).length === 0;
  // };

  // useEffect(() => {
  //   GetTemplateCategories();
  // }, []);

  // const GetTemplateCategories = async () => {
  //   try {
  //     const res = await axios.get(fetchCategories(), config);
  //     setcategoryData(res.data?.data?.values || []);
  //   } catch (err) {
  //     console.error('Error fetching categories:', err);
  //   }
  // };

const validateField = (name, value, allData = formData) => {
  const trimmed = typeof value === 'string' ? value.trim() : value;

  switch (name) {
    case 'name':
      if (!trimmed) return 'Category name is required';
      if (trimmed.length < 2) return 'Must be at least 2 characters';
      if (trimmed.length > 100) return 'Must be less than 100 characters';
      if (categoryData.some(item => item.name.toLowerCase() === trimmed.toLowerCase() && item.id !== allData.id)) {
        return 'Category name already exists';
      }
      return '';

    case 'slug':
      if (!trimmed) return 'Slug is required';
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmed)) {
        return 'Use lowercase, numbers, hyphens only';
      }
      if (trimmed.length < 2) return 'Must be at least 2 characters';
      if (trimmed.length > 50) return 'Must be less than 50 characters';
      if (categoryData.some(item => item.slug.toLowerCase() === trimmed.toLowerCase() && item.id !== allData.id)) {
        return 'Slug already exists';
      }
      return '';

    case 'description':
      if (!trimmed) return 'Description is required';
      if (trimmed.length < 10) return 'Must be at least 10 characters';
      if (trimmed.length > 500) return 'Must be less than 500 characters';
      return '';

    case 'icon':
      if (!trimmed) return 'Icon is required';
      if (!/^fa-[a-zA-Z0-9-]+$/.test(trimmed)) {
        return 'Use format: fa-icon-name';
      }
      return '';

    case 'color':
      if (!trimmed) return 'Color is required';
      if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(trimmed)) {
        return 'Invalid hex code';
      }
      return '';

    case 'sort_order':
      if (trimmed === '' || trimmed === null || trimmed === undefined) return 'Sort order is required';
      const num = parseInt(trimmed);
      if (isNaN(num)) return 'Must be a number';
      if (num < 0) return 'Must be ≥ 0';
      if (num > 1000) return 'Must be ≤ 1000';
      return '';

    default:
      return '';
  }
};

const validateForm = (data = formData) => {
  const fields = ['name', 'slug', 'description', 'icon', 'color', 'sort_order'];
  const errors = {};
  fields.forEach((field) => {
    const error = validateField(field, data[field], data);
    if (error) errors[field] = error;
  });
  return errors;
};

const isFormValid = () => {
  const formErrors = validateForm();
  return Object.keys(formErrors).length === 0;
};


  const handleOpenDialog = (item = null) => {
    setFormData(item ? { ...item } : {
      id: null, name: '', slug: '', description: '',
      icon: '', color: '#4A90E2', is_active: true, sort_order: 1
    });
    setErrors({});
    setTouched({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-generate slug from name
    let updatedData = { ...formData, [name]: value };
    if (name === 'name' && !formData.id) {
      updatedData.slug = value.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }
    
    setFormData(updatedData);
    
    // Clear error for this field and validate
    if (touched[name]) {
      const fieldError = validateField(name, value, updatedData);
      setErrors(prev => ({
        ...prev,
        [name]: fieldError
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const fieldError = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
  };

  const handleSubmit = async () => {
    // Mark all fields as touched
    const allFields = ['name', 'slug', 'description', 'icon', 'color', 'sort_order'];
    const touchedFields = {};
    allFields.forEach(field => {
      touchedFields[field] = true;
    });
    setTouched(touchedFields);

    // Validate form
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const url = formData.id
        ? updateCategory()
        : addCategory();

      await axios.post(url, formData, config);
      handleCloseDialog();
      fetchCategoryData();
    } catch (err) {
      console.error("Error saving category:", err);
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.post(deleteCategory(), { id: deleteId }, config );
      setOpenDeleteConfirm(false);
      fetchCategoryData();
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  const handleViewCategory = async (id) => {
    try {
      const res = await axios.get(`${showCategory()}?id=${id}`, config);
      setViewData(res.data?.data);
      setOpenViewDialog(true);
    } catch (err) {
      console.error("Error viewing category:", err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = categoryData.find((item) => item.id === id);
      if (!updated) return;

      const payload = { ...updated, is_active: newStatus };

      await axios.post(updateCategory(), payload, config);
      fetchCategoryData();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const filteredData = categoryData.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.slug.toLowerCase().includes(searchText.toLowerCase()) 
  );

  const Field = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
      <Typography fontWeight={500} color="text.secondary">{label}</Typography>
      <Typography>{value}</Typography>
    </div>
  );

  const getFieldProps = (name) => ({
    name,
    value: formData[name],
    onChange: handleChange,
    onBlur: handleBlur,
    error: touched[name] && !!errors[name],
    helperText: touched[name] && errors[name],
    sx: {
      '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
          borderColor: touched[name] && errors[name] ? '#d32f2f' : '#1976d2',
        },
      },
    }
  });

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
            {categoryData.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                                <Typography variant="h6" color="text.secondary">
                                  No templates found
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ) :(
            filteredData
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
              )))}
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
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 'bold', 
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          {formData.id ? <Edit fontSize="small" /> : <Add fontSize="small" />}
          {formData.id ? 'Edit Category' : 'Add Category'}
        </DialogTitle>
        
        <DialogContent dividers sx={{ pb: 3 }}>
          {/* Show validation summary if there are errors */}
          {/* {Object.keys(errors).length > 0 && Object.keys(touched).length > 0 && (
            <Alert 
              severity="error" 
              sx={{ mb: 2 }}
              icon={<Error />}
            >
              Please fix the following errors before submitting:
            </Alert>
          )} */}

          <TextField
            {...getFieldProps('name')}
            margin="dense"
            label="Category Name"
            fullWidth
            required
            placeholder="Enter category name"
            InputProps={{
              endAdornment: !errors.name && touched.name && formData.name ? (
                <CheckCircle color="success" fontSize="small" />
              ) : null
            }}
          />

          <TextField
            {...getFieldProps('slug')}
            margin="dense"
            label="Slug"
            fullWidth
            required
            placeholder="category-slug"
            helperText={
              touched.slug && errors.slug ? errors.slug : 
              "URL-friendly version of the name. Will be auto-generated if left empty."
            }
            InputProps={{
              endAdornment: !errors.slug && touched.slug && formData.slug ? (
                <CheckCircle color="success" fontSize="small" />
              ) : null
            }}
          />

          <TextField
            {...getFieldProps('description')}
            margin="dense"
            label="Description"
            fullWidth
            required
            multiline
            minRows={3}
            placeholder="Enter category description"
            helperText={
              touched.description && errors.description ? errors.description :
              `${formData.description.length}/500 characters`
            }
            InputProps={{
              endAdornment: !errors.description && touched.description && formData.description ? (
                <CheckCircle color="success" fontSize="small" />
              ) : null
            }}
          />

          <TextField
            {...getFieldProps('icon')}
            margin="dense"
            label="Icon"
            fullWidth
            required
            placeholder="fa-tag"
            helperText={
              touched.icon && errors.icon ? errors.icon :
              "FontAwesome icon class (e.g., fa-tag, fa-folder)"
            }
            InputProps={{
              endAdornment: !errors.icon && touched.icon && formData.icon ? (
                <CheckCircle color="success" fontSize="small" />
              ) : null
            }}
          />

          <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
            <TextField
              {...getFieldProps('color')}
              margin="dense"
              label="Color"
              type="color"
              required
              sx={{ flex: 1 }}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: !errors.color && touched.color && formData.color ? (
                  <CheckCircle color="success" fontSize="small" />
                ) : null
              }}
            />

            <TextField
              {...getFieldProps('sort_order')}
              margin="dense"
              label="Sort Order"
              type="number"
              required
              sx={{ flex: 1 }}
              inputProps={{ min: 0, max: 1000 }}
              InputProps={{
                endAdornment: !errors.sort_order && touched.sort_order && formData.sort_order ? (
                  <CheckCircle color="success" fontSize="small" />
                ) : null
              }}
            />
          </div>

          <div style={{ marginTop: 16 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
              Status
            </Typography>
            <RadioGroup
              row
              name="is_active"
              value={formData.is_active ? 'true' : 'false'}
              onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.value === 'true' }))}
            >
              <FormControlLabel 
                value="true" 
                control={<Radio color="success" />} 
                label={
                  <Chip 
                    label="Active" 
                    color="success" 
                    variant="outlined" 
                    size="small"
                  />
                } 
              />
              <FormControlLabel 
                value="false" 
                control={<Radio color="error" />} 
                label={
                  <Chip 
                    label="Inactive" 
                    color="error" 
                    variant="outlined" 
                    size="small"
                  />
                } 
              />
            </RadioGroup>
          </div>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button 
            onClick={handleCloseDialog}
            variant="outlined"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={!isFormValid() || isSubmitting}
            sx={{ minWidth: 100 }}
          >
            {isSubmitting ? 'Saving...' : (formData.id ? 'Update' : 'Add')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={openDeleteConfirm} 
        onClose={() => setOpenDeleteConfirm(false)}
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Delete color="error" />
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          Are you sure you want to delete this category? This action cannot be undone.
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDeleteConfirm(false)} variant="outlined">
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
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