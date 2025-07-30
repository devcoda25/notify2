import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Tooltip, 
  TableContainer, Paper, Dialog, DialogTitle, DialogContent, Button, 
  DialogActions, Checkbox, TablePagination, Box, Typography, Chip
} from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import { config, deleteTemplatemodule, getAllTemplates } from "../../Url";
import NewTemplate from "./NewTemplate";

const templates = [
  // Festival Templates
  {
    id: 1,
    title: 'Christmas Wishes',
    category: 'Festival',
    content: `Hi {{name}}! 🎄🎅\n\nWishing you a joyful and magical Christmas season!\n\nMay this festive season bring you and your loved ones endless happiness and countless blessings. Thank you for being our beloved customer!\n\nMerry Christmas and a Happy New Year! 🎉✨\n\nWarmest wishes,\n{{shop_name}}`
  },
  {
    id: 2,
    title: 'New Year Wishes',
    category: 'Festival',
    content: `Hey {{name}}! 🎉🎆\n\nAs we bid farewell to the old year and welcome the new one, we wanted to take a moment to thank you for your support and trust.\n\nWishing you a joyful and prosperous New Year filled with laughter, love, and exciting adventures!🥳✨\n\nBest wishes,\n{{shop_name}}`,
    img: 'https://img.freepik.com/free-photo/new-year-background_24972-1409.jpg?t=st=1730998908~exp=1731002508~hmac=9f484971e6d37d12e5b179a0d5eaefd9898b90b9a33d36ce724be43a69a5a4dd&w=1800'
  },
  {
    id: 3,
    title: 'Diwali Celebration',
    category: 'Festival',
    content: `✨ Happy Diwali {{name}}! 🪔\n\nMay this Festival of Lights illuminate your life with joy, prosperity, and happiness!\n\nWishing you and your family a very Happy Diwali filled with sweet moments and memories to cherish forever.\n\nThank you for being a valued customer!\n\nWith warm wishes,\n{{shop_name}}`
  },
  {
    id: 4,
    title: 'Eid Mubarak',
    category: 'Festival',
    content: `🌙 Eid Mubarak {{name}}! ✨\n\nMay this blessed occasion bring peace, happiness, and prosperity to you and your loved ones.\n\nWishing you a joyous Eid filled with love, laughter, and countless blessings.\n\nThank you for your continued support!\n\nEid Mubarak,\n{{shop_name}}`
  },
  {
    id: 5,
    title: 'Valentine\'s Day Special',
    category: 'Festival',
    content: `💕 Happy Valentine's Day {{name}}! 💖\n\nSpread love and joy on this special day!\n\nCheck out our exclusive Valentine's offers and make this day even more memorable for your loved ones.\n\nWith love,\n{{shop_name}} ❤️`
  },

  // Education Templates
  {
    id: 6,
    title: 'New Course Announcement',
    category: 'Education',
    content: `🎓 *New Course Available: {{Course_Name}}*\n\nDear {{name}},\n\nWe're excited to announce that we are offering a new course: *{{Course_Name}}*! Here are the details:\n\n- 🗓️ Start Date: {{Date}}\n- ⏰ Duration: {{Time}}\n- 💻 Mode: {{online}}\n- 📚 Key Topics: Topic 1, Topic 2, Topic 3\n- 📝 How to Enroll: {{url}}\n\nSeats are limited, so make sure to enroll as soon as possible. If you have any questions, feel free to reply to this message.\n\nBest regards,\n{{Company_Name}}`
  },
  {
    id: 7,
    title: 'Daily Schedule',
    category: 'Education',
    content: `📚 *Good morning, {{name}}!*\n\nHere's your schedule for today:\n- Subject 1: {{Time}} - {{Topic}}\n- Subject 2: {{Time}} - {{Topic}}\n- Additional subjects if needed\n\nMaterials required:\n- Material 1\n- Material 2\n\nMake sure you're prepared! If you have any questions, feel free to ask.\n\nBest of luck! 👍`
  },
  {
    id: 8,
    title: 'Assignment Reminder',
    category: 'Education',
    content: `📝 Assignment Reminder\n\nHi {{name}},\n\nThis is a friendly reminder about your upcoming assignment:\n\n*Subject:* {{subject}}\n*Due Date:* {{due_date}}\n*Topic:* {{topic}}\n\nPlease make sure to submit it on time. If you need any help, feel free to reach out to your instructor.\n\nGood luck!\n{{school_name}}`
  },
  {
    id: 9,
    title: 'Exam Results',
    category: 'Education',
    content: `🎉 Exam Results Published!\n\nDear {{name}},\n\nYour exam results for {{subject}} are now available.\n\n*Score:* {{score}}\n*Grade:* {{grade}}\n*Remarks:* {{remarks}}\n\nCongratulations on your performance! Keep up the good work.\n\nBest regards,\n{{institution_name}}`
  },

  // E-Commerce Templates
  {
    id: 10,
    title: 'Order Confirmation',
    category: 'E-Commerce',
    content: `🛍️ Order Confirmed!\n\nHi {{name}},\n\nThank you for your order! Here are the details:\n\n*Order ID:* {{order_id}}\n*Total Amount:* {{amount}}\n*Delivery Date:* {{delivery_date}}\n*Address:* {{address}}\n\nYou can track your order using the link: {{tracking_link}}\n\nThank you for shopping with us!\n{{shop_name}}`
  },
  {
    id: 11,
    title: 'Flash Sale Alert',
    category: 'E-Commerce',
    content: `⚡ FLASH SALE ALERT! ⚡\n\nHey {{name}}!\n\nDon't miss out on our biggest sale of the year!\n\n🔥 Up to {{discount}}% OFF on selected items\n⏰ Limited time offer: {{end_time}}\n🚚 Free shipping on orders above {{min_amount}}\n\nShop now: {{shop_link}}\n\nHurry, stocks are limited!\n{{shop_name}}`
  },
  {
    id: 12,
    title: 'Abandoned Cart',
    category: 'E-Commerce',
    content: `🛒 You left something behind!\n\nHi {{name}},\n\nYou have {{item_count}} item(s) waiting in your cart:\n\n{{item_list}}\n\n*Total Value:* {{cart_total}}\n\nComplete your purchase now and get:\n✅ Free shipping\n✅ {{discount}}% discount with code: SAVE{{discount}}\n\nShop now: {{cart_link}}\n\n{{shop_name}}`
  },
  {
    id: 13,
    title: 'Product Launch',
    category: 'E-Commerce',
    content: `🚀 NEW PRODUCT LAUNCH!\n\nHello {{name}}!\n\nWe're excited to introduce our latest product:\n\n*{{product_name}}*\n\n✨ Features: {{features}}\n💰 Special Launch Price: {{price}}\n🎁 Limited time offer: {{offer}}\n\nBe among the first to experience {{product_name}}!\n\nOrder now: {{product_link}}\n\n{{shop_name}}`
  },

  // Others Templates
  {
    id: 14,
    title: 'Welcome Message',
    category: 'Others',
    content: `🎉 Welcome {{name}}!\n\nThank you for joining us! We're excited to have you as part of our community.\n\nHere's what you can expect:\n✅ Exclusive updates\n✅ Special offers\n✅ Priority support\n\nIf you have any questions, feel free to reach out to us anytime.\n\nWelcome aboard!\n{{company_name}}`
  },
  {
    id: 15,
    title: 'Appointment Reminder',
    category: 'Others',
    content: `📅 Appointment Reminder\n\nHi {{name}},\n\nThis is a reminder about your upcoming appointment:\n\n*Date:* {{date}}\n*Time:* {{time}}\n*Location:* {{location}}\n*Purpose:* {{purpose}}\n\nPlease arrive 10 minutes early. If you need to reschedule, please let us know at least 24 hours in advance.\n\nSee you soon!\n{{business_name}}`
  },
  {
    id: 16,
    title: 'Thank You Message',
    category: 'Others',
    content: `🙏 Thank You {{name}}!\n\nWe wanted to take a moment to thank you for {{reason}}.\n\nYour support means the world to us, and we're grateful to have customers like you.\n\nAs a token of our appreciation, here's a special offer: {{offer_details}}\n\nThank you once again!\n\nWith gratitude,\n{{company_name}}`
  },
  {
    id: 17,
    title: 'Survey Request',
    category: 'Others',
    content: `📊 We Value Your Feedback!\n\nHi {{name}},\n\nWe hope you had a great experience with {{service_name}}!\n\nWould you mind taking 2 minutes to share your feedback? Your opinion helps us improve our services.\n\n👆 Rate your experience: {{survey_link}}\n\nAs a thank you, you'll receive {{incentive}} upon completion.\n\nThank you for your time!\n{{company_name}}`
  },
  {
    id: 18,
    title: 'Event Invitation',
    category: 'Others',
    content: `🎊 You're Invited!\n\nDear {{name}},\n\nWe're hosting {{event_name}} and would love to have you join us!\n\n*Date:* {{event_date}}\n*Time:* {{event_time}}\n*Venue:* {{venue}}\n*Dress Code:* {{dress_code}}\n\nPlease RSVP by {{rsvp_date}}: {{rsvp_link}}\n\nLooking forward to seeing you there!\n\n{{organizer_name}}`
  }
];

const TemplateLibrary = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isOpenTemplateMessage, setIsOpenTemplateMessage] = useState(false);
  const [templateData, setTemplateData] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Row selection states
  const [selectedRows, setSelectedRows] = useState([]);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setPage(0); // Reset to first page when category changes
    setSelectedRows([]); // Clear selections when category changes
  };

  const handleTemplateMessage = () => {
    setIsOpenTemplateMessage(true);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(0); // Reset to first page when searching
    setSelectedRows([]); // Clear selections when searching
  };

  const handleSearchClear = () => {
    setSearchQuery("");
    setPage(0);
    setSelectedRows([]);
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Row selection handlers
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = paginatedTemplates.map((template) => template.id);
      setSelectedRows(newSelected);
      return;
    }
    setSelectedRows([]);
  };

  const handleRowClick = (event, id) => {
    const selectedIndex = selectedRows.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1),
      );
    }
    setSelectedRows(newSelected);
  };

  const isSelected = (id) => selectedRows.indexOf(id) !== -1;

  const fetchAllTemplates = async () => {
    try {
      const res = await axios.get(getAllTemplates(), config);
      const TemplateValues = res?.data?.data?.values || [];
      setTemplateData(TemplateValues);
    } catch (error) {
      console.log("Error fetching templates", error);
    }
  };

  useEffect(() => {
    fetchAllTemplates();
  }, []);

  const getCategoryCount = (category) => {
    return templates.filter((template) => template.category === category).length;
  };

  const getFilteredTemplates = () => {
    // For "All" category, use API data (templateData)
    // For other categories, use static templates data
    let dataSource = selectedCategory === "All" ? templateData : templates;
    let filtered = dataSource;

    if (searchQuery.trim()) {
      filtered = filtered.filter((template) =>
        template.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter((template) => template.category === selectedCategory);
    }

    return filtered;
  };

  const filteredTemplates = getFilteredTemplates();

  // Get total count for "All" category (API data + static templates)
  const getTotalTemplateCount = () => {
    return templateData.length + templates.length;
  };
  
  // Get paginated data
  const paginatedTemplates = filteredTemplates.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleView = (template) => {
    console.log("View", template);
  };

  const handleUpdate = (template) => {
    setSelectedTemplate(template); 
    setIsOpenTemplateMessage(true); 
  };

  const confirmDelete = async () => {
    try {
      const payload = { id: templateToDelete }; 
      await axios.post(deleteTemplatemodule(), payload, config);

      setTemplateData((prev) => prev.filter(t => t.id !== templateToDelete));
      setDeleteDialogOpen(false);
      setTemplateToDelete(null);
      setSelectedRows(prev => prev.filter(id => id !== templateToDelete));
    } catch (error) {
      console.error("Error deleting template:", error);
    }
  };

  // Bulk delete function
  const confirmBulkDelete = async () => {
    try {
      // Delete multiple templates
      const deletePromises = selectedRows.map(id => 
        axios.post(deleteTemplatemodule(), { id }, config)
      );
      
      await Promise.all(deletePromises);
      
      setTemplateData((prev) => prev.filter(t => !selectedRows.includes(t.id)));
      setBulkDeleteDialogOpen(false);
      setSelectedRows([]);
    } catch (error) {
      console.error("Error deleting templates:", error);
    }
  };

  const handleBulkDelete = () => {
    setBulkDeleteDialogOpen(true);
  };

  return (
    <div> 
      {/* Single Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this template? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" onClick={confirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Delete Dialog */}
      <Dialog
        open={bulkDeleteDialogOpen}
        onClose={() => setBulkDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Bulk Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {selectedRows.length} selected template{selectedRows.length > 1 ? 's' : ''}? 
          This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" onClick={confirmBulkDelete}>
            Delete {selectedRows.length} Template{selectedRows.length > 1 ? 's' : ''}
          </Button>
        </DialogActions>
      </Dialog>

      {isOpenTemplateMessage ? (
        <NewTemplate
          isOpenTemplateMessage={isOpenTemplateMessage}
          setIsOpenTemplateMessage={setIsOpenTemplateMessage}
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
          fetchAllTemplates={fetchAllTemplates}
        />
      ) : (
        <div className="Template_librabry-Container">
          <div className="template-library-wrapper">
            <div className="template-library-intro">
              <div className="template-library-header">
                <h2 className="template-library-title">Template Library</h2>
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
                  </a>
                  .
                </p>
              </div>
              <div className="template-library-actions">
                <a
                  href="https://www.youtube.com/watch?v=Zyk7bby9URE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="template-library-tutorial"
                >
                  <div className="tutorial-content">
                    <svg
                      width="27"
                      height="27"
                      viewBox="0 0 27 27"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="13.5" cy="13.5" r="13.5" fill="#269CFE"></circle>
                      <path
                        d="M17.8691 12.6344C18.5358 13.0193 18.5358 13.9815 17.8691 14.3664L12.0648 17.7176C11.3981 18.1025 10.5648 17.6214 10.5648 16.8516L10.5648 10.1493C10.5648 9.37948 11.3981 8.89836 12.0648 9.28326L17.8691 12.6344Z"
                        fill="white"
                      ></path>
                    </svg>
                    <span className="tutorial-text">Watch Tutorial</span>
                  </div>
                </a>
                <button className="btn btn-success template-library-new-button" onClick={handleTemplateMessage}>
                  New Template Message
                </button>
              </div>
            </div>
          </div>

          <div className="template-navigation-wrapper">
            <nav className="template-nav">
              <ul className="template-nav-list">
                {["All", "Festival", "Education", "E-Commerce", "Others"].map((cat) => (
                  <li
                    key={cat}
                    className={`template-nav-item ${selectedCategory === cat ? "activeBroad" : ""}`}
                    onClick={() => handleCategoryClick(cat)}
                  >
                    <div className="template-tab">
                      {cat}
                      {cat !== "All" && (
                        <span className="template-count">{getCategoryCount(cat)}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="template-search">
              <div className="search-input-wrap">
                <input
                  type="text"
                  placeholder="Search by subject..."
                  className="search-input template_Search_input"
                  aria-label="Search Templates by Subject"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <button 
                  className="search-icon"
                  onClick={searchQuery ? handleSearchClear : undefined}
                  style={{ cursor: searchQuery ? 'pointer' : 'default' }}
                >
                  {searchQuery ? (
                    <svg
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  ) : (
                    <svg
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  )}
                </button>
              </div>
              {searchQuery && (
                <div className="search-results-info" style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
                </div>
              )}
            </div>
          </div>

          <div className="template-card-container">
            {selectedCategory === "All" ? (
              <Box>
                {/* Selection Info and Bulk Actions */}
                {selectedRows.length > 0 && (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    mb: 2,
                    p: 2,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 1
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Chip 
                        label={`${selectedRows.length} selected`} 
                        color="primary" 
                        size="small" 
                      />
                      <Typography variant="body2" color="text.secondary">
                        {selectedRows.length} of {filteredTemplates.length} templates selected
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<Delete />}
                      onClick={handleBulkDelete}
                    >
                      Delete Selected
                    </Button>
                  </Box>
                )}

                <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
                  <Table>
                    <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            indeterminate={selectedRows.length > 0 && selectedRows.length < paginatedTemplates.length}
                            checked={paginatedTemplates.length > 0 && selectedRows.length === paginatedTemplates.length}
                            onChange={handleSelectAllClick}
                            inputProps={{
                              'aria-label': 'select all templates',
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Subject</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Content</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Channel</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Language</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Ticket Type</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Updated</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedTemplates.length > 0 ? (
                        paginatedTemplates.map((template) => {
                          const isItemSelected = isSelected(template.id);
                          const labelId = `enhanced-table-checkbox-${template.id}`;

                          return (
                            <TableRow
                              key={template.id}
                              hover
                              onClick={(event) => handleRowClick(event, template.id)}
                              role="checkbox"
                              aria-checked={isItemSelected}
                              tabIndex={-1}
                              selected={isItemSelected}
                              sx={{ cursor: 'pointer' }}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  color="primary"
                                  checked={isItemSelected}
                                  inputProps={{
                                    'aria-labelledby': labelId,
                                  }}
                                />
                              </TableCell>
                              <TableCell component="th" id={labelId} scope="row">
                                {template.id}
                              </TableCell>
                              <TableCell>
                                {searchQuery ? (
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: template.subject?.replace(
                                        new RegExp(`(${searchQuery})`, 'gi'),
                                        '<mark style="background-color: #ffeb3b; padding: 0 2px;">$1</mark>'
                                      ) || ''
                                    }}
                                  />
                                ) : (
                                  template.subject
                                )}
                              </TableCell>
                              <TableCell
                                sx={{ 
                                  maxWidth: 200, 
                                  whiteSpace: 'nowrap', 
                                  overflow: 'hidden', 
                                  textOverflow: 'ellipsis'
                                }}
                              >
                                {template.content}
                              </TableCell>
                              <TableCell>{template.channel?.name || "-"}</TableCell>
                              <TableCell>{template.language?.name || "-"}</TableCell>
                              <TableCell>{template.ticket_type}</TableCell>
                              <TableCell>
                                {new Date(template.updated_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Tooltip title="View">
                                  <IconButton 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleView(template);
                                    }} 
                                    size="small"
                                  >
                                    <Visibility />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Update">
                                  <IconButton 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUpdate(template);
                                    }} 
                                    size="small"
                                  >
                                    <Edit />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setTemplateToDelete(template.id);
                                      setDeleteDialogOpen(true);
                                    }}
                                    size="small"
                                  >
                                    <Delete color="error" />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={9} sx={{ textAlign: 'center', py: 4 }}>
                            {searchQuery ? (
                              <div>
                                <p>No templates found matching "{searchQuery}"</p>
                                <button 
                                  onClick={handleSearchClear}
                                  style={{ 
                                    background: 'none', 
                                    border: '1px solid #ccc', 
                                    padding: '4px 8px', 
                                    cursor: 'pointer',
                                    marginTop: '8px'
                                  }}
                                >
                                  Clear search
                                </button>
                              </div>
                            ) : (
                              'No templates available'
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Pagination */}
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={filteredTemplates.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{ mt: 2 }}
                />
              </Box>
            ) : (
              <div className="template__template">
                <div className="template-card-section">
                  {filteredTemplates.length > 0 ? (
                    filteredTemplates.map((template) => (
                      <div key={template.id} className="template-cards">
                        <div className="template_card-wrapper">
                          {template.img && (
                            <div className="template_card-top-wrapper">
                              <img
                                src={template.img}
                                alt={template.title}
                                className="background-image"
                              />
                            </div>
                          )}
                          <div className="template_card-wrapper-content">
                            <div className="template_header-content">
                              <h4>{template.title}</h4>
                              <span className="template_label">{template.category}</span>
                            </div>
                            <p className="template_content">
                              {template.content
                                .replace("{{name}}", "John Doe")
                                .replace("{{shop_name}}", "Your Shop")
                                .split("\n")
                                .map((line, index) => (
                                  <React.Fragment key={index}>
                                    {line}
                                    <br />
                                  </React.Fragment>
                                ))}
                            </p>
                            <div className="template_button-container">
                              <button className="template_use-sample-btn">Use sample</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', width: '100%', padding: '40px' }}>
                      {searchQuery ? (
                        <div>
                          <p>No templates found matching "{searchQuery}" in {selectedCategory} category</p>
                          <button 
                            onClick={handleSearchClear}
                            style={{ 
                              background: 'none', 
                              border: '1px solid #ccc', 
                              padding: '8px 16px', 
                              cursor: 'pointer',
                              marginTop: '8px'
                            }}
                          >
                            Clear search
                          </button>
                        </div>
                      ) : (
                        `No templates available in ${selectedCategory} category`
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateLibrary;

 
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Table, TableHead, TableRow, TableCell, TableBody, IconButton, Tooltip, TableContainer, Paper, Dialog, DialogTitle, DialogContent, Button, DialogActions
// } from "@mui/material";
// import { Visibility, Edit, Delete } from "@mui/icons-material";
// import { config, deleteTemplatemodule, getAllTemplates } from "../../Url";
// import NewTemplate from "./NewTemplate";

// const templates = [
//   {
//     id: 1,
//     title: 'Christmas Wishes',
//     category: 'Festival',
//     content: `Hi {{name}}! 🎄🎅\n\nWishing you a joyful and magical Christmas season!\n\nMay this festive season bring you and your loved ones endless happiness and countless blessings. Thank you for being our beloved customer!\n\nMerry Christmas and a Happy New Year! 🎉✨\n\nWarmest wishes,\n{{shop_name}}`
//   },
//   {
//     id: 2,
//     title: 'New Year Wishes',
//     category: 'Festival',
//     content: `Hey {{name}}! 🎉🎆\n\nAs we bid farewell to the old year and welcome the new one, we wanted to take a moment to thank you for your support and trust.\n\nWishing you a joyful and prosperous New Year filled with laughter, love, and exciting adventures!🥳✨\n\nBest wishes,\n{{shop_name}}`,
//     img: 'https://img.freepik.com/free-photo/new-year-background_24972-1409.jpg?t=st=1730998908~exp=1731002508~hmac=9f484971e6d37d12e5b179a0d5eaefd9898b90b9a33d36ce724be43a69a5a4dd&amp;w=1800" alt="https://img.freepik.com/free-photo/new-year-background_24972-1409.jpg?t=st=1730998908~exp=1731002508~hmac=9f484971e6d37d12e5b179a0d5eaefd9898b90b9a33d36ce724be43a69a5a4dd&amp;w=1800'
//   },
//   {
//     id: 3,
//     title: 'New Course Announcement',
//     category: 'Education',
//     content: `🎓 *New Course Available: {{Course_Name}}*\n\nDear {{name}},\n\nWe’re excited to announce that we are offering a new course: *{{Course_Name}}*! Here are the details:\n\n- 🗓️ Start Date: {{Date}}\n- ⏰ Duration: {{Time}}\n- 💻 Mode: {{online}}\n- 📚 Key Topics: Topic 1, Topic 2, Topic 3\n- 📝 How to Enroll: {{url}}\n\nSeats are limited, so make sure to enroll as soon as possible. If you have any questions, feel free to reply to this message.\n\nBest regards,\n{{Company_Name}}`
//   },
//   {
//     id: 4,
//     title: 'Daily Schedule',
//     category: 'Education',
//     content: `📚 *Good morning, {{name}}!*\n\nHere’s your schedule for today:\n- Subject 1: {{Time}} - {{Topic}}\n- Subject 2: {{Time}} - {{Topic}}\n- Additional subjects if needed\n\nMaterials required:\n- Material 1\n- Material 2\n\nMake sure you’re prepared! If you have any questions, feel free to ask.\n\nBest of luck! 👍`
//   },
//   {
//     id: 5,
//     title: 'E-Commerce Tips',
//     category: 'E-Commerce',
//     content: 'Boost your sales with these strategies.'
//   },
//   {
//     id: 6,
//     title: 'Summer Sale',
//     category: 'Others',
//     content: 'Check out our amazing summer sale!'
//   },
// ];

// const TemplateLibrary = () => {
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [isOpenTemplateMessage, setIsOpenTemplateMessage] = useState(false);
//   const [templateData, setTemplateData] = useState([]);
//   const [selectedTemplate, setSelectedTemplate] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [templateToDelete, setTemplateToDelete] = useState(null);
//   const [searchQuery, setSearchQuery] = useState(""); // Added search state

//   const handleCategoryClick = (category) => {
//     setSelectedCategory(category);
//   };

//   const handleTemplateMessage = () => {
//     setIsOpenTemplateMessage(true);
//   };

//   // Added search handler
//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   // Added search clear handler
//   const handleSearchClear = () => {
//     setSearchQuery("");
//   };

//   const fetchAllTemplates = async () => {
//     try {
//       const res = await axios.get(getAllTemplates(), config);
//       const TemplateValues = res?.data?.data?.values || [];
//       // console.log("TemplateValues", TemplateValues)
//       setTemplateData(TemplateValues);
//     } catch (error) {
//       console.log("Error fetching templates", error);
//     }
//   };

//   useEffect(() => {
//     fetchAllTemplates();
//   }, []);

//   const getCategoryCount = (category) => {
//     return templates.filter((template) => template.category === category).length;
//   };

//   // Updated filtered templates to include search functionality
//   const getFilteredTemplates = () => {
//     let filtered = templateData;

//     // Filter by search query (subject)
//     if (searchQuery.trim()) {
//       filtered = filtered.filter((template) =>
//         template.subject?.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     // Filter by category (for non-All categories)
//     if (selectedCategory !== "All") {
//       filtered = filtered.filter((template) => template.category === selectedCategory);
//     }

//     return filtered;
//   };

//   const filteredTemplates = getFilteredTemplates();

//   const handleView = (template) => {
//     console.log("View", template);
//   };

//   const handleUpdate = (template) => {
//     // console.log("template", template)
//     setSelectedTemplate(template); 
//     setIsOpenTemplateMessage(true); 
//   };

//   const confirmDelete = async () => {
//     try {
//       const payload = { id: templateToDelete }; 
//       await axios.post(deleteTemplatemodule(), payload, config);

//       setTemplateData((prev) => prev.filter(t => t.id !== templateToDelete));
//       setDeleteDialogOpen(false);
//       setTemplateToDelete(null);
//     } catch (error) {
//       console.error("Error deleting template:", error);
//     }
//   };

//   return (
//     <div> 
//       <Dialog
//         open={deleteDialogOpen}
//         onClose={() => setDeleteDialogOpen(false)}
//       >
//         <DialogTitle>Confirm Deletion</DialogTitle>
//         <DialogContent>
//           Are you sure you want to delete this template? This action cannot be undone.
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
//           <Button color="error" onClick={confirmDelete}>Delete</Button>
//         </DialogActions>
//       </Dialog>

//       {isOpenTemplateMessage ? (
//         <NewTemplate
//           isOpenTemplateMessage={isOpenTemplateMessage}
//           setIsOpenTemplateMessage={setIsOpenTemplateMessage}
//           selectedTemplate={selectedTemplate}
//           setSelectedTemplate={setSelectedTemplate}
//           fetchAllTemplates={fetchAllTemplates}
//         />
//       ) : (
//         <div className="Template_librabry-Container">
//           <div className="template-library-wrapper">
//             <div className="template-library-intro">
//               <div className="template-library-header">
//                 <h2 className="template-library-title">Template Library</h2>
//                 <p className="template-library-guideline">
//                   Select or create your template and submit it for WhatsApp approval.
//                   All templates must adhere to{" "}
//                   <a
//                     href="https://support.wati.io/l/en/article/d0ewqzh7gv-how-to-avoid-template-message-rejection"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="template-library-link"
//                   >
//                     WhatsApp's guidelines
//                   </a>
//                   .
//                 </p>
//               </div>
//               <div className="template-library-actions">
//                 <a
//                   href="https://www.youtube.com/watch?v=Zyk7bby9URE"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="template-library-tutorial"
//                 >
//                   <div className="tutorial-content">
//                     <svg
//                       width="27"
//                       height="27"
//                       viewBox="0 0 27 27"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <circle cx="13.5" cy="13.5" r="13.5" fill="#269CFE"></circle>
//                       <path
//                         d="M17.8691 12.6344C18.5358 13.0193 18.5358 13.9815 17.8691 14.3664L12.0648 17.7176C11.3981 18.1025 10.5648 17.6214 10.5648 16.8516L10.5648 10.1493C10.5648 9.37948 11.3981 8.89836 12.0648 9.28326L17.8691 12.6344Z"
//                         fill="white"
//                       ></path>
//                     </svg>
//                     <span className="tutorial-text">Watch Tutorial</span>
//                   </div>
//                 </a>
//                 <button className="btn btn-success template-library-new-button" onClick={handleTemplateMessage}>
//                   New Template Message
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="template-navigation-wrapper">
//             <nav className="template-nav">
//               <ul className="template-nav-list">
//                 {["All", "Festival", "Education", "E-Commerce", "Others"].map((cat) => (
//                   <li
//                     key={cat}
//                     className={`template-nav-item ${selectedCategory === cat ? "activeBroad" : ""}`}
//                     onClick={() => handleCategoryClick(cat)}
//                   >
//                     <div className="template-tab">
//                       {cat}
//                       {cat !== "All" && (
//                         <span className="template-count">{getCategoryCount(cat)}</span>
//                       )}
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </nav>

//             {/* Updated search input with functionality */}
//             <div className="template-search">
//               <div className="search-input-wrap">
//                 <input
//                   type="text"
//                   placeholder="Search by subject..."
//                   className="search-input template_Search_input"
//                   aria-label="Search Templates by Subject"
//                   value={searchQuery}
//                   onChange={handleSearchChange}
//                 />
//                 <button 
//                   className="search-icon"
//                   onClick={searchQuery ? handleSearchClear : undefined}
//                   style={{ cursor: searchQuery ? 'pointer' : 'default' }}
//                 >
//                   {searchQuery ? (
//                     // Clear icon when there's a search query
//                     <svg
//                       stroke="currentColor"
//                       fill="none"
//                       strokeWidth="2"
//                       viewBox="0 0 24 24"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       height="1em"
//                       width="1em"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <line x1="18" y1="6" x2="6" y2="18"></line>
//                       <line x1="6" y1="6" x2="18" y2="18"></line>
//                     </svg>
//                   ) : (
//                     // Search icon when no search query
//                     <svg
//                       stroke="currentColor"
//                       fill="none"
//                       strokeWidth="2"
//                       viewBox="0 0 24 24"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       height="1em"
//                       width="1em"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <circle cx="11" cy="11" r="8"></circle>
//                       <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
//                     </svg>
//                   )}
//                 </button>
//               </div>
//               {/* Show search results count */}
//               {searchQuery && (
//                 <div className="search-results-info" style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
//                   {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="template-card-container">
//             {selectedCategory === "All" ? (
//               <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
//                 <Table>
//                   <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
//                     <TableRow>
//                       <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
//                       <TableCell sx={{ fontWeight: 600 }}>Subject</TableCell>
//                       <TableCell sx={{ fontWeight: 600 }}>Content</TableCell>
//                       <TableCell sx={{ fontWeight: 600 }}>Channel</TableCell>
//                       <TableCell sx={{ fontWeight: 600 }}>Language</TableCell>
//                       <TableCell sx={{ fontWeight: 600 }}>Ticket Type</TableCell>
//                       <TableCell sx={{ fontWeight: 600 }}>Updated</TableCell>
//                       <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {filteredTemplates.length > 0 ? (
//                       filteredTemplates.map((template) => (
//                         <TableRow key={template.id}>
//                           <TableCell>{template.id}</TableCell>
//                           <TableCell>
//                             {/* Highlight search term in subject */}
//                             {searchQuery ? (
//                               <span
//                                 dangerouslySetInnerHTML={{
//                                   __html: template.subject?.replace(
//                                     new RegExp(`(${searchQuery})`, 'gi'),
//                                     '<mark style="background-color: #ffeb3b; padding: 0 2px;">$1</mark>'
//                                   ) || ''
//                                 }}
//                               />
//                             ) : (
//                               template.subject
//                             )}
//                           </TableCell>
//                           <TableCell
//                             sx={{ 
//                               maxWidth: 200, 
//                               whiteSpace: 'nowrap', 
//                               overflow: 'hidden', 
//                               textOverflow: 'ellipsis'
//                             }}
//                           >
//                             {template.content}
//                           </TableCell>
//                           <TableCell>{template.channel?.name || "-"}</TableCell>
//                           <TableCell>{template.language?.name || "-"}</TableCell>
//                           <TableCell>{template.ticket_type}</TableCell>
//                           <TableCell>
//                             {new Date(template.updated_at).toLocaleDateString()}
//                           </TableCell>
//                           <TableCell>
//                             <Tooltip title="View">
//                               <IconButton onClick={() => handleView(template)} size="small">
//                                 <Visibility />
//                               </IconButton>
//                             </Tooltip>
//                             <Tooltip title="Update">
//                               <IconButton onClick={() => handleUpdate(template)} size="small">
//                                 <Edit />
//                               </IconButton>
//                             </Tooltip>
//                             <Tooltip title="Delete">
//                               <IconButton
//                                 onClick={() => {
//                                   setTemplateToDelete(template.id);
//                                   setDeleteDialogOpen(true);
//                                 }}
//                                 size="small"
//                               >
//                                 <Delete color="error" />
//                               </IconButton>
//                             </Tooltip>
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     ) : (
//                       <TableRow>
//                         <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
//                           {searchQuery ? (
//                             <div>
//                               <p>No templates found matching "{searchQuery}"</p>
//                               <button 
//                                 onClick={handleSearchClear}
//                                 style={{ 
//                                   background: 'none', 
//                                   border: '1px solid #ccc', 
//                                   padding: '4px 8px', 
//                                   cursor: 'pointer',
//                                   marginTop: '8px'
//                                 }}
//                               >
//                                 Clear search
//                               </button>
//                             </div>
//                           ) : (
//                             'No templates available'
//                           )}
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             ) : (
//               <div className="template__template">
//                 <div className="template-card-section">
//                   {filteredTemplates.length > 0 ? (
//                     filteredTemplates.map((template) => (
//                       <div key={template.id} className="template-cards">
//                         <div className="template_card-wrapper">
//                           {template.img && (
//                             <div className="template_card-top-wrapper">
//                               <img
//                                 src={template.img}
//                                 alt={template.title}
//                                 className="background-image"
//                               />
//                             </div>
//                           )}
//                           <div className="template_card-wrapper-content">
//                             <div className="template_header-content">
//                               <h4>{template.title}</h4>
//                               <span className="template_label">{template.category}</span>
//                             </div>
//                             <p className="template_content">
//                               {template.content
//                                 .replace("{{name}}", "John Doe")
//                                 .replace("{{shop_name}}", "Your Shop")
//                                 .split("\n")
//                                 .map((line, index) => (
//                                   <React.Fragment key={index}>
//                                     {line}
//                                     <br />
//                                   </React.Fragment>
//                                 ))}
//                             </p>
//                             <div className="template_button-container">
//                               <button className="template_use-sample-btn">Use sample</button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <div style={{ textAlign: 'center', width: '100%', padding: '40px' }}>
//                       {searchQuery ? (
//                         <div>
//                           <p>No templates found matching "{searchQuery}" in {selectedCategory} category</p>
//                           <button 
//                             onClick={handleSearchClear}
//                             style={{ 
//                               background: 'none', 
//                               border: '1px solid #ccc', 
//                               padding: '8px 16px', 
//                               cursor: 'pointer',
//                               marginTop: '8px'
//                             }}
//                           >
//                             Clear search
//                           </button>
//                         </div>
//                       ) : (
//                         `No templates available in ${selectedCategory} category`
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TemplateLibrary;



// import React, { useState, useEffect } from "react";
// import NewTemplate from "./NewTemplate";
// import axios from "axios";
// import { config, getAllTemplates } from "../../Url";

// const templates = [
//   {
//     id: 1,
//     title: 'Christmas Wishes',
//     category: 'Festival',
//     content: `Hi {{name}}! 🎄🎅\n\nWishing you a joyful and magical Christmas season!\n\nMay this festive season bring you and your loved ones endless happiness and countless blessings. Thank you for being our beloved customer!\n\nMerry Christmas and a Happy New Year! 🎉✨\n\nWarmest wishes,\n{{shop_name}}`
//   },
//   {
//     id: 2,
//     title: 'New Year Wishes',
//     category: 'Festival',
//     content: `Hey {{name}}! 🎉🎆\n\nAs we bid farewell to the old year and welcome the new one, we wanted to take a moment to thank you for your support and trust.\n\nWishing you a joyful and prosperous New Year filled with laughter, love, and exciting adventures!🥳✨\n\nBest wishes,\n{{shop_name}}`,
//     img: 'https://img.freepik.com/free-photo/new-year-background_24972-1409.jpg?t=st=1730998908~exp=1731002508~hmac=9f484971e6d37d12e5b179a0d5eaefd9898b90b9a33d36ce724be43a69a5a4dd&amp;w=1800" alt="https://img.freepik.com/free-photo/new-year-background_24972-1409.jpg?t=st=1730998908~exp=1731002508~hmac=9f484971e6d37d12e5b179a0d5eaefd9898b90b9a33d36ce724be43a69a5a4dd&amp;w=1800'
//   },
//   {
//     id: 3,
//     title: 'New Course Announcement',
//     category: 'Education',
//     content: `🎓 *New Course Available: {{Course_Name}}*\n\nDear {{name}},\n\nWe’re excited to announce that we are offering a new course: *{{Course_Name}}*! Here are the details:\n\n- 🗓️ Start Date: {{Date}}\n- ⏰ Duration: {{Time}}\n- 💻 Mode: {{online}}\n- 📚 Key Topics: Topic 1, Topic 2, Topic 3\n- 📝 How to Enroll: {{url}}\n\nSeats are limited, so make sure to enroll as soon as possible. If you have any questions, feel free to reply to this message.\n\nBest regards,\n{{Company_Name}}`
//   },
//   {
//     id: 4,
//     title: 'Daily Schedule',
//     category: 'Education',
//     content: `📚 *Good morning, {{name}}!*\n\nHere’s your schedule for today:\n- Subject 1: {{Time}} - {{Topic}}\n- Subject 2: {{Time}} - {{Topic}}\n- Additional subjects if needed\n\nMaterials required:\n- Material 1\n- Material 2\n\nMake sure you’re prepared! If you have any questions, feel free to ask.\n\nBest of luck! 👍`
//   },
//   {
//     id: 5,
//     title: 'E-Commerce Tips',
//     category: 'E-Commerce',
//     content: 'Boost your sales with these strategies.'
//   },
//   {
//     id: 6,
//     title: 'Summer Sale',
//     category: 'Others',
//     content: 'Check out our amazing summer sale!'
//   },
// ];



// const TemplateLibrary = () => {
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [isOpenTemplateMessage, setIsOpenTemplateMessage] = useState(false);
//   const [templateData, setTemplateData]= useState([]);

//   const handleCategoryClick = (category) => {
//     setSelectedCategory(category);
//   };

//   const handleTemplateMessage = () => {
//     setIsOpenTemplateMessage(true);
//   }

//   const fetchAllTemplates = async()=>{
//     try {
//       const res = await axios.get(getAllTemplates(), config)
//       const TemplateValues = res?.data?.data?.values
//       console.log("TemplateValues", TemplateValues)
//       setTemplateData(TemplateValues)
//     } catch (error) {
//       console.log("error",error)
//     }
//   }

  
//   useEffect(() => {
//     fetchAllTemplates()   
//   }, [])
  

  
//   const filteredTemplates =
//     selectedCategory === "All"
//       ? templates
//       : templates.filter((template) => template.category === selectedCategory);
//   const getCategoryCount = (category) => {
//     return templates.filter((template) => template.category === category).length;
//   };

//   return (
//     <>
//       <div>
//         {
//           isOpenTemplateMessage ? (
//             <>
//               <NewTemplate isOpenTemplateMessage={isOpenTemplateMessage} setIsOpenTemplateMessage={setIsOpenTemplateMessage}  />
//             </>
//           ) : (
//             <div className='Template_librabry-Container'>
//               <div className="template-library-wrapper">
//                 <div className="template-library-intro">
//                   <div className="template-library-header">
//                     <h2 className="template-library-title">Template Library</h2>
//                     <p className="template-library-guideline">
//                       Select or create your template and submit it for WhatsApp approval.
//                       All templates must adhere to{" "}
//                       <a
//                         href="https://support.wati.io/l/en/article/d0ewqzh7gv-how-to-avoid-template-message-rejection"
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="template-library-link"
//                       >
//                         WhatsApp's guidelines
//                       </a>
//                       .
//                     </p>
//                   </div>
//                   <div className="template-library-actions">
//                     <a
//                       href="https://www.youtube.com/watch?v=Zyk7bby9URE"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="template-library-tutorial"
//                     >
//                       <div className="tutorial-content">
//                         <svg
//                           width="27"
//                           height="27"
//                           viewBox="0 0 27 27"
//                           fill="none"
//                           xmlns="http://www.w3.org/2000/svg"
//                         >
//                           <circle cx="13.5" cy="13.5" r="13.5" fill="#269CFE"></circle>
//                           <path
//                             d="M17.8691 12.6344C18.5358 13.0193 18.5358 13.9815 17.8691 14.3664L12.0648 17.7176C11.3981 18.1025 10.5648 17.6214 10.5648 16.8516L10.5648 10.1493C10.5648 9.37948 11.3981 8.89836 12.0648 9.28326L17.8691 12.6344Z"
//                             fill="white"
//                           ></path>
//                         </svg>
//                         <span className="tutorial-text">Watch Tutorial</span>
//                       </div>
//                     </a>
//                     <button className="btn btn-success template-library-new-button" onClick={handleTemplateMessage}>New Template Message</button>
//                   </div>
//                 </div>
//               </div>

//               <div className="template-navigation-wrapper">
//                 <div className="template-navigation">
//                   <nav role="navigation" aria-label="Template Filter" className="template-nav">
//                     <ul className="template-nav-list">
//                       <li
//                         className={`template-nav-item ${selectedCategory === "All" ? "activeBroad" : ""}`}
//                         onClick={() => handleCategoryClick("All")}
//                       >
//                         <div className="template-tab">
//                           All
//                           <span className="template-count">{templates.length}</span>
//                         </div>
//                       </li>
//                       <li
//                         className={`template-nav-item ${selectedCategory === "Festival" ? "activeBroad" : ""}`}
//                         onClick={() => handleCategoryClick("Festival")}
//                       >
//                         <div className="template-tab">
//                           Festival
//                           <span className="template-count">{getCategoryCount("Festival")}</span>
//                         </div>
//                       </li>
//                       <li
//                         className={`template-nav-item ${selectedCategory === "Education" ? "activeBroad" : ""}`}
//                         onClick={() => handleCategoryClick("Education")}
//                       >
//                         <div className="template-tab">
//                           Education
//                           <span className="template-count">{getCategoryCount("Education")}</span>
//                         </div>
//                       </li>
//                       <li
//                         className={`template-nav-item ${selectedCategory === "E-Commerce" ? "activeBroad" : ""}`}
//                         onClick={() => handleCategoryClick("E-Commerce")}
//                       >
//                         <div className="template-tab">
//                           E-Commerce
//                           <span className="template-count">{getCategoryCount("E-Commerce")}</span>
//                         </div>
//                       </li>
//                       <li
//                         className={`template-nav-item ${selectedCategory === "Others" ? "activeBroad" : ""}`}
//                         onClick={() => handleCategoryClick("Others")}
//                       >
//                         <div className="template-tab">
//                           Others
//                           <span className="template-count">{getCategoryCount("Others")}</span>
//                         </div>
//                       </li>
//                     </ul>
//                   </nav>
//                 </div>
//                 <div className="template-search">
//                   <div className="search-input-wrap">
//                     <input
//                       type="text"
//                       placeholder="Search..."
//                       className="search-input template_Search_input"
//                       aria-label="Search Templates"
//                     />
//                     <button className="search-icon">
//                       <svg
//                         stroke="currentColor"
//                         fill="none"
//                         strokeWidth="2"
//                         viewBox="0 0 24 24"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         height="1em"
//                         width="1em"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <circle cx="11" cy="11" r="8"></circle>
//                         <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
//                       </svg>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//               <div className="template-card-container">
//                 <div className="template__template">
//                   <div className="template-card-section">
//                     {/* Map over filtered templates to display cards */}
//                     {filteredTemplates.map(template => (
//                       <div key={template.id} className="template-cards">
//                         <div className="template_card-wrapper">

//                           {template.img && (
//                             <div class="template_card-top-wrapper">
//                               <img src={template.img} alt={template.title} className="background-image" />
//                             </div>
//                           )}

//                           <div className="template_card-wrapper-content">
//                             <div className="template_header-content">
//                               <h4>{template.title}</h4>
//                               <span className="template_label">{template.category}</span>
//                             </div>
//                             <p className="template_content">
//                               {template.content
//                                 .replace('{{name}}', 'John Doe')
//                                 .replace('{{shop_name}}', 'Your Shop')
//                                 .split('\n')
//                                 .map((line, index) => (
//                                   <React.Fragment key={index}>
//                                     {line}
//                                     <br />
//                                   </React.Fragment>
//                                 ))}
//                             </p>
//                             <div className="template_button-container">
//                               <button className="template_use-sample-btn">Use sample</button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )
//         }


//       </div>
//     </>
//   )
// }
// export default TemplateLibrary;
