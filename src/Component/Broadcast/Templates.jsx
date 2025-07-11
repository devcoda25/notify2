import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Tooltip, Typography, TablePagination, Radio, RadioGroup,
  FormControlLabel, Grid, Chip, Box, Divider, Card, CardHeader, CardContent, List, ListItem, ListItemText, ListItemSecondaryAction
} from '@mui/material';
import { Add, Edit, Delete, Visibility, CheckCircle } from '@mui/icons-material';
import axios from 'axios';
import baseURL from '../../Url';

const Templates = () => {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    id: null, name: '', slug: '', description: '', status: 'active',
    tags: '', metadata: '', category_id: '', content_type_id: ''
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;


    const [languages, setLanguages] = useState([]);
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


  const fetchData = async () => {
    const res = await axios.get(`${baseURL}/templates`, { headers, withCredentials: true });
    setData(res.data?.data?.values || []);
  };
   const fetchLanguages = async () => {
  const res = await axios.get(`${baseURL}/languages`, { headers, withCredentials: true });
  setLanguages(res.data?.data?.values || []);
};
    

  useEffect(() => {
  fetchData();
  fetchLanguages();
}, []);




  const handleDialogOpen = (item = null) => {
    if (item) {
      setFormData({
        ...item,
        tags: item.tags?.join(', ') || '',
        metadata: JSON.stringify(item.metadata, null, 2)
      });
    } else {
      setFormData({ id: null, name: '', slug: '', description: '', status: 'active', tags: '', metadata: '', category_id: '', content_type_id: '' });
    }
    setOpenDialog(true);
  };

  const handleDialogClose = () => setOpenDialog(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
  const payload = {
    name: formData.name,
    slug: formData.slug,
    category_id: parseInt(formData.category_id),
    content_type_id: parseInt(formData.content_type_id),
    status: formData.status,
    tags: formData.tags.split(',').map(tag => tag.trim())
  };

  const url = formData.id ? `${baseURL}/template/update` : `${baseURL}/template/store`;
  await axios.post(url, payload, { headers, withCredentials: true });
  setOpenDialog(false);
  fetchData();
};


  const handleView = async (id) => {
    const res = await axios.get(`${baseURL}/template/show?id=${id}`, { headers , withCredentials: true });
    setViewData(res.data?.data);
    setOpenView(true);
  };

  const handleDelete = async () => {
    await axios.post(`${baseURL}/template/delete`, { id: deleteId }, { headers , withCredentials: true });
    setOpenDelete(false);
    fetchData();
  };

    // For language 
    const handleLangInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewLanguage((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
    }));
    };
    
    const handleAddLanguage = async () => {
    await axios.post(`${baseURL}/language/store`, newLanguage, { headers, withCredentials: true });
    setOpenLangDialog(false);
    fetchLanguages();
    };
    
    const handleDeleteLanguage = async (id) => {
    await axios.post(`${baseURL}/language/delete`, { id }, { headers, withCredentials: true });
    fetchLanguages();
    };

    const setAsDefaultLanguage = async (langId) => {
      try {
        await axios.post(`${baseURL}/language/set-default`, {langId},{ headers, withCredentials: true });
        fetchLanguages(); 
      } catch (err) {
        console.error("Failed to set default language", err);
      }
    };




  return (
    <Box sx={{ display: 'grid', gap: 3, p: 2 }}>
  {/* Language Management */}
 <Card variant="outlined">
  <CardHeader
    title="Languages"
    action={
      <>
        <Button startIcon={<Visibility />} onClick={() => setOpenLangDialog(true)}>View All</Button>
        <Button startIcon={<Add />} onClick={() => setShowAddLang(true)} sx={{ ml: 1 }}>Add Language</Button>
      </>
    }
  />
</Card>

{/* Language List Dialog */}
<Dialog 
  open={openLangDialog} 
  onClose={() => setOpenLangDialog(false)} 
  fullWidth 
  maxWidth="sm"
  PaperProps={{
    sx: {
      borderRadius: 2,
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }
  }}
>
  <DialogTitle sx={{ 
    pb: 1, 
    fontSize: '1.1rem', 
    fontWeight: 600,
    borderBottom: '1px solid',
    borderColor: 'divider'
  }}>
    All Languages
  </DialogTitle>
  
  <DialogContent sx={{ p: 0 }}>
    {languages.length === 0 ? (
      <Box textAlign="center" py={4}>
        <Typography variant="body2" color="text.secondary">
          No languages found.
        </Typography>
      </Box>
    ) : (
      <List disablePadding>
        {languages.map((lang, index) => (
          <ListItem 
            key={lang.id}
            sx={{ 
              py: 1.5,
              px: 2,
              borderBottom: index < languages.length - 1 ? '1px solid' : 'none',
              borderColor: 'divider',
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }}
          >
            <ListItemText
              primary={
                <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {lang.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ({lang.code})
                  </Typography>
                </Box>
              }
              secondary={
                <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                  <Chip 
                    label={lang.direction.toUpperCase()} 
                    size="small" 
                    variant="outlined"
                    sx={{ 
                      fontSize: '0.7rem',
                      height: 18,
                      borderColor: 'info.main',
                      color: 'info.main'
                    }} 
                  />
                  {lang.is_default && (
                    <Chip 
                      label="Default" 
                      size="small" 
                      sx={{ 
                        fontSize: '0.7rem',
                        height: 18,
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
                      fontSize: '0.7rem',
                      height: 18,
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
        <CheckCircle fontSize="small" />
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
      <Delete fontSize="small" />
    </IconButton>
  </Tooltip>
</ListItemSecondaryAction>

          </ListItem>
        ))}
      </List>
    )}
  </DialogContent>
  
  <DialogActions sx={{ px: 2, py: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
    <Button 
      onClick={() => setOpenLangDialog(false)}
      variant="text"
      sx={{ 
        textTransform: 'none',
        fontWeight: 500
      }}
    >
      Close
    </Button>
  </DialogActions>
</Dialog>


<Dialog open={showAddLang} onClose={() => setShowAddLang(false)} fullWidth maxWidth="sm">
  <DialogTitle>Add New Language</DialogTitle>
  <DialogContent dividers>
    <TextField fullWidth label="Name" name="name" value={newLanguage.name} onChange={handleLangInputChange} sx={{ mb: 2 }} />
    <TextField fullWidth label="Code" name="code" value={newLanguage.code} onChange={handleLangInputChange} sx={{ mb: 2 }} />
    <TextField fullWidth label="Locale" name="locale" value={newLanguage.locale} onChange={handleLangInputChange} sx={{ mb: 2 }} />
    <RadioGroup row name="direction" value={newLanguage.direction} onChange={handleLangInputChange}>
      <FormControlLabel value="ltr" control={<Radio />} label="LTR" />
      <FormControlLabel value="rtl" control={<Radio />} label="RTL" />
    </RadioGroup>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setShowAddLang(false)}>Cancel</Button>
    <Button variant="contained" onClick={handleAddLanguage}>Save</Button>
  </DialogActions>
</Dialog>


  {/* Template Messages */}
  <Card variant="outlined">
    <CardHeader
      title="Template"
      action={
        <Button startIcon={<Add />} variant="contained" onClick={() => handleDialogOpen()}>Add Template</Button>
      }
    />
    <Divider />
    <CardContent>
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
            {data.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.slug}</TableCell>
                <TableCell>
                  <Chip
                    label={row.category?.name || 'N/A'}
                    size="small"
                    sx={{ backgroundColor: row.category?.color || '#ccc', color: '#fff' }}
                  />
                </TableCell>
                <TableCell>{row.content_type?.name || 'N/A'}</TableCell>
                <TableCell>
                  <Chip label={row.status} color={row.status === 'active' ? 'success' : 'default'} size="small" />
                </TableCell>
                <TableCell>
                  <Tooltip title="View">
                    <IconButton onClick={() => handleView(row.id)}><Visibility /></IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleDialogOpen(row)}><Edit /></IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => { setDeleteId(row.id); setOpenDelete(true); }}><Delete /></IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
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
      />
    </CardContent>
  </Card>
 <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="sm">
  <DialogTitle>{formData.id ? 'Edit Template' : 'Add Template'}</DialogTitle>
  <DialogContent dividers>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Slug"
          name="slug"
          value={formData.slug}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Category ID"
          name="category_id"
          type="number"
          value={formData.category_id}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Content Type ID"
          name="content_type_id"
          type="number"
          value={formData.content_type_id}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Tags (comma separated)"
          name="tags"
          value={formData.tags}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          select
          fullWidth
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          SelectProps={{ native: true }}
        >
          <option value="draft">Draft</option>
          <option value="active">Active</option>
        </TextField>
      </Grid>
    </Grid>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleDialogClose}>Cancel</Button>
    <Button variant="contained" onClick={handleSubmit}>Save</Button>
  </DialogActions>
</Dialog>
  
  <Dialog open={openView} onClose={() => setOpenView(false)} fullWidth maxWidth="sm">
  <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
    Template Details
  </DialogTitle>

  <DialogContent dividers>
    {viewData ? (
      <Box display="flex" flexDirection="column" gap={2}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">Name</Typography>
          <Typography variant="body1" fontWeight={500}>{viewData.name}</Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">Slug</Typography>
          <Typography variant="body1">{viewData.slug}</Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">Status</Typography>
          <Typography
            variant="body2"
            sx={{
              display: 'inline-block',
              px: 1.5,
              py: 0.5,
              borderRadius: '12px',
              backgroundColor: viewData.status === 'active' ? '#C8E6C9' : '#FFE0B2',
              color: viewData.status === 'active' ? '#2E7D32' : '#E65100',
              fontWeight: 500,
              fontSize: 13,
              width: 'fit-content'
            }}
          >
            {viewData.status}
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">Category</Typography>
          <Typography variant="body1">{viewData.category?.name || 'N/A'}</Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">Content Type</Typography>
          <Typography variant="body1">{viewData.content_type?.name || 'N/A'}</Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">Tags</Typography>
          {viewData.tags?.length ? (
            <Box display="flex" gap={1} flexWrap="wrap">
              {viewData.tags.map((tag, index) => (
                <Box
                  key={index}
                  sx={{
                    px: 1.2,
                    py: 0.3,
                    borderRadius: '16px',
                    backgroundColor: '#e0f7fa',
                    color: '#00796b',
                    fontSize: 13
                  }}
                >
                  {tag}
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body2">N/A</Typography>
          )}
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">Metadata</Typography>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              backgroundColor: "#f9f9f9",
              fontSize: 13,
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              maxHeight: 200,
              overflowY: 'auto'
            }}
          >
            {JSON.stringify(viewData.metadata, null, 2)}
          </Paper>
        </Box>
      </Box>
    ) : (
      <Typography align="center" py={4} color="text.secondary">
        Loading details...
      </Typography>
    )}
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setOpenView(false)} variant="outlined">
      Close
    </Button>
  </DialogActions>
</Dialog>


</Box>


  );
};

export default Templates;
