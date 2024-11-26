import React, { useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { RiWhatsappFill } from "react-icons/ri";
import { MdClose } from "react-icons/md";
import countrycode from '../Component/Assets/img/Contact/country_code.svg'
import { Table, TableBody, TableCell, TableHead, TablePagination, TableRow, IconButton, Tooltip ,  TextField,  MenuItem,Select,} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DeleteIcon from "@mui/icons-material/Delete";

const countries = [
    { flag: "https://www.worldometers.info//img/flags/small/tn_in-flag.gif", shortname: "IN", code: "+91", name: "India" },
    { flag: "https://www.worldometers.info//img/flags/small/tn_ae-flag.gif", shortname: "AE", code: "+971", name: "United Arab Emirates" },
    { flag: "https://www.worldometers.info//img/flags/small/tn_us-flag.gif", shortname: "US", code: "+1", name: "United States" },
    { flag: "https://www.worldometers.info//img/flags/small/tn_uk-flag.gif", shortname: "UK", code: "+44", name: "United Kingdom" },
];

const options = [
    "+ ADD NEW",
    "actual_fare",
    "actual_estimate",
    "additional_items",
  ];
  
const AddContactModal = ({ isOpen, onClose, onSave }) => {
    const [contact, setContact] = useState({
        name: '',
        phone: '',
        customAttributes: [],
    });
    const [attributes, setAttributes] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState({
      flag: countrycode,
      shortname: "",
      code: "",
    });
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setContact((prev) => ({ ...prev, [name]: value }));
    };
   

    const handleAddAttribute = () => {
      setAttributes([...attributes, { key: "", value: "" }]);
    };
  
    const handleRemoveAttribute = (index) => {
      const updatedAttributes = attributes.filter((_, i) => i !== index);
      setAttributes(updatedAttributes);
    };
  
    const handleAttributeChange = (index, field, value) => {
      const updatedAttributes = [...attributes];
      updatedAttributes[index][field] = value;
      setAttributes(updatedAttributes);
    };
  

    const handleSave = () => {
        onSave(contact);
        onClose();
    };

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    
    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
        setIsDropdownOpen(false);
    };
    
    const toggleDropdown = () => {
        setShowDropdown((prev) => !prev);
    };
    
    const handleSelectOption = (option) => {
        setSelectedOption(option);
        setShowDropdown(false); 
    };
  

    if (!isOpen) return null;

    return (
        <div className="contact-modal">
            <div className="contact-modal-content">
                <div className="contact-popup-header">
                    <h6>Add Contact</h6>
                    <button className="contact-close-btn" onClick={onClose} aria-label="Close">
                        <MdClose />
                    </button>
                </div>
                <div className="contact-popup-Fields">
                    <div className="contact-align-field">
                        <div className="form-field">
                            <label>Name</label>
                            <input type="text" name="name" placeholder="name" value={contact.name} onChange={handleInputChange} className="edit__contact-name" />
                        </div>
                        <div className="form-field">
                            <label>Phone Number</label>
                            <div className="phone-input">
                                <div className="phone-input-select">
                                    <div className="country-code"> 
                                        <div className="country-selector"> 
                                            {selectedCountry.code ? ( 
                                                <div className="has-selected-country" role="button" onClick={handleDropdownToggle}>
                                                <img src={selectedCountry.flag} alt={`Flag of ${selectedCountry.shortname}`} className="selected-img" />
                                                <span className="country-shortname">{selectedCountry.shortname}</span>
                                                <svg width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="dropdown-icon">
                                                    <path d="M9.57143 9.57143L5.28571 13L1 9.57143M1 4.42857L5.28571 1L9.57143 4.42857" stroke="black" strokeWidth="1.13333" strokeLinecap="square"></path>
                                                </svg>
                                            </div>
                                            ) : ( 
                                                <div className="not-selected-country" role="button" onClick={handleDropdownToggle}>
                                                    <img className="selected-img" src={countrycode} alt="Default country selection" />
                                                    <svg width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="dropdown-icon">
                                                    <path d="M9.57143 9.57143L5.28571 13L1 9.57143M1 4.42857L5.28571 1L9.57143 4.42857" stroke="black" strokeWidth="1.13333" strokeLinecap="square"></path>
                                                    </svg>
                                                </div>
                                            )} 
                                            {isDropdownOpen && ( 
                                                <div className="contact-dropdown-menu">
                                                <span className="contact-dropdown-title">Top Countries</span> 
                                                {countries.map((country, index) => ( 
                                                    <div className="contact-dropdown-item" key={index} onClick={()=> handleCountrySelect(country)} > 
                                                    <img src={country.flag} alt={`Flag of ${country.name}`} className="contact-country-flag selected-imgs" />
                                                    <span className="contact-country-name">{country.name}</span>
                                                    <span className="contact-country-code">({country.code})</span>
                                                    </div> 
                                                ))}
                                            </div> 
                                            )} 
                                        </div>
                                    </div>
                                </div> 
                                {selectedCountry.code ? ( 
                                <>
                                    <input type="text" name="phone" placeholder={`(${selectedCountry.code})9876543210`} value={contact.phone} onChange={handleInputChange} className="edit__contact-phone" />
                                </> 
                                ) : ( 
                                <>
                                    <input type="text" name="phone" placeholder="(---)9876543210" value={contact.phone} onChange={handleInputChange} className="edit__contact-phone" />
                                </> 
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="custom-attributes">
                        <h6>Custom Attributes <span className='optional-content'>(Optional)</span>
                        </h6> 
                        {attributes.map((attribute, index) => ( 
                            <div className="contact-align-field" key={index}>
                                <div className="form-field">
                                    <label>Attribute</label>
                                    <div className="custom__param-name">
                                    <div className="custom__param-search-dropdown" role="menu" tabIndex="0">
                                        <div className="selected-item" onClick={toggleDropdown}>
                                        <input className="custom__param-input" type="text" value={selectedOption || "Select a param" } onClick={toggleDropdown} placeholder="Select a param" readOnly />
                                        <div className="dropdown-icon">
                                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"></path>
                                            </svg>
                                        </div> {showDropdown && ( <div className="dropdown-options"> {options.map((option, index) => ( <div key={index} className="dropdown-option" onClick={()=> handleSelectOption(option)} > <div className="option-label">{option}</div>
                                            </div> ))} </div> )}
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                <div className="form-field">
                                    <label>Value</label>
                                    <div className="custom__param-value">
                                    <input type="text" name="value" placeholder="Enter value" className="custom__param-value-input" value={attribute.value} onChange={(e)=> handleAttributeChange(index, "value", e.target.value) } /> <div class="custom__param-value-error"></div>
                                    </div>
                                </div>
                                <button className="custom__param-delete" onClick={()=> handleRemoveAttribute(index)} > <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path>
                                    <path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" stroke-width="1.25" stroke-linecap="round"></path>
                                    </svg>
                                </button>
                            </div> 
                        ))} 
                        <button className="add-attribute-btn" onClick={handleAddAttribute}> + Add Attribute </button>
                    </div>
                </div>
                <div className="modal-actions">
                    <button className="cancel-btn" onClick={onClose}> Cancel </button>
                    <button className="save-btn" onClick={handleSave}> Save </button>
                </div>
            </div>
        </div>
    );
};
   
const allOptions = ["Last Updated", "Name", "Created Date"];
const ContactUs = () => {
    const [selectedOption, setSelectedOption] = useState("Last Updated");
    const [isDropdownOpen, setDropdownOpen] = useState(false); 
    const [searchValue, setSearchValue] = useState(""); 
    const filteredOptions = allOptions.filter(option => option !== selectedOption);
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [contactData, setContactData] = useState([
        { id: 1, name: "Lakshmi", phone: "(+91)9941004073", source: "", attributes: "" },
        { id: 2, name: "MC Sathish 👿", phone: "(+91)9790227160", source: "", attributes: "" },
        { id: 3, name: "Pavan Kumar", phone: "(+91)6379982716", source: "", attributes: "" },
        { id: 4, name: "Muthu", phone: "(+91)9840912285", source: "", attributes: "" },
    ]);

    const handleOptionSelect = (option) => {
      setSelectedOption(option); 
      setDropdownOpen(false); 
    };
    
    const handleInputChange = (e) => {
        
        setSearchValue(e.target.value); 
    };

    const handleModalToggle = () =>{  setIsModalOpen(!isModalOpen);
    if (!isModalOpen) {
        document.body.classList.add('no-scroll');
        } else {
        document.body.classList.remove('no-scroll');
        }
    };
  
    const handleAddContact = (newContact) => {
    setContactData((prevContacts) => [
        ...prevContacts,
        { id: prevContacts.length + 1, ...newContact },
    ]);
    setIsModalOpen(false);
    };
    
    const filteredData = contactData.filter((row) =>
        row.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const displayedRows = filteredData.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    const handleSelectAll = (event) => {
        if (event.target.checked) {
        setSelected(displayedRows.map((row) => row.id));
        } else {
        setSelected([]);
        }
    };

    const handleSelectRow = (event, id) => {
        if (event.target.checked) {
        setSelected((prevSelected) => [...prevSelected, id]);
        } else {
        setSelected((prevSelected) => prevSelected.filter((item) => item !== id));
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handlePreviousPage = () => {
        if (page > 0) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < Math.ceil(filteredData.length / rowsPerPage) - 1) setPage(page + 1);
    };

    const isPreviousActive = page > 0; 
    const isNextActive = page < Math.ceil(filteredData.length / rowsPerPage) - 1;

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [rows, setRows] = useState([]);

    const addRow = () => {
      setRows([
        ...rows,
        { attribute: "", operation: "", value: "" }, 
      ]);
    };
  
    const deleteRow = (index) => {
      const updatedRows = rows.filter((_, i) => i !== index);
      setRows(updatedRows);
    };
  
    const handleInputChanges = (index, field, value) => {
      const updatedRows = rows.map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      );
      setRows(updatedRows);
    }

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };
    const [isOpenAttribute, setIsOpenAttribute] = useState(false);
    const [isOpenOperation, setIsOpenOperation] = useState(false);

    const handleDropdownattribute = () => {
        setIsOpenAttribute(!isOpenAttribute);
    };
    const handleDropdownoperation = () => {
        setIsOpenOperation(!isOpenOperation);
      };

  
    return (
        <>
            <section className="main-contact-wrapper">
                <div className="main-contact-section">
                    <div className="main-top-container">
                        <div className="contact-heading-profile">
                            <h1>Contacts</h1>
                            <span>Contact list stores the list of numbers that you've interacted with. You can even <br />manually export or import contacts.</span> 
                        </div>
                        <div className="contact-bar-contacts">
                            <ul>
                                <li className='watch-icon'>
                                    <Link 
                                        to="https://www.youtube.com/watch?v=6xguOZ5Lvw8" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        
                                    >
                                        <i className="fa fa-play-circle" aria-hidden="true" style={{ fontSize: '26px' }}></i>
                                        Watch Tutorial
                                    </Link>
                                </li>
                                <li  className='contact-add-button'>
                                    <button className='btn btn-success' onClick={handleModalToggle}>+ Add Contact</button>
                                    <div className="contact-add-button__total">({contactData.length} in total)</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="main-contact-actionbar">
                    <div className="actionbar-fileter-group">
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
                        <div className="custom-action-bar-search">
                            <div className="custom-search-input-container"   data-testid="custom-search-bar-input">
                                <div className="custom-input-wrap">
                                <input
                                    type="text"
                                    className="custom-search-input"
                                    placeholder="Search..."
                                    value={searchValue} // Controlled value linked to state
                                    onChange={handleInputChange}
                                    data-testid="custom-search-input"
                                />
                                <div tabIndex="0" className="custom-search-icon">
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
                                </div>
                                </div>
                            </div>
                        </div>
                        <div className="custom-filter">
                            <span aria-label="Filter contacts..." onClick={togglePopup}>
                                <div className="custom-filter-button" role="button" tabIndex="0" aria-label="Open Filter" data-testid="custom-filter-button">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.1169 17.9867H2.88281" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M21.1174 17.9864C21.1174 19.577 19.828 20.8664 18.2374 20.8664C16.6468 20.8664 15.3574 19.577 15.3574 17.9864C15.3574 16.3947 16.6468 15.1064 18.2374 15.1064C19.828 15.1064 21.1174 16.3947 21.1174 17.9864Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                    <path d="M13.8828 6.26206H21.1181" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path fillRule="evenodd" clipRule="evenodd" d="M2.88281 6.26208C2.88281 7.85384 4.17222 9.14208 5.76281 9.14208C7.3534 9.14208 8.64281 7.85384 8.64281 6.26208C8.64281 4.67149 7.3534 3.38208 5.76281 3.38208C4.17222 3.38208 2.88281 4.67149 2.88281 6.26208Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                                </div>
                            </span>
                        </div>
                    
                    </div>
                    <div className="actionbar-fileter-group">
                        <div className="custom-export-import">
                            <div className="buttons">
                            <div className="button-left">
                                <button type="button" className="custom-button export-button" aria-label="Export to CSV" data-testid="contacts-actionBar-contactBar-export-button">
                                <div className="button-child">
                                    <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.10189 0.825209L9.10189 10.8594" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                    <path d="M11.5322 3.27344L9.10223 0.833437L6.67223 3.27344" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                    <path d="M12.963 5.78125H13.7405C15.4364 5.78125 16.8105 7.15542 16.8105 8.85208V12.9221C16.8105 14.6137 15.4397 15.9846 13.748 15.9846L4.46471 15.9846C2.76888 15.9846 1.39388 14.6096 1.39388 12.9137L1.39388 8.84292C1.39388 7.15208 2.76555 5.78125 4.45638 5.78125L5.24138 5.78125" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                    </svg>
                                    <div className="button-title">Export</div>
                                </div>
                                </button>
                            </div>
                            <div className="button-right">
                                <button type="button" className="custom-button import-button" aria-label="Import from CSV" data-testid="contacts-actionBar-contactBar-import-button">
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
                            </div>
                            </div>
                        </div>
                        <button aria-label="delete" className="custom-delete-button">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"> </path>
                                <path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" strokeWidth="1.25" strokeLinecap="round"></path>
                            </svg>
                        </button>
                    </div>
                    
                </div>
                <div className="contact-table-container">
                    <Table  className='contact__table '>
                        <TableHead>
                            <TableRow>
                            <TableCell className='alignLeft'>
                                <label className="custom-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={selected.length === displayedRows.length && displayedRows.length > 0}
                                        onChange={handleSelectAll}
                                    />
                                    <span className="checkmark"></span>
                                </label>
                            </TableCell>
                            <TableCell className='contact__name alignLeft'>Basic Info</TableCell>
                            <TableCell className='alignLeft'>Phone Number</TableCell>
                            <TableCell className='alignLeft'>Source</TableCell>
                            <TableCell className='alignLeft'>Contact Attributes</TableCell>
                            <TableCell className='alignLeft'>Edit/Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayedRows.map((row) => (
                            <TableRow key={row.id} className='contact__body'>
                                <TableCell padding="checkbox">
                                    <label className="custom-checkbox">
                                    <input
                                    type="checkbox"
                                    checked={selected.includes(row.id)}
                                    onChange={(event) => handleSelectRow(event, row.id)}
                                    />
                                    <span className="checkmark"></span>
                                    </label>
                                </TableCell>
                                <TableCell className='contact__name'>
                                    <div className="contact__full-name" data-testid="contacts-list-contactRow-fullName" role="button" tabIndex="0">
                                        <p>{row.name}</p>
                                        <div className="contact__whatsapp-icon">
                                        <RiWhatsappFill size={16} color="#2CB742" />
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="contact__phone"> 
                                        <img src="https://cdn.clare.ai/flags/IN.svg" alt="country flag" className="item-country-flag" />
                                        <p>{row.phone}</p>
                                    </div>
                                </TableCell>
                                <TableCell>{row.source}</TableCell>
                                <TableCell>{row.attributes}</TableCell>
                                <TableCell>
                                    <Tooltip title="Edit">
                                        <IconButton aria-label="edit">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><g clipPath="url(#clip0_381_1977)"><path d="M7.33333 2.66675H2.66666C2.31304 2.66675 1.9739 2.80722 1.72385 3.05727C1.4738 3.30732 1.33333 3.64646 1.33333 4.00008V13.3334C1.33333 13.687 1.4738 14.0262 1.72385 14.2762C1.9739 14.5263 2.31304 14.6667 2.66666 14.6667H12C12.3536 14.6667 12.6928 14.5263 12.9428 14.2762C13.1929 14.0262 13.3333 13.687 13.3333 13.3334V8.66675" stroke="#848A86" strokeLinecap="round" strokeLinejoin="round"></path><path d="M12.3333 1.66666C12.5985 1.40144 12.9583 1.25244 13.3333 1.25244C13.7084 1.25244 14.0681 1.40144 14.3333 1.66666C14.5985 1.93187 14.7475 2.29158 14.7475 2.66666C14.7475 3.04173 14.5985 3.40144 14.3333 3.66666L8 9.99999L5.33333 10.6667L5.99999 7.99999L12.3333 1.66666Z" stroke="#848A86" strokeLinecap="round" strokeLinejoin="round"></path></g><defs><clipPath id="clip0_381_1977"><rect width="16" height="16" fill="white" fillOpacity="1"></rect></clipPath></defs></svg>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton aria-label="delete">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1.59998 3.59995L14.4 3.59995M11.2 14.8H4.79998C3.91632 14.8 3.19998 14.0836 3.19998 13.2V4.39995C3.19998 3.95812 3.55815 3.59995 3.99998 3.59995H12C12.4418 3.59995 12.8 3.95812 12.8 4.39995V13.2C12.8 14.0836 12.0836 14.8 11.2 14.8ZM6.39998 3.59995H9.59998C10.0418 3.59995 10.4 3.24178 10.4 2.79995V1.99995C10.4 1.55812 10.0418 1.19995 9.59998 1.19995H6.39998C5.95815 1.19995 5.59998 1.55812 5.59998 1.99995V2.79995C5.59998 3.24178 5.95815 3.59995 6.39998 3.59995Z" stroke="#848A86" strokeLinecap="round"></path></svg>
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="pagination-wrapper">
                        <div className='sequence__pagination'>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, 100]}
                                count={filteredData.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={() => (
                                    <div className='tablepagination__action'>
                                        <div>
                                            <p onClick={handlePreviousPage} className={`Previouspage ${isPreviousActive ? 'active' : 'inactive'}`} aria-label="Go to previous page" title="Go to previous page">
                                                <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 24 24" className="leftRightArrow" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1.02698 11.9929L5.26242 16.2426L6.67902 14.8308L4.85766 13.0033L22.9731 13.0012L22.9728 11.0012L4.85309 11.0033L6.6886 9.17398L5.27677 7.75739L1.02698 11.9929Z" fill="currentColor"></path>
                                                </svg>
                                                <span className="pagination_previousnextcont" >Previous</span>
                                            </p>
                                        </div>
                                        <div>
                                            <p onClick={handleNextPage}  className={`nextPage ${isNextActive ? 'active' : 'inactive'}`}  aria-label="Go to next page" title="Go to next page">
                                                <span className="pagination_previousnextcont" >Next</span>
                                                <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 24 24" className="leftRightArrow" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M23.0677 11.9929L18.818 7.75739L17.4061 9.17398L19.2415 11.0032L0.932469 11.0012L0.932251 13.0012L19.2369 13.0032L17.4155 14.8308L18.8321 16.2426L23.0677 11.9929Z" fill="currentColor"></path>
                                                </svg>
                                            </p>
                                        </div>
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
                {isModalOpen && (
                    <AddContactModal isOpen={isModalOpen} onClose={handleModalToggle} onSave={handleAddContact} />
                )}
                {isPopupOpen && (
                    <div className="filter-popup ">
                        <div className="contact-filter-content">
                            <div className="contact-popup-header">
                            <h6>Filter Contacts</h6>
                            <button className="contact-close-btn"  onClick={togglePopup}>
                            <MdClose />
                            </button>
                            
                            </div>
                            <div className='contact-popup-main'>
                                <Table>
                                <TableBody >
                                    {rows.map((row, index) => (
                                    <TableRow key={index} className='contact-filter-row'>
                                        <TableCell className="filter-dropdown">
                                        <Select
                                            value={row.attribute}
                                            displayEmpty
                                            className="contact-filter-select"
                                            onChange={(e) => handleInputChange(index, "attribute", e.target.value)}
                                            fullWidth
                                            open={isOpenAttribute} 
                                            onOpen={handleDropdownattribute} 
                                            onClose={handleDropdownattribute}
                                            IconComponent={(props) => (
                                                <span className={`contact-filter-select-left ${isOpenAttribute  ? "rotate" : ""}`}  {...props}  >
                                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"></path></svg>
                                                </span>
                                            )}
                                            sx={{
                                            "& .MuiOutlinedInput-notchedOutline": {
                                                borderColor: "grey", 
                                            },
                                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                borderColor: "rgb(35, 164, 85)", 
                                            },
                                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                                borderColor: "rgb(35, 164, 85) !important", 
                                            },
                                            }}
                                            renderValue={(selected) =>
                                            selected ? selected : <span style={{ color: "grey" }}>Attribute</span> 
                                            }
                                        >
                                            <MenuItem value="" disabled style={{ color: "grey" }}>
                                            Attribute
                                            </MenuItem>
                                            <MenuItem value="Option 1">Option 1</MenuItem>
                                            <MenuItem value="Option 2">Option 2</MenuItem>
                                            <MenuItem value="Option 3">Option 3</MenuItem>
                                        </Select>
                                        </TableCell>
                                        <TableCell className="filter-dropdown">
                                        <Select
                                            value={row.operation}
                                            displayEmpty
                                            className="contact-filter-select"
                                            onChange={(e) => handleInputChange(index, "operation", e.target.value)}
                                            fullWidth
                                            open={isOpenOperation}
                                            onOpen={handleDropdownoperation}
                                            onClose={handleDropdownoperation}
                                            IconComponent={(props) => (
                                                <span className={`contact-filter-select-left ${isOpenOperation  ? "rotate" : ""}`} {...props}>
                                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"></path></svg>
                                                </span>
                                            )}
                                            sx={{
                                            "& .MuiOutlinedInput-notchedOutline": {
                                                borderColor: "grey", 
                                            },
                                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                borderColor: "rgb(35, 164, 85)", 
                                            },
                                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                                borderColor: "rgb(35, 164, 85) !important", 
                                            },
                                            }}
                                            renderValue={(selected) =>
                                            selected ? selected : <span style={{ color: "grey" }}>Operation</span> 
                                            }
                                        >
                                            <MenuItem value="" disabled style={{ color: "grey" }}>
                                            Operation
                                            </MenuItem>
                                            <MenuItem value="Equals">Equals</MenuItem>
                                            <MenuItem value="Contains">Contains</MenuItem>
                                            <MenuItem value="Starts with">Starts with</MenuItem>
                                        </Select>
                                        </TableCell>
                                        <TableCell className="filter-dropdown">
                                        <TextField
                                            placeholder="Value"
                                            value={row.value}
                                            className="contact-filter-select"
                                            onChange={(e) => handleInputChange(index, "value", e.target.value)}
                                            fullWidth
                                            sx={{
                                            "& .MuiOutlinedInput-notchedOutline": {
                                                borderColor: "grey", 
                                            },
                                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                borderColor: "rgb(35, 164, 85)", 
                                            },
                                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                                borderColor: "rgb(35, 164, 85) !important", 
                                            },
                                            "& input::placeholder": {
                                                color: "grey", 
                                            },
                                            }}
                                        />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton color="error" onClick={() => deleteRow(index)} className='filter-contact-button'>
                                            <Tooltip title="Delete" placement="top">
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path><path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" stroke-width="1.25" stroke-linecap="round"></path></svg>
                                            </Tooltip>
                                            </IconButton>
                                            
                                        </TableCell>
                                        
                                    
                                    </TableRow>
                                    ))}
                                </TableBody>
                                </Table>
                                <button className="add-attribute-btn"  onClick={addRow} >
                                    Add new Segment +
                                </button>
                            </div>
                            <div className="contact-popup-footer">
                            <Button variant="contained" color="primary" >
                                Apply
                            </Button>
                            </div>
                        </div>
                    </div>
                )}
            </section>
           
        </>
    );
}
export default ContactUs;





























{/* <div className='main-wrapper'>
                <div className="main-title-sec">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12 column">
                            <div className="heading-profile">
                                <h2>Contacts</h2>
                                <span>Contact list stores the list of numbers that you've interacted with. You can even <br />manually export or import contacts.</span> </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12 column">
                            <div className="top-bar-contacts">
                                <ul>
                                    <li className='watch-tut'><i className="fa fa-play-circle" aria-hidden="true"></i> Watch Tutorial</li>
                                    <li><button className='btn btn-success'>+ Add Contact</button></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="widget bg-f5f6fa p-3">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className='search-input'>
                                <ul>
                                    <li>Sorted by:</li>
                                    <li><Form.Select aria-label="Default select example">
                                        <option>Last Updated</option>
                                        <option value="1">Name</option>
                                        <option value="2">Created Date</option>
                                    </Form.Select></li>
                                    <li><InputGroup className="mb-3">
                                        <Form.Control
                                            placeholder="Username"
                                            aria-label="Username"
                                            aria-describedby="basic-addon1"
                                        />
                                        <InputGroup.Text id="basic-addon1"><i className="fa fa-search" aria-hidden="true"></i>
                                        </InputGroup.Text>
                                    </InputGroup>
                                    </li>
                                    <li> <a className='search-btn'><img src="assets/images/filter-icon.png" alt="" /></a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className='search-export'>
                                <ul>
                                    <li><span className='sea-btn-inn'><button className='btn btn-upload'><img src="assets/images/cloud-arrow-up.svg" alt="" /> Export</button><button className='btn btn-download'><img src="assets/images/cloud-download.svg" alt="" /> Import</button></span></li>
                                    <li><a className='red-delete-icon'><img src="assets/images/red-delete-icon.png" alt="" /></a></li>
                                </ul>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="widget white">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th><Form.Check className='contact-check' aria-label="option 1" /></th>
                                        <th>Basic Info</th>
                                        <th>Phone Number</th>
                                        <th>Contact Attributes</th>
                                        <th>Created Date</th>
                                        <th>Broadcast</th>
                                        <th>SMS</th>
                                        <th>Edit/Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th><Form.Check className='contact-check' aria-label="option 1" /></th>
                                        <td>919941004073</td>
                                        <td>(+91) 9941004073</td>
                                        <td className='contact-arti'><span className='mr-5'>Name:9999999999</span><span>Name:9999999999</span></td>
                                        <td>Aug-31-2024</td>
                                        <td><img className='check-img' src="assets/images/check.svg" alt="" /></td>
                                        <td><img className='check-img' src="assets/images/check.svg" alt="" /></td>
                                        <td className='cont-arti-edit-delete'><a href=''><i className="fa fa-pencil" aria-hidden="true"></i>
                                        </a><a href=''><i className="fa fa-trash-o" aria-hidden="true"></i>
                                        </a></td>
                                    </tr>
                                    <tr>
                                        <th><Form.Check className='contact-check' aria-label="option 1" /></th>
                                        <td>919941004073</td>
                                        <td>(+91) 9941004073</td>
                                        <td className='contact-arti'><span className='mr-5'>Name:9999999999</span><span>Name:9999999999</span></td>
                                        <td>Aug-31-2024</td>
                                        <td><img className='check-img' src="assets/images/check.svg" alt="" /></td>
                                        <td><img className='check-img' src="assets/images/check.svg" alt="" /></td>
                                        <td className='cont-arti-edit-delete'><a href=''><i className="fa fa-pencil" aria-hidden="true"></i>
                                        </a><a href=''><i className="fa fa-trash-o" aria-hidden="true"></i>
                                        </a></td>
                                    </tr>

                                    <tr>
                                        <th><Form.Check className='contact-check' aria-label="option 1" /></th>
                                        <td>919941004073</td>
                                        <td>(+91) 9941004073</td>
                                        <td className='contact-arti'><span className='mr-5'>Name:9999999999</span><span>Name:9999999999</span></td>
                                        <td>Aug-31-2024</td>
                                        <td><img className='check-img' src="assets/images/check.svg" alt="" /></td>
                                        <td><img className='check-img' src="assets/images/check.svg" alt="" /></td>
                                        <td className='cont-arti-edit-delete'><a href=''><i className="fa fa-pencil" aria-hidden="true"></i>
                                        </a><a href=''><i className="fa fa-trash-o" aria-hidden="true"></i>
                                        </a></td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div> */}