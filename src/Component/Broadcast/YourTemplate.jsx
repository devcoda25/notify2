import React, { useState, useEffect, useRef } from "react";
import { Table, TableBody, TableCell, TableHead, TablePagination, TableRow, IconButton, Tooltip, Badge, Autocomplete, FormControlLabel, Radio, RadioGroup, Chip } from '@mui/material';
import { Modal, ModalBody, ModalFooter } from 'react-bootstrap';
import { MdClose } from "react-icons/md";
import NewTemplate from '../Broadcast/NewTemplate'
import axios from "axios";
import baseURL from "../../Url";
import { TbRuler2 } from "react-icons/tb";

const styles = {
    autocompleteStyle: {
        backgroundColor: 'rgb(245, 246, 250) !important',
    },
    radiobtn: {
        color: 'rgb(231 231 232)',
        '&.Mui-checked': {
            borderColor: 'rgb(231 231 232)',
            color: 'green',
        },

    },
    chipAttributes: {
        height: "34px",
        margin: " 0px 20px 20px 0px",
        padding: "0px 13px",
        border: "1px solid rgb(35, 164, 85)",
        borderRadius: " 100px",
        color: " rgb(35, 164, 85)",
        fontSize: "13px",
        fontWeight: " 500",
    }

}

// const templateData = [

//     {
//         id: 1,
//         templateName: "faff",
//         category: "Marketing",
//         status: "DRAFT",
//         language: "English (US)",
//         lastUpdated: "7/20/2024",
//     },
//     {
//         id: 2,
//         templateName: "aaa",
//         category: "Marketing",
//         status: "APPROVED",
//         language: "English (US)",
//         lastUpdated: "10/7/2024",
//     },
//     {
//         id: 3,
//         templateName: "faff",
//         category: "Marketing",
//         status: "DRAFT",
//         language: "English (US)",
//         lastUpdated: "7/20/2024",
//     },
//     {
//         id: 4,
//         templateName: "faff",
//         category: "Marketing",
//         status: "DRAFT",
//         language: "English (US)",
//         lastUpdated: "7/20/2024",
//     },
//     {
//         id: 5,
//         templateName: "faff",
//         category: "Marketing",
//         status: "APPROVED",
//         language: "English (US)",
//         lastUpdated: "7/20/2024",
//     },
// ];

const TemplateDeleteModal = ({ show, onClose }) => {

    return (
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
    )
}
const FilterTemplateModal = ({ show, onClose }) => {
    const [filters, setFilters] = useState({
        DRAFT: true,
        PENDING: true,
        APPROVED: true,
        REJECTED: true,
        DELETED: false,
        PAUSED: false,
        DISABLED: false,
    });

    const handleCheckboxChange = (filter) => {
        setFilters((prev) => ({
            ...prev,
            [filter]: !prev[filter],
        }));
    };
    return (
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
                                                className={`broadcast-checkbox-label ${filters[filter] ? "checked" : ""
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
    )
}
const TemplateSubmitModal = ({ show, onClose }) => {

    return (
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
    )
}

const YourTemplate = () => {
    const allOptions = ["Lastest", "Oldest"];
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [isOpenFilterModal, setIsOpenFilterModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState("Lastest");
    const filteredOptions = allOptions.filter(option => option !== selectedOption);
    const [isOpenSubmitModal, setIsOpenSubmitModal] = useState(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [isOpenTemplateMessage, setIsOpenTemplateMessage] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const totalRows = 5;
    const [templateData, setTemplateData]= useState([]);

//    const baseURL = `https://api.dev.evzone.app/api/v1.0/web/notify/template`;

    console.log( "baseURL",baseURL)

      function getAuthIdFromUrl() {
            const path = window.location.pathname; 
            const parts = path.split('/'); 
            const userId = parts[2]; 
            return userId ? userId : 0; 
        }



//    const headers = { 'Accept': 'application/json',
//                     'Content-Type': 'application/json',
//                     "X-Authuser" : getAuthIdFromUrl(),
//                     "X-Request-Agent":"APP",
//                     "X-SID":"sid_r3fCxGnrMOp07mKQaCiS",
//                     "X-MUID":"mut_XHujrA2WUG51hx3uOLL8"}
    

                    
     const headers = { 'Accept': 'application/json', "X-Authuser": getAuthIdFromUrl() };


        useEffect(() => {
        GetTemplateCategories();
        }, []);

        const GetTemplateCategories = async () => {
        try {
            const res = await axios.get(`${baseURL}/categories`, {headers, withCredentials: true});
            console.log("data", res.data?.data?.values)
            setTemplateData(res.data?.data?.values); 
        } catch (err) {
            console.error("Error fetching categories:", err);
        }
        };


    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        setDropdownOpen(false);
    };
    const handleInputChange = (event) => {
        setSearchValue(event.target.value);
    };
    const OpenFilterModal = () => {
        setIsOpenFilterModal(true);
    };

    const closeFilterModal = () => {
        setIsOpenFilterModal(false);
    };
    const OpenSubmitModal = () => {
        setIsOpenSubmitModal(true);
    };

    const closeSubmitModal = () => {
        setIsOpenSubmitModal(false);
    };

    const OpenDeleteModal = () => {
        setIsOpenDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setIsOpenDeleteModal(false);
    };
    const handleTemplateMessage = () => {
        setIsOpenTemplateMessage(true);
    }
    return (
        <>
            {isOpenDeleteModal && (
                <TemplateDeleteModal show={OpenDeleteModal} onClose={closeDeleteModal} />
            )}
            {isOpenFilterModal && (
                <FilterTemplateModal show={OpenFilterModal} onClose={closeFilterModal} />
            )}
            {isOpenSubmitModal && (
                <TemplateSubmitModal show={OpenSubmitModal} onClose={closeSubmitModal} />
            )}
            <div className="Template-Left-container">
                {
                    isOpenTemplateMessage ? (
                        <>
                       
                            <NewTemplate isOpenTemplateMessage={isOpenTemplateMessage} setIsOpenTemplateMessage={setIsOpenTemplateMessage} />
                        </>
                    )
                        : (
                            <div>
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
                                                <button className="btn btn-success template-library-new-button" onClick={handleTemplateMessage} >New Template Message</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='your__template_left_section'>
                                        <div className="custom-action-bar-search">
                                            <div className="custom-search-input-container"   >
                                                <div className="custom-input-wrap">
                                                    <input
                                                        type="text"
                                                        className="custom-search-input"
                                                        placeholder="Search..."
                                                        value={searchValue}
                                                        onChange={handleInputChange}

                                                    />
                                                    <div tabIndex="0" className="custom-search-icon">
                                                        <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="your-template-filter">
                                            <span aria-label="Filter contacts..." onClick={OpenFilterModal}>
                                                <div className="custom-filter-button" role="button" tabIndex="0" aria-label="Open Filter"  >
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
                                                <div className={`contact-custom-dropdown ${isDropdownOpen ? "contact-dropdown-active" : ""}`}
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
                                                        <button type="button" className="custom-button export-button" aria-label="Export to CSV"  >
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
                                                        <button type="button" className="custom-button import-button" aria-label="Import from CSV"  >
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
                                    {/* <Table className='template__table'>
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
                                                            className={`message-badge ${row.status === "APPROVED"
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
                                                            <Tooltip title="Submit Template" onClick={OpenSubmitModal}>
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
                                                        {row.status === "DRAFT" && (
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

                                    </Table> */}
                                    <Table className='template__table'>
                                        <TableHead className='template__table__Head'>
                                            <TableRow>
                                                <TableCell>Category Name</TableCell>
                                                <TableCell>Description</TableCell>
                                                <TableCell>Slug</TableCell>
                                                <TableCell>Status</TableCell>
                                                {/* <TableCell>Color</TableCell> */}
                                                <TableCell>Created At</TableCell>
                                                <TableCell>Actions</TableCell>
                                            </TableRow>
                                            </TableHead>

                                        <TableBody className="template__table__body">
                                        {templateData.map((row) => (
                                            <TableRow key={row.id}>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>{row.description}</TableCell>
                                            <TableCell>{row.slug}</TableCell>
                                            <TableCell>
                                                <span className={`message-badge ${row.is_active ? "message-badge_approved" : "message-badge_draft"}`}>
                                                {row.is_active ? "Active" : "Inactive"}
                                                </span>
                                            </TableCell>
                                            {/* <TableCell>
                                                <span style={{ backgroundColor: row.color }} className="inline-block w-4 h-4 rounded-full mr-2"></span>
                                                {row.color}
                                            </TableCell> */}
                                            <TableCell>{new Date(row.updated_at).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Tooltip title="Edit Category">
                                                <button className="cell__edit">Edit</button>
                                                </Tooltip>
                                                <Tooltip title="Delete Category">
                                                <button className="cell__delete">Delete</button>
                                                </Tooltip>
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
                                                    <p className="Previouspage Pagintaion__action " aria-label="Go to previous page" title="Go to previous page">
                                                        <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 24 24" className="leftRightArrow" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M1.02698 11.9929L5.26242 16.2426L6.67902 14.8308L4.85766 13.0033L22.9731 13.0012L22.9728 11.0012L4.85309 11.0033L6.6886 9.17398L5.27677 7.75739L1.02698 11.9929Z" fill="currentColor"></path>
                                                        </svg>
                                                        <span className="pagination_previousnextcont" >Previous</span>
                                                    </p>
                                                    <p className="nextPage Pagintaion__action  " aria-label="Go to next page" title="Go to next page">
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
                        )


                }

            </div>
        </>
    )
}
export default YourTemplate;