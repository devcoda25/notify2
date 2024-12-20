import React, { useState } from 'react'
import { MdKeyboardArrowDown } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import DataJsonFile from '../Data.json';
import { CgArrowLongLeft } from "react-icons/cg";
import { CgArrowLongRight } from "react-icons/cg";
import NewPopup from '../newpopup';
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {  Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import {  Table, TableBody, TableCell, TableHead, TablePagination, TableRow, IconButton, Tooltip ,Badge } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ReplyAllOutlinedIcon from '@mui/icons-material/ReplyAllOutlined';
import SendIcon from '@mui/icons-material/Send';
import LoopIcon from '@mui/icons-material/Loop';
import { MdClose  } from "react-icons/md";
import { Modal, ModalBody, ModalFooter } from 'react-bootstrap';
import sampleFile from '../Assets/img/Contact/Contacts_Upload_Sample.csv'
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { TextField } from "@mui/material";
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
const templateData = [

  {
    id: 1,
    templateName: "faff",
    category: "Marketing",
    status: "DRAFT",
    language: "English (US)",
    lastUpdated: "7/20/2024",
  },
  {
    id: 2,
    templateName: "aaa",
    category: "Marketing",
    status: "APPROVED",
    language: "English (US)",
    lastUpdated: "10/7/2024",
  },
  {
    id: 3,
    templateName: "faff",
    category: "Marketing",
    status: "DRAFT",
    language: "English (US)",
    lastUpdated: "7/20/2024",
  },
  {
    id: 4,
    templateName: "faff",
    category: "Marketing",
    status: "DRAFT",
    language: "English (US)",
    lastUpdated: "7/20/2024",
  },
  {
    id: 5,
    templateName: "faff",
    category: "Marketing",
    status: "APPROVED",
    language: "English (US)",
    lastUpdated: "7/20/2024",
  },
];


const data = [
  {
    broadcastName: "aaa_131220240958",
    date: "2024-12-13 07:29 AM",
    recipients: 1,
    successful: 100,
    read: 100,
    replied: 0,
    failedContacts: 0,
    failed: 0,
  },
  {
    broadcastName: "bbb_131220240959",
    date: "2024-12-13 08:30 AM",
    recipients: 2,
    successful: 100,
    read: 100,
    replied: 0,
    failedContacts: 1,
    failed: 0,
  },
];

const stats = [
  {  count: 1,  title: "Sent",  tooltip: "Messages that were sent",  rightIcon: <DoneIcon style={{ color: '#23A455' }} /> },
  { count: 1, title: "Delivered", tooltip: "Messages that were delivered to the device",  rightIcon:<DoneAllIcon style={{ color: '#23A455' }} />    },
  { count: 0, title: "Read", tooltip: "Messages that the users read. If read notifications are not enabled, the status shall not update here",  rightIcon:<VisibilityOutlinedIcon style={{ color: '#23A455' }} />  },
  { count: 0, title: "Replied", tooltip: "Messages to which users have replied",  rightIcon: <ReplyAllOutlinedIcon style={{ color: '#23A455' }} />},
  { count: 0, title: "Sending", tooltip: "Messages that are in the process of being sent",  rightIcon:<SendIcon style={{ color: '#23A455' }} />  },
  { count: 0, title: "Failed", tooltip: "Messages that failed to deliver either due to incorrect number or other errors",  rightIcon: (<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.51796 4.51898C6.02201 3.00511 8.00712 2.06343 10.1311 1.85629C12.255 1.64915 14.3846 2.18953 16.1529 3.38427C17.9211 4.57901 19.217 6.35324 19.8173 8.40108C20.4176 10.4489 20.2846 12.642 19.4413 14.6023C19.3534 14.7845 19.3246 14.9896 19.3588 15.189L20.1655 19.0665C20.1965 19.2151 20.1902 19.3692 20.147 19.5148C20.1038 19.6604 20.0251 19.793 19.918 19.9007C19.8301 19.9878 19.7256 20.0563 19.6106 20.102C19.4956 20.1477 19.3725 20.1696 19.2488 20.1665H19.0655L15.1421 19.3781C14.9427 19.3542 14.7405 19.3826 14.5555 19.4606C12.5952 20.304 10.4021 20.437 8.35422 19.8367C6.30638 19.2364 4.53216 17.9404 3.33741 16.1722C2.14267 14.404 1.60229 12.2743 1.80943 10.1504C2.01657 8.02648 2.95825 6.04137 4.47213 4.53732L4.51796 4.51898ZM3.75713 12.1823C3.93635 13.2768 4.36149 14.3164 5.00054 15.2228C5.63959 16.1292 6.47592 16.8789 7.44657 17.4154C8.41723 17.9519 9.49693 18.2613 10.6044 18.3202C11.7119 18.3792 12.8184 18.1861 13.8405 17.7557C14.203 17.6015 14.5924 17.5205 14.9863 17.5173C15.1584 17.5185 15.3301 17.5339 15.4996 17.5632L18.0846 18.0856L17.5621 15.5007C17.4581 14.9408 17.5251 14.3626 17.7546 13.8415C18.1851 12.8194 18.3781 11.7129 18.3192 10.6054C18.2603 9.49795 17.9509 8.41825 17.4144 7.4476C16.8779 6.47694 16.1282 5.64062 15.2218 5.00156C14.3154 4.36251 13.2758 3.93737 12.1813 3.75815C11.0325 3.56961 9.85524 3.65729 8.74702 4.01396C7.6388 4.37062 6.63142 4.98601 5.8082 5.80923C4.98499 6.63244 4.3696 7.63982 4.01293 8.74805C3.65627 9.85627 3.56858 11.0335 3.75713 12.1823Z" fill="#23A455"></path><path d="M10.504 11.2619L8.93246 12.8335L9.16797 13.069L10.7396 11.4974L11.2699 10.9671L11.8002 11.4974L13.3718 13.069L13.6073 12.8335L12.0357 11.2619L11.5054 10.7316L12.0357 10.2012L13.6073 8.62966L13.3718 8.39416L11.8002 9.96574L11.2699 10.4961L10.7396 9.96574L9.16797 8.39416L8.93246 8.62966L10.504 10.2012L11.0344 10.7316L10.504 11.2619Z" stroke="#23A455" stroke-width="1.5"></path></svg>)},
  { count: 0, title: "Processing", tooltip: "Messages that in the process",  rightIcon:<LoopIcon style={{ color: '#23A455' }} />  },
  { count: 0, title: "Queued", tooltip: "Messages that are in queue",  rightIcon: <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.8626 1.36479V1.92329H5.66616C3.79786 1.92329 2.2794 3.44174 2.2794 5.31004V6.96775H2.27495C2.07347 6.96775 1.91016 6.80444 1.91016 6.60296V1.36479C1.91016 1.16335 2.07351 1 2.27495 1H12.4978C12.6993 1 12.8626 1.16335 12.8626 1.36479Z" stroke="#23A455" stroke-width="2"></path><path d="M16.2532 5.31004V5.86853H9.50209C7.63381 5.86853 6.11533 7.3869 6.11533 9.25528V10.9129H5.66558C5.46413 10.9129 5.30078 10.7496 5.30078 10.5481V5.31004C5.30078 5.1086 5.46413 4.94525 5.66558 4.94525H15.8884C16.0899 4.94525 16.2532 5.10857 16.2532 5.31004Z" stroke="#23A455" stroke-width="2"></path><path d="M9.50542 8.89056H19.7283C19.9298 8.89056 20.0931 9.05388 20.0931 9.25536V14.4935C20.0931 14.695 19.9298 14.8583 19.7283 14.8583H9.50542C9.30398 14.8583 9.14062 14.695 9.14062 14.4935V9.25536C9.14062 9.05391 9.30398 8.89056 9.50542 8.89056Z" stroke="#23A455" stroke-width="2"></path></svg>},
];

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


const FilterBroadcastModal=({show, onClose}) => {
  const [filters, setFilters] = useState({
    PENDING: false,
    PROCESSING: false,
    COMPLETED: false,
    STOPPED: false,
  });

  const handleCheckboxChange = (filter) => {
    setFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };
  return(
    <Modal show={show} onHide={onClose} dialogClassName="Modal_container ">  
        <Modal.Header className='Modal-popup-header'> 
            <Modal.Title className='Modal-Popup-title' >Attributes</Modal.Title>
            <button className="Modal-close-btn" onClick={onClose} aria-label="Close">
                <MdClose />
            </button>
        </Modal.Header>
        <ModalBody className='Modal-popup-main broadcast-Modal-Main'>
          <div className="broadcast-modal-container">
            <div className="modal-description">Choose attributes to filter</div>
            <div className="filter-items">
              {Object.keys(filters).map((filter) => (
                <div className="broadcast-checkbox-container" key={filter}>
                  <div className="broadcast-checkbox-wrapper">
                    <div className="broadcast-checkbox-ui">
                      <input
                        type="checkbox"
                        className="hidden-checkbox"
                        checked={filters[filter]}
                        onChange={() => handleCheckboxChange(filter)}
                      />
                      <label
                        className={`broadcast-checkbox-label ${
                          filters[filter] ? "checked" : ""
                        }`}
                        onClick={() => handleCheckboxChange(filter)}
                      ></label>
                      <span className='broadcast-lable-text'>{filter}</span>
                    </div>
                  </div>
                </div>
              ))}
          
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="Modal-popup-footer"> 
        <button className='btn btn-success' >
            save
        </button>
        </ModalFooter>     
    </Modal>
)
}

const BroadcastModal=({show, onClose}) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = sampleFile;
    link.download = "sample.csv"; 
    link.click();
  };
  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(5); 
  const totalRows = 5;

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };
  const [selectedFilter, setSelectedFilter] = useState("Replied"); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setIsDropdownOpen(false); 
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const dropdownOptions = [
    "Select All",
    "Queued",
    "Pending",
    "Sending",
    "Delivered",
    "Failed",
    "Read",
    "Replied",
  ];

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxClick = () => {
      setIsChecked(!isChecked);
  };

  return(

    <Modal show={show} onHide={onClose} dialogClassName="Modal_container Broadcast__popup main-modal-wrapper"> 
    <div className='Broadcast-popup-Modal-section'>
      <Modal.Header className='Modal-popup-header'> 
          <Modal.Title className='Modal-Popup-title' >
            <span>Statistic  </span>
            <span>fordfdf_161220241259 </span>
            <span>broadcast</span>
        </Modal.Title>
          <button className="Modal-close-btn" onClick={onClose} aria-label="Close">
              <MdClose />
          </button>
      </Modal.Header>
      <ModalBody className='Modal-popup-main  broadcast-Modal-Main'>
        <div className="overview-container Broadcast-Popup-Container">
          <h3 className="overview-header">Contact : 1</h3>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div className="stat-item" key={index}>
                <div className="info-box__left">
                  <div className="info-box__count">{stat.count}</div>
                  <div className="info-box__title">
                    {stat.title}
                    
                  </div>
                </div>
                <div className="info-box__right">{stat.rightIcon}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="custom-table-header">
          <div className="broadcast-checkbox-container">
              <div className="broadcast-checkbox-wrapper">
                  <div className="broadcast-checkbox-ui">
                      <input 
                          type="checkbox"
                          className="hidden-checkbox"
                          checked={isChecked}
                          onChange={handleCheckboxClick} 
                      />
                      <label 
                          className={`broadcast-checkbox-label ${isChecked ? 'checked' : ''}`} 
                          onClick={handleCheckboxClick} 
                      ></label>
                  </div>
              </div>
          </div>
          <div className="custom-header-field">Contact</div>
          <div className="custom-header-field">Phone</div>
          <div className="custom-header-field">Status</div>
          <div className="custom-header-field">Reason</div>
          <div className="custom-filter"> 
            <div  className="custom-filter-dropdown"> 
            <div className="custom-filter-item" onClick={toggleDropdown}>
              <span>{selectedFilter}</span>
              <div className="custom-filter-icon">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
                </svg>
              </div>
            </div> 
            
            {isDropdownOpen && ( 
              <div className="custom-filter-dropdown-menu"> 
                {dropdownOptions.map((option) => ( 
                  <div key={option} className={`custom-filter-item ${ selectedFilter===option ? "selected" : "" }`} onClick={()=> handleFilterChange(option)} > 
                  {option} 
                  </div> 
                ))} 
                </div> 
              )} 
                </div>
          </div>  
        </div>
        <div className="broadcast__popup-row">
          <div className="broadcast__popup-section">
            <div className="broadcast-checkbox-container">
                <div className="broadcast-checkbox-wrapper">
                    <div className="broadcast-checkbox-ui">
                        <input 
                            type="checkbox"
                            className="hidden-checkbox"
                            checked={isChecked}
                            onChange={handleCheckboxClick} 
                        />
                        <label 
                            className={`broadcast-checkbox-label ${isChecked ? 'checked' : ''}`} 
                            onClick={handleCheckboxClick} 
                        ></label>
                    </div>
                </div>
            </div>
            <div className="broadcast__row-field" data-label="Contact">
              Siva
            </div>
            <div className="broadcast__row-field" data-label="Phone">
              919566585747
            </div>
            <div className="broadcast__row-field" data-label="Status">
              <div className="broadcast__status">
                <div className="broadcast__status-text">REPLIED</div>
              </div>
            </div>
            <div className="broadcast__row-field" data-label="Reason">
            </div>
            <div className="broadcast__row-field"></div>
          </div>
        </div>
        <div className="pagination-wrapper">
          <div className='sequence__pagination broadcast-pagination'>
              <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 100]}
                  count={totalRows} 
                  page={page} 
                  onPageChange={handlePageChange} 
                  rowsPerPage={rowsPerPage} 
                  onRowsPerPageChange={handleRowsPerPageChange} 
                  ActionsComponent={() => (
                      <div className='tablepagination__action'>
                          <p  className="Previouspage Pagintaion__action " aria-label="Go to previous page" title="Go to previous page">
                              <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 24 24" className="leftRightArrow" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M1.02698 11.9929L5.26242 16.2426L6.67902 14.8308L4.85766 13.0033L22.9731 13.0012L22.9728 11.0012L4.85309 11.0033L6.6886 9.17398L5.27677 7.75739L1.02698 11.9929Z" fill="currentColor"></path>
                              </svg>
                              <span className="pagination_previousnextcont" >Previous</span>
                          </p>
                          <p  className="nextPage Pagintaion__action  "  aria-label="Go to next page" title="Go to next page">
                              <span className="pagination_previousnextcont" >Next</span>
                              <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 24 24" className="leftRightArrow" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M23.0677 11.9929L18.818 7.75739L17.4061 9.17398L19.2415 11.0032L0.932469 11.0012L0.932251 13.0012L19.2369 13.0032L17.4155 14.8308L18.8321 16.2426L23.0677 11.9929Z" fill="currentColor"></path>
                              </svg>
                          </p>     
                      </div>
                  )}
                  sx={{
                      '.MuiTablePagination-displayedRows': {
                          fontSize: '1.2rem',
                          margin: '0px',
                          color: 'rgb(51, 51, 51)'
                      },
                      '.MuiSelect-nativeInput': {
                          padding: '0px 1rem',
                          height: '3rem',
                          margin: '0 0 8px 0px',
                      },
                      '.MuiInputBase-root': {
                          fontSize: '1.2rem',
                          paddingRight: '0',
                      },
                      '.MuiTablePagination-selectLabel': {
                          fontSize: '1.2rem',
                          margin: '0px',
                          color: 'rgb(51, 51, 51)',
                      },
                  }}
              />
          </div>
        </div>
      </ModalBody>
      <ModalFooter className="Modal-popup-footer broadcast-Modal-buttons"> 
      <Tooltip title="Please contact support@wati.io to enable Send SMS" arrow>
      <button className='btn btn-secondary send-sms-btn' >
      send sms 
      </button>
    
      </Tooltip>
      <button className='btn btn-success Export-csv-btn '  onClick={handleDownload}>
      Export to CSV
      </button>
      </ModalFooter>    
      </div>
</Modal>
  )
}

const EditBroadcastModal = ({ show, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedTime, setSelectedTime] = useState(dayjs());

  return (
    <Modal show={show} onHide={onClose} dialogClassName="Modal_container edit__Broadcast__popup main-modal-wrapper">
      <Modal.Header className='Modal-popup-header'>
        <Modal.Title className='Modal-Popup-title'>Edit Broadcast</Modal.Title>
        <button className="Modal-close-btn" onClick={onClose} aria-label="Close">
          <MdClose />
        </button>
      </Modal.Header>
      <ModalBody className='Modal-popup-main broadcast-Modal-Main'>
        <div className="broadcast__input_name_container">
          <h4 className="broadcast-name__title">Broadcast name</h4>
          <div width="285px" height="40px" className="ui input  broadcast-name__input">
            <input
              placeholder="Broadcast name"
              type="text"
              value="fdadfa_171220241446"
            />
          </div>
        </div>

        <div className="broadcast-date-container">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Select Date"
              value={selectedDate}
              className=' datepicker'
              onChange={(newValue) => {
                if (newValue && !newValue.isValid()) {
                  console.error("Invalid Date Selected!");
                  setSelectedDate(null); 
                } else {
                  setSelectedDate(newValue);
                }
              }}
              renderInput={(params) => <TextField {...params} />}
            />
            <TimePicker
              label="Time (GMT+3)"
              value={selectedTime} 
              onChange={(newTime) => setSelectedTime(newTime)} 
              className="datepicker"
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </div>
      </ModalBody>
      <ModalFooter className="Modal-popup-footer broadcast-Modal-buttons">
        <button className="btn btn-success save-btn" > Save </button>
      </ModalFooter>
    </Modal>
  );
};
const FilterTemplateModal=({show, onClose}) => {
  const [filters, setFilters] = useState({
    DRAFT: true,
    PENDING: true,
    APPROVED: true,
    REJECTED: true,
    DELETED: false,
    PAUSED:false,
    DISABLED:false,
  });

  const handleCheckboxChange = (filter) => {
    setFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };
  return(
    <Modal show={show} onHide={onClose} dialogClassName="Modal_container  main-modal-wrapper"> 
    <Modal.Header className='Modal-popup-header'> 
          <Modal.Title className='Modal-Popup-title' >Attributes</Modal.Title>
          <button className="Modal-close-btn" onClick={onClose} aria-label="Close">
              <MdClose />
          </button>
      </Modal.Header>
      <ModalBody className='Modal-popup-main  broadcast-Modal-Main'>
        <div className="template__Filter-body-Main"> 
          <div className="broadcast-modal-container">
            <div className="modal-description">Choose attributes to filter</div>
            <div className="filter-items">
              {Object.keys(filters).map((filter) => (
                <div className="broadcast-checkbox-container" key={filter}>
                  <div className="broadcast-checkbox-wrapper">
                    <div className="broadcast-checkbox-ui">
                      <input
                        type="checkbox"
                        className="hidden-checkbox"
                        checked={filters[filter]}
                        onChange={() => handleCheckboxChange(filter)}
                      />
                      <label
                        className={`broadcast-checkbox-label ${
                          filters[filter] ? "checked" : ""
                        }`}
                        onClick={() => handleCheckboxChange(filter)}
                      ></label>
                      <span className='broadcast-lable-text'>{filter}</span>
                    </div>
                  </div>
                </div>
              ))}
          
            </div>
          </div>
          </div>
      </ModalBody>
      <ModalFooter className="Modal-popup-footer broadcast-Modal-buttons"> 
        <button class="btn btn-success save-btn"> Save </button>
      </ModalFooter>    
    </Modal>
)}

const TemplateSubmitModal=({show, onClose}) => {
  
  return(
    <Modal show={show} onHide={onClose} dialogClassName="Modal_container Template__Sumbit_popup  main-modal-wrapper"> 
    <Modal.Header className='Modal-popup-header'> 
          <Modal.Title className='Modal-Popup-title' >submit</Modal.Title>
      </Modal.Header>
      <ModalBody className='Modal-popup-main  broadcast-Modal-Main'>
        <div>Do you want to submit this message for validation?</div>
        <div class="warning-message">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.9987 1.20856C17.9592 1.20856 22.7904 6.04089 22.7904 12.0002C22.7904 17.9596 17.9592 22.7919 11.9987 22.7919C6.03937 22.7919 1.20703 17.9596 1.20703 12.0002C1.20703 6.04089 6.03937 1.20856 11.9987 1.20856Z" stroke="#637E73" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.9935 7.57166V12.7272" stroke="#637E73" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.9916 16.4288H12.0032" stroke="#637E73" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          Make sure you have chosen a category that matches the content in the template to avoid rejection of template
        </div>
      </ModalBody>
      <ModalFooter className="Modal-popup-footer broadcast-Modal-buttons"> 
      <button class="add-attribute-btn add-submit-btn" onClick={onClose}> cancel </button>
        <button class="btn btn-success save-btn"> Yes </button>
      </ModalFooter>    
    </Modal>
)}
const TemplateDeleteModal=({show, onClose}) => {

  return(
    <Modal show={show} onHide={onClose} dialogClassName="Modal_container Template__Delete_popup  main-modal-wrapper"> 
    <Modal.Header className='Modal-popup-header'> 
          <Modal.Title className='Modal-Popup-title' >Confirm</Modal.Title>
      </Modal.Header>
      <ModalBody className='Modal-popup-main  broadcast-Modal-Main'>
        <div class="confirm-msg">Do you want to remove this template   message?</div>
      </ModalBody>
      <ModalFooter className="Modal-popup-footer broadcast-Modal-buttons"> 
      <button class="add-attribute-btn add-cancel-btn" onClick={onClose}> cancel </button>
        <button class="btn btn-danger contact-Delete-confirm-btn"> Yes </button>
      </ModalFooter>    
    </Modal>
)}
const ScheduleDeleteModal=({show, onClose}) => {

  return(
    <Modal show={show} onHide={onClose} dialogClassName="Modal_container Template__Delete_popup  main-modal-wrapper"> 
    <Modal.Header className='Modal-popup-header'> 
          <Modal.Title className='Modal-Popup-title' >Confirm</Modal.Title>
      </Modal.Header>
      <ModalBody className='Modal-popup-main  broadcast-Modal-Main'>
        <div class="confirm-msg">Do you want to delete this broadcast?</div>
      </ModalBody>
      <ModalFooter className="Modal-popup-footer broadcast-Modal-buttons"> 
      <button class="add-attribute-btn add-cancel-btn" onClick={onClose}> cancel </button>
        <button class="btn btn-danger contact-Delete-confirm-btn"> Yes </button>
      </ModalFooter>    
    </Modal>
)}
const BroadcastBody = () => {

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectCount, setSelectCount] = useState(false);

  const [selectNumber, setSelectNumber] = useState(5);
  const [pageNum, setPageNum] = useState(1);
  const [pageLastNum, setPageLastNum] = useState(5);
  const [pageTotalNum, setPageTotalNum] = useState(127);

  const [copyIconHover, setCopyIconHover] = useState(null);
  const [deleteIconHover, setDeleteIconHover] = useState(null);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const [checkedValues, setCheckedValues] = useState([]);

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setCheckedValues([...checkedValues, value]);
    } else {
      setCheckedValues(checkedValues.filter(item => item !== value));
    }
  };
  const [activeTab, setActiveTab] = useState("yourTemplate"); 

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };


  const filteredTemplates =
    selectedCategory === "All"
      ? templates
      : templates.filter((template) => template.category === selectedCategory);

  const getCategoryCount = (category) => {
    return templates.filter((template) => template.category === category).length;
  };

  const [dateFrom, setDateFrom] = useState(dayjs('12/11/2024')); 
  const [dateTo, setDateTo] =  useState(dayjs('13/11/2024'));
  const [range, setRange] = useState("custom");

  const handleRangeChange = (event) => {
    setRange(event.target.value);
  };
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);

  const toggleFilterPopup = () => {
    setIsFilterPopupOpen(!isFilterPopupOpen);
  };
  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(5); 
  const totalRows = 5;

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };


  const [isOpenBroadcastModal, setIsOpenBroadcastModal] = useState(false);

    const OpenBroadcastModal = () => {
      setIsOpenBroadcastModal(true);
    };

    const closeBroadcastModal = () => {
      setIsOpenBroadcastModal(false);
    };

    const handleDownload = () => {
      const link = document.createElement("a");
      link.href = sampleFile;
      link.download = "sample.csv"; 
      link.click();
    };
    const [tooltipText, setTooltipText] = useState("Last updated 33 minutes ago");

    const handleClick = () => {
      setTooltipText("Just now");
    };
    const [isEditBroadcastModal, setIsEditBroadcast] = useState(false);
    
    const OpenEditBroadcastModal = () => {
      setIsEditBroadcast(true);
    };

    const closeEditBroadcastModal = () => {
      setIsEditBroadcast(false);
    };

    const handleInputChange = (event) => {
      setSearchValue(event.target.value);
    };
    const allOptions = ["Lastest", "Oldest"];
    const [selectedOption, setSelectedOption] = useState("Lastest");
    const filteredOptions = allOptions.filter(option => option !== selectedOption);
    const handleOptionSelect = (option) => {
      setSelectedOption(option); 
      setDropdownOpen(false); 
    };
    const [isOpenFilterModal, setIsOpenFilterModal] = useState(false);

    const OpenFilterModal = () => {
      setIsOpenFilterModal(true);
    };

    const closeFilterModal = () => {
      setIsOpenFilterModal(false);
    };
    const [isOpenSubmitModal, setIsOpenSubmitModal] = useState(false);

    const OpenSubmitModal = () => {
      setIsOpenSubmitModal(true);
    };

    const closeSubmitModal = () => {
      setIsOpenSubmitModal(false);
    };
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

    const OpenDeleteModal = () => {
      setIsOpenDeleteModal(true);
    };

    const closeDeleteModal = () => {
      setIsOpenDeleteModal(false);
    };
    const [isOpenScheduleDeleteModal, setIsOpeSchedulenDeleteModal] = useState(false);

    const OpenScheduleDeleteModal = () => {
      setIsOpeSchedulenDeleteModal(true);
    };

    const closeScheduleDeleteModal = () => {
      setIsOpeSchedulenDeleteModal(false);
    };
  return (
    <div className='main-contact-wrapper main-modal-wrapper broadcast_wrapper '>
      <div className='msgCont'>
        <div className='msgContL broadcast__left__content'>
          <li className="solo">
            <a onClick={() => handleTabClick("yourTemplate")}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 3.125C0 2.2962 0.32924 1.50134 0.915291 0.915291C1.50134 0.32924 2.2962 0 3.125 0H14.375C15.2038 0 15.9987 0.32924 16.5847 0.915291C17.1708 1.50134 17.5 2.2962 17.5 3.125V7.54375C17.293 7.51438 17.0841 7.49976 16.875 7.5H16.25V3.125C16.25 2.62772 16.0525 2.15081 15.7008 1.79917C15.3492 1.44754 14.8723 1.25 14.375 1.25H3.125C2.62772 1.25 2.15081 1.44754 1.79917 1.79917C1.44754 2.15081 1.25 2.62772 1.25 3.125V14.375C1.25 14.8723 1.44754 15.3492 1.79917 15.7008C2.15081 16.0525 2.62772 16.25 3.125 16.25H5V16.875C5 17.0875 5.015 17.2962 5.04375 17.5H3.125C2.2962 17.5 1.50134 17.1708 0.915291 16.5847C0.32924 15.9987 0 15.2038 0 14.375V3.125ZM13.75 6.875C13.75 7.04076 13.6842 7.19973 13.5669 7.31694C13.4497 7.43415 13.2908 7.5 13.125 7.5H6.875C6.70924 7.5 6.55027 7.43415 6.43306 7.31694C6.31585 7.19973 6.25 7.04076 6.25 6.875C6.25 6.70924 6.31585 6.55027 6.43306 6.43306C6.55027 6.31585 6.70924 6.25 6.875 6.25H13.125C13.2908 6.25 13.4497 6.31585 13.5669 6.43306C13.6842 6.55027 13.75 6.70924 13.75 6.875ZM3.75 4.375C3.75 4.20924 3.81585 4.05027 3.93306 3.93306C4.05027 3.81585 4.20924 3.75 4.375 3.75H13.125C13.2908 3.75 13.4497 3.81585 13.5669 3.93306C13.6842 4.05027 13.75 4.20924 13.75 4.375C13.75 4.54076 13.6842 4.69973 13.5669 4.81694C13.4497 4.93415 13.2908 5 13.125 5H4.375C4.20924 5 4.05027 4.93415 3.93306 4.81694C3.81585 4.69973 3.75 4.54076 3.75 4.375ZM6.25 11.875C6.25 11.0462 6.57924 10.2513 7.16529 9.66529C7.75134 9.07924 8.5462 8.75 9.375 8.75H16.875C17.7038 8.75 18.4987 9.07924 19.0847 9.66529C19.6708 10.2513 20 11.0462 20 11.875V16.875C20 17.7038 19.6708 18.4987 19.0847 19.0847C18.4987 19.6708 17.7038 20 16.875 20H9.375C8.5462 20 7.75134 19.6708 7.16529 19.0847C6.57924 18.4987 6.25 17.7038 6.25 16.875V11.875ZM9.375 10C8.93598 9.99991 8.51084 10.1539 8.17368 10.4351C7.83653 10.7163 7.60873 11.1068 7.53 11.5387L13.125 14.8962L18.72 11.5387C18.6413 11.1068 18.4135 10.7163 18.0763 10.4351C17.7392 10.1539 17.314 9.99991 16.875 10H9.375ZM7.5 16.875C7.5 17.3723 7.69754 17.8492 8.04917 18.2008C8.40081 18.5525 8.87772 18.75 9.375 18.75H16.875C17.3723 18.75 17.8492 18.5525 18.2008 18.2008C18.5525 17.8492 18.75 17.3723 18.75 16.875V12.9788L13.4462 16.1612C13.3492 16.2194 13.2382 16.2501 13.125 16.2501C13.0118 16.2501 12.9008 16.2194 12.8038 16.1612L7.5 12.9788V16.875Z" fill="#666"></path></svg>
              <span className="templateMessagesSvg">Template Messages</span>
            </a>
            <div className="templateContent">
              <a onClick={() => handleTabClick("templateLibrary")} className={` ${activeTab === "templateLibrary" ? "active" : ""}`}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 3.125C0 2.2962 0.32924 1.50134 0.915291 0.915291C1.50134 0.32924 2.2962 0 3.125 0H14.375C15.2038 0 15.9987 0.32924 16.5847 0.915291C17.1708 1.50134 17.5 2.2962 17.5 3.125V7.54375C17.293 7.51438 17.0841 7.49976 16.875 7.5H16.25V3.125C16.25 2.62772 16.0525 2.15081 15.7008 1.79917C15.3492 1.44754 14.8723 1.25 14.375 1.25H3.125C2.62772 1.25 2.15081 1.44754 1.79917 1.79917C1.44754 2.15081 1.25 2.62772 1.25 3.125V14.375C1.25 14.8723 1.44754 15.3492 1.79917 15.7008C2.15081 16.0525 2.62772 16.25 3.125 16.25H5V16.875C5 17.0875 5.015 17.2962 5.04375 17.5H3.125C2.2962 17.5 1.50134 17.1708 0.915291 16.5847C0.32924 15.9987 0 15.2038 0 14.375V3.125ZM13.75 6.875C13.75 7.04076 13.6842 7.19973 13.5669 7.31694C13.4497 7.43415 13.2908 7.5 13.125 7.5H6.875C6.70924 7.5 6.55027 7.43415 6.43306 7.31694C6.31585 7.19973 6.25 7.04076 6.25 6.875C6.25 6.70924 6.31585 6.55027 6.43306 6.43306C6.55027 6.31585 6.70924 6.25 6.875 6.25H13.125C13.2908 6.25 13.4497 6.31585 13.5669 6.43306C13.6842 6.55027 13.75 6.70924 13.75 6.875ZM3.75 4.375C3.75 4.20924 3.81585 4.05027 3.93306 3.93306C4.05027 3.81585 4.20924 3.75 4.375 3.75H13.125C13.2908 3.75 13.4497 3.81585 13.5669 3.93306C13.6842 4.05027 13.75 4.20924 13.75 4.375C13.75 4.54076 13.6842 4.69973 13.5669 4.81694C13.4497 4.93415 13.2908 5 13.125 5H4.375C4.20924 5 4.05027 4.93415 3.93306 4.81694C3.81585 4.69973 3.75 4.54076 3.75 4.375ZM6.25 11.875C6.25 11.0462 6.57924 10.2513 7.16529 9.66529C7.75134 9.07924 8.5462 8.75 9.375 8.75H16.875C17.7038 8.75 18.4987 9.07924 19.0847 9.66529C19.6708 10.2513 20 11.0462 20 11.875V16.875C20 17.7038 19.6708 18.4987 19.0847 19.0847C18.4987 19.6708 17.7038 20 16.875 20H9.375C8.5462 20 7.75134 19.6708 7.16529 19.0847C6.57924 18.4987 6.25 17.7038 6.25 16.875V11.875ZM9.375 10C8.93598 9.99991 8.51084 10.1539 8.17368 10.4351C7.83653 10.7163 7.60873 11.1068 7.53 11.5387L13.125 14.8962L18.72 11.5387C18.6413 11.1068 18.4135 10.7163 18.0763 10.4351C17.7392 10.1539 17.314 9.99991 16.875 10H9.375ZM7.5 16.875C7.5 17.3723 7.69754 17.8492 8.04917 18.2008C8.40081 18.5525 8.87772 18.75 9.375 18.75H16.875C17.3723 18.75 17.8492 18.5525 18.2008 18.2008C18.5525 17.8492 18.75 17.3723 18.75 16.875V12.9788L13.4462 16.1612C13.3492 16.2194 13.2382 16.2501 13.125 16.2501C13.0118 16.2501 12.9008 16.2194 12.8038 16.1612L7.5 12.9788V16.875Z" fill="#666"></path></svg>
                <span className="templateMessagesSvg">Template Library</span>
              </a>
              <a  onClick={() => handleTabClick("yourTemplate")} className={` ${activeTab === "yourTemplate" ? "active" : ""}`}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 3.125C0 2.2962 0.32924 1.50134 0.915291 0.915291C1.50134 0.32924 2.2962 0 3.125 0H14.375C15.2038 0 15.9987 0.32924 16.5847 0.915291C17.1708 1.50134 17.5 2.2962 17.5 3.125V7.54375C17.293 7.51438 17.0841 7.49976 16.875 7.5H16.25V3.125C16.25 2.62772 16.0525 2.15081 15.7008 1.79917C15.3492 1.44754 14.8723 1.25 14.375 1.25H3.125C2.62772 1.25 2.15081 1.44754 1.79917 1.79917C1.44754 2.15081 1.25 2.62772 1.25 3.125V14.375C1.25 14.8723 1.44754 15.3492 1.79917 15.7008C2.15081 16.0525 2.62772 16.25 3.125 16.25H5V16.875C5 17.0875 5.015 17.2962 5.04375 17.5H3.125C2.2962 17.5 1.50134 17.1708 0.915291 16.5847C0.32924 15.9987 0 15.2038 0 14.375V3.125ZM13.75 6.875C13.75 7.04076 13.6842 7.19973 13.5669 7.31694C13.4497 7.43415 13.2908 7.5 13.125 7.5H6.875C6.70924 7.5 6.55027 7.43415 6.43306 7.31694C6.31585 7.19973 6.25 7.04076 6.25 6.875C6.25 6.70924 6.31585 6.55027 6.43306 6.43306C6.55027 6.31585 6.70924 6.25 6.875 6.25H13.125C13.2908 6.25 13.4497 6.31585 13.5669 6.43306C13.6842 6.55027 13.75 6.70924 13.75 6.875ZM3.75 4.375C3.75 4.20924 3.81585 4.05027 3.93306 3.93306C4.05027 3.81585 4.20924 3.75 4.375 3.75H13.125C13.2908 3.75 13.4497 3.81585 13.5669 3.93306C13.6842 4.05027 13.75 4.20924 13.75 4.375C13.75 4.54076 13.6842 4.69973 13.5669 4.81694C13.4497 4.93415 13.2908 5 13.125 5H4.375C4.20924 5 4.05027 4.93415 3.93306 4.81694C3.81585 4.69973 3.75 4.54076 3.75 4.375ZM6.25 11.875C6.25 11.0462 6.57924 10.2513 7.16529 9.66529C7.75134 9.07924 8.5462 8.75 9.375 8.75H16.875C17.7038 8.75 18.4987 9.07924 19.0847 9.66529C19.6708 10.2513 20 11.0462 20 11.875V16.875C20 17.7038 19.6708 18.4987 19.0847 19.0847C18.4987 19.6708 17.7038 20 16.875 20H9.375C8.5462 20 7.75134 19.6708 7.16529 19.0847C6.57924 18.4987 6.25 17.7038 6.25 16.875V11.875ZM9.375 10C8.93598 9.99991 8.51084 10.1539 8.17368 10.4351C7.83653 10.7163 7.60873 11.1068 7.53 11.5387L13.125 14.8962L18.72 11.5387C18.6413 11.1068 18.4135 10.7163 18.0763 10.4351C17.7392 10.1539 17.314 9.99991 16.875 10H9.375ZM7.5 16.875C7.5 17.3723 7.69754 17.8492 8.04917 18.2008C8.40081 18.5525 8.87772 18.75 9.375 18.75H16.875C17.3723 18.75 17.8492 18.5525 18.2008 18.2008C18.5525 17.8492 18.75 17.3723 18.75 16.875V12.9788L13.4462 16.1612C13.3492 16.2194 13.2382 16.2501 13.125 16.2501C13.0118 16.2501 12.9008 16.2194 12.8038 16.1612L7.5 12.9788V16.875Z" fill="#666"></path></svg>
                <span className="templateMessagesSvg">Your Template</span>
              </a>
            </div>
          </li>
          <li className="solo"><a  onClick={() => handleTabClick("Broadcast Analytics")} className={` ${activeTab === "Broadcast Analytics" ? "active" : ""}`}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.0312 9.67641V9.98707L10.2509 10.2067L13.095 13.0508C13.1073 13.0631 13.1072 13.0828 13.0951 13.095L13.095 13.095C13.0828 13.1072 13.063 13.1072 13.0508 13.095L9.97791 10.0221L9.97784 10.022C9.97207 10.0163 9.96875 10.0083 9.96875 10V5.39062C9.96875 5.37335 9.98273 5.35938 10 5.35938C10.0173 5.35938 10.0312 5.37335 10.0312 5.39062V9.67641ZM1.63473 1.69836V3.34451L2.87688 2.2643C4.02874 1.26261 5.46716 0.75 6.92707 0.75H13.0729C16.4783 0.75 19.25 3.52167 19.25 6.92707V13.0729C19.25 16.4783 16.4783 19.25 13.0729 19.25H6.92707C3.52167 19.25 0.75 16.4783 0.75 13.0729V10C0.75 9.98273 0.763979 9.96875 0.78125 9.96875C0.798521 9.96875 0.8125 9.98273 0.8125 10V13.0729C0.8125 16.4452 3.55481 19.1875 6.92707 19.1875H13.0729C16.4452 19.1875 19.1875 16.4452 19.1875 13.0729V6.92707C19.1875 3.55481 16.4452 0.8125 13.0729 0.8125H6.92707C5.32361 0.8125 3.80341 1.448 2.67801 2.53299L1.57223 3.59907V0.78125C1.57223 0.763979 1.58621 0.75 1.60348 0.75C1.62075 0.75 1.63473 0.763979 1.63473 0.78125V1.69836ZM1.57223 3.85418V3.82293H3.19855H4.67641C4.69368 3.82293 4.70766 3.83691 4.70766 3.85418C4.70766 3.87145 4.69368 3.88543 4.67641 3.88543H1.60348C1.59706 3.88543 1.58965 3.8834 1.5818 3.87558C1.57797 3.87175 1.57553 3.86783 1.57417 3.86465C1.57305 3.86202 1.57223 3.85897 1.57223 3.85418Z" stroke="#666" stroke-width="1.5"></path></svg><span className="svgSpan">Broadcast Analytics</span></a></li>
          <li className="solo"><a  onClick={() => handleTabClick("Scheduled Broadcasts")} className={` ${activeTab === "Scheduled Broadcasts" ? "active" : ""}`}><svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.3035 20.125H4.79167C4.28333 20.125 3.79582 19.923 3.43638 19.5636C3.07693 19.2041 2.875 18.7166 2.875 18.2083V6.70829C2.875 6.19996 3.07693 5.71245 3.43638 5.353C3.79582 4.99356 4.28333 4.79163 4.79167 4.79163H16.2917C16.8 4.79163 17.2875 4.99356 17.647 5.353C18.0064 5.71245 18.2083 6.19996 18.2083 6.70829V10.5416" stroke="#666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M17.2474 21.0833C19.3645 21.0833 21.0807 19.3671 21.0807 17.25C21.0807 15.1329 19.3645 13.4166 17.2474 13.4166C15.1303 13.4166 13.4141 15.1329 13.4141 17.25C13.4141 19.3671 15.1303 21.0833 17.2474 21.0833Z" stroke="#666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M14.375 2.875V6.70833" stroke="#666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6.71094 2.875V6.70833" stroke="#666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M2.875 10.5416H18.2083" stroke="#666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M17.25 15.8087V17.25L18.2083 18.2083" stroke="#666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg><span className="templateMessagesSvg">Scheduled Broadcasts</span></a></li>
        </div>
       
        {activeTab === "yourTemplate" && (
          <> 
           <div className='msgContR Template-Left-container '> 
            <div className='your__template_top_section'> 
              <div className="template-library-wrapper">
                <div className="template-library-intro">
                  <div className="template-library-header">
                    <h2 className="template-library-title">Your Templates</h2>
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
                    <button className="btn btn-success template-library-new-button">New Template Message</button>
                  </div>
                </div>
              </div>
              <div className='your__template_left_section'>
                <div className="custom-action-bar-search">
                  <div className="custom-search-input-container"   data-testid="custom-search-bar-input">
                      <div className="custom-input-wrap">
                      <input
                          type="text"
                          className="custom-search-input"
                          placeholder="Search..."
                          value={searchValue} 
                          onChange={handleInputChange}
                          data-testid="custom-search-input"
                      />
                      <div tabIndex="0" className="custom-search-icon">
                      <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                      </div>
                      </div>
                  </div>
                </div>
                <div className="your-template-filter">
                  <span aria-label="Filter contacts..." onClick={OpenFilterModal}>
                      <div className="custom-filter-button" role="button" tabIndex="0" aria-label="Open Filter" data-testid="custom-filter-button" >
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.1169 17.9867H2.88281" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                          <path fillRule="evenodd" clipRule="evenodd" d="M21.1174 17.9864C21.1174 19.577 19.828 20.8664 18.2374 20.8664C16.6468 20.8664 15.3574 19.577 15.3574 17.9864C15.3574 16.3947 16.6468 15.1064 18.2374 15.1064C19.828 15.1064 21.1174 16.3947 21.1174 17.9864Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                          <path d="M13.8828 6.26206H21.1181" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path fillRule="evenodd" clipRule="evenodd" d="M2.88281 6.26208C2.88281 7.85384 4.17222 9.14208 5.76281 9.14208C7.3534 9.14208 8.64281 7.85384 8.64281 6.26208C8.64281 4.67149 7.3534 3.38208 5.76281 3.38208C4.17222 3.38208 2.88281 4.67149 2.88281 6.26208Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                      </svg>
                      <Badge
                        badgeContent={4}
                        className='filter-button'
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        style={{
                          top: '-18px',
                          left: '5px',
                        }}
                      >
                      </Badge>
                      </div>
                  </span>
                </div>
                <div className='actionbar-sort'>
                    <div className="actionbar-sort-container">
                        <div className="actionbar-sort-title">
                        Sorted by:
                        </div>
                        <div className={`contact-custom-dropdown ${ isDropdownOpen ? "contact-dropdown-active" : "" }`}
                        role="menu"
                        tabIndex="0"
                        onClick={() => setDropdownOpen(!isDropdownOpen)}
                        >
                            <div className="contact-dropdown-header">
                                <span>{selectedOption}</span>
                                <div className="contact-dropdown-icon">
                                <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    strokeWidth="0"
                                    viewBox="0 0 16 16"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                    fillRule="evenodd"
                                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                                    ></path>
                                </svg>
                                </div>
                            </div>
                            {isDropdownOpen && (
                                <div className="contact-dropdown-options">
                                {filteredOptions.map((option, index) => (
                                    <div
                                    key={index}
                                    className="contact-dropdown-option"
                                    role="menuitem"
                                    tabIndex="0"
                                    onClick={(e) => {
                                        e.stopPropagation(); 
                                        handleOptionSelect(option);
                                    }}
                                    >
                                    {option}
                                    </div>
                                ))}
                                </div>
                            )}
                        </div>
                        
                    </div>
                </div>
                <div className="custom-export-import">
                  <div className="buttons">
                  <div className="button-left">
                    <Tooltip title="Export Template Message" >
                      <button type="button" className="custom-button export-button" aria-label="Export to CSV" data-testid="contacts-actionBar-contactBar-export-button" >
                          <div className="button-child">
                              <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9.10189 0.825209L9.10189 10.8594" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                              <path d="M11.5322 3.27344L9.10223 0.833437L6.67223 3.27344" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                              <path d="M12.963 5.78125H13.7405C15.4364 5.78125 16.8105 7.15542 16.8105 8.85208V12.9221C16.8105 14.6137 15.4397 15.9846 13.748 15.9846L4.46471 15.9846C2.76888 15.9846 1.39388 14.6096 1.39388 12.9137L1.39388 8.84292C1.39388 7.15208 2.76555 5.78125 4.45638 5.78125L5.24138 5.78125" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                              </svg>
                              <div className="button-title">Export</div>
                          </div>
                      </button>
                    </Tooltip>
                  </div>
                  <div className="button-right">
                    <Tooltip title="Import Template Message" >
                      <button type="button" className="custom-button import-button" aria-label="Import from CSV" data-testid="contacts-actionBar-contactBar-import-button" >
                      <input id="template-upload" type="file" accept=".csv" style={{ display: "none" }} />
                      <div className="button-child">
                          <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.10189 10.8623L9.10189 0.828125" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                          <path d="M11.5322 8.42188L9.10223 10.8619L6.67223 8.42187" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                          <path d="M12.963 5.77344H13.7405C15.4364 5.77344 16.8105 7.1476 16.8105 8.84427V12.9143C16.8105 14.6059 15.4397 15.9768 13.748 15.9768L4.46471 15.9768C2.76888 15.9768 1.39388 14.6018 1.39388 12.9059L1.39388 8.8351C1.39388 7.14427 2.76555 5.77344 4.45638 5.77344L5.24138 5.77344" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                          </svg>
                          <div className="button-title">Import</div>
                      </div>
                      </button>
                      </Tooltip>
                  </div>
                  </div>
                </div>

              </div>
            </div>
            <div className="template__table-container">
                <Table  className='template__table'>
                    <TableHead className='template__table__Head'>
                        <TableRow>
                        <TableCell>Template Name</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell >Status</TableCell>
                        <TableCell >Language</TableCell>
                        <TableCell >Last Updated</TableCell>
                        <TableCell >Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className="template__table__body">
                      {templateData.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>
                            <Tooltip title={row.templateName} position="top">
                            <span
                              className="list-table__cell_first"
                              role="button"
                              tabIndex="0"
                            >
                              {row.templateName}
                            </span>
                            </Tooltip>
                          </TableCell>
                          <TableCell>{row.category}</TableCell>
                          <TableCell className="list-table__cell">
                            <div
                              className={`message-badge ${
                                row.status === "APPROVED"
                                  ? "message-badge_approved"
                                  : "message-badge_draft"
                              }`}
                            >
                              <span>{row.status}</span>
                            </div>
                          </TableCell>
                          <TableCell>{row.language}</TableCell>
                          <TableCell>{row.lastUpdated}</TableCell>
                          <TableCell className="list-table__cell_actions">
                            {row.status === "DRAFT" ? (
                              <Tooltip title="Submit Template"  onClick={OpenSubmitModal}>
                                <button className="btn btn-success save_action_btn">Submit</button>
                              </Tooltip>
                            ) : (
                                <button className="add-attribute-btn add_action_btn">
                                  Send Broadcast
                                </button>
                            )}
                            <hr className="list-table__cell_line"></hr>
                            <Tooltip title="Copy Template">
                              <button aria-label="copy" className='cell__copy'>
                                <svg className='copysvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.66406 3.33341V13.3334C6.66406 13.7754 6.83966 14.1994 7.15222 14.5119C7.46478 14.8245 7.8887 15.0001 8.33073 15.0001H14.9974C15.4394 15.0001 15.8633 14.8245 16.1759 14.5119C16.4885 14.1994 16.6641 13.7754 16.6641 13.3334V6.03508C16.664 5.81305 16.6196 5.59326 16.5335 5.38862C16.4473 5.18398 16.3212 4.99862 16.1624 4.84341L13.3999 2.14175C13.0885 1.8373 12.6704 1.6668 12.2349 1.66675H8.33073C7.8887 1.66675 7.46478 1.84234 7.15222 2.1549C6.83966 2.46746 6.66406 2.89139 6.66406 3.33341V3.33341Z" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M13.332 15.0002V16.6668C13.332 17.1089 13.1564 17.5328 12.8439 17.8453C12.5313 18.1579 12.1074 18.3335 11.6654 18.3335H4.9987C4.55667 18.3335 4.13275 18.1579 3.82019 17.8453C3.50763 17.5328 3.33203 17.1089 3.33203 16.6668V7.50016C3.33203 7.05814 3.50763 6.63421 3.82019 6.32165C4.13275 6.00909 4.55667 5.8335 4.9987 5.8335H6.66536" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                              </button>
                            </Tooltip>
                            <Tooltip title="Delete Template" onClick={OpenDeleteModal}>
                              <button aria-label="delete" className="cell__delete">
                                <svg className='deletesvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path><path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" stroke-width="1.25" stroke-linecap="round"></path></svg>
                              </button>
                            </Tooltip>
                            {row.status === "DRAFT" &&(
                            <Tooltip title="Edit Template">
                              <button aria-label="edit" className="cell__edit">
                              <svg className='editsvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.3753 9.16041C12.6078 9.74959 10.2511 7.39287 10.8402 5.62533M11.5664 4.89913L7.75841 8.70716C6.10291 10.3627 4.92846 12.437 4.36063 14.7083L4.17663 15.4443C4.11929 15.6736 4.32702 15.8814 4.55635 15.824L5.29236 15.64C7.56369 15.0722 9.638 13.8977 11.2935 12.2422L15.1015 8.43421C15.5703 7.96543 15.8337 7.32963 15.8337 6.66667C15.8337 5.28614 14.7145 4.16699 13.334 4.16699C12.671 4.16699 12.0352 4.43035 11.5664 4.89913Z" stroke="#333" stroke-width="1.25"></path></svg>
                              </button>
                            </Tooltip>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>

                </Table>
            </div>
            <div className="pagination-wrapper">
              <div className='sequence__pagination'>
                  <TablePagination
                      rowsPerPageOptions={[5, 10, 25, 100]}
                      count={totalRows} 
                      page={page} 
                      onPageChange={handlePageChange} 
                      rowsPerPage={rowsPerPage} 
                      onRowsPerPageChange={handleRowsPerPageChange} 
                      ActionsComponent={() => (
                          <div className='tablepagination__action'>
                              <p  className="Previouspage Pagintaion__action " aria-label="Go to previous page" title="Go to previous page">
                                  <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 24 24" className="leftRightArrow" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M1.02698 11.9929L5.26242 16.2426L6.67902 14.8308L4.85766 13.0033L22.9731 13.0012L22.9728 11.0012L4.85309 11.0033L6.6886 9.17398L5.27677 7.75739L1.02698 11.9929Z" fill="currentColor"></path>
                                  </svg>
                                  <span className="pagination_previousnextcont" >Previous</span>
                              </p>
                              <p  className="nextPage Pagintaion__action  "  aria-label="Go to next page" title="Go to next page">
                                  <span className="pagination_previousnextcont" >Next</span>
                                  <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 24 24" className="leftRightArrow" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M23.0677 11.9929L18.818 7.75739L17.4061 9.17398L19.2415 11.0032L0.932469 11.0012L0.932251 13.0012L19.2369 13.0032L17.4155 14.8308L18.8321 16.2426L23.0677 11.9929Z" fill="currentColor"></path>
                                  </svg>
                              </p>     
                          </div>
                      )}
                      sx={{
                          '.MuiTablePagination-displayedRows': {
                              fontSize: '1.2rem',
                              margin: '0px',
                              color: 'rgb(51, 51, 51)'
                          },
                          '.MuiSelect-nativeInput': {
                              padding: '0px 1rem',
                              height: '3rem',
                              margin: '0 0 8px 0px',
                          },
                          '.MuiInputBase-root': {
                              fontSize: '1.2rem',
                              paddingRight: '0',
                          },
                          '.MuiTablePagination-selectLabel': {
                              fontSize: '1.2rem',
                              margin: '0px',
                              color: 'rgb(51, 51, 51)',
                          },
                      }}
                  />
              </div>
          </div>
            </div>
           
          </>
        )}
        {activeTab === "templateLibrary" && (
          <> 
          <div className='msgContR  Template_librabry-Container'>
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
                  <button className="btn btn-success template-library-new-button">New Template Message</button>
                </div>
              </div>
            </div>
            
            <div className="template-navigation-wrapper">
              <div className="template-navigation">
                <nav role="navigation" aria-label="Template Filter" className="template-nav">
                  <ul className="template-nav-list">
                    <li
                      className={`template-nav-item ${selectedCategory === "All" ? "activeBroad" : ""}`}
                      onClick={() => handleCategoryClick("All")}
                    >
                      <div className="template-tab">
                        All
                        <span className="template-count">{templates.length}</span>
                      </div>
                    </li>
                    <li
                      className={`template-nav-item ${selectedCategory === "Festival" ? "activeBroad" : ""}`}
                      onClick={() => handleCategoryClick("Festival")}
                    >
                      <div className="template-tab">
                        Festival
                        <span className="template-count">{getCategoryCount("Festival")}</span>
                      </div>
                    </li>
                    <li
                      className={`template-nav-item ${selectedCategory === "Education" ? "activeBroad" : ""}`}
                      onClick={() => handleCategoryClick("Education")}
                    >
                      <div className="template-tab">
                        Education
                        <span className="template-count">{getCategoryCount("Education")}</span>
                      </div>
                    </li>
                    <li
                      className={`template-nav-item ${selectedCategory === "E-Commerce" ? "activeBroad" : ""}`}
                      onClick={() => handleCategoryClick("E-Commerce")}
                    >
                      <div className="template-tab">
                        E-Commerce
                        <span className="template-count">{getCategoryCount("E-Commerce")}</span>
                      </div>
                    </li>
                    <li
                      className={`template-nav-item ${selectedCategory === "Others" ? "activeBroad" : ""}`}
                      onClick={() => handleCategoryClick("Others")}
                    >
                      <div className="template-tab">
                        Others
                        <span className="template-count">{getCategoryCount("Others")}</span>
                      </div>
                    </li>
                  </ul>
                </nav>
              </div>
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
              <div className="template__template">
                <div className="template-card-section">
                  {/* Map over filtered templates to display cards */}
                  {filteredTemplates.map(template => (
                    <div key={template.id} className="template-cards">
                      <div className="template_card-wrapper"> 
                     
                      {template.img && (
                         <div class="template_card-top-wrapper">
                          <img src={template.img} alt={template.title} className="background-image" />
                        </div>
                      )}
                     
                      <div className="template_card-wrapper-content">
                        <div className="template_header-content">
                          <h4>{template.title}</h4>
                          <span className="template_label">{template.category}</span>
                        </div>
                        <p className="template_content">
                        {template.content
                          .replace('{{name}}', 'John Doe')
                          .replace('{{shop_name}}', 'Your Shop')
                          .split('\n')
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
            </div>

          </div>
          </>
        )}
        {activeTab === "Broadcast Analytics" && (
          <> 
            <div className='msgContR  Broadcast-container'>
              <div className="date-range-filter">
                <div className="datepicker-container">
                  <div className="header-bar">
                    <div className="header-bar__label">
                      <h3 className="header-bar__name">Date Range Filter</h3>
                    </div>
                    <div class="header-bottom-label"></div>
                  </div>
                  <LocalizationProvider dateAdapter={AdapterDayjs} >
                    <Box className="date-picker-section"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: 2,
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px",
                      }}
                    >
                        <LocalizationProvider dateAdapter={AdapterDayjs}> 
                        <DatePicker
                          className="datecontent datepicker"
                          label="Date picker from"
                          value={dateFrom}
                          onChange={(newValue) => setDateFrom(newValue)} 
                          
                        />
                        </LocalizationProvider>
                        <DatePicker
                         className='datepicker'
                          label="Date picker to"
                          value={dateTo}
                          onChange={(newValue) => setDateTo(newValue)}
                         
                        />
                        <FormControl variant="standard" fullWidth className="date-range-select">
                          <InputLabel id="date-range-label" className='date-range-label'>Period</InputLabel>
                          <Select
                            labelId="date-range-label"
                            value={range}
                            onChange={handleRangeChange}
                            className='datepickers-range__select'
                            fullWidth
                          >
                            <MenuItem value="custom">Custom range</MenuItem>
                            <MenuItem value="Today">Today</MenuItem>
                            <MenuItem value="Yesterday">Yesterday</MenuItem>
                            <MenuItem value="last7days">Last 7 Days</MenuItem>
                            <MenuItem value="last30days">Last 30 Days</MenuItem>
                          </Select>
                        </FormControl>

                    </Box>
                  </LocalizationProvider>
                  
                </div>
                  <button className="add-attribute-btn add-green-btn apply-button" data-testid="apply-now-button">Apply Now</button>
                  <div class="export-import-container">
                    <div class="export-import-buttons">
                      <div class="export-button">
                        <button
                          type="button"
                          data-testid="Export-broadcast-analytics-export-button"
                          aria-label="Export to CSV"
                          class="export-button-element"
                          onClick={handleDownload}
                        >
                          <div class="button-content">
                            <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9.10189 0.825209L9.10189 10.8594" stroke="#666666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                              <path d="M11.5322 3.27344L9.10223 0.833437L6.67223 3.27344" stroke="#666666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                              <path d="M12.963 5.78125H13.7405C15.4364 5.78125 16.8105 7.15542 16.8105 8.85208V12.9221C16.8105 14.6137 15.4397 15.9846 13.748 15.9846L4.46471 15.9846C2.76888 15.9846 1.39388 14.6096 1.39388 12.9137L1.39388 8.84292C1.39388 7.15208 2.76555 5.78125 4.45638 5.78125L5.24138 5.78125" stroke="#666666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                            <div class="button-label">Export</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="new-broadcast-button-container">
                    <div class="new-broadcast__create">
                      <a href="https://www.youtube.com/watch?v=CWCk7iDNG3Y" target="_blank" rel="noopener noreferrer" class="template-library-tutorial">
                        <div class="tutorial-content">
                          <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="13.5" cy="13.5" r="13.5" fill="#269CFE"></circle>
                            <path d="M17.8691 12.6344C18.5358 13.0193 18.5358 13.9815 17.8691 14.3664L12.0648 17.7176C11.3981 18.1025 10.5648 17.6214 10.5648 16.8516L10.5648 10.1493C10.5648 9.37948 11.3981 8.89836 12.0648 9.28326L17.8691 12.6344Z" fill="white"></path>
                          </svg>
                          <span class="tutorial-text">Watch Tutorial</span>
                        </div>
                      </a>
                      <button class="btn btn-success broadcast-New-button">New Broadcast</button>
                      
                    </div>
                    <div class="messaging-limit-container">
                      <span class="messaging-limit-text">
                        Messaging-Limit: <strong>1000 Unique Contacts/24 Hours</strong>
                      </span>
                      <a
                        href="https://developers.facebook.com/docs/whatsapp/api/rate-limits#quality-rating-and-messaging-limits"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="messaging-limit-link"
                      >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9987 1.20856C17.9592 1.20856 22.7904 6.04089 22.7904 12.0002C22.7904 17.9596 17.9592 22.7919 11.9987 22.7919C6.03937 22.7919 1.20703 17.9596 1.20703 12.0002C1.20703 6.04089 6.03937 1.20856 11.9987 1.20856Z" stroke="#637E73" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        <path d="M11.9935 7.57166V12.7272" stroke="#637E73" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        <path d="M11.9916 16.4288H12.0032" stroke="#637E73" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                      </svg>
                      </a>
                     </div>
                  </div>
                  <div className="overview-container">
                    <h3 className="overview-header">Overview</h3>
                    <div className="stats-grid">
                      {stats.map((stat, index) => (
                        <div className="stat-item" key={index}>
                          <div className="info-box__left">
                            <div className="info-box__count">{stat.count}</div>
                            <div className="info-box__title">
                              {stat.title}
                              <div className="tooltip-wrapper">
                              <Tooltip title={stat.tooltip}>
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5.71282 14.4853C3.62975 13.9967 2.00328 12.3702 1.51466 10.2872C1.16178 8.78281 1.16178 7.21719 1.51466 5.71282C2.00328 3.62975 3.62976 2.00328 5.71283 1.51466C7.21719 1.16178 8.78281 1.16178 10.2872 1.51466C12.3702 2.00328 13.9967 3.62975 14.4853 5.71283C14.8382 7.21719 14.8382 8.78281 14.4853 10.2872C13.9967 12.3702 12.3702 13.9967 10.2872 14.4853C8.78281 14.8382 7.21719 14.8382 5.71282 14.4853Z"
                                    stroke="#333"
                                    strokeOpacity="0.3"
                                    strokeWidth="1.0125"
                                  />
                                  <circle
                                    cx="8"
                                    cy="10.6255"
                                    r="0.75"
                                    fill="#333"
                                    fillOpacity="0.3"
                                  />
                                  <path
                                    d="M6.5 6.5V6.125C6.5 5.29657 7.17157 4.625 8 4.625V4.625V4.625C8.82843 4.625 9.5 5.29657 9.5 6.125V6.21599C9.5 6.63795 9.33238 7.04262 9.03401 7.34099L8 8.375"
                                    stroke="#333"
                                    strokeOpacity="0.3"
                                    strokeWidth="1.0125"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </Tooltip>
                                {/* <div className="tooltip"></div> */}
                              </div>
                            </div>
                          </div>
                          <div className="info-box__right">{stat.rightIcon}</div>
                        </div>
                      ))}
                    </div>

                  </div>
              </div>
              <div className="broadcast-list-wrapper">
                <h3 className="broadcast-list-header">Broadcast list</h3>
                <div className="actionbar-fileter-group"> 
                   <div className="actionbar-sort">
                    <div className="actionbar-sort-container">
                      <div className="actionbar-sort-title">Sorted by:</div>
                      <div className={`contact-broadcast__dropdown ${ isDropdownOpen ? "contact-dropdown-active" : "" }`}role="menu"  tabIndex="0"  onClick={toggleDropdown}   > 
                        <div role="menu" tabIndex="0"className="contact-dropdown-header broadcast__dropdown-Content">
                          <span>Latest</span>
                          <div className="contact-dropdown-icon">
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"></path>
                            </svg>
                          </div>
                        </div>
                        {isDropdownOpen && ( 
                          <div className="contact-dropdown-options">
                            <div className="contact-dropdown-option" role="menuitem" tabIndex="0"> Oldest </div>
                          </div> 
                        )}
                      </div> 
                    </div>
                  </div> 
                  <div className="custom-action-bar-search">
                    <div className="custom-search-input-container " >
                      <div className="custom-input-wrap">
                        <input type="text" className="custom-search-input broadcast-actionBar-search-input" placeholder="Search..." value={searchValue} onChange={handleSearchChange} data-testid="custom-search-input" />
                        <div tabIndex="0" className="custom-search-icon">
                          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>  
                  <div className="custom-filter-button Brodcast-filter-dropdown" role="button" tabIndex="0" aria-label="Open Filter" onClick={toggleFilterPopup}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.1169 17.9867H2.88281" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M21.1174 17.9864C21.1174 19.577 19.828 20.8664 18.2374 20.8664C16.6468 20.8664 15.3574 19.577 15.3574 17.9864C15.3574 16.3947 16.6468 15.1064 18.2374 15.1064C19.828 15.1064 21.1174 16.3947 21.1174 17.9864Z" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M13.8828 6.26206H21.1181" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M2.88281 6.26208C2.88281 7.85384 4.17222 9.14208 5.76281 9.14208C7.3534 9.14208 8.64281 7.85384 8.64281 6.26208C8.64281 4.67149 7.3534 3.38208 5.76281 3.38208C4.17222 3.38208 2.88281 4.67149 2.88281 6.26208Z" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    <Badge
                        badgeContent={0}
                        className='filter-button'
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        style={{
                          top: '-18px',
                          left: '5px',
                        }}
                      >
                      </Badge>
                  </div>
                </div>
                <Tooltip title={tooltipText} placement="right">
                <IconButton 
                  onClick={handleClick} 
                  className="broadcast__refesh-content" 
                  style={{ width: '32px', height: '32px'}}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="refresh-ccw">
                      <path id="Vector" d="M0.666687 2.66675V6.66675H4.66669" stroke="#23a455" strokeLinecap="round" strokeLinejoin="round"></path>
                      <path id="Vector_2" d="M15.3333 13.3333V9.33325H11.3333" stroke="#23a455" strokeLinecap="round" strokeLinejoin="round"></path>
                      <path id="Vector_3" d="M13.66 5.99989C13.3219 5.04441 12.7473 4.19016 11.9897 3.51683C11.2322 2.84351 10.3164 2.37306 9.32783 2.14939C8.33928 1.92572 7.31018 1.95612 6.33656 2.23774C5.36294 2.51936 4.47652 3.04303 3.76002 3.75989L0.666687 6.66655M15.3334 9.33322L12.24 12.2399C11.5235 12.9567 10.6371 13.4804 9.66348 13.762C8.68986 14.0437 7.66076 14.0741 6.67221 13.8504C5.68366 13.6267 4.76789 13.1563 4.01033 12.4829C3.25278 11.8096 2.67813 10.9554 2.34002 9.99989" stroke="#23a455" strokeLinecap="round" strokeLinejoin="round"></path>
                    </g>
                  </svg>
                </IconButton>
              </Tooltip>
              </div>
              <div class="broadcast-table-container">
                  <Table  className='broadcast__table'>
                      <TableHead className='broadcast__table__Head'>
                          <TableRow>
                          <TableCell> <div> Broadcast name</div></TableCell>
                          <TableCell>Recipients</TableCell>
                          <TableCell className='header-cell_desktop'>Successful</TableCell>
                          <TableCell className='header-cell_desktop'>Read</TableCell>
                          <TableCell className='header-cell_desktop'>Replied</TableCell>
                          <TableCell>Failed	</TableCell>
                          <TableCell className='header-cell__clicked header-cell__pro-bg'>Website clicks</TableCell>
                          <TableCell>Actions	</TableCell>
                          </TableRow>
                      </TableHead>
                      <TableBody>
                      {data.map((item, index) => (
                        <TableRow key={index} className="broadcast__table__body">
                          <TableCell >
                            <div data-testid="broadcast-name-insights" className="body-cell__name" role="button" tabIndex="0">
                              {item.broadcastName}
                            </div>
                            <div className="body-cell__value">{item.date}</div>
                          </TableCell>
                          <TableCell className="broadcast__table__body-cell">
                            <div className="body-cell__text-cell">{item.recipients} <span className="body-cell__text">Contacts</span></div>
                          </TableCell>
                          <TableCell className="broadcast__table__body-cell">
                            <div className="RCP body-cell__progress-bar">
                              <svg width="94" height="94" viewBox="0 0 94 94" style={{ transform: 'rotate(-90deg)' }}>
                                <circle cx="47" cy="47" r="27" fill="none" stroke="#DFEBFA" strokeWidth="7" strokeDasharray="169.64600329384882, 169.64600329384882" strokeLinecap="round" className="RCP__track" style={{ transition: '0.3s' }}></circle>
                                <circle cx="47" cy="47" r="27" fill="none" stroke="#23a455" strokeWidth="7" strokeDasharray="169.64600329384882, 169.64600329384882" strokeDashoffset="0" strokeLinecap="square" className="RCP__progress" style={{ transition: '0.3s' }}></circle>
                              </svg>
                              <div className="body-cell__progress-count">{item.successful}%</div>
                            </div>
                          </TableCell>
                          <TableCell className="broadcast__table__body-cell">
                            <div className="RCP body-cell__progress-bar">
                              <svg width="94" height="94" viewBox="0 0 94 94" style={{ transform: 'rotate(-90deg)' }}>
                                <circle cx="47" cy="47" r="27" fill="none" stroke="#DFEBFA" strokeWidth="7" strokeDasharray="169.64600329384882, 169.64600329384882" strokeLinecap="round" className="RCP__track" style={{ transition: '0.3s' }}></circle>
                                <circle cx="47" cy="47" r="27" fill="none" stroke="#23a455" strokeWidth="7" strokeDasharray="169.64600329384882, 169.64600329384882" strokeDashoffset="0" strokeLinecap="square" className="RCP__progress" style={{ transition: '0.3s' }}></circle>
                              </svg>
                              <div className="body-cell__progress-count">{item.read}%</div>
                            </div>
                          </TableCell>
                          <TableCell className="broadcast__table__body-cell">
                            <div className="RCP body-cell__progress-bar">
                              <svg width="94" height="94" viewBox="0 0 94 94" style={{ transform: 'rotate(-90deg)' }}>
                                <circle cx="47" cy="47" r="27" fill="none" stroke="#DFEBFA" strokeWidth="7" strokeDasharray="169.64600329384882, 169.64600329384882" strokeLinecap="round" className="RCP__track" style={{ transition: '0.3s' }}></circle>
                                <circle cx="47" cy="47" r="27" fill="none" stroke="#ff0e0e" strokeWidth="7" strokeDasharray="169.64600329384882, 169.64600329384882" stroke-dashoffset="169.64600329384882" strokeLinecap="square" className="RCP__progress" style={{ transition: '0.3s' }}></circle>
                              </svg>
                              <div className="body-cell__progress-count">{item.replied}%</div>
                            </div>
                          </TableCell>
                          <TableCell className="broadcast__table__body-cell">
                            <div>{item.failedContacts} <span className="body-cell__text">Contacts</span></div>
                          </TableCell>
                          <TableCell className="broadcast__table__body-cell body-cell__pro-cell">
                            {index === 0 && (
                              <div className="body-cell__pro-cell-content">
                                <div variant="text" className="body-cell-pro-text">
                                  <span>
                                    <svg width="10px" height="10px" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M7 3.5H8.11136C8.27404 3.5 8.36866 3.68387 8.27411 3.81625L6 7M4 3.5H5.74384C5.87396 3.5 5.96943 3.62228 5.93787 3.74851L5 7.5M1.5 3.5H2.84914C2.93844 3.5 3.01691 3.5592 3.04144 3.64506L4 7M6.5 1H7.39296C7.45983 1 7.52228 1.03342 7.55937 1.08906L8.29271 2.18906C8.38131 2.32197 8.28604 2.5 8.1263 2.5H7M4.5 1H5.35585C5.44193 1 5.51836 1.05509 5.54558 1.13675L5.91225 2.23675C5.95542 2.36626 5.85903 2.5 5.72251 2.5H4M2.5 1H3.22251C3.35903 1 3.45542 1.13374 3.41225 1.26325L3.04558 2.36325C3.01836 2.44491 2.94193 2.5 2.85585 2.5H1.5M2.10704 0C2.04017 0 1.97772 0.0334202 1.94063 0.08906L0.0765721 2.88514C0.0304804 2.95428 0.0319387 3.04471 0.0802354 3.11233L4.83725 9.77215C4.91702 9.88382 5.08298 9.88382 5.16275 9.77215L9.91976 3.11233C9.96806 3.04471 9.96952 2.95428 9.92343 2.88514L8.05937 0.0890601C8.02228 0.0334203 7.95983 0 7.89296 0H2.10704Z" fill="#FF9D00"></path>
                                    </svg>
                                    <span>PRO</span>
                                  </span>
                                </div>
                                <span>Beyond the Click:</span> Analyze your button clicks for data-driven improvements.
                                <div className="body-cell__pro-cell-content-description">
                                  Available on these plans: Pro, <span>Business</span>
                                </div>
                                <button className="btn btn-success Brodacst_View-Button">View demo</button>
                              </div>
                             )}
                          </TableCell>
                          <TableCell className="broadcast__table__body-cell">
                            <div className="action-cell__wrapper" >
                              <button color="ghost" className="view-report__button" data-testid="view-report-bc-analytics" target="_self" onClick={OpenBroadcastModal}>
                                View report
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                        
                      </TableBody>
                  </Table>
                <div className="pagination-wrapper">
                    <div className='sequence__pagination broadcast-pagination'>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 100]}
                            count={totalRows} 
                            page={page} 
                            onPageChange={handlePageChange} 
                            rowsPerPage={rowsPerPage} 
                            onRowsPerPageChange={handleRowsPerPageChange} 
                            ActionsComponent={() => (
                                <div className='tablepagination__action'>
                                    <p  className="Previouspage Pagintaion__action " aria-label="Go to previous page" title="Go to previous page">
                                        <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 24 24" className="leftRightArrow" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1.02698 11.9929L5.26242 16.2426L6.67902 14.8308L4.85766 13.0033L22.9731 13.0012L22.9728 11.0012L4.85309 11.0033L6.6886 9.17398L5.27677 7.75739L1.02698 11.9929Z" fill="currentColor"></path>
                                        </svg>
                                        <span className="pagination_previousnextcont" >Previous</span>
                                    </p>
                                    <p  className="nextPage Pagintaion__action  "  aria-label="Go to next page" title="Go to next page">
                                        <span className="pagination_previousnextcont" >Next</span>
                                        <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 24 24" className="leftRightArrow" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M23.0677 11.9929L18.818 7.75739L17.4061 9.17398L19.2415 11.0032L0.932469 11.0012L0.932251 13.0012L19.2369 13.0032L17.4155 14.8308L18.8321 16.2426L23.0677 11.9929Z" fill="currentColor"></path>
                                        </svg>
                                    </p>     
                                </div>
                            )}
                            sx={{
                                '.MuiTablePagination-displayedRows': {
                                    fontSize: '1.2rem',
                                    margin: '0px',
                                    color: 'rgb(51, 51, 51)'
                                },
                                '.MuiSelect-nativeInput': {
                                    padding: '0px 1rem',
                                    height: '3rem',
                                    margin: '0 0 8px 0px',
                                },
                                '.MuiInputBase-root': {
                                    fontSize: '1.2rem',
                                    paddingRight: '0',
                                },
                                '.MuiTablePagination-selectLabel': {
                                    fontSize: '1.2rem',
                                    margin: '0px',
                                    color: 'rgb(51, 51, 51)',
                                },
                            }}
                        />
                    </div>
                </div>
              </div>

            </div>
           </>
        )}
        {activeTab === "Scheduled Broadcasts" && (
          <> 
           <div className='msgContR schedule_broadcast '>
            <div className="scheduled-broadcast">             
                <div className="action-bar__left-side">
                  <h3 className="action-bar__header">Scheduled Broadcast</h3>
                    <div className="custom-action-bar-search">
                        <div className="custom-search-input-container"   data-testid="custom-search-bar-input">
                            <div className="custom-input-wrap">
                            <input
                                type="text"
                                className="custom-search-input"
                                placeholder="Search..."
                                value="Search"
                               
                                data-testid="custom-search-input"
                            />
                            <div tabIndex="0" className="custom-search-icon">
                            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="action-bar__right-side schedule__broadcast-container ">
                  <div class="messaging-limit-container">
                    <span class="messaging-limit-text">
                      Messaging-Limit: <strong>1000 Unique Contacts/24 Hours</strong>
                    </span>
                    
                        <a
                          href="https://developers.facebook.com/docs/whatsapp/api/rate-limits#quality-rating-and-messaging-limits"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: 'inline-block', padding: '8px', cursor: 'pointer' }}
                        >
                        <Tooltip
                        title="WhatsApp imposes messaging limits to determine how many unique users your business can send messages to on a daily basis. For more details on sending to more users, please refer to the article."
                        placement="bottom"
                        arrow
                        sx={{
                          '.MuiTooltip-tooltip': {
                            backgroundColor: 'black', 
                            color: 'white', 
                            fontSize: '1rem', 
                          },
                          '.MuiTooltip-arrow': {
                            color: 'black', 
                          },
                        }}
                      >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M11.9987 1.20856C17.9592 1.20856 22.7904 6.04089 22.7904 12.0002C22.7904 17.9596 17.9592 22.7919 11.9987 22.7919C6.03937 22.7919 1.20703 17.9596 1.20703 12.0002C1.20703 6.04089 6.03937 1.20856 11.9987 1.20856Z"
                              stroke="#637E73"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                            <path
                              d="M11.9935 7.57166V12.7272"
                              stroke="#637E73"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                            <path
                              d="M11.9916 16.4288H12.0032"
                              stroke="#637E73"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                          </svg>
                          </Tooltip>
                        </a>
                     
                  </div>
                  <button class="btn btn-success broadcast-New-button">New Broadcast</button>
                </div>            
            </div>
            <div className="schedule__broadcast-header">
                <div className="schedule__broadcast-Headerseaction">
                  <div className="header__name">Broadcast name</div>
                  <div className="header__scheduled">Scheduled</div>
                  <div className="header__actions">Actions</div>
                </div>
                <div className="schedule__broadcast-row">
                  <div className="scheduled-row">
                    <div className="row-name" data-testid="scheduled-row-name">
                      payment_success_1_171220241423
                    </div>
                    <div className="row-scheduled" data-testid="scheduled-row-start-in">
                      Start In: 2/21/2025 10:00:01 AM
                    </div>
                    <div className="row-actions" data-testid="scheduled-row-actions">
                    <Tooltip title="edit" >
                    <button aria-label="edit" className='cell__edit'onClick={OpenEditBroadcastModal} ><svg className='editsvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.3753 9.16041C12.6078 9.74959 10.2511 7.39287 10.8402 5.62533M11.5664 4.89913L7.75841 8.70716C6.10291 10.3627 4.92846 12.437 4.36063 14.7083L4.17663 15.4443C4.11929 15.6736 4.32702 15.8814 4.55635 15.824L5.29236 15.64C7.56369 15.0722 9.638 13.8977 11.2935 12.2422L15.1015 8.43421C15.5703 7.96543 15.8337 7.32963 15.8337 6.66667C15.8337 5.28614 14.7145 4.16699 13.334 4.16699C12.671 4.16699 12.0352 4.43035 11.5664 4.89913Z" stroke="#333" stroke-width="1.25"></path></svg></button>
                    </Tooltip>
                    <Tooltip title="Delete" onClick={OpenScheduleDeleteModal}>
                      <button aria-label="delete" className=' cell__delete'  >
                        <svg className='deletesvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path><path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" stroke-width="1.25" stroke-linecap="round">
                        </path>
                        </svg>
                      </button>
                    </Tooltip>
                    </div>
                  </div>
                </div>
            </div>
           
              <div className="pagination-wrapper">
                <div className='sequence__pagination '>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 100]}
                        count={totalRows} 
                        page={page} 
                        onPageChange={handlePageChange} 
                        rowsPerPage={rowsPerPage} 
                        onRowsPerPageChange={handleRowsPerPageChange} 
                        ActionsComponent={() => (
                            <div className='tablepagination__action'>
                                <p  className="Previouspage Pagintaion__action " aria-label="Go to previous page" title="Go to previous page">
                                    <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 24 24" className="leftRightArrow" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.02698 11.9929L5.26242 16.2426L6.67902 14.8308L4.85766 13.0033L22.9731 13.0012L22.9728 11.0012L4.85309 11.0033L6.6886 9.17398L5.27677 7.75739L1.02698 11.9929Z" fill="currentColor"></path>
                                    </svg>
                                    <span className="pagination_previousnextcont" >Previous</span>
                                </p>
                                <p  className="nextPage Pagintaion__action  "  aria-label="Go to next page" title="Go to next page">
                                    <span className="pagination_previousnextcont" >Next</span>
                                    <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 24 24" className="leftRightArrow" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M23.0677 11.9929L18.818 7.75739L17.4061 9.17398L19.2415 11.0032L0.932469 11.0012L0.932251 13.0012L19.2369 13.0032L17.4155 14.8308L18.8321 16.2426L23.0677 11.9929Z" fill="currentColor"></path>
                                    </svg>
                                </p>     
                            </div>
                        )}
                        sx={{
                            '.MuiTablePagination-displayedRows': {
                                fontSize: '1.2rem',
                                margin: '0px',
                                color: 'rgb(51, 51, 51)'
                            },
                            '.MuiSelect-nativeInput': {
                                padding: '0px 1rem',
                                height: '3rem',
                                margin: '0 0 8px 0px',
                            },
                            '.MuiInputBase-root': {
                                fontSize: '1.2rem',
                                paddingRight: '0',
                            },
                            '.MuiTablePagination-selectLabel': {
                                fontSize: '1.2rem',
                                margin: '0px',
                                color: 'rgb(51, 51, 51)',
                            },
                        }}
                    />
                </div>
              </div>
          </div>
          </>
        )}
        {isEditBroadcastModal&&(
          <EditBroadcastModal show={isEditBroadcastModal} onClose={closeEditBroadcastModal}/>
        )}
        {isFilterPopupOpen && (
          <FilterBroadcastModal show={isFilterPopupOpen} onClose={toggleFilterPopup} />
        )}
        {isOpenFilterModal && (
          <FilterTemplateModal show={OpenFilterModal}  onClose={closeFilterModal} />
        )}
        {isOpenBroadcastModal &&(
            <BroadcastModal show={OpenBroadcastModal} onClose={closeBroadcastModal}/>
        )}
         {isOpenSubmitModal &&(
            <TemplateSubmitModal show={OpenSubmitModal} onClose={closeSubmitModal}/>
        )}
        {isOpenDeleteModal &&(
          <TemplateDeleteModal show={OpenDeleteModal} onClose={closeDeleteModal}/>
        )}
        {isOpenScheduleDeleteModal &&(
          <ScheduleDeleteModal show={OpenScheduleDeleteModal} onClose={closeScheduleDeleteModal}/>
        )}
        
        </div>
      </div>

  )
}

export default BroadcastBody


