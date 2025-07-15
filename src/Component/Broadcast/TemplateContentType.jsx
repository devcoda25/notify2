import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Tooltip, Typography, TablePagination, Radio, RadioGroup, 
  FormControlLabel, Switch, Grid, Box, Chip, Alert, CircularProgress,
  Card, CardContent, Divider, Stack, InputAdornment, Fade, Slide
} from '@mui/material';
import { 
  Add, Edit, Delete, Visibility, Save, Cancel, Warning,
  CheckCircle, ErrorOutline, Code, Description, Label
} from '@mui/icons-material';
import axios from 'axios';
import baseURL from '../../Url';

const TemplateContentType = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    id: null, name: '', slug: '', description: '', is_active: true,
    supports_versioning: false, supports_translation: false, debug: false,
    field_schema: '', validation_rules: '', default_values: ''
  });
  const [errors, setErrors] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [page, setPage] = useState(0);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'success' });
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


  // Validation functions
  const validateField = (name, value) => {
    const validationRules = {
      name: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z0-9\s\-_]+$/,
        message: 'Name must be 2-50 characters, alphanumeric with spaces, hyphens, and underscores only'
      },
      slug: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-z0-9\-_]+$/,
        message: 'Slug must be lowercase, alphanumeric with hyphens and underscores only'
      },
      description: {
        maxLength: 500,
        message: 'Description must be less than 500 characters'
      },
      field_schema: {
        json: true,
        message: 'Field schema must be valid JSON'
      },
      validation_rules: {
        json: true,
        message: 'Validation rules must be valid JSON'
      },
      default_values: {
        json: true,
        message: 'Default values must be valid JSON'
      }
    };

    const rule = validationRules[name];
    if (!rule) return '';

    // Required validation
    if (rule.required && (!value || value.trim() === '')) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }

    // Skip other validations if field is empty and not required
    if (!value || value.trim() === '') return '';

    // Length validations
    if (rule.minLength && value.length < rule.minLength) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least ${rule.minLength} characters`;
    }
    if (rule.maxLength && value.length > rule.maxLength) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} must be less than ${rule.maxLength} characters`;
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message;
    }

    // JSON validation
    if (rule.json && value.trim()) {
      try {
        JSON.parse(value);
      } catch {
        return rule.message;
      }
    }

    return '';
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ open: true, message, type });
    setTimeout(() => setNotification({ open: false, message: '', type: 'success' }), 4000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/content-types`, { headers, withCredentials: true });
      setData(res.data?.data?.values || []);
    } catch (error) {
      showNotification('Failed to fetch data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDialogOpen = (item = null) => {
    setFormData(item ? { 
      ...item,
      field_schema: typeof item.field_schema === 'object' ? JSON.stringify(item.field_schema, null, 2) : item.field_schema || '',
      validation_rules: typeof item.validation_rules === 'object' ? JSON.stringify(item.validation_rules, null, 2) : item.validation_rules || '',
      default_values: typeof item.default_values === 'object' ? JSON.stringify(item.default_values, null, 2) : item.default_values || ''
    } : {
      id: null, name: '', slug: '', description: '',
      supports_versioning: false, supports_translation: false, is_active: true, debug: false,
      field_schema: '', validation_rules: '', default_values: ''
    });
    setErrors({});
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setErrors({});
  };

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    // Real-time validation
    if (errors[name]) {
      const error = validateField(name, newValue);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showNotification('Please fix the validation errors', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const url = formData.id
        ? `${baseURL}/content-type/update`
        : `${baseURL}/content-type/store`;

      await axios.post(url, formData, { headers, withCredentials: true });
      setOpenDialog(false);
      fetchData();
      showNotification(
        formData.id ? 'Template updated successfully' : 'Template created successfully',
        'success'
      );
    } catch (error) {
      showNotification('Failed to save template', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await axios.post(`${baseURL}/content-type/delete`, { id: deleteId }, { headers, withCredentials: true });
      setOpenDelete(false);
      fetchData();
      showNotification('Template deleted successfully', 'success');
    } catch (error) {
      showNotification('Failed to delete template', 'error');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleView = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/content-type/show?id=${id}`, { headers, withCredentials: true });
      setViewData(res.data?.data);
      setOpenView(true);
    } catch (error) {
      showNotification('Failed to fetch template details', 'error');
    } finally {
      setLoading(false);
    }
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
      showNotification(`Template ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      showNotification('Failed to update status', 'error');
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
      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {value}
      </Typography>
    </Box>
  );

  const renderFormField = (name, label, type = 'text', props = {}) => (
    <TextField
      fullWidth
      name={name}
      label={label}
      type={type}
      value={formData[name] || ''}
      onChange={handleInputChange}
      error={!!errors[name]}
      helperText={errors[name]}
      variant="outlined"
      InputProps={{
        startAdornment: props.multiline ? (
          <InputAdornment position="start">
            <Code sx={{ color: 'text.secondary' }} />
          </InputAdornment>
        ) : name === 'name' ? (
          <InputAdornment position="start">
            <Label sx={{ color: 'text.secondary' }} />
          </InputAdornment>
        ) : name === 'description' ? (
          <InputAdornment position="start">
            <Description sx={{ color: 'text.secondary' }} />
          </InputAdornment>
        ) : undefined,
        sx: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
          },
        },
      }}
      {...props}
    />
  );

  return (
    <Box sx={{ p: 3, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Notification */}
      {notification.open && (
        <Fade in={notification.open}>
          <Alert
            severity={notification.type}
            sx={{
              position: 'fixed',
              top: 16,
              right: 16,
              zIndex: 9999,
              minWidth: 300,
              boxShadow: 3,
            }}
          >
            {notification.message}
          </Alert>
        </Fade>
      )}

      {/* Header */}
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Template Management
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                Manage your content type templates with ease
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={() => handleDialogOpen()}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1,
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 3,
                },
              }}
            >
              Add Template
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Main Table */}
      <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f7fa' }}>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Slug</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                      No templates found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.id} hover sx={{ '&:hover': { backgroundColor: '#f8f9fa' } }}>
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {row.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Chip
                          label={row.slug}
                          size="small"
                          variant="outlined"
                          sx={{ fontFamily: 'monospace' }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 2, maxWidth: 200 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {row.description || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <RadioGroup
                          row
                          value={row.is_active ? 'true' : 'false'}
                          onChange={(e) => handleStatusChange(row, e.target.value === 'true')}
                        >
                          <FormControlLabel
                            value="true"
                            control={<Radio size="small" color="success" />}
                            label={
                              <Typography variant="body2" sx={{ color: 'success.main' }}>
                                Active
                              </Typography>
                            }
                            sx={{ mr: 1 }}
                          />
                          <FormControlLabel
                            value="false"
                            control={<Radio size="small" color="error" />}
                            label={
                              <Typography variant="body2" sx={{ color: 'error.main' }}>
                                Inactive
                              </Typography>
                            }
                          />
                        </RadioGroup>
                      </TableCell>
                      <TableCell sx={{ py: 2 }} align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleView(row.id)}
                              sx={{ color: 'primary.main' }}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Template">
                            <IconButton
                              size="small"
                              onClick={() => handleDialogOpen(row)}
                              sx={{ color: 'success.main' }}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Template">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setDeleteId(row.id);
                                setOpenDelete(true);
                              }}
                              sx={{ color: 'error.main' }}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={data.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[rowsPerPage]}
          sx={{ borderTop: 1, borderColor: 'divider' }}
        />
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: 4,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: '1.5rem', pb: 1 }}>
          {formData?.id ? 'Edit Template' : 'Create New Template'}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              {renderFormField('name', 'Template Name')}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderFormField('slug', 'Slug')}
            </Grid>
            <Grid item xs={12}>
              {renderFormField('description', 'Description', 'text', { multiline: true, rows: 3 })}
            </Grid>
            <Grid item xs={12}>
              {renderFormField('field_schema', 'Field Schema (JSON)', 'text', { 
                multiline: true, 
                rows: 4,
                placeholder: '{"fields": [{"name": "title", "type": "text"}]}' 
              })}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderFormField('validation_rules', 'Validation Rules (JSON)', 'text', { 
                multiline: true, 
                rows: 3,
                placeholder: '{"required": ["title"]}'
              })}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderFormField('default_values', 'Default Values (JSON)', 'text', { 
                multiline: true, 
                rows: 3,
                placeholder: '{"title": "Default Title"}'
              })}
            </Grid>
            
            {/* Switches */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Configuration Options
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.supports_versioning || false}
                        onChange={handleInputChange}
                        name="supports_versioning"
                        color="primary"
                      />
                    }
                    label="Supports Versioning"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.supports_translation || false}
                        onChange={handleInputChange}
                        name="supports_translation"
                        color="primary"
                      />
                    }
                    label="Supports Translation"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.is_active || false}
                        onChange={handleInputChange}
                        name="is_active"
                        color="success"
                      />
                    }
                    label="Is Active"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.debug || false}
                        onChange={(e) => handleInputChange({
                          target: { name: 'debug', value: e.target.checked }
                        })}
                        color="warning"
                      />
                    }
                    label="Debug Mode"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleDialogClose}
            variant="outlined"
            startIcon={<Cancel />}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            startIcon={submitting ? <CircularProgress size={16} /> : <Save />}
            disabled={submitting}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, ml: 1 }}
          >
            {submitting ? 'Saving...' : 'Save Template'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        maxWidth="md"
        fullWidth
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: 4,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: '1.5rem', pb: 1 }}>
          Template Details
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          {viewData ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Field label="Name" value={viewData.name} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field label="Slug" value={viewData.slug} />
              </Grid>
              <Grid item xs={12}>
                <Field label="Description" value={viewData.description || '—'} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  label="Supports Versioning"
                  value={
                    <Chip
                      label={viewData.supports_versioning ? 'Yes' : 'No'}
                      color={viewData.supports_versioning ? 'success' : 'default'}
                      size="small"
                      icon={viewData.supports_versioning ? <CheckCircle /> : <ErrorOutline />}
                    />
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  label="Supports Translation"
                  value={
                    <Chip
                      label={viewData.supports_translation ? 'Yes' : 'No'}
                      color={viewData.supports_translation ? 'success' : 'default'}
                      size="small"
                      icon={viewData.supports_translation ? <CheckCircle /> : <ErrorOutline />}
                    />
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  label="Field Schema"
                  value={
                    <Box
                      component="pre"
                      sx={{
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #e9ecef',
                        borderRadius: 2,
                        p: 2,
                        fontSize: 13,
                        fontFamily: 'monospace',
                        overflowX: 'auto',
                        maxHeight: 200,
                      }}
                    >
                      {JSON.stringify(viewData.field_schema?.fields || viewData.field_schema, null, 2)}
                    </Box>
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  label="Validation Rules"
                  value={
                    <Box
                      component="pre"
                      sx={{
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #e9ecef',
                        borderRadius: 2,
                        p: 2,
                        fontSize: 13,
                        fontFamily: 'monospace',
                        overflowX: 'auto',
                        maxHeight: 150,
                      }}
                    >
                      {JSON.stringify(viewData.validation_rules, null, 2)}
                    </Box>
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  label="Default Values"
                  value={
                    <Box
                      component="pre"
                      sx={{
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #e9ecef',
                        borderRadius: 2,
                        p: 2,
                        fontSize: 13,
                        fontFamily: 'monospace',
                        overflowX: 'auto',
                        maxHeight: 150,
                      }}
                    >
                      {JSON.stringify(viewData.default_values, null, 2)}
                    </Box>
                  }
                />
              </Grid>
            </Grid>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 3 }}>
          <Button
            variant="outlined"
            onClick={() => setOpenView(false)}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: 4,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
          <Warning sx={{ color: 'error.main', mr: 1 }} />
          Confirm Delete
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body1">
            Are you sure you want to delete this template? This action cannot be undone.
          </Typography>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpenDelete(false)}
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            startIcon={submitting ? <CircularProgress size={16} /> : <Delete />}
            disabled={submitting}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, ml: 1 }}
          >
            {submitting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TemplateContentType;