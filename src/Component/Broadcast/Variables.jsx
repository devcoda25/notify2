import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableHead,
    TablePagination, TableRow, Dialog, DialogTitle,
    DialogContent, DialogActions
} from '@mui/material';
import { fetchvarVariables, addVariable, editVariable, deleteVariable, showVariable, config } from '../../Url';
import axios from 'axios';

const Variables = () => {
    const [variables, setVariablesTypeData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [openDialog, setOpenDialog] = useState(false);
    const [formSchema, setFormSchema] = useState(null);
    const [formData, setFormData] = useState({});
    const [editMode, setEditMode] = useState(false);

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const [openShowDialog, setOpenShowDialog] = useState(false);
    const [showVariableData, setShowVariableData] = useState(null);

    useEffect(() => {
        fetchvarVariablesData();
    }, []);

    const fetchvarVariablesData = async () => {
        try {
            const res = await axios.get(fetchvarVariables(), config);
            setVariablesTypeData(res.data?.data?.values || []);
        } catch (error) {
            console.log('Failed to fetch data', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredData = variables.filter((row) =>
        row.name?.toLowerCase().includes(searchTerm) ||
        row.description?.toLowerCase().includes(searchTerm) ||
        String(row.id).toLowerCase().includes(searchTerm)
    );

    const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleAddClick = () => {
        const schema = {
            template_id: 1,
            name: '',
            type: 'string',
            description: '',
            default_value: '',
            is_required: false,
            validation_rules: {
                min_length: 2,
                max_length: 100
            },
            sample_data: [''],
            sort_order: 1
        };

        setFormSchema(schema);
        setFormData(schema);
        setEditMode(false);
        setOpenDialog(true);
    };

    const handleInputChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.post(deleteVariable(), { id: deleteId }, config);
            setOpenDeleteDialog(false);
            setDeleteId(null);
            fetchvarVariablesData();
        } catch (error) {
            console.error('Error deleting variable:', error);
        }
    };

    const handleFormSubmit = async () => {
        try {
            const url = editMode ? editVariable() : addVariable();
            const payload = { ...formData };

            await axios.post(url, payload, config);
            setOpenDialog(false);
            fetchvarVariablesData();
        } catch (error) {
            console.error('Error saving variable:', error);
        }
    };

   const normalizeSampleData = (data) => {
        if (Array.isArray(data)) return data;
        if (typeof data === 'string') {
            try {
                const parsed = JSON.parse(data);
                if (Array.isArray(parsed)) return parsed;
            } catch {}
            return data.split('\n').map(item => item.trim()).filter(Boolean);
        }
        return [];
    };

    // NEW: Handle show variable details
     const handleShowClick = async (id) => {
        try {
            const res = await axios.get(showVariable(id), config); // ✅ GET with ID param
            const result = res.data?.data;

            setShowVariableData({
                ...result,
                sample_data: normalizeSampleData(result.sample_data)
            });

            setOpenShowDialog(true);
        } catch (error) {
            console.error("Error showing variable:", error);
        }
    };

    return (
        <div>
            <div className='your__template_top_section'>
                <div className="template-library-wrapper">
                    <div className="template-library-intro">
                        <div className="template-library-header">
                            <h2 className="template-library-title">Variables Templates</h2>
                            <p className="template-library-guideline">
                                Select or create your template and submit it for WhatsApp approval.
                                All templates must adhere to{" "}
                                <a
                                    href="https://support.wati.io/l/en/article/d0ewqzh7gv-how-to-avoid-template-message-rejection"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="template-library-link"
                                >
                                    WhatsApp's guidelines
                                </a>.
                            </p>
                        </div>
                        <div className="template-library-actions">
                            <button className="btn btn-success template-library-new-button" onClick={handleAddClick}>
                                Add Variables
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className='your__template_left_section'>
                    <div className="custom-action-bar-search">
                        <div className="custom-search-input-container">
                            <div className="custom-input-wrap">
                                <input
                                    type="text"
                                    className="custom-search-input"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                                <div tabIndex="0" className="custom-search-icon">
                                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className='Template-Left-container'>
                    <div className="template__table-container">
                        <Table className='template__table'>
                            <TableHead className='template__table__Head'>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Sample Data</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody className="template__table__body">
                                {paginatedData.length > 0 ? (
                                    paginatedData.map((row, index) => (
                                        <TableRow key={row.id || index}>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>{row.description}</TableCell>
                                            <TableCell>
                                                {normalizeSampleData(row.sample_data).map((val, i) => (
                                                    <div key={i}>{val}</div>
                                                ))}
                                            </TableCell>
                                            <TableCell>
                                                <button className='cell__show' style={{ marginLeft: "4px" }} onClick={() => handleShowClick(row.id)}>Show</button>
                                                <button
                                                    className='cell__edit'
                                                    style={{ marginLeft: "4px" }}
                                                    onClick={() => {
                                                        setEditMode(true);
                                                        const updatedRow = {
                                                            ...row,
                                                            sample_data: normalizeSampleData(row.sample_data)
                                                        };
                                                        setFormData(updatedRow);
                                                        setFormSchema(updatedRow);
                                                        setOpenDialog(true);
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className='cell__delete'
                                                    style={{ marginLeft: "4px" }}
                                                    onClick={() => confirmDelete(row.id)}
                                                >
                                                    Delete
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4}>No data found</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        <TablePagination
                            component="div"
                            count={filteredData.length}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                        />
                    </div>
                </div>
            </div>

            {/* Add/Edit Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editMode ? 'Edit Variable' : 'Add Variable'}</DialogTitle>
                <DialogContent dividers>
                    {formSchema && (
                        <div className="d-flex flex-column gap-3">
                            <input
                                type="text"
                                placeholder="Name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className="form-control"
                            />
                            <textarea
                                placeholder="Description"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                className="form-control"
                            />
                            {Array.isArray(formData.sample_data) && formData.sample_data.map((item, idx) => (
                                <div key={idx} className="d-flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={item}
                                        onChange={(e) => {
                                            const updated = [...formData.sample_data];
                                            updated[idx] = e.target.value;
                                            handleInputChange('sample_data', updated);
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-danger"
                                        onClick={() => {
                                            const updated = formData.sample_data.filter((_, i) => i !== idx);
                                            handleInputChange('sample_data', updated);
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleInputChange('sample_data', [...formData.sample_data, ''])}
                            >
                                + Add Sample
                            </button>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <button onClick={() => setOpenDialog(false)} className="btn btn-secondary">Cancel</button>
                    <button onClick={handleFormSubmit} className="btn btn-primary">Save</button>
                </DialogActions>
            </Dialog>

            {/* Show Variable Dialog */}
            <Dialog open={openShowDialog} onClose={() => setOpenShowDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Variable Details</DialogTitle>
                <DialogContent dividers>
                    {showVariableData ? (
                        <div className="d-flex flex-column gap-2">
                            <div><strong>Name:</strong> {showVariableData.name}</div>
                            <div><strong>Description:</strong> {showVariableData.description}</div>
                            <div><strong>Sample Data:</strong>
                                <ul>
                                    {showVariableData.sample_data.map((val, i) => (
                                        <li key={i}>{val}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div>Loading...</div>
                    )}
                </DialogContent>
                <DialogActions>
                    <button onClick={() => setOpenShowDialog(false)} className="btn btn-secondary">Close</button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent dividers>
                    <p>Are you sure you want to delete this variable?</p>
                </DialogContent>
                <DialogActions>
                    <button onClick={() => setOpenDeleteDialog(false)} className="btn btn-secondary">Cancel</button>
                    <button onClick={handleConfirmDelete} className="btn btn-danger">Delete</button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Variables;
