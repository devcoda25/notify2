import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Tooltip, TableContainer, Paper, Dialog, DialogTitle, DialogContent, Button, DialogActions
} from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import { config, deleteTemplatemodule, getAllTemplates } from "../../Url";
import NewTemplate from "./NewTemplate";

const templates = [
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
    img: 'https://img.freepik.com/free-photo/new-year-background_24972-1409.jpg?t=st=1730998908~exp=1731002508~hmac=9f484971e6d37d12e5b179a0d5eaefd9898b90b9a33d36ce724be43a69a5a4dd&amp;w=1800" alt="https://img.freepik.com/free-photo/new-year-background_24972-1409.jpg?t=st=1730998908~exp=1731002508~hmac=9f484971e6d37d12e5b179a0d5eaefd9898b90b9a33d36ce724be43a69a5a4dd&amp;w=1800'
  },
  {
    id: 3,
    title: 'New Course Announcement',
    category: 'Education',
    content: `🎓 *New Course Available: {{Course_Name}}*\n\nDear {{name}},\n\nWe’re excited to announce that we are offering a new course: *{{Course_Name}}*! Here are the details:\n\n- 🗓️ Start Date: {{Date}}\n- ⏰ Duration: {{Time}}\n- 💻 Mode: {{online}}\n- 📚 Key Topics: Topic 1, Topic 2, Topic 3\n- 📝 How to Enroll: {{url}}\n\nSeats are limited, so make sure to enroll as soon as possible. If you have any questions, feel free to reply to this message.\n\nBest regards,\n{{Company_Name}}`
  },
  {
    id: 4,
    title: 'Daily Schedule',
    category: 'Education',
    content: `📚 *Good morning, {{name}}!*\n\nHere’s your schedule for today:\n- Subject 1: {{Time}} - {{Topic}}\n- Subject 2: {{Time}} - {{Topic}}\n- Additional subjects if needed\n\nMaterials required:\n- Material 1\n- Material 2\n\nMake sure you’re prepared! If you have any questions, feel free to ask.\n\nBest of luck! 👍`
  },
  {
    id: 5,
    title: 'E-Commerce Tips',
    category: 'E-Commerce',
    content: 'Boost your sales with these strategies.'
  },
  {
    id: 6,
    title: 'Summer Sale',
    category: 'Others',
    content: 'Check out our amazing summer sale!'
  },
];

const TemplateLibrary = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isOpenTemplateMessage, setIsOpenTemplateMessage] = useState(false);
  const [templateData, setTemplateData] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);



  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleTemplateMessage = () => {
    setIsOpenTemplateMessage(true);
  };

  const fetchAllTemplates = async () => {
    try {
      const res = await axios.get(getAllTemplates(), config);
      const TemplateValues = res?.data?.data?.values || [];
      console.log("TemplateValues", TemplateValues)
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

  const filteredTemplates =
    selectedCategory === "All" ? [] : templates.filter((t) => t.category === selectedCategory);

  const handleView = (template) => {
    console.log("View", template);
  };

const handleUpdate = (template) => {
  console.log("template", template)
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
  } catch (error) {
    console.error("Error deleting template:", error);
  }
};


  return (
    <div> 
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

      {isOpenTemplateMessage ? (
        <NewTemplate
          isOpenTemplateMessage={isOpenTemplateMessage}
          setIsOpenTemplateMessage={setIsOpenTemplateMessage}
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
          fetchAllTemplates ={fetchAllTemplates}
        />
      ) : (
        <div className="Template_librabry-Container">
          <div className="template-library-wrapper">
            {/* Your header + tutorial + create button section (unchanged) */}
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
                    <button className="btn btn-success template-library-new-button" onClick={handleTemplateMessage}>New Template Message</button>
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

            {/* Your search input remains unchanged */}
             <div className="template-search">
                  <div className="search-input-wrap">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="search-input template_Search_input"
                      aria-label="Search Templates"
                    />
                    <button className="search-icon">
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
                    </button>
                  </div>
                </div>
          </div>

          <div className="template-card-container">
            {selectedCategory === "All" ? (
              <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
                <Table>
                  <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableRow>
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
                    {templateData.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell>{template.id}</TableCell>
                        <TableCell>{template.subject}</TableCell>
                        <TableCell
                          sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',}}
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
                            <IconButton onClick={() => handleView(template)} size="small">
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Update">
                            <IconButton onClick={() => handleUpdate(template)} size="small">
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                            onClick={() => {
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
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <div className="template__template">
                <div className="template-card-section">
                  {filteredTemplates.map((template) => (
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
                  ))}
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
