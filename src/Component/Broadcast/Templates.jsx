import React, { useEffect, useState, useCallback } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Tooltip, Typography, TablePagination, Radio, RadioGroup,
  FormControlLabel, Grid, Chip, Box, Divider, Card, CardHeader, CardContent, 
  List, ListItem, ListItemText, ListItemSecondaryAction, Alert, Snackbar,
  CircularProgress, FormControl, InputLabel, Select, MenuItem, FormHelperText,
  Skeleton, Fade, Slide
} from '@mui/material';
import { Add, Edit, Delete, Visibility, CheckCircle, Warning, Language } from '@mui/icons-material';
import axios from 'axios';
import baseURL from '../../Url';

const Templates = () => {
  // State Management
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: null, name: '', slug: '', description: '', status: 'active',
    tags: '', metadata: '', category_id: '', content_type_id: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [page, setPage] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const rowsPerPage = 10;

  // Language Management State
  const [languages, setLanguages] = useState([]);
  const [languageLoading, setLanguageLoading] = useState(false);
  const [openLangDialog, setOpenLangDialog] = useState(false);
  const [showAddLang, setShowAddLang] = useState(false);
  const [newLanguage, setNewLanguage] = useState({
    name: '',
    code: '',
    locale: '',
    direction: 'ltr',
    is_default: false,
    is_active: true,
    sort_order: 1,
  });
  const [langErrors, setLangErrors] = useState({});

  // Notification State
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Utility Functions
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


  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  // Validation Functions
  const validateTemplateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Template name is required';
    } else if (formData.name.length < 3) {
      errors.name = 'Template name must be at least 3 characters';
    } else if (formData.name.length > 100) {
      errors.name = 'Template name cannot exceed 100 characters';
    }

    if (!formData.slug.trim()) {
      errors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-_]+$/.test(formData.slug)) {
      errors.slug = 'Slug can only contain lowercase letters, numbers, hyphens, and underscores';
    } else if (formData.slug.length < 3) {
      errors.slug = 'Slug must be at least 3 characters';
    }

    if (!formData.category_id) {
      errors.category_id = 'Category is required';
    } else if (isNaN(formData.category_id) || formData.category_id <= 0) {
      errors.category_id = 'Please select a valid category';
    }

    if (!formData.content_type_id) {
      errors.content_type_id = 'Content type is required';
    } else if (isNaN(formData.content_type_id) || formData.content_type_id <= 0) {
      errors.content_type_id = 'Please select a valid content type';
    }

    if (formData.tags && formData.tags.length > 500) {
      errors.tags = 'Tags cannot exceed 500 characters';
    }

    if (formData.metadata) {
      try {
        JSON.parse(formData.metadata);
      } catch (e) {
        errors.metadata = 'Invalid JSON format';
      }
    }

    return errors;
  };

  const validateLanguageForm = () => {
    const errors = {};
    
    if (!newLanguage.name.trim()) {
      errors.name = 'Language name is required';
    } else if (newLanguage.name.length < 2) {
      errors.name = 'Language name must be at least 2 characters';
    }

    if (!newLanguage.code.trim()) {
      errors.code = 'Language code is required';
    } else if (!/^[a-z]{2}$/i.test(newLanguage.code)) {
      errors.code = 'Language code must be exactly 2 letters';
    }

    if (!newLanguage.locale.trim()) {
      errors.locale = 'Locale is required';
    } else if (!/^[a-z]{2}[-_][A-Z]{2}$/i.test(newLanguage.locale)) {
      errors.locale = 'Locale format should be like: en-US, fr-FR, etc.';
    }

    if (!newLanguage.sort_order || newLanguage.sort_order < 1) {
      errors.sort_order = 'Sort order must be at least 1';
    }

    return errors;
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseURL}/templates`, { headers, withCredentials: true });
      setData(res.data?.data?.values || []);
    } catch (error) {
      showNotification('Failed to fetch templates', 'error');
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLanguages = useCallback(async () => {
    try {
      setLanguageLoading(true);
      const res = await axios.get(`${baseURL}/languages`, { headers, withCredentials: true });
      setLanguages(res.data?.data?.values || []);
    } catch (error) {
      showNotification('Failed to fetch languages', 'error');
      console.error('Error fetching languages:', error);
    } finally {
      setLanguageLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchLanguages();
  }, [fetchData, fetchLanguages]);

  // Dialog Handlers
  const handleDialogOpen = (item = null) => {
    if (item) {
      setFormData({
        ...item,
        tags: item.tags?.join(', ') || '',
        metadata: JSON.stringify(item.metadata, null, 2)
      });
    } else {
      setFormData({ 
        id: null, name: '', slug: '', description: '', status: 'active', 
        tags: '', metadata: '', category_id: '', content_type_id: '' 
      });
    }
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      
      // Auto-generate slug when name changes
      if (name === 'name' && !prev.id) {
        newData.slug = generateSlug(value);
      }
      
      return newData;
    });

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async () => {
    const errors = validateTemplateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        category_id: parseInt(formData.category_id),
        content_type_id: parseInt(formData.content_type_id),
        status: formData.status,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        metadata: formData.metadata ? JSON.parse(formData.metadata) : null
      };

      const url = formData.id ? `${baseURL}/template/update` : `${baseURL}/template/store`;
      await axios.post(url, payload, { headers, withCredentials: true });
      
      setOpenDialog(false);
      fetchData();
      showNotification(
        formData.id ? 'Template updated successfully' : 'Template created successfully'
      );
    } catch (error) {
      showNotification('Failed to save template', 'error');
      console.error('Error saving template:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleView = async (id) => {
    try {
      const res = await axios.get(`${baseURL}/template/show?id=${id}`, { headers, withCredentials: true });
      setViewData(res.data?.data);
      setOpenView(true);
    } catch (error) {
      showNotification('Failed to fetch template details', 'error');
      console.error('Error fetching template details:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.post(`${baseURL}/template/delete`, { id: deleteId }, { headers, withCredentials: true });
      setOpenDelete(false);
      fetchData();
      showNotification('Template deleted successfully');
    } catch (error) {
      showNotification('Failed to delete template', 'error');
      console.error('Error deleting template:', error);
    }
  };

  // Language Handlers
  const handleLangInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewLanguage((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (langErrors[name]) {
      setLangErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddLanguage = async () => {
    const errors = validateLanguageForm();
    
    if (Object.keys(errors).length > 0) {
      setLangErrors(errors);
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(`${baseURL}/language/store`, newLanguage, { headers, withCredentials: true });
      setOpenLangDialog(false);
      setShowAddLang(false);
      fetchLanguages();
      showNotification('Language added successfully');
      setNewLanguage({
        name: '',
        code: '',
        locale: '',
        direction: 'ltr',
        is_default: false,
        is_active: true,
        sort_order: 1,
      });
      setLangErrors({});
    } catch (error) {
      showNotification('Failed to add language', 'error');
      console.error('Error adding language:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLanguage = async (id) => {
    try {
      await axios.post(`${baseURL}/language/delete`, { id }, { headers, withCredentials: true });
      fetchLanguages();
      showNotification('Language deleted successfully');
    } catch (error) {
      showNotification('Failed to delete language', 'error');
      console.error('Error deleting language:', error);
    }
  };

  const setAsDefaultLanguage = async (langId) => {
    try {
      await axios.post(`${baseURL}/language/set-default`, { langId }, { headers, withCredentials: true });
      fetchLanguages();
      showNotification('Default language updated successfully');
    } catch (err) {
      showNotification('Failed to set default language', 'error');
      console.error("Failed to set default language", err);
    }
  };

  // Skeleton Loading Component
  const TableSkeleton = () => (
    <TableContainer component={Paper} elevation={0}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Slug</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Content Type</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
              <TableCell><Skeleton width="80%" /></TableCell>
              <TableCell><Skeleton width="60%" /></TableCell>
              <TableCell><Skeleton width="40%" /></TableCell>
              <TableCell><Skeleton width="50%" /></TableCell>
              <TableCell><Skeleton width="30%" /></TableCell>
              <TableCell><Skeleton width="60%" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ display: 'grid', gap: 3, p: 2 }}>
      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={hideNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={hideNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
          elevation={6}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Language Management */}
      <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <CardHeader
          avatar={<Language color="primary" />}
          title={
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              Languages
            </Typography>
          }
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                startIcon={<Visibility />} 
                onClick={() => setOpenLangDialog(true)}
                variant="outlined"
                sx={{ textTransform: 'none' }}
              >
                View All
              </Button>
              <Button 
                startIcon={<Add />} 
                onClick={() => setShowAddLang(true)} 
                variant="contained"
                sx={{ textTransform: 'none' }}
              >
                Add Language
              </Button>
            </Box>
          }
        />
      </Card>

      {/* Language List Dialog */}
      <Dialog
        open={openLangDialog}
        onClose={() => setOpenLangDialog(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }}
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' }}
      >
        <DialogTitle sx={{
          pb: 2,
          fontSize: '1.3rem',
          fontWeight: 600,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Language color="primary" />
          Language Management
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          {languageLoading ? (
            <Box sx={{ p: 3 }}>
              {[...Array(3)].map((_, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Skeleton height={60} />
                </Box>
              ))}
            </Box>
          ) : languages.length === 0 ? (
            <Box textAlign="center" py={6}>
              <Language sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No languages found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add your first language to get started
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {languages.map((lang, index) => (
                <Fade in key={lang.id} timeout={300 * (index + 1)}>
                  <ListItem
                    sx={{
                      py: 2,
                      px: 3,
                      borderBottom: index < languages.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider',
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {lang.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ({lang.code})
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                          <Chip
                            label={lang.direction.toUpperCase()}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              borderColor: 'info.main',
                              color: 'info.main'
                            }}
                          />
                          {lang.is_default && (
                            <Chip
                              label="Default"
                              size="small"
                              sx={{
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                backgroundColor: 'success.main',
                                color: 'white'
                              }}
                            />
                          )}
                          <Chip
                            label={lang.is_active ? "Active" : "Inactive"}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              borderColor: lang.is_active ? 'success.main' : 'warning.main',
                              color: lang.is_active ? 'success.main' : 'warning.main'
                            }}
                          />
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {!lang.is_default && (
                        <Tooltip title="Set as Default" arrow>
                          <IconButton
                            onClick={() => setAsDefaultLanguage(lang.id)}
                            size="small"
                            sx={{
                              color: 'primary.main',
                              '&:hover': {
                                backgroundColor: 'primary.lighter',
                              }
                            }}
                          >
                            <CheckCircle />
                          </IconButton>
                        </Tooltip>
                      )}

                      <Tooltip title="Delete" arrow>
                        <IconButton
                          onClick={() => handleDeleteLanguage(lang.id)}
                          size="small"
                          sx={{
                            color: 'error.main',
                            '&:hover': {
                              backgroundColor: 'error.lighter'
                            }
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                </Fade>
              ))}
            </List>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button
            onClick={() => setOpenLangDialog(false)}
            variant="outlined"
            sx={{ textTransform: 'none', fontWeight: 500 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Language Dialog */}
      <Dialog 
        open={showAddLang} 
        onClose={() => setShowAddLang(false)} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }}
      >
        <DialogTitle sx={{ pb: 2, fontSize: '1.2rem', fontWeight: 600 }}>
          Add New Language
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Language Name" 
                name="name" 
                value={newLanguage.name} 
                onChange={handleLangInputChange}
                error={!!langErrors.name}
                helperText={langErrors.name}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Language Code" 
                name="code" 
                value={newLanguage.code} 
                onChange={handleLangInputChange}
                error={!!langErrors.code}
                helperText={langErrors.code || "e.g., en, fr, es"}
                variant="outlined"
                inputProps={{ maxLength: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Locale" 
                name="locale" 
                value={newLanguage.locale} 
                onChange={handleLangInputChange}
                error={!!langErrors.locale}
                helperText={langErrors.locale || "e.g., en-US, fr-FR"}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Sort Order" 
                name="sort_order" 
                type="number" 
                value={newLanguage.sort_order} 
                onChange={handleLangInputChange}
                error={!!langErrors.sort_order}
                helperText={langErrors.sort_order}
                variant="outlined"
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Text Direction
              </Typography>
              <RadioGroup 
                row 
                name="direction" 
                value={newLanguage.direction} 
                onChange={handleLangInputChange}
              >
                <FormControlLabel value="ltr" control={<Radio />} label="Left to Right (LTR)" />
                <FormControlLabel value="rtl" control={<Radio />} label="Right to Left (RTL)" />
              </RadioGroup>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={() => setShowAddLang(false)}
            variant="outlined"
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleAddLanguage}
            disabled={submitting}
            sx={{ textTransform: 'none' }}
          >
            {submitting ? <CircularProgress size={20} /> : 'Add Language'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Templates Management */}
      <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <CardHeader
          title={
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              Templates
            </Typography>
          }
          action={
            <Button 
              startIcon={<Add />} 
              variant="contained" 
              onClick={() => handleDialogOpen()}
              sx={{ textTransform: 'none' }}
            >
              Add Template
            </Button>
          }
        />
        <Divider />
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <TableSkeleton />
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Slug</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Content Type</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {row.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {row.slug}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row.category?.name || 'N/A'}
                          size="small"
                          sx={{ 
                            backgroundColor: row.category?.color || '#e0e0e0', 
                            color: '#fff',
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {row.content_type?.name || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={row.status} 
                          color={row.status === 'active' ? 'success' : 'default'} 
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="View Details">
                            <IconButton 
                              onClick={() => handleView(row.id)}
                              size="small"
                              sx={{ color: 'info.main' }}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton 
                              onClick={() => handleDialogOpen(row)}
                              size="small"
                              sx={{ color: 'primary.main' }}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton 
                              onClick={() => { setDeleteId(row.id); setOpenDelete(true); }}
                              size="small"
                              sx={{ color: 'error.main' }}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <TablePagination
            component="div"
            count={data.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[rowsPerPage]}
            sx={{ borderTop: '1px solid', borderColor: 'divider' }}
          />
        </CardContent>
      </Card>

      {/* Add/Edit Template Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleDialogClose} 
        fullWidth 
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }}
      >
        <DialogTitle sx={{ pb: 2, fontSize: '1.2rem', fontWeight: 600 }}>
          {formData.id ? 'Edit Template' : 'Add New Template'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Template Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                error={!!formErrors.slug}
                helperText={formErrors.slug || "Auto-generated from name"}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category ID"
                name="category_id"
                type="number"
                value={formData.category_id}
                onChange={handleInputChange}
                error={!!formErrors.category_id}
                helperText={formErrors.category_id}
                variant="outlined"
                required
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Content Type ID"
                name="content_type_id"
                type="number"
                value={formData.content_type_id}
                onChange={handleInputChange}
                error={!!formErrors.content_type_id}
                helperText={formErrors.content_type_id}
                variant="outlined"
                required
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                variant="outlined"
                multiline
                rows={2}
                placeholder="Enter template description..."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  label="Status"
                >
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="review">Review</MenuItem>
                  <MenuItem value="published">Published</MenuItem>
                  <MenuItem value="archieved">Archieved</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                error={!!formErrors.tags}
                helperText={formErrors.tags || "Comma separated tags"}
                variant="outlined"
                placeholder="tag1, tag2, tag3"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Metadata (JSON)"
                name="metadata"
                value={formData.metadata}
                onChange={handleInputChange}
                error={!!formErrors.metadata}
                helperText={formErrors.metadata || "Optional JSON metadata"}
                variant="outlined"
                multiline
                rows={4}
                placeholder='{"key": "value"}'
                sx={{
                  '& .MuiInputBase-input': {
                    fontFamily: 'monospace',
                    fontSize: '0.9rem'
                  }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={handleDialogClose}
            variant="outlined"
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={submitting}
            sx={{ textTransform: 'none' }}
          >
            {submitting ? <CircularProgress size={20} /> : (formData.id ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Template Dialog */}
      <Dialog 
        open={openView} 
        onClose={() => setOpenView(false)} 
        fullWidth 
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 2, 
          fontSize: '1.2rem', 
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Visibility color="primary" />
          Template Details
        </DialogTitle>

        <DialogContent dividers>
          {viewData ? (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                    Name
                  </Typography>
                  <Typography variant="h6" fontWeight={600} sx={{ mt: 0.5 }}>
                    {viewData.name}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                    Slug
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5, fontFamily: 'monospace', backgroundColor: 'grey.100', p: 0.5, borderRadius: 1 }}>
                    {viewData.slug}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                    Status
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label={viewData.status}
                      color={viewData.status === 'active' ? 'success' : viewData.status === 'draft' ? 'warning' : 'default'}
                      sx={{ fontWeight: 500 }}
                    />
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                    Category
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {viewData.category?.name || 'N/A'}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                    Content Type
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {viewData.content_type?.name || 'N/A'}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                    Created
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {viewData.created_at ? new Date(viewData.created_at).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Box>
              </Grid>

              {viewData.description && (
                <Grid item xs={12}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                      Description
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {viewData.description}
                    </Typography>
                  </Box>
                </Grid>
              )}

              <Grid item xs={12}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                    Tags
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {viewData.tags?.length ? (
                      <Box display="flex" gap={1} flexWrap="wrap">
                        {viewData.tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor: 'primary.main',
                              color: 'primary.main',
                              fontWeight: 500
                            }}
                          />
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No tags
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                    Metadata
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{
                      mt: 1,
                      p: 2,
                      backgroundColor: "#f8f9fa",
                      fontSize: '0.875rem',
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap',
                      maxHeight: 200,
                      overflowY: 'auto',
                      borderRadius: 2
                    }}
                  >
                    {viewData.metadata ? JSON.stringify(viewData.metadata, null, 2) : 'No metadata'}
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          ) : (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={() => setOpenView(false)} 
            variant="outlined"
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
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
          }
        }}
      >
        <DialogTitle sx={{
          pb: 2,
          fontSize: '1.1rem',
          fontWeight: 600,
          color: 'error.main',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Warning color="error" />
          Confirm Delete
        </DialogTitle>

        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete this template?
          </Typography>
          <Alert severity="warning" sx={{ borderRadius: 2 }}>
            This action cannot be undone. All associated data will be permanently removed.
          </Alert>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button
            onClick={() => setOpenDelete(false)}
            variant="outlined"
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              borderColor: 'grey.400',
              color: 'grey.600',
              '&:hover': {
                borderColor: 'grey.500',
                backgroundColor: 'grey.50'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'error.dark'
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Templates;