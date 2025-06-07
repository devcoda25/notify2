import React,{useState} from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {  Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import {  Table, TableBody, TableCell, TableHead, TablePagination, TableRow, IconButton, Tooltip ,Badge } from '@mui/material';
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ReplyAllOutlinedIcon from '@mui/icons-material/ReplyAllOutlined';
import SendIcon from '@mui/icons-material/Send';
import LoopIcon from '@mui/icons-material/Loop';
import sampleFile from '../Assets/img/Contact/Contacts_Upload_Sample.csv';
import { Modal, ModalBody, ModalFooter } from 'react-bootstrap';
import { MdClose  } from "react-icons/md";
import NewBroadcastTemplate from "./NewBroadcastTemplate";
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
      replied: 100,
      failedContacts: 1,
      failed: 0,
    },
  ];
  
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
const BroadcastAnalytics=()=>{
    const [dateFrom, setDateFrom] = useState(dayjs('12/11/2024')); 
    const [dateTo, setDateTo] =  useState(dayjs('13/11/2024'));
    const [range, setRange] = useState("custom");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
    const [searchValue, setSearchValue] = useState('');
    const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
    const [tooltipText, setTooltipText] = useState("Last updated 33 minutes ago");
    const [isOpenTemplateMessage, setIsOpenTemplateMessage] = useState(false);

    const handleClick = () => {
      setTooltipText("Just now");
    };
   
    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
      };
    const toggleDropdown = () => {
      setIsDropdownOpen((prev) => !prev);
    };
    const handleRangeChange = (event) => {
      setRange(event.target.value);
    };
    
  const toggleFilterPopup = () => {
    setIsFilterPopupOpen(!isFilterPopupOpen);
  };
    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = sampleFile;
        link.download = "sample.csv"; 
        link.click();
      };
      const [isOpenBroadcastModal, setIsOpenBroadcastModal] = useState(false);

      const OpenBroadcastModal = () => {
        setIsOpenBroadcastModal(true);
      };
  
      const closeBroadcastModal = () => {
        setIsOpenBroadcastModal(false);
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
      const handleTemplateMessage = () => {
        setIsOpenTemplateMessage(true);
    }
    return(
        <>
          {isOpenBroadcastModal &&(
            <BroadcastModal show={OpenBroadcastModal} onClose={closeBroadcastModal}/>
        )}
        {isFilterPopupOpen && (
          <FilterBroadcastModal show={isFilterPopupOpen} onClose={toggleFilterPopup} />
        )}
        
            {
              isOpenTemplateMessage ? (
                  <>
                 
                      <NewBroadcastTemplate isOpenTemplateMessage={isOpenTemplateMessage} setIsOpenTemplateMessage={setIsOpenTemplateMessage}/>
                  </>
              )
              :
              (
        
         <div className='Broadcast-container'>
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
                  <button className="add-attribute-btn add-green-btn apply-button" >Apply Now</button>
                  <div class="export-import-container">
                    <div class="export-import-buttons">
                      <div class="export-button">
                        <button
                          type="button"
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
                      <button class="btn btn-success broadcast-New-button" onClick={handleTemplateMessage}>New Broadcast</button>
                      
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
                        <input type="text" className="custom-search-input broadcast-actionBar-search-input" placeholder="Search..." value={searchValue} onChange={handleSearchChange}  />
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
                            <div  className="body-cell__name" role="button" tabIndex="0">
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
                                <circle
                                  cx="47"
                                  cy="47"
                                  r="27"
                                  fill="none"
                                  stroke="#DFEBFA"
                                  strokeWidth="7"
                                  strokeDasharray="169.64600329384882, 169.64600329384882"
                                  strokeLinecap="round"
                                  className="RCP__track"
                                  style={{ transition: '0.3s' }}
                                ></circle>
                                <circle
                                  cx="47"
                                  cy="47"
                                  r="27"
                                  fill="none"
                                  stroke={item.replied === 100 ? "#23a455" : "#ff0e0e"}
                                  strokeWidth="7"
                                  strokeDasharray="169.64600329384882, 169.64600329384882"
                                  strokeDashoffset={item.replied === 100 ? "0" : "169.64600329384882"}
                                  strokeLinecap="square"
                                  className="RCP__progress"
                                  style={{ transition: '0.3s' }}
                                ></circle>
                              </svg>
                              <div className="body-cell__progress-count">{item.replied}%</div>
                            </div>
                            
                            {item.replied === 100 && (
                              <div className="body-cell__button-wrapper">
                              <button class="add-attribute-btn  send-broadcast-btn">Send Broadcast</button>
                                <span width="226px">
                                  <svg
                                    width="13"
                                    height="13"
                                    viewBox="0 0 13 13"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M6.1 4.54873V4.94873H6.9V4.54873H6.1ZM6.9 4.54073V4.14073H6.1V4.54073H6.9ZM6.9 9.74873V6.54873H6.1V9.74873H6.9ZM6.9 4.54873V4.54073H6.1V4.54873H6.9ZM5.3 7.34873H6.5V6.54873H5.3V7.34873ZM5.3 9.74873H7.7V8.94873H5.3V9.74873ZM6.5 1.74873C7.18287 1.74873 7.85906 1.88323 8.48995 2.14456C9.12085 2.40588 9.69409 2.78891 10.177 3.27178C10.6598 3.75464 11.0428 4.32788 11.3042 4.95878C11.5655 5.58967 11.7 6.26586 11.7 6.94873H12.5C12.5 5.35743 11.8679 3.83131 10.7426 2.70609C9.61742 1.58087 8.0913 0.94873 6.5 0.94873V1.74873ZM1.3 6.94873C1.3 5.5696 1.84786 4.24696 2.82304 3.27178C3.79823 2.29659 5.12087 1.74873 6.5 1.74873V0.94873C4.9087 0.94873 3.38258 1.58087 2.25736 2.70609C1.13214 3.83131 0.5 5.35743 0.5 6.94873H1.3ZM6.5 12.1487C5.12087 12.1487 3.79823 11.6009 2.82304 10.6257C1.84786 9.6505 1.3 8.32786 1.3 6.94873H0.5C0.5 8.54003 1.13214 10.0662 2.25736 11.1914C3.38258 12.3166 4.9087 12.9487 6.5 12.9487V12.1487ZM6.5 12.9487C8.0913 12.9487 9.61742 12.3166 10.7426 11.1914C11.8679 10.0662 12.5 8.54003 12.5 6.94873H11.7C11.7 7.6316 11.5655 8.30779 11.3042 8.93868C11.0428 9.56958 10.6598 10.1428 10.177 10.6257C9.69409 11.1086 9.12085 11.4916 8.48995 11.7529C7.85906 12.0142 7.18287 12.1487 6.5 12.1487V12.9487Z"
                                      fill="#848A86"
                                    ></path>
                                  </svg>
                                </span>
                              </div>
                            )}
                          </TableCell>
                          {/* <TableCell className="broadcast__table__body-cell">
                            <div className="RCP body-cell__progress-bar">
                              <svg width="94" height="94" viewBox="0 0 94 94" style={{ transform: 'rotate(-90deg)' }}>
                                <circle cx="47" cy="47" r="27" fill="none" stroke="#DFEBFA" strokeWidth="7" strokeDasharray="169.64600329384882, 169.64600329384882" strokeLinecap="round" className="RCP__track" style={{ transition: '0.3s' }}></circle>
                                <circle cx="47" cy="47" r="27" fill="none" stroke="#ff0e0e" strokeWidth="7" strokeDasharray="169.64600329384882, 169.64600329384882" stroke-dashoffset="169.64600329384882" strokeLinecap="square" className="RCP__progress" style={{ transition: '0.3s' }}></circle>
                              </svg>
                              <div className="body-cell__progress-count">{item.replied}%</div>
                            </div>
                          </TableCell> */}
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
                              <button color="ghost" className="view-report__button"  target="_self" onClick={OpenBroadcastModal}>
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
    )
  }
        </>
    )
}
export default BroadcastAnalytics;