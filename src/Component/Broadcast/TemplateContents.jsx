import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Card, CardHeader, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Tooltip, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Box, Typography, Chip, Grid, Paper, Divider, Alert, Snackbar,
  FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel,
  Accordion, AccordionSummary, AccordionDetails, CircularProgress,
  TableContainer, TablePagination, InputAdornment, AppBar, Toolbar,
  Fade, Slide, Collapse, FormHelperText, Stack, Avatar
} from '@mui/material';
import {
  Add, Delete, Edit, Visibility, Search, Code, Language, Settings,
  ExpandMore, ContentCopy, Preview, Check, Error, Warning, Info,
  Email, Description, DataObject, Psychology, AutoFixHigh,
  Timeline, Palette, Security, BugReport
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import axios from 'axios';
import { addContent, config, deleteContent, fetchContents, updateContent } from '../../Url';

//  validation schema
const validationSchema = {
  template_id: {
    required: true,
    type: 'number',
    min: 1,
    message: 'Template ID is required and must be a positive number'
  },
  channel_id: {
    required: true,
    type: 'number',
    min: 1,
    message: 'Channel ID is required and must be a positive number'
  },
  language_id: {
    required: true,
    type: 'number',
    min: 1,
    message: 'Language ID is required and must be a positive number'
  },
  subject: {
    required: true,
    minLength: 5,
    maxLength: 200,
    message: 'Subject must be between 5 and 200 characters'
  },
  content: {
    required: true,
    minLength: 10,
    message: 'Content must be at least 10 characters long'
  },
  plain_content: {
    required: true,
    minLength: 10,
    message: 'Plain content must be at least 10 characters long'
  },
  variables: {
    pattern: /^[a-zA-Z_][a-zA-Z0-9_]*(\s*,\s*[a-zA-Z_][a-zA-Z0-9_]*)*$/,
    message: 'Variables must be valid identifiers separated by commas'
  },
  dynamic_content: {
    type: 'json',
    message: 'Dynamic content must be valid JSON'
  },
  conditional_blocks: {
    type: 'json',
    message: 'Conditional blocks must be valid JSON'
  }
};

// validation function
const validateField = (name, value, schema) => {
  const rules = schema[name];
  if (!rules) return null;

  if (rules.required && (!value || value.toString().trim() === '')) {
    return rules.message || `${name} is required`;
  }

  if (!value || value.toString().trim() === '') return null;

  if (rules.type === 'number') {
    const num = Number(value);
    if (isNaN(num)) return 'Must be a valid number';
    if (rules.min && num < rules.min) return `Must be at least ${rules.min}`;
    if (rules.max && num > rules.max) return `Must be at most ${rules.max}`;
  }

  if (rules.minLength && value.length < rules.minLength) {
    return `Must be at least ${rules.minLength} characters`;
  }
  if (rules.maxLength && value.length > rules.maxLength) {
    return `Must be at most ${rules.maxLength} characters`;
  }

  if (rules.pattern && !rules.pattern.test(value)) {
    return rules.message || 'Invalid format';
  }

  if (rules.type === 'json') {
    try {
      JSON.parse(value);
    } catch (e) {
      return 'Must be valid JSON';
    }
  }

  return null;
};

const FormField = ({ name, label, type = 'text', multiline = false, rows = 1, icon, form, formTouched, formErrors, handleFieldChange, ...props }) => {
  const hasError = formTouched[name] && formErrors[name];
  const isRequired = validationSchema[name]?.required;

  return (
    <TextField
      label={
        <Box display="flex" alignItems="center" gap={0.5}>
          {icon}
          {label}
          {isRequired && <Typography color="error.main">*</Typography>}
        </Box>
      }
      fullWidth
      margin="dense"
      type={type}
      multiline={multiline}
      rows={rows}
      value={form[name]}
      onChange={(e) => handleFieldChange(name, e.target.value)}
      error={hasError}
      helperText={hasError ? formErrors[name] : props.helperText}
      variant="outlined"
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: hasError ? 'error.main' : 'primary.main',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: 2,
          },
        },
        '& .MuiInputLabel-root': {
          fontWeight: 500,
        },
      }}
      {...props}
    />
  );
};

const TemplateContents = ({channelData, templateData}) => {
  const theme = useTheme();
  const [templateContents, setTemplateContents] = useState([]);
  const [filteredContents, setFilteredContents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [previewContent, setPreviewContent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [formTouched, setFormTouched] = useState({});
  const [form, setForm] = useState({
    template_id: '',
    channel_id: '',
    language_id: '',
    subject: '',
    content: '',
    plain_content: '',
    variables: '',
    dynamic_content: '{}',
    conditional_blocks: '{}',
    is_compiled: false
  });

  const formErrors = useMemo(() => {
    const errors = {};
    Object.keys(form).forEach(field => {
      const error = validateField(field, form[field], validationSchema);
      if (error) errors[field] = error;
    });
    return errors;
  }, [form]);

  const isFormValid = useMemo(() => {
    return Object.keys(formErrors).length === 0;
  }, [formErrors]);

  const handleFieldChange = useCallback((field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setFormTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(fetchContents(), config);
      setTemplateContents(res.data?.data?.values || []);
      setFilteredContents(res.data?.data?.values || []);
    } catch (error) {
      console.log('Error fetching data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
// console.log("channelData", channelData)
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = templateContents.filter(content =>
      (content.subject?.toLowerCase()?.includes(searchTerm.toLowerCase()) ?? false) ||
      (Array.isArray(content.variables) &&
        content.variables.some(variable => variable?.toLowerCase()?.includes(searchTerm.toLowerCase())))
    );
    setFilteredContents(filtered);
    setPage(0);
  }, [searchTerm, templateContents]);

  const handleOpen = (item = null) => {
    setEditingContent(item);
    if (item) {
      setForm({
        template_id: item.template_id || '',
        channel_id: item.channel_id || '',
        language_id: item.language_id || '',
        subject: item.subject || '',
        content: item.content || '',
        plain_content: item.plain_content || '',
        variables: (item.variables || []).join(', '),
        dynamic_content: JSON.stringify(item.dynamic_content || {}, null, 2),
        conditional_blocks: JSON.stringify(item.conditional_blocks || {}, null, 2),
        is_compiled: item.is_compiled || false
      });
    } else {
      setForm({
        template_id: '',
        channel_id: '',
        language_id: '',
        subject: '',
        content: '',
        plain_content: '',
        variables: '',
        dynamic_content: '{}',
        conditional_blocks: '{}',
        is_compiled: false
      });
    }
    setFormTouched({});
    setOpenDialog(true);
  };

  const handlePreview = (item) => {
    setPreviewContent(item);
    setOpenPreviewDialog(true);
  };

  const handleSave = async () => {
    const allTouched = Object.keys(form).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setFormTouched(allTouched);

    if (!isFormValid) {
      console.log('Please fix validation errors before saving', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        variables: form.variables.split(',').map(v => v.trim()).filter(v => v),
        dynamic_content: form.dynamic_content ? JSON.parse(form.dynamic_content) : {},
        conditional_blocks: form.conditional_blocks ? JSON.parse(form.conditional_blocks) : {}
      };

      if (editingContent) {
        console.log("payload", payload)
        await axios.post(updateContent(), { ...payload, id: editingContent.id }, config);
        showSnackbar('Template content updated successfully!', 'success');
      } else {
        await axios.post(addContent(), payload, config);
        showSnackbar('Template content created successfully!', 'success');
      }

      setOpenDialog(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving template content:', error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'Server error occurred';
        
        const errorMessages = {
          400: `Validation error: ${message}`,
          401: 'Unauthorized access',
          403: 'Permission denied',
          404: 'Template not found',
          409: 'Template already exists'
        };
        
        showSnackbar(errorMessages[status] || `Error: ${message}`, 'error');
      } else if (error.request) {
        showSnackbar('Network error. Please check your connection.', 'error');
      } else {
        showSnackbar('Error processing data. Please check your input.', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setForm({
      template_id: '',
      channel_id: '',
      language_id: '',
      subject: '',
      content: '',
      plain_content: '',
      variables: '',
      dynamic_content: '{}',
      conditional_blocks: '{}',
      is_compiled: false
    });
    setEditingContent(null);
    setFormTouched({});
  };

  const handleDeleteClick = (id) => {
    setDeleteItemId(id);
    setOpenDelete(true);
  };

  const handleDelete = async () => {
    if (!deleteItemId) return;
    
    setLoading(true);
    try {
      await axios.post(deleteContent(), { id: deleteItemId }, config);
      setOpenDelete(false);
      setDeleteItemId(null);
      showSnackbar('Template content deleted successfully!', 'success');
      fetchData();
    } catch (error) {
      showSnackbar('Error deleting template content', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedContents = filteredContents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);


  return (
    <Box sx={{ p: 3, bgcolor: 'grey.50', minHeight: '100vh' }}>
      <Paper elevation={0} sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }}>
        <AppBar 
          position="static" 
          color="default" 
          elevation={0}
          sx={{
            bgcolor: 'background.paper',
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Toolbar sx={{ py: 1 }}>
            <Box display="flex" alignItems="center" gap={2} flexGrow={1}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <Email />
              </Avatar>
              <Box>
                <Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Template Content Manager
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage and organize your email templates
                </Typography>
              </Box>
            </Box>
            <Button
              startIcon={<Add />}
              variant="contained"
              size="large"
              onClick={() => handleOpen()}
              sx={{ 
                borderRadius: 3,
                px: 3,
                py: 1.5,
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                }
              }}
            >
              Create Template
            </Button>
          </Toolbar>
        </AppBar>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <CardHeader
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.02),
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
              title={
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Template Contents
                  </Typography>
                  <Chip 
                    label={`${filteredContents.length} templates`} 
                    color="primary" 
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                </Box>
              }
              action={
                <TextField
                  placeholder="Search templates..."
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    width: 300,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: 'background.paper',
                    }
                  }}
                />
              }
            />
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ '& .MuiTableCell-head': { fontWeight: 600, bgcolor: 'grey.50' } }}>
                    <TableCell>Subject</TableCell>
                    <TableCell>Variables</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Updated</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                        <Stack alignItems="center" spacing={2}>
                          <CircularProgress size={40} />
                          <Typography color="text.secondary">Loading templates...</Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ) : paginatedContents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                        <Stack alignItems="center" spacing={2}>
                          <Email sx={{ fontSize: 48, color: 'text.disabled' }} />
                          <Typography color="text.secondary">No template contents found</Typography>
                          <Button 
                            variant="outlined" 
                            startIcon={<Add />}
                            onClick={() => handleOpen()}
                            sx={{ borderRadius: 2 }}
                          >
                            Create Your First Template
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedContents.map((row) => (
                      <TableRow 
                        key={row.id} 
                        hover
                        sx={{
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.04),
                          },
                        }}
                      >
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {row.subject}
                          </Typography>
                          {/* <Typography variant="caption" color="text.secondary">
                            ID: {row.id}
                          </Typography> */}
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={0.5} flexWrap="nowrap">
                            {row.variables.slice(0, 2).map((variable, index) => (
                              <Chip
                                key={index}
                                label={variable}
                                size="small"
                                variant="outlined"
                                color="secondary"
                                sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
                              />
                            ))}
                            {row.variables.length > 2 && (
                              <Chip
                                label={`+${row.variables.length - 2} more`}
                                size="small"
                                variant="outlined"
                                color="default"
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.is_compiled ? 'Compiled' : 'Draft'}
                            color={row.is_compiled ? 'success' : 'warning'}
                            size="small"
                            icon={row.is_compiled ? <Check /> : <Warning />}
                            sx={{ fontWeight: 500 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(row.updated_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box display="flex" gap={0.5} justifyContent="flex-start">
                            <Tooltip title="Preview Template">
                              <IconButton
                                color="info"
                                onClick={() => handlePreview(row)}
                                size="small"
                                sx={{ borderRadius: 1.5 }}
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit Template">
                              <IconButton
                                color="primary"
                                onClick={() => handleOpen(row)}
                                size="small"
                                sx={{ borderRadius: 1.5 }}
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Template">
                              <IconButton
                                color="error"
                                onClick={() => handleDeleteClick(row.id)}
                                size="small"
                                sx={{ borderRadius: 1.5 }}
                              >
                                <Delete />
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
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredContents.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                borderTop: `1px solid ${theme.palette.divider}`,
                '& .MuiTablePagination-toolbar': {
                  px: 3,
                },
              }}
            />
          </Card>
        </Grid>
      </Grid>

      {/* Enhanced Add/Edit Dialog */}
     <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        fullWidth 
        maxWidth="lg"
        TransitionComponent={Fade}
        PaperProps={{ 
          sx: { 
            borderRadius: 3,
            maxHeight: '90vh',
          } 
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ bgcolor: editingContent ? 'warning.main' : 'primary.main' }}>
              {editingContent ? <Edit /> : <Add />}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {editingContent ? 'Edit Template Content' : 'Create New Template'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {editingContent ? 'Update your template content' : 'Build a new email template'}
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>

        <DialogContent dividers sx={{ px: 3 }}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                Basic Information
              </Typography>
            </Grid>
            
            {/* <Grid item xs={12} md={4}>
              <FormField
                name="template_id"
                label="Template ID"
                type="number"
                icon={<Settings fontSize="small" />}
                helperText="Unique identifier for the template"
                form={form}
                formTouched={formTouched}
                formErrors={formErrors}
                handleFieldChange={handleFieldChange}
              />
            </Grid> */}

            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Template"
                name="template_id"
                value={form.template_id}
                onChange={(e) => handleFieldChange('template_id', e.target.value)}
                helperText="Select the template"
                error={formTouched.template_id && Boolean(formErrors.template_id)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Settings fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              >
                {templateData.map((template) => (
                  <MenuItem key={template.id} value={template.id}>
                    {template.name || `Template #${template.id}`}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            
            {/* <Grid item xs={12} md={4}>
              <FormField
                name="channel_id"
                label="Channel ID"
                type="number"
                icon={<Timeline fontSize="small" />}
                helperText="Communication channel identifier"
                form={form}
                formTouched={formTouched}
                formErrors={formErrors}
                handleFieldChange={handleFieldChange}
              />
            </Grid> */}


            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small" error={!!formErrors.channel_id}>
                <InputLabel id="channel-select-label">Channel</InputLabel>
                <Select
                  labelId="channel-select-label"
                  value={form.channel_id}
                  onChange={(e) => handleFieldChange('channel_id', e.target.value)}
                  label="Channel"
                  startAdornment={<Timeline fontSize="small" sx={{ mr: 1 }} />}
                >
                  {channelData.map((channel) => (
                    <MenuItem key={channel.id} value={channel.id}>
                      {channel.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {formErrors.channel_id || 'Communication channel identifier'}
                </FormHelperText>
              </FormControl>
            </Grid>

            
            <Grid item xs={12} md={4}>
              <FormField
                name="language_id"
                label="Language ID"
                type="number"
                icon={<Language fontSize="small" />}
                helperText="Language localization identifier"
                form={form}
                formTouched={formTouched}
                formErrors={formErrors}
                handleFieldChange={handleFieldChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormField
                name="subject"
                label="Subject Line"
                icon={<Email fontSize="small" />}
                helperText="Email subject with template variables (e.g., {{user_name}})"
                form={form}
                formTouched={formTouched}
                formErrors={formErrors}
                handleFieldChange={handleFieldChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormField
                name="variables"
                label="Template Variables"
                icon={<DataObject fontSize="small" />}
                helperText="Comma-separated variables (e.g., user_name, company_name, email)"
                form={form}
                formTouched={formTouched}
                formErrors={formErrors}
                handleFieldChange={handleFieldChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.is_compiled}
                    onChange={(e) => handleFieldChange('is_compiled', e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <AutoFixHigh fontSize="small" />
                    <Typography>Compiled Template</Typography>
                  </Box>
                }
                sx={{ mt: 1 }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Accordion defaultExpanded sx={{ borderRadius: 2, mb: 2 }}>
              <AccordionSummary 
                expandIcon={<ExpandMore />}
                sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  }
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Description color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Content Templates
                  </Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormField
                      name="content"
                      label="HTML Content"
                      multiline
                      rows={12}
                      icon={<Code fontSize="small" />}
                      helperText="Rich HTML content with styling and template variables"
                      form={form}
                      formTouched={formTouched}
                      formErrors={formErrors}
                      handleFieldChange={handleFieldChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormField
                      name="plain_content"
                      label="Plain Text Content"
                      multiline
                      rows={12}
                      icon={<Description fontSize="small" />}
                      helperText="Plain text version for email clients that don't support HTML"
                      form={form}
                      formTouched={formTouched}
                      formErrors={formErrors}
                      handleFieldChange={handleFieldChange}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ borderRadius: 2 }}>
              <AccordionSummary 
                expandIcon={<ExpandMore />}
                sx={{ 
                  bgcolor: alpha(theme.palette.secondary.main, 0.04),
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.secondary.main, 0.08),
                  }
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Psychology color="secondary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Advanced Configuration
                  </Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormField
                      name="dynamic_content"
                      label="Dynamic Content (JSON)"
                      multiline
                      rows={8}
                      icon={<DataObject fontSize="small" />}
                      helperText="JSON structure for personalized content blocks"
                      form={form}
                      formTouched={formTouched}
                      formErrors={formErrors}
                      handleFieldChange={handleFieldChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormField
                      name="conditional_blocks"
                      label="Conditional Blocks (JSON)"
                      multiline
                      rows={8}
                      icon={<Security fontSize="small" />}
                      helperText="JSON structure for conditional content rendering"
                      form={form}
                      formTouched={formTouched}
                      formErrors={formErrors}
                      handleFieldChange={handleFieldChange}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, bgcolor: 'grey.50' }}>
          <Button 
            onClick={() => setOpenDialog(false)} 
            size="large"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            size="large"
            disabled={saving || !isFormValid}
            startIcon={saving ? <CircularProgress size={20} /> : <Check />}
            sx={{ 
              borderRadius: 2,
              px: 3,
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
              },
              '&:disabled': {
                bgcolor: 'grey.300',
                color: 'grey.500',
              }
            }}
          >
            {saving ? 'Saving...' : editingContent ? 'Update Template' : 'Create Template'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Preview Dialog */}
      <Dialog 
        open={openPreviewDialog} 
        onClose={() => setOpenPreviewDialog(false)} 
        fullWidth 
        maxWidth="md"
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' }}
        PaperProps={{ 
          sx: { 
            borderRadius: 3,
            maxHeight: '80vh',
          } 
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ bgcolor: 'info.main' }}>
              <Preview />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Template Preview
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Live preview of your template content
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          {previewContent && (
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {previewContent.subject}
                </Typography>
                <Stack direction="row" spacing={1} mb={2}>
                  <Chip
                    label={previewContent.is_compiled ? 'Compiled' : 'Draft'}
                    color={previewContent.is_compiled ? 'success' : 'warning'}
                    size="small"
                    icon={previewContent.is_compiled ? <Check /> : <Warning />}
                  />
                  <Chip
                    label={`${previewContent.variables.length} variables`}
                    color="primary"
                    size="small"
                    variant="outlined"
                  />
                </Stack>
              </Box>
              
              <Divider />
              
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Template Variables:
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {previewContent.variables.map((variable, index) => (
                    <Chip
                      key={index}
                      label={`{{${variable}}}`}
                      size="small"
                      color="secondary"
                      variant="outlined"
                      sx={{ fontFamily: 'monospace' }}
                    />
                  ))}
                </Stack>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Plain Text Content:
                </Typography>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    bgcolor: 'grey.50',
                    borderRadius: 2,
                    maxHeight: 300,
                    overflow: 'auto'
                  }}
                >
                  <Typography 
                    variant="body2" 
                    component="pre" 
                    sx={{ 
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      lineHeight: 1.5
                    }}
                  >
                    {previewContent.plain_content}
                  </Typography>
                </Paper>
              </Box>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={() => setOpenPreviewDialog(false)}
            variant="outlined"
            size="large"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Close Preview
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Delete Confirmation Dialog */}
      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        maxWidth="xs"
        fullWidth
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }}
      >
        <DialogTitle sx={{
          pb: 2,
          textAlign: 'center',
        }}>
          <Stack alignItems="center" spacing={2}>
            <Avatar sx={{ bgcolor: 'error.main', width: 56, height: 56 }}>
              <Delete fontSize="large" />
            </Avatar>
            <Box textAlign="center">
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'error.main' }}>
                Delete Template
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This action cannot be undone
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ textAlign: 'center', pb: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete this template?
          </Typography>
          <Alert severity="warning" sx={{ borderRadius: 2 }}>
            All associated data will be permanently removed from the system.
          </Alert>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, gap: 2, justifyContent: 'center' }}>
          <Button
            onClick={() => setOpenDelete(false)}
            variant="outlined"
            size="large"
            sx={{
              borderRadius: 2,
              px: 3,
              fontWeight: 500,
              borderColor: 'grey.400',
              color: 'grey.600',
              '&:hover': {
                borderColor: 'grey.500',
                bgcolor: 'grey.50'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Delete />}
            sx={{
              borderRadius: 2,
              px: 3,
              fontWeight: 600,
              '&:hover': {
                bgcolor: 'error.dark'
              }
            }}
          >
            {loading ? 'Deleting...' : 'Delete Template'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'left' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ 
            width: '100%',
            borderRadius: 2,
            fontWeight: 500,
            '& .MuiAlert-icon': {
              fontSize: '1.5rem'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TemplateContents;