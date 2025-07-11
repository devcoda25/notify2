import React, { useState, useEffect } from 'react';
import {
  Card, CardHeader, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Tooltip, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Box, Typography, Chip, Grid, Paper, Divider, Alert, Snackbar,
  FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel,
  Accordion, AccordionSummary, AccordionDetails, CircularProgress,
  TableContainer, TablePagination, InputAdornment, AppBar, Toolbar
} from '@mui/material';
import {
  Add, Delete, Edit, Visibility, Search, Code, Language, Settings,
  ExpandMore, ContentCopy, Preview, Check, Error, Warning, Info
} from '@mui/icons-material';
import axios from 'axios';
import baseURL from '../../Url';


const mockTemplateContents = [
  {
    id: 1,
    template_id: 1,
    channel_id: 1,
    language_id: 1,
    subject: "Welcome to {{company_name}}, {{user_first_name}}!",
    content: "{{fragment:email-header}}\n<div style=\"padding: 30px; max-width: 600px; margin: 0 auto;\">\n<h2 style=\"color: #333; margin-bottom: 20px;\">Welcome aboard, {{user_first_name}}!</h2>\n<p style=\"color: #666; line-height: 1.6; margin-bottom: 20px;\">\nWe're thrilled to have you join our community! Your account has been successfully created, and you're now ready to explore all the amazing features we have to offer.\n</p>\n</div>\n{{fragment:email-footer}}",
    plain_content: "Welcome aboard, {{user_first_name}}!\n\nWe're thrilled to have you join our community! Your account has been successfully created, and you're now ready to explore all the amazing features we have to offer.\n\nBest regards,\n{{company_name}} Team",
    variables: ["user_first_name", "company_name", "cta_url", "cta_text"],
    dynamic_content: {
      personalization_blocks: {
        greeting: {
          new_user: "Welcome aboard",
          returning_user: "Welcome back"
        }
      }
    },
    conditional_blocks: {
      new_user_bonus: {
        content: "<p>As a welcome gift, enjoy 20% off your first purchase with code WELCOME20!</p>",
        condition: "user.registration_date >= now() - 7 days"
      }
    },
    is_compiled: false,
    created_at: "2025-07-02T08:45:22.000000Z",
    updated_at: "2025-07-02T08:45:22.000000Z"
  }
];

const TemplateContents = () => {
  const [templateContents, setTemplateContents] = useState(mockTemplateContents);
  const [filteredContents, setFilteredContents] = useState(mockTemplateContents);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [previewContent, setPreviewContent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [form, setForm] = useState({
    template_id: '',
    channel_id: '',
    language_id: '',
    subject: '',
    content: '',
    plain_content: '',
    variables: '',
    dynamic_content: '',
    conditional_blocks: '',
    is_compiled: false
  });

   const getAuthIdFromUrl = () => {
    const parts = window.location.pathname.split('/');
    return parts[2] || 0;
  };

//   const headers = {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json',
//     'X-Authuser': getAuthIdFromUrl(),
//     'X-Request-Agent': 'APP',
//     'X-SID': 'sid_r3fCxGnrMOp07mKQaCiS',
//     'X-MUID': 'mut_XHujrA2WUG51hx3uOLL8'
//   };
     
  const headers = { 'Accept': 'application/json', "X-Authuser": getAuthIdFromUrl() };



  const [formErrors, setFormErrors] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
    //   await new Promise(resolve => setTimeout(resolve, 1000));
    const res = await axios.get(`${baseURL}/contents`, { headers, withCredentials: true });
      setTemplateContents(res.data?.data?.values);
      setFilteredContents(res.data?.data?.values);
    } catch (error) {
      showSnackbar('Error fetching data', 'error');
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


  const validateForm = () => {
    const errors = {};
    if (!form.subject.trim()) errors.subject = 'Subject is required';
    if (!form.content.trim()) errors.content = 'Content is required';
    if (!form.plain_content.trim()) errors.plain_content = 'Plain content is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

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
    setFormErrors({});
    setOpenDialog(true);
  };

  const handlePreview = (item) => {
    setPreviewContent(item);
    setOpenPreviewDialog(true);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        ...form,
        variables: form.variables.split(',').map(v => v.trim()).filter(v => v),
        dynamic_content: form.dynamic_content ? JSON.parse(form.dynamic_content) : {},
        conditional_blocks: form.conditional_blocks ? JSON.parse(form.conditional_blocks) : {}
      };

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingContent) {
        showSnackbar('Template content updated successfully!');
      } else {
        showSnackbar('Template content created successfully!');
      }

      setOpenDialog(false);
      fetchData();
    } catch (error) {
      showSnackbar('Error saving template content', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this template content?')) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      showSnackbar('Template content deleted successfully!');
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

//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text);
//     showSnackbar('Copied to clipboard!');
//   };

  const paginatedContents = filteredContents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={0} sx={{ mb: 3 }}>
        <AppBar position="static" color="default" elevation={0}>
          <Toolbar>
            <Typography variant="h5" component="h1" sx={{ flexGrow: 1, fontWeight: 600 }}>
              Template Content Manager
            </Typography>
            <Button
              startIcon={<Add />}
              variant="contained"
              size="large"
              onClick={() => handleOpen()}
              sx={{ borderRadius: 2 }}
            >
              Add Template
            </Button>
          </Toolbar>
        </AppBar>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardHeader
              title={
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="h6">Template Contents</Typography>
                  <Chip label={`${filteredContents.length} items`} color="primary" size="small" />
                </Box>
              }
              action={
                <TextField
                  placeholder="Search templates..."
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                  }}
                  sx={{ width: 250 }}
                />
              }
            />
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Subject</TableCell>
                    <TableCell>Variables</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Updated</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : paginatedContents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <Typography color="textSecondary">No template contents found</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedContents.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                            {row.subject}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={0.5} flexWrap="wrap">
                            {row.variables.slice(0, 3).map((variable, index) => (
                              <Chip
                                key={index}
                                label={variable}
                                size="small"
                                variant="outlined"
                                color="secondary"
                              />
                            ))}
                            {row.variables.length > 3 && (
                              <Chip
                                label={`+${row.variables.length - 3}`}
                                size="small"
                                variant="outlined"
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
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="textSecondary">
                            {new Date(row.updated_at).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Preview">
                            <IconButton
                              color="info"
                              onClick={() => handlePreview(row)}
                              size="small"
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton
                              color="primary"
                              onClick={() => handleOpen(row)}
                              size="small"
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          {/* <Tooltip title="Copy">
                            <IconButton
                              color="secondary"
                              onClick={() => copyToClipboard(row.content)}
                              size="small"
                            >
                              <ContentCopy />
                            </IconButton>
                          </Tooltip> */}
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(row.id)}
                              size="small"
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
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
            />
          </Card>
        </Grid>
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        fullWidth 
        maxWidth="lg"
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle>
          <Typography variant="h6">
            {editingContent ? 'Edit Template Content' : 'Add Template Content'}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Template ID"
                fullWidth
                margin="dense"
                type="number"
                value={form.template_id}
                onChange={(e) => setForm({ ...form, template_id: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Channel ID"
                fullWidth
                margin="dense"
                type="number"
                value={form.channel_id}
                onChange={(e) => setForm({ ...form, channel_id: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Language ID"
                fullWidth
                margin="dense"
                type="number"
                value={form.language_id}
                onChange={(e) => setForm({ ...form, language_id: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Subject"
                fullWidth
                margin="dense"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                error={!!formErrors.subject}
                helperText={formErrors.subject}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Language /></InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Variables (comma-separated)"
                fullWidth
                margin="dense"
                value={form.variables}
                onChange={(e) => setForm({ ...form, variables: e.target.value })}
                helperText="Enter variables like: user_name, company_name, email"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.is_compiled}
                    onChange={(e) => setForm({ ...form, is_compiled: e.target.checked })}
                  />
                }
                label="Compiled Template"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">Content</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="HTML Content"
                      fullWidth
                      multiline
                      rows={8}
                      value={form.content}
                      onChange={(e) => setForm({ ...form, content: e.target.value })}
                      error={!!formErrors.content}
                      helperText={formErrors.content}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><Code /></InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Plain Content"
                      fullWidth
                      multiline
                      rows={8}
                      value={form.plain_content}
                      onChange={(e) => setForm({ ...form, plain_content: e.target.value })}
                      error={!!formErrors.plain_content}
                      helperText={formErrors.plain_content}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">Advanced Settings</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Dynamic Content (JSON)"
                      fullWidth
                      multiline
                      rows={6}
                      value={form.dynamic_content}
                      onChange={(e) => setForm({ ...form, dynamic_content: e.target.value })}
                      helperText="Enter JSON structure for dynamic content blocks"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Conditional Blocks (JSON)"
                      fullWidth
                      multiline
                      rows={6}
                      value={form.conditional_blocks}
                      onChange={(e) => setForm({ ...form, conditional_blocks: e.target.value })}
                      helperText="Enter JSON structure for conditional content"
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDialog(false)} size="large">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog 
        open={openPreviewDialog} 
        onClose={() => setOpenPreviewDialog(false)} 
        fullWidth 
        maxWidth="md"
      >
        <DialogTitle>
          <Typography variant="h6">Template Preview</Typography>
        </DialogTitle>
        <DialogContent dividers>
          {previewContent && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {previewContent.subject}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="textSecondary" paragraph>
                Variables: {previewContent.variables.join(', ')}
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                  {previewContent.plain_content}
                </Typography>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPreviewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TemplateContents;