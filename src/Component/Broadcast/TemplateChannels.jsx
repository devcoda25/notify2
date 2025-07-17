import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Tooltip, Typography, TablePagination, Radio, RadioGroup, 
  FormControlLabel, Switch, Grid, Box, Chip, Divider, Alert, Snackbar,
  FormControl, FormLabel, FormHelperText, InputLabel, Select, MenuItem,
  CircularProgress, Backdrop, Card, CardContent, useTheme, alpha
} from '@mui/material';
import { Add, Edit, Delete, Visibility, Save, Cancel, Search, FilterList } from '@mui/icons-material';
import axios from 'axios';
import { addChannel, config, deleteChannel, fetchChannels, showChannel, updateChannel } from '../../Url';

const TemplateChannels = ({fetchChannelData, data}) => {
  const theme = useTheme();
  
  // State management
  // const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    slug: '',
    type: '',
    description: '',
    supported_formats: [],
    priority: 1,
    debug: 0,
    is_active: true
  });
  
  // Validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Notification
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const channelTypes = ['email', 'sms', 'push', 'webhook', 'api', 'file'];
  const supportedFormats = ['json', 'xml', 'html', 'text', 'csv', 'pdf'];



  const validationRules = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-Z0-9\s\-_]+$/
    },
    slug: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-z0-9\-_]+$/
    },
    type: {
      required: true,
      enum: channelTypes
    },
    description: {
      maxLength: 500
    },
    priority: {
      required: true,
      min: 1,
      max: 100
    },
    debug: {
      min: 0,
      max: 1
    },
    supported_formats: {
      required: true,
      minItems: 1
    }
  };

  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return '';

    if (rules.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }

    if (rules.minLength && value.length < rules.minLength) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least ${rules.minLength} characters`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} must not exceed ${rules.maxLength} characters`;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      if (name === 'name') {
        return 'Name can only contain letters, numbers, spaces, hyphens, and underscores';
      }
      if (name === 'slug') {
        return 'Slug can only contain lowercase letters, numbers, hyphens, and underscores';
      }
    }

    if (rules.enum && !rules.enum.includes(value)) {
      return `Please select a valid ${name}`;
    }

    if (rules.min && value < rules.min) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least ${rules.min}`;
    }

    if (rules.max && value > rules.max) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} must not exceed ${rules.max}`;
    }

    if (rules.minItems && Array.isArray(value) && value.length < rules.minItems) {
      return `Please select at least ${rules.minItems} format(s)`;
    }

    return '';
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(validationRules).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s\-_]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  useEffect(() => {
    // fetchData();
    fetchChannelData();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredData(data);
    } else {
      const filtered = data.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [data, searchQuery]);

  // const fetchData = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await axios.get(fetchChannels(),config);
  //     setData(res.data?.data?.values || []);
  //     // showNotification('Data loaded successfully', 'success');
  //   } catch (error) {
  //     // showNotification('Failed to load data', 'error');
  //     console.log('fetch error','Failed to load data')
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleDialogOpen = (item = null) => {
    if (item) {
      setFormData({
        ...item,
        supported_formats: Array.isArray(item.supported_formats) ? item.supported_formats : []
      });
    } else {
      setFormData({
        id: null,
        name: '',
        slug: '',
        type: '',
        description: '',
        supported_formats: [],
        priority: 1,
        debug: 0,
        is_active: true
      });
    }
    setErrors({});
    setTouched({});
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setErrors({});
    setTouched({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    // Auto-generate slug when name changes
    if (name === 'name' && !formData.id) {
      setFormData(prev => ({
        ...prev,
        [name]: newValue,
        slug: generateSlug(newValue)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: newValue }));
    }

    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }));

    // Validate field
    const error = validateField(name, newValue);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleMultiSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showNotification('Please correct the errors before submitting', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const url = formData.id ? updateChannel() : addChannel();
      
      await axios.post(url, formData, config);
      
      setOpenDialog(false);
      // await fetchData();
      await fetchChannelData();
      showNotification(
        formData.id ? 'Channel updated successfully' : 'Channel created successfully',
        'success'
      );
    } catch (error) {
      showNotification('Failed to save channel', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSubmitting(true);
      await axios.post(deleteChannel(), { id: deleteId }, config);
      setOpenDelete(false);
      // await fetchData();
      await fetchChannelData();
      showNotification('Channel deleted successfully', 'success');
    } catch (error) {
      showNotification('Failed to delete channel', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleView = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(`${showChannel()}?id=${id}`, config);
      setViewData(res.data?.data);
      setOpenView(true);
    } catch (error) {
      showNotification('Failed to load channel details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (row, isActive) => {
    try {
      await axios.post(updateChannel(), {
        ...row,
        is_active: isActive,
      }, config);
      
      // await fetchData();
      await fetchChannelData();
      showNotification('Status updated successfully', 'success');
    } catch (error) {
      showNotification('Failed to update status', 'error');
    }
  };

  const Field = ({ label, value, chip = false }) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
        {label}
      </Typography>
      {chip ? (
        <Box>{value}</Box>
      ) : (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {value || '—'}
        </Typography>
      )}
    </Box>
  );

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
          Template Channels
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your template channels with advanced validation and elegant interface
        </Typography>
      </Box>

      {/* Actions Bar */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />
            }}
            sx={{ minWidth: 250 }}
          />
          
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleDialogOpen()}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3
            }}
          >
            Add Channel
          </Button>
        </Box>
      </Card>

      {/* Data Table */}
    <Card elevation={2}>
  <TableContainer>
    <Table size="small" sx={{ '& th, & td': { py: 0.75, px: 1 }, minWidth: 650 }}>
      <TableHead>
        <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
          {['Name', 'Slug', 'Type', 'Description', 'Formats', 'Status', 'Actions'].map((head, idx) => (
            <TableCell key={idx} sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{head}</TableCell>
          ))}
        </TableRow>
      </TableHead>

      <TableBody >
        {loading ? (
          <TableRow>
            <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
              <CircularProgress size={24} />
            </TableCell>
          </TableRow>
        ) : paginatedData.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
              <Typography color="text.secondary" fontSize="0.75rem">No channels found</Typography>
            </TableCell>
          </TableRow>
        ) : (
          paginatedData.map((row) => (
            <TableRow key={row.id} hover sx={{ '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.02) } }}>
              <TableCell>
                <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 500 }}>{row.name}</Typography>
              </TableCell>

              <TableCell>
                <Chip label={row.slug} variant="outlined" size="small" sx={{ fontSize: '0.75rem', height: 20 }} />
              </TableCell>

              <TableCell>
                <Chip
                  label={row.type}
                  color="primary"
                  variant="outlined"
                  size="small"
                  sx={{ textTransform: 'capitalize', fontSize: '0.75rem', height: 20 }}
                />
              </TableCell>

              <TableCell sx={{ maxWidth: 160 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.75rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {row.description || '—'}
                </Typography>
              </TableCell>

              <TableCell>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.25 }}>
                  {Array.isArray(row.supported_formats) &&
                    row.supported_formats.slice(0, 2).map((format, idx) => (
                      <Chip
                        key={idx}
                        label={format.toUpperCase()}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.75rem', height: 20 }}
                      />
                    ))}
                  {Array.isArray(row.supported_formats) && row.supported_formats.length > 2 && (
                    <Chip
                      label={`+${row.supported_formats.length - 2}`}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.75rem', height: 20 }}
                    />
                  )}
                </Box>
              </TableCell>

              {/* <TableCell>
                <Chip
                  label={row.priority}
                  color={row.priority <= 3 ? 'success' : row.priority <= 7 ? 'warning' : 'error'}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem', height: 20 }}
                />
              </TableCell> */}

              <TableCell>
                <RadioGroup
                  row
                  value={row.is_active ? 'true' : 'false'}
                  onChange={(e) => handleStatusChange(row, e.target.value === 'true')}
                  sx={{
                    justifyContent: 'flex-start',
                    '& .MuiFormControlLabel-root': { marginRight: 0.5 },
                    '& .MuiFormControlLabel-label': { fontSize: '0.75rem' }
                  }}
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio size="small" color="success" />}
                    label="Active"
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio size="small" color="error" />}
                    label="Inactive"
                  />
                </RadioGroup>
              </TableCell>

              <TableCell align="center">
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 0.5 }}>
                  <Tooltip title="View Details">
                    <IconButton onClick={() => handleView(row.id)} size="small" sx={{ p: 0.5, color: 'info.main' }}>
                      <Visibility fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleDialogOpen(row)} size="small" sx={{ p: 0.5, color: 'primary.main' }}>
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
                      sx={{ p: 0.5, color: 'error.main' }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </TableContainer>

  <TablePagination
    component="div"
    count={filteredData.length}
    page={page}
    onPageChange={(e, newPage) => setPage(newPage)}
    rowsPerPage={rowsPerPage}
    onRowsPerPageChange={(e) => {
      setRowsPerPage(parseInt(e.target.value, 10));
      setPage(0);
    }}
    rowsPerPageOptions={[5, 10, 25, 50]}
    sx={{
      borderTop: 1,
      borderColor: 'divider',
      '& .MuiTablePagination-toolbar': { minHeight: 36 },
      '& .MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
        fontSize: '0.75rem'
      }
    }}
  />
</Card>


      {/* Add/Edit Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleDialogClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 600, 
          fontSize: '1.5rem',
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          {formData?.id ? 'Edit Channel' : 'Add New Channel'}
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Channel Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                required
                sx={{ mb: 2, mt:2 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                error={touched.slug && !!errors.slug}
                helperText={touched.slug && errors.slug}
                required
                sx={{ mb: 2, mt:2 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={touched.type && !!errors.type}>
                <InputLabel>Channel Type *</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  label="Channel Type *"
                >
                  {channelTypes.map(type => (
                    <MenuItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
                {touched.type && errors.type && (
                  <FormHelperText>{errors.type}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                error={touched.priority && !!errors.priority}
                helperText={touched.priority && errors.priority}
                required
                inputProps={{ min: 1, max: 100 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                error={touched.description && !!errors.description}
                helperText={touched.description && errors.description}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth error={touched.supported_formats && !!errors.supported_formats}>
                <InputLabel>Supported Formats *</InputLabel>
                <Select
                  multiple
                  name="supported_formats"
                  value={formData.supported_formats}
                  onChange={(e) => handleMultiSelectChange('supported_formats', e.target.value)}
                  label="Supported Formats *"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value.toUpperCase()} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {supportedFormats.map(format => (
                    <MenuItem key={format} value={format}>
                      {format.toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
                {touched.supported_formats && errors.supported_formats && (
                  <FormHelperText>{errors.supported_formats}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Debug Level"
                name="debug"
                value={formData.debug}
                onChange={handleInputChange}
                error={touched.debug && !!errors.debug}
                helperText={touched.debug && errors.debug}
                inputProps={{ min: 0, max: 1 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={(e) => handleInputChange({
                      target: { name: 'is_active', value: e.target.checked }
                    })}
                    color="primary"
                  />
                }
                label="Active Channel"
                sx={{ mt: 2 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
          <Button 
            onClick={handleDialogClose}
            startIcon={<Cancel />}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={16} /> : <Save />}
            sx={{ textTransform: 'none', px: 3 }}
          >
            {submitting ? 'Saving...' : 'Save Channel'}
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
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 600, 
          fontSize: '1.5rem',
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          Channel Details
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          {viewData ? (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Field label="Name" value={viewData.name} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field label="Slug" value={<Chip label={viewData.slug} variant="outlined" size="small" />} chip />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field label="Type" value={<Chip label={viewData.type} color="primary" variant="outlined" size="small" />} chip />
              </Grid>
              <Grid item xs={12}>
                <Field label="Description" value={viewData.description} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field label="Priority" value={<Chip label={viewData.priority} color="info" size="small" />} chip />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field 
                  label="Status" 
                  value={
                    <Chip
                      label={viewData.is_active ? 'Active' : 'Inactive'}
                      color={viewData.is_active ? 'success' : 'error'}
                      size="small"
                    />
                  } 
                  chip 
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  label="Supported Formats"
                  value={
                    viewData.supported_formats?.length ? (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {viewData.supported_formats.map((fmt, idx) => (
                          <Chip
                            key={idx}
                            label={fmt.toUpperCase()}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        ))}
                      </Box>
                    ) : '—'
                  }
                  chip
                />
              </Grid>
            </Grid>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
          <Button 
            variant="outlined" 
            onClick={() => setOpenView(false)}
            sx={{ textTransform: 'none' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={openDelete} 
        onClose={() => setOpenDelete(false)}
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, color: 'error.main' }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this channel? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setOpenDelete(false)}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleDelete}
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={16} /> : <Delete />}
            sx={{ textTransform: 'none' }}
          >
            {submitting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>


      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotification(prev => ({ ...prev, open: false }))}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TemplateChannels;