import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Autocomplete, TextField, Checkbox, Chip, IconButton, InputAdornment } from '@mui/material';
import { Modal, ModalBody } from 'react-bootstrap';
import { Select, MenuItem, FormControl } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";


const NewRuleModal = ({ show, onClose, onClick }) => {

    return (
        <>
            <Modal show={show} onHide={onClose} dialogClassName="newrule_modal">
                <div className='newrule_main_content'>
                    <Modal.Header className='newrule_header' closeButton>
                        <Modal.Title >Create a new rule</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='newrule_modal_bodycontent'>
                        <div className='newrule_trigger_text'>Pick a trigger</div>
                        <div className='newrule_trigger_subtext'>A trigger is an event that starts a rule. Once you turn on a rule, we will monitor for that trigger event.
                            <a href='#' target='_blank'>Learn more about triggers</a>
                        </div>
                        <div className='newrule_attribute_trigger'>
                            <div>
                                <div className='newrule_trigger_text'> Attribute based triggers</div>
                                <div className='newrule_attribute_grid'>
                                    <div className='newrule_attribute_grid_content' onClick={onClick}>
                                        <div className='newrule_attribute_image'>
                                            <div class="attribute_svg_image"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 12 12" fill="none"><path d="M1.89453 2.59619C1.13628 2.59619 0.519531 3.21294 0.519531 3.97119V6.72119C0.519531 7.47944 1.13628 8.09619 1.89453 8.09619H2.78271C2.77646 8.01344 2.76953 7.93069 2.76953 7.84619C2.76953 6.05419 4.22753 4.59619 6.01953 4.59619C7.81153 4.59619 9.26953 6.05419 9.26953 7.84619C9.26953 7.93069 9.26334 8.01344 9.25684 8.09619H10.1445C10.9028 8.09619 11.5195 7.47944 11.5195 6.72119V3.97119C11.5195 3.21294 10.9028 2.59619 10.1445 2.59619H1.89453ZM6.00049 5C4.48174 5 3.25049 6.23125 3.25049 7.75C3.25049 9.26875 4.48174 10.5 6.00049 10.5C7.51924 10.5 8.75049 9.26875 8.75049 7.75C8.75049 6.23125 7.51924 5 6.00049 5ZM6.00049 5.75C6.13849 5.75 6.25049 5.862 6.25049 6V7.5H7.75049C7.88849 7.5 8.00049 7.612 8.00049 7.75C8.00049 7.888 7.88849 8 7.75049 8H6.25049V9.5C6.25049 9.638 6.13849 9.75 6.00049 9.75C5.86249 9.75 5.75049 9.638 5.75049 9.5V8H4.25049C4.11249 8 4.00049 7.888 4.00049 7.75C4.00049 7.612 4.11249 7.5 4.25049 7.5H5.75049V6C5.75049 5.862 5.86249 5.75 6.00049 5.75Z" fill="white"></path></svg></div>
                                        </div>
                                        <div class="gridcontent_trigger__text">New attribute is added to a contact</div>
                                    </div>
                                    <div className='newrule_attribute_grid_content' onClick={onClick}>
                                        <div className='newrule_attribute_image'>
                                            <div class="attribute_svg_image"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 12 12" fill="none"><path d="M4 1.5C3.4475 1.5 3 1.9475 3 2.5V6C3 6.5525 3.4475 7 4 7H5.5V8.5C5.5 9.04653 5.95347 9.5 6.5 9.5H10C10.5465 9.5 11 9.04653 11 8.5V5C11 4.45347 10.5465 4 10 4H8.5V2.5C8.5 1.9475 8.0525 1.5 7.5 1.5H4ZM8.5 5H10V8.5H6.5V7H7.5C8.0525 7 8.5 6.5525 8.5 6V5ZM1 7V9C1 9.54653 1.45347 10 2 10H3.5V11L5 9.5L3.5 8V9H2V7H1Z" fill="white"></path></svg></div>
                                        </div>
                                        <div class="gridcontent_trigger__text">An attribute value is changed for a contact</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <div className='newrule_modal_footer'><a class="newrulemodal_footer__link" href="https://feedback.wati.io/board-1/feedback?typeId=c4739cc2-c0ac-4062-893a-26ddb645549f" target="_blank">Don’t see a trigger that you need? Suggest a new trigger here!</a></div>
                </div>
            </Modal>
        </>
    )
}
const ActionSelect = ({ options, selectedOption, onChange, placeholder, styleProps }) => {
    return (
        <FormControl fullWidth>
            <Select
                value={selectedOption}
                onChange={onChange}
                sx={{
                    height: 36,
                    backgroundColor: "white",
                    border: "1px solid rgb(242, 242, 242)",
                    borderRadius: "4px",
                    fontSize: "13px",
                    boxShadow: "none",
                    width: "95%",
                    ...styleProps,
                    "&:hover": {
                        border: "1px solid rgb(242, 242, 242)",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                        border: "none", // Removes extra outlines
                    },
                    "&.Mui-focused": {
                        border: "1px solid rgb(242, 242, 242)", // Keeps the same border on focus
                        boxShadow: "none", // Removes shadow when focused
                    },
                    "& .MuiSelect-select": {
                        padding: "8px 12px", // Ensures proper padding for the dropdown text
                    },
                }}
                MenuProps={{
                    PaperProps: {
                        sx: {
                            borderRadius: "4px",
                            border: "1px solid rgb(242, 242, 242)",
                        },
                    },
                }}
                displayEmpty
                renderValue={(selected) => {
                    if (!selected) {
                        return placeholder || " ";
                    }
                    const option = options.find((opt) => opt.id === selected);
                    return (
                        <div>
                            <span className="actionproperties_dropdown_value_svg">
                                {option?.svg}
                            </span>
                            {option?.label}
                        </div>
                    );
                }}
            >
                {options.map((option) => (
                    <MenuItem
                        key={option.id}
                        value={option.id}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            backgroundColor:
                                selectedOption === option.id ? "#eceff1" : "transparent",
                            "&.Mui-selected": {
                                backgroundColor: "#eceff1",
                            },
                            "&.Mui-selected:hover": {
                                backgroundColor: "#eceff1",
                            },
                            "&:hover, &:focus": {
                                backgroundColor: "#eceff1",
                            },
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                            <span className="actionproperties_dropdown_svg">{option.svg}</span>
                            <span
                                className={`triggerproperties_dropdown_label ${selectedOption === option.id ? "selected-label" : ""
                                    }`}
                            >
                                {option.label}
                            </span>
                            {selectedOption === option.id && (
                                <CheckIcon
                                    sx={{
                                        position: "absolute",
                                        right: "12px",
                                        color: "green",
                                    }}
                                />
                            )}
                        </div>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
const TriggerPropertiesModal = ({ show, onClose }) => {
    const options = [
        {
            id: 1, label: "New attribute is added to a contact", svg: (
                <svg style={{background:"#ff9500",padding:"3px",marginRight:"8px"}}xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 12 12" fill="none"><path d="M1.89453 2.59619C1.13628 2.59619 0.519531 3.21294 0.519531 3.97119V6.72119C0.519531 7.47944 1.13628 8.09619 1.89453 8.09619H2.78271C2.77646 8.01344 2.76953 7.93069 2.76953 7.84619C2.76953 6.05419 4.22753 4.59619 6.01953 4.59619C7.81153 4.59619 9.26953 6.05419 9.26953 7.84619C9.26953 7.93069 9.26334 8.01344 9.25684 8.09619H10.1445C10.9028 8.09619 11.5195 7.47944 11.5195 6.72119V3.97119C11.5195 3.21294 10.9028 2.59619 10.1445 2.59619H1.89453ZM6.00049 5C4.48174 5 3.25049 6.23125 3.25049 7.75C3.25049 9.26875 4.48174 10.5 6.00049 10.5C7.51924 10.5 8.75049 9.26875 8.75049 7.75C8.75049 6.23125 7.51924 5 6.00049 5ZM6.00049 5.75C6.13849 5.75 6.25049 5.862 6.25049 6V7.5H7.75049C7.88849 7.5 8.00049 7.612 8.00049 7.75C8.00049 7.888 7.88849 8 7.75049 8H6.25049V9.5C6.25049 9.638 6.13849 9.75 6.00049 9.75C5.86249 9.75 5.75049 9.638 5.75049 9.5V8H4.25049C4.11249 8 4.00049 7.888 4.00049 7.75C4.00049 7.612 4.11249 7.5 4.25049 7.5H5.75049V6C5.75049 5.862 5.86249 5.75 6.00049 5.75Z" fill="white"></path></svg>
            )
        },
        { id: 2, label: "An attribute valueis changed for a contact", svg: (<svg  style={{background:"#ff9500",padding:"3px",marginRight:"8px"}}  xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 12 12" fill="none"><path d="M4 1.5C3.4475 1.5 3 1.9475 3 2.5V6C3 6.5525 3.4475 7 4 7H5.5V8.5C5.5 9.04653 5.95347 9.5 6.5 9.5H10C10.5465 9.5 11 9.04653 11 8.5V5C11 4.45347 10.5465 4 10 4H8.5V2.5C8.5 1.9475 8.0525 1.5 7.5 1.5H4ZM8.5 5H10V8.5H6.5V7H7.5C8.0525 7 8.5 6.5525 8.5 6V5ZM1 7V9C1 9.54653 1.45347 10 2 10H3.5V11L5 9.5L3.5 8V9H2V7H1Z" fill="white"></path></svg>) },
    ];
    const contactOptions = [
        { id: 1, label: 'Source' },
        { id: 2, label: 'Channel' },
        { id: 3, label: 'actual_fare' },
        { id: 4, label: 'actuall_estimate' },
        { id: 5, label: 'additional_items' }
    ]
    const [selectedOption, setSelectedOption] = useState("");
    const [SelectedContactOption, setSelectedContactOption] = useState("");

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
    };
    const handleContactChange = (event) => {
        setSelectedContactOption(event.target.value);
    }
    return (
        <>
            <Modal show={show} onHide={onClose} backdrop={false}
                dialogClassName="custom_triggerpropertiesmodal">
                <div className='triggerproperties_content_container'>
                    <Modal.Header className='triggerproperties_header' closeButton>
                        <Modal.Title >Trigger Properties</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='triggerproperties_modal_bodycontent'>
                        <div className='trigger_text'>
                            <div className='learn_more_text'>Your rule will trigger based on the below properties</div>
                            <a href='https://support.wati.io/l/en/article/4t7p3q876y-learn-more-about-triggers' className='learn_more_link'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2.66683 2.66651C2.31321 2.66651 1.97407 2.80698 1.72402 3.05703C1.47397 3.30708 1.3335 3.64622 1.3335 3.99984V11.9998C1.3335 12.3535 1.47397 12.6926 1.72402 12.9426C1.97407 13.1927 2.31321 13.3332 2.66683 13.3332H6.66683C7.17883 13.3332 7.64683 13.1405 8.00016 12.8238C8.3535 13.1405 8.8215 13.3332 9.3335 13.3332H13.3335C13.6871 13.3332 14.0263 13.1927 14.2763 12.9426C14.5264 12.6926 14.6668 12.3535 14.6668 11.9998V3.99984C14.6668 3.64622 14.5264 3.30708 14.2763 3.05703C14.0263 2.80698 13.6871 2.66651 13.3335 2.66651H9.3335C8.8215 2.66651 8.3535 2.85917 8.00016 3.17584C7.63385 2.84725 7.15892 2.66583 6.66683 2.66651H2.66683ZM7.3335 4.66651V11.3332C7.3335 11.51 7.26326 11.6796 7.13823 11.8046C7.01321 11.9296 6.84364 11.9998 6.66683 11.9998H2.66683V3.99984H6.66683C6.84364 3.99984 7.01321 4.07008 7.13823 4.1951C7.26326 4.32013 7.3335 4.48969 7.3335 4.66651ZM8.66683 11.3332V4.66651C8.66683 4.48969 8.73707 4.32013 8.86209 4.1951C8.98712 4.07008 9.15668 3.99984 9.3335 3.99984H13.3335V11.9998H9.3335C9.15668 11.9998 8.98712 11.9296 8.86209 11.8046C8.73707 11.6796 8.66683 11.51 8.66683 11.3332Z" fill="#1B74E3"></path></svg>
                                Learn more about triggers
                            </a>
                        </div>
                        <div className='trigger_details'>Trigger Details</div>
                        <div className='trigger_type_container'>
                            <div className='triggertype_text'>Trigger Type</div>
                            {/* <FormControl fullWidth
                            >

                                <Select

                                    value={selectedOption}
                                    onChange={handleChange}
                                    sx={{
                                        height: 36,
                                        backgroundColor: "white",
                                        border: "1px solid rgb(242, 242, 242)",
                                        borderRadius: "4px",
                                        fontSize: "13px",
                                        boxShadow: "none",
                                        width: "95%",
                                        "&:hover": {
                                            border: "1px solid rgb(242, 242, 242)",
                                        },
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            border: "none", // Removes extra outlines
                                        },
                                        "&.Mui-focused": {
                                            border: "1px solid rgb(242, 242, 242)", // Keeps the same border on focus
                                            boxShadow: "none", // Removes shadow when focused
                                        },
                                        "& .MuiSelect-select": {
                                            padding: "8px 12px", // Ensures proper padding for the dropdown text
                                        },
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                width: '30px',
                                                borderRadius: "4px",
                                                border: "1px solid rgb(242, 242, 242)",
                                            },
                                        },
                                    }}
                                    renderValue={(selected) => {
                                        const option = options.find((opt) => opt.id === selected);
                                        return (
                                            <div>
                                                <span className='dropdown_value_svg'> {option?.svg}</span>
                                                {option?.label}
                                            </div>
                                        );
                                    }}
                                >
                                    {options.map((option) => (
                                        <MenuItem key={option.id} value={option.id}
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                backgroundColor:
                                                    selectedOption === option.id ? "#eceff1" : "transparent",
                                                "&.Mui-selected": {
                                                    backgroundColor: "#eceff1",
                                                },
                                                "&.Mui-selected:hover": {
                                                    backgroundColor: "#eceff1",
                                                },
                                                "&:hover, &:focus": {
                                                    backgroundColor: "#eceff1",
                                                },
                                            }}>
                                            <div>
                                                <span className='triggerproperties_dropdown_svg'>{option.svg}</span>
                                                <span
                                                    className={`triggerproperties_dropdown_label ${selectedOption === option.id ? "selected-label" : ""
                                                        }`}
                                                >
                                                    {option.label}
                                                </span>
                                                {selectedOption === option.id && (
                                                    <CheckIcon sx={{ position: "absolute", right: "12px", color: "green" }} />
                                                )}
                                            </div>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl> */}
                            <ActionSelect
                                options={options}
                                selectedOption={selectedOption}
                                onChange={handleChange}
                               

                            />

                        </div>
                        <div className='contact_type_container'>
                            <div className='contacttype_text'>Contact Type</div>
                            {/* <FormControl fullWidth >
                                <Select
                                    value={SelectedContactOption}
                                    onChange={handleContactChange}
                                    sx={{
                                        height: 36,
                                        backgroundColor: "white",
                                        border: "1px solid rgb(242, 242, 242)",
                                        borderRadius: "4px",
                                        fontSize: "13px",
                                        boxShadow: "none",
                                        width: "95%",
                                        "&:hover": {
                                            border: "1px solid rgb(242, 242, 242)",
                                        },
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            border: "none", // Removes extra outlines
                                        },
                                        "&.Mui-focused": {
                                            border: "1px solid rgb(242, 242, 242)", // Keeps the same border on focus
                                            boxShadow: "none", // Removes shadow when focused
                                        },
                                        "& .MuiSelect-select": {
                                            padding: "8px 12px", // Ensures proper padding for the dropdown text
                                        },
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                width: '30px',
                                                borderRadius: "4px",
                                                border: "1px solid rgb(242, 242, 242)",
                                            },
                                        },
                                    }}
                                    renderValue={(selected) => {
                                        const option = contactOptions.find((opt) => opt.id === selected);
                                        return (
                                            <div>
                                                {option?.label}
                                            </div>
                                        );
                                    }}
                                >
                                    {contactOptions.map((option) => (
                                        <MenuItem key={option.id} value={option.id}
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                backgroundColor:
                                                    SelectedContactOption === option.id ? "#eceff1" : "transparent",
                                                "&.Mui-selected": {
                                                    backgroundColor: "#eceff1",
                                                },
                                                "&.Mui-selected:hover": {
                                                    backgroundColor: "#eceff1",
                                                },
                                                "&:hover, &:focus": {
                                                    backgroundColor: "#eceff1",
                                                },
                                            }}>
                                            <div>

                                                <span
                                                    className={`triggerproperties_dropdown_label ${SelectedContactOption === option.id ? "selected-label" : ""
                                                        }`}
                                                >
                                                    {option.label}
                                                </span>
                                                {SelectedContactOption === option.id && (
                                                    <CheckIcon sx={{ position: "absolute", right: "12px", color: "green" }} />
                                                )}
                                            </div>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl> */}
                            <ActionSelect
                                options={contactOptions}
                                selectedOption={SelectedContactOption}
                                onChange={handleContactChange}

                            />
                        </div>
                    </Modal.Body>

                </div>
            </Modal>
        </>
    )
}
const FilterPropertiesModal = ({ show, onClose }) => {
    const options = [{ id: 1, label: 'Source' },
    { id: 2, label: 'Channel' },
    { id: 3, label: 'actual_fare' },
    { id: 4, label: 'actuall_estimate' },
    { id: 5, label: 'additional_items' }]
    const [selectedOption, setSelectedOption] = useState("");


    const handleChange = (event) => {
        setSelectedOption(event.target.value);
    };

    return (
        <>
            <Modal show={show} onHide={onClose} backdrop={false}
                dialogClassName="custom_triggerpropertiesmodal">
                <div className='triggerproperties_content_container'>
                    <Modal.Header className='triggerproperties_header' closeButton>
                        <Modal.Title >Filter Properties</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='triggerproperties_modal_bodycontent'>
                        <div className='trigger_text'>
                            <div className='learn_more_text'>Add a filter to narrow down where the action should take place</div>
                            <a href='https://support.wati.io/l/en/article/ws0l9jdkkk-learn-more-about-filters?_gl=1*1xsro8w*_gcl_au*ODI5NTcxMjk3LjE3MjY0OTE0NDU.*_ga*MTYxNTI3NjY1MS4xNzI2NDkxNDQ2*_ga_HYL717ZD73*MTczMTc1NDQ0Mi4xNjcuMS4xNzMxNzU0NDQ1LjU3LjAuMA..' className='learn_more_link' target='_blank'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2.66683 2.66651C2.31321 2.66651 1.97407 2.80698 1.72402 3.05703C1.47397 3.30708 1.3335 3.64622 1.3335 3.99984V11.9998C1.3335 12.3535 1.47397 12.6926 1.72402 12.9426C1.97407 13.1927 2.31321 13.3332 2.66683 13.3332H6.66683C7.17883 13.3332 7.64683 13.1405 8.00016 12.8238C8.3535 13.1405 8.8215 13.3332 9.3335 13.3332H13.3335C13.6871 13.3332 14.0263 13.1927 14.2763 12.9426C14.5264 12.6926 14.6668 12.3535 14.6668 11.9998V3.99984C14.6668 3.64622 14.5264 3.30708 14.2763 3.05703C14.0263 2.80698 13.6871 2.66651 13.3335 2.66651H9.3335C8.8215 2.66651 8.3535 2.85917 8.00016 3.17584C7.63385 2.84725 7.15892 2.66583 6.66683 2.66651H2.66683ZM7.3335 4.66651V11.3332C7.3335 11.51 7.26326 11.6796 7.13823 11.8046C7.01321 11.9296 6.84364 11.9998 6.66683 11.9998H2.66683V3.99984H6.66683C6.84364 3.99984 7.01321 4.07008 7.13823 4.1951C7.26326 4.32013 7.3335 4.48969 7.3335 4.66651ZM8.66683 11.3332V4.66651C8.66683 4.48969 8.73707 4.32013 8.86209 4.1951C8.98712 4.07008 9.15668 3.99984 9.3335 3.99984H13.3335V11.9998H9.3335C9.15668 11.9998 8.98712 11.9296 8.86209 11.8046C8.73707 11.6796 8.66683 11.51 8.66683 11.3332Z" fill="#1B74E3"></path></svg>
                                Learn more about filters
                            </a>
                        </div>
                        <div className='trigger_details'>Filter Details</div>
                        <div className='trigger_type_container'>
                            <div className='triggertype_text'>Select your Criteria</div>
                            <ActionSelect

                                options={options}
                                selectedOption={selectedOption}
                                onChange={handleChange}
                                styleProps={{
                                    width: "45%"
                                }}

                            />
                        </div>

                    </Modal.Body>

                </div>
            </Modal>
        </>
    )
}
const ActionPropertiesModal = ({ show, onClose }) => {
    const options = [
        {
            id: 1, label: "Send template message", svg: (

                <svg style={{ background: 'rgb(216, 150, 255)', padding: 2 }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 12 12" fill="none"><path d="M4.51487 1.67197C5.4917 1.44268 6.5083 1.44268 7.48513 1.67197C8.81543 1.98424 9.87075 2.98225 10.2642 4.27883H1.73582C2.12925 2.98225 3.18457 1.98424 4.51487 1.67197Z" fill="white"></path><path d="M1.60226 4.85361C1.44571 5.72654 1.4689 6.62356 1.67185 7.48935C2.00275 8.90101 3.10421 10.0032 4.51487 10.3344C4.90945 10.427 5.31051 10.4822 5.71282 10.5V4.85361H1.60226Z" fill="white"></path><path d="M6.28719 10.5C6.6895 10.4822 7.09056 10.427 7.48513 10.3344C8.89579 10.0032 9.99725 8.90101 10.3282 7.48935C10.5311 6.62355 10.5543 5.72654 10.3977 4.85361H6.28719V10.5Z" fill="white"></path></svg>

            ),
            subOptionsLabel: "Choose a template from library"
        },
        {
            id: 2, label: "Send message", svg: (
                <svg xmlns="http://www.w3.org/2000/svg" style={{ background: 'rgb(226, 88, 102)', padding: 2 }} width="16" height="16" viewBox="0 0 12 12" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.65873 1.6624C3.17123 1.99869 2.00406 3.14186 1.64597 4.61321C1.45016 5.41776 1.45195 6.26434 1.64776 7.06888C2.01145 8.56324 3.08129 9.8069 4.51647 10.3864L4.57902 10.4117C5.20008 10.6624 5.91153 10.3604 6.16637 9.74508C6.2365 9.57573 6.40351 9.46338 6.58804 9.46338H7.14994C8.67822 9.46338 10.0077 8.42496 10.3664 6.95104C10.5445 6.21911 10.5445 5.45563 10.3664 4.7237L10.3194 4.53044C9.97361 3.10979 8.84666 2.00602 7.41043 1.68132L7.20866 1.63571C6.4083 1.45476 5.57717 1.45476 4.77681 1.63571L4.65873 1.6624ZM4.25097 4.18334C4.05858 4.18334 3.90262 4.33808 3.90262 4.52896C3.90262 4.71984 4.05858 4.87458 4.25097 4.87458H7.44421C7.6366 4.87458 7.79256 4.71984 7.79256 4.52896C7.79256 4.33808 7.6366 4.18334 7.44421 4.18334H4.25097ZM4.83156 5.91143C4.63917 5.91143 4.48321 6.06616 4.48321 6.25704C4.48321 6.44792 4.63917 6.60266 4.83156 6.60266H6.86362C7.05601 6.60266 7.21197 6.44792 7.21197 6.25704C7.21197 6.06616 7.05601 5.91143 6.86362 5.91143H4.83156Z" fill="white"></path></svg>

            ), subOptionsLabel: "Message Type"
        },
        {
            id: 3, label: "Route chat", svg: (

                <svg style={{ background: 'rgb(75, 218, 131)', padding: 2 }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 8 8" fill="none"><path d="M3.08571 0C2.0127 0 1.14286 0.869847 1.14286 1.94286C1.14286 3.01587 2.0127 3.88571 3.08571 3.88571C4.15872 3.88571 5.02857 3.01587 5.02857 1.94286C5.02857 0.869847 4.15872 0 3.08571 0Z" fill="white"></path><path d="M4.23226 4.75007C3.4727 4.62885 2.69873 4.62885 1.93917 4.75007L1.85775 4.76306C0.787507 4.93387 0 5.85702 0 6.94081C0 7.52579 0.474213 8 1.05919 8H5.11224C5.69722 8 6.17143 7.52579 6.17143 6.94081C6.17143 5.85702 5.38392 4.93387 4.31368 4.76306L4.23226 4.75007Z" fill="white"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M6.74286 2.74286C6.93221 2.74286 7.08571 2.89636 7.08571 3.08571V3.65714H7.65714C7.8465 3.65714 8 3.81065 8 4C8 4.18935 7.8465 4.34286 7.65714 4.34286H7.08571V4.91429C7.08571 5.10364 6.93221 5.25714 6.74286 5.25714C6.5535 5.25714 6.4 5.10364 6.4 4.91429V4.34286H5.82857C5.63922 4.34286 5.48571 4.18935 5.48571 4C5.48571 3.81065 5.63922 3.65714 5.82857 3.65714H6.4V3.08571C6.4 2.89636 6.5535 2.74286 6.74286 2.74286Z" fill="white"></path></svg>

            ), subOptionsLabel: "Routing"
        },
        {
            id: 4, label: 'Start chatbot', svg: (

                <svg style={{ background: 'rgb(27, 116, 227)', padding: 2 }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 9 10" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.63514 1.25C2.63514 0.918479 2.77395 0.600537 3.02104 0.366117C3.26813 0.131696 3.60326 0 3.9527 0H4.83108C5.18052 0 5.51565 0.131696 5.76274 0.366117C6.00983 0.600537 6.14865 0.918479 6.14865 1.25V2.08333C6.14865 2.41485 6.00983 2.7328 5.76274 2.96722C5.51565 3.20164 5.18052 3.33333 4.83108 3.33333V4.16667H7.02703C7.14351 4.16667 7.25522 4.21057 7.33758 4.28871C7.41995 4.36685 7.46622 4.47283 7.46622 4.58333V5.41667C7.46622 5.52717 7.41995 5.63315 7.33758 5.71129C7.25522 5.78943 7.14351 5.83333 7.02703 5.83333C6.91055 5.83333 6.79884 5.78943 6.71647 5.71129C6.63411 5.63315 6.58784 5.52717 6.58784 5.41667V5H2.19595V5.41667C2.19595 5.52717 2.14967 5.63315 2.06731 5.71129C1.98495 5.78943 1.87324 5.83333 1.75676 5.83333C1.64028 5.83333 1.52857 5.78943 1.4462 5.71129C1.36384 5.63315 1.31757 5.52717 1.31757 5.41667V4.58333C1.31757 4.47283 1.36384 4.36685 1.4462 4.28871C1.52857 4.21057 1.64028 4.16667 1.75676 4.16667H3.9527V3.33333C3.60326 3.33333 3.26813 3.20164 3.02104 2.96722C2.77395 2.7328 2.63514 2.41485 2.63514 2.08333V1.25ZM0 7.91667C0 7.58515 0.138815 7.2672 0.385907 7.03278C0.632999 6.79836 0.968127 6.66667 1.31757 6.66667H2.19595C2.54539 6.66667 2.88052 6.79836 3.12761 7.03278C3.3747 7.2672 3.51351 7.58515 3.51351 7.91667V8.75C3.51351 9.08152 3.3747 9.39946 3.12761 9.63388C2.88052 9.8683 2.54539 10 2.19595 10H1.31757C0.968127 10 0.632999 9.8683 0.385907 9.63388C0.138815 9.39946 0 9.08152 0 8.75V7.91667ZM5.27027 7.91667C5.27027 7.58515 5.40908 7.2672 5.65618 7.03278C5.90327 6.79836 6.2384 6.66667 6.58784 6.66667H7.46622C7.81566 6.66667 8.15079 6.79836 8.39788 7.03278C8.64497 7.2672 8.78378 7.58515 8.78378 7.91667V8.75C8.78378 9.08152 8.64497 9.39946 8.39788 9.63388C8.15079 9.8683 7.81566 10 7.46622 10H6.58784C6.2384 10 5.90327 9.8683 5.65618 9.63388C5.40908 9.39946 5.27027 9.08152 5.27027 8.75V7.91667Z" fill="white"></path></svg>

            ), subOptionsLabel: "Choose a chatbot from library"
        }
    ];
    const [selectedOption, setSelectedOption] = useState("");
    const [subOptions, setSubOptions] = useState("");

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
        setSubOptions("");
    };
    const handleSubvalueChange = (event) => {
        setSubOptions(event.target.value);
    };
    const subOptionsList =
        selectedOption === 1
            ? [
                { id: 1, label: "Wake_up" },
                { id: 2, label: "emergency_update" },
                { id: 3, label: "welcomnote" },
                { id: 4, label: 'intro_welcome' }
            ]
            : selectedOption === 2
                ? [
                    { id: 1, label: "Text", svg: (<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3.83333 2C2.82674 2 2 2.82674 2 3.83333V12.1667C2 13.1733 2.82674 14 3.83333 14H12.1667C13.1733 14 14 13.1733 14 12.1667V3.83333C14 2.82674 13.1733 2 12.1667 2H3.83333ZM3.83333 3H12.1667C12.6327 3 13 3.36726 13 3.83333V12.1667C13 12.6327 12.6327 13 12.1667 13H3.83333C3.36726 13 3 12.6327 3 12.1667V3.83333C3 3.36726 3.36726 3 3.83333 3ZM4.83333 4C4.76708 3.99906 4.7013 4.0113 4.63981 4.03601C4.57833 4.06072 4.52237 4.0974 4.47518 4.14392C4.428 4.19044 4.39053 4.24588 4.36496 4.30701C4.33938 4.36814 4.32621 4.43374 4.32621 4.5C4.32621 4.56626 4.33938 4.63186 4.36496 4.69299C4.39053 4.75412 4.428 4.80956 4.47518 4.85608C4.52237 4.9026 4.57833 4.93928 4.63981 4.96399C4.7013 4.9887 4.76708 5.00094 4.83333 5H11.1667C11.2329 5.00094 11.2987 4.9887 11.3602 4.96399C11.4217 4.93928 11.4776 4.9026 11.5248 4.85608C11.572 4.80956 11.6095 4.75412 11.635 4.69299C11.6606 4.63186 11.6738 4.56626 11.6738 4.5C11.6738 4.43374 11.6606 4.36814 11.635 4.30701C11.6095 4.24588 11.572 4.19044 11.5248 4.14392C11.4776 4.0974 11.4217 4.06072 11.3602 4.03601C11.2987 4.0113 11.2329 3.99906 11.1667 4H4.83333ZM4.83333 6.33333C4.76708 6.3324 4.7013 6.34464 4.63981 6.36934C4.57833 6.39405 4.52237 6.43073 4.47518 6.47725C4.428 6.52378 4.39053 6.57921 4.36496 6.64034C4.33938 6.70147 4.32621 6.76707 4.32621 6.83333C4.32621 6.8996 4.33938 6.9652 4.36496 7.02633C4.39053 7.08746 4.428 7.14289 4.47518 7.18941C4.52237 7.23594 4.57833 7.27262 4.63981 7.29732C4.7013 7.32203 4.76708 7.33427 4.83333 7.33333H9.16667C9.23292 7.33427 9.2987 7.32203 9.36019 7.29732C9.42167 7.27262 9.47763 7.23594 9.52482 7.18941C9.572 7.14289 9.60947 7.08746 9.63505 7.02633C9.66062 6.9652 9.67379 6.8996 9.67379 6.83333C9.67379 6.76707 9.66062 6.70147 9.63505 6.64034C9.60947 6.57921 9.572 6.52378 9.52482 6.47725C9.47763 6.43073 9.42167 6.39405 9.36019 6.36934C9.2987 6.34464 9.23292 6.3324 9.16667 6.33333H4.83333ZM4.83333 8.66667C4.76708 8.66573 4.7013 8.67797 4.63981 8.70268C4.57833 8.72738 4.52237 8.76406 4.47518 8.81059C4.428 8.85711 4.39053 8.91255 4.36496 8.97367C4.33938 9.0348 4.32621 9.1004 4.32621 9.16667C4.32621 9.23293 4.33938 9.29853 4.36496 9.35966C4.39053 9.42079 4.428 9.47622 4.47518 9.52275C4.52237 9.56927 4.57833 9.60595 4.63981 9.63066C4.7013 9.65536 4.76708 9.6676 4.83333 9.66667H11.1667C11.2329 9.6676 11.2987 9.65536 11.3602 9.63066C11.4217 9.60595 11.4776 9.56927 11.5248 9.52275C11.572 9.47622 11.6095 9.42079 11.635 9.35966C11.6606 9.29853 11.6738 9.23293 11.6738 9.16667C11.6738 9.1004 11.6606 9.0348 11.635 8.97367C11.6095 8.91255 11.572 8.85711 11.5248 8.81059C11.4776 8.76406 11.4217 8.72738 11.3602 8.70268C11.2987 8.67797 11.2329 8.66573 11.1667 8.66667H4.83333ZM4.83333 11C4.76708 10.9991 4.7013 11.0113 4.63981 11.036C4.57833 11.0607 4.52237 11.0974 4.47518 11.1439C4.428 11.1904 4.39053 11.2459 4.36496 11.307C4.33938 11.3681 4.32621 11.4337 4.32621 11.5C4.32621 11.5663 4.33938 11.6319 4.36496 11.693C4.39053 11.7541 4.428 11.8096 4.47518 11.8561C4.52237 11.9026 4.57833 11.9393 4.63981 11.964C4.7013 11.9887 4.76708 12.0009 4.83333 12H9.16667C9.23292 12.0009 9.2987 11.9887 9.36019 11.964C9.42167 11.9393 9.47763 11.9026 9.52482 11.8561C9.572 11.8096 9.60947 11.7541 9.63505 11.693C9.66062 11.6319 9.67379 11.5663 9.67379 11.5C9.67379 11.4337 9.66062 11.3681 9.63505 11.307C9.60947 11.2459 9.572 11.1904 9.52482 11.1439C9.47763 11.0974 9.42167 11.0607 9.36019 11.036C9.2987 11.0113 9.23292 10.9991 9.16667 11H4.83333Z" fill="#848A86"></path></svg>) },
                    { id: 2, label: "Document", svg: (<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3.75146 6.50098C3.68516 6.50098 3.62157 6.52732 3.57469 6.5742C3.5278 6.62108 3.50146 6.68467 3.50146 6.75098V8.25098C3.50146 8.31728 3.5278 8.38087 3.57469 8.42775C3.62157 8.47464 3.68516 8.50098 3.75146 8.50098C3.81777 8.50098 3.88136 8.47464 3.92824 8.42775C3.97513 8.38087 4.00147 8.31728 4.00147 8.25098V8.00098H4.24996C4.44888 8.00098 4.63964 7.92196 4.7803 7.78131C4.92095 7.64065 4.99996 7.44989 4.99996 7.25098C4.99996 7.05206 4.92095 6.8613 4.7803 6.72065C4.63964 6.57999 4.44888 6.50098 4.24996 6.50098H3.75146ZM4.24996 7.50098H4.00147V7.00098H4.24996C4.31627 7.00098 4.37986 7.02732 4.42674 7.0742C4.47363 7.12108 4.49996 7.18467 4.49996 7.25098C4.49996 7.31728 4.47363 7.38087 4.42674 7.42775C4.37986 7.47464 4.31627 7.50098 4.24996 7.50098ZM7.49897 6.75048C7.4991 6.68426 7.5255 6.6208 7.57236 6.57402C7.61923 6.52725 7.68275 6.50098 7.74897 6.50098H8.50146C8.56777 6.50098 8.63136 6.52732 8.67824 6.5742C8.72513 6.62108 8.75146 6.68467 8.75146 6.75098C8.75146 6.81728 8.72513 6.88087 8.67824 6.92775C8.63136 6.97464 8.56777 7.00098 8.50146 7.00098H7.99846L7.99796 7.50198H8.50146C8.56777 7.50198 8.63136 7.52832 8.67824 7.5752C8.72513 7.62208 8.75146 7.68567 8.75146 7.75198C8.75146 7.81828 8.72513 7.88187 8.67824 7.92875C8.63136 7.97564 8.56777 8.00198 8.50146 8.00198H7.99796L7.99897 8.25048C7.99903 8.28331 7.99263 8.31583 7.98013 8.34619C7.96762 8.37654 7.94926 8.40414 7.9261 8.4274C7.8793 8.47438 7.81577 8.50084 7.74946 8.50098C7.68316 8.50111 7.61952 8.4749 7.57254 8.42811C7.52556 8.38132 7.4991 8.31778 7.49897 8.25148L7.49746 7.75248V7.75148L7.49897 6.75048ZM5.74996 6.50098C5.68366 6.50098 5.62007 6.52732 5.57319 6.5742C5.5263 6.62108 5.49996 6.68467 5.49996 6.75098V8.25098C5.49996 8.31728 5.5263 8.38087 5.57319 8.42775C5.62007 8.47464 5.68366 8.50098 5.74996 8.50098H5.99897C6.26418 8.50098 6.51854 8.39562 6.70607 8.20808C6.89361 8.02055 6.99897 7.76619 6.99897 7.50098C6.99897 7.23576 6.89361 6.98141 6.70607 6.79387C6.51854 6.60633 6.26418 6.50098 5.99897 6.50098H5.74996ZM5.99996 8.00098V7.00098C6.13257 7.00098 6.25975 7.05366 6.35352 7.14742C6.44729 7.24119 6.49996 7.36837 6.49996 7.50098C6.49996 7.63358 6.44729 7.76076 6.35352 7.85453C6.25975 7.9483 6.13257 8.00098 5.99996 8.00098Z" fill="#7C8188"></path><path d="M10 10V9.418C10.2955 9.2775 10.5 8.976 10.5 8.627V6.375C10.5 6.026 10.2955 5.725 10 5.584V4.914C9.99994 4.64881 9.89455 4.39449 9.707 4.207L6.7925 1.293C6.78477 1.28581 6.77659 1.27913 6.768 1.273C6.76182 1.26822 6.75581 1.26322 6.75 1.258C6.7156 1.22554 6.67901 1.19546 6.6405 1.168C6.6277 1.15974 6.61433 1.15239 6.6005 1.146L6.5765 1.134L6.5515 1.1195C6.5245 1.104 6.497 1.088 6.4685 1.076C6.36893 1.03623 6.26355 1.01293 6.1565 1.007C6.1465 1.0065 6.1365 1.005 6.127 1.0035C6.11343 1.0014 6.09973 1.00023 6.086 1H3C2.73478 1 2.48043 1.10536 2.29289 1.29289C2.10536 1.48043 2 1.73478 2 2V5.584C1.7045 5.7245 1.5 6.026 1.5 6.375V8.627C1.5 8.976 1.7045 9.277 2 9.418V10C2 10.2652 2.10536 10.5196 2.29289 10.7071C2.48043 10.8946 2.73478 11 3 11H9C9.26522 11 9.51957 10.8946 9.70711 10.7071C9.89464 10.5196 10 10.2652 10 10ZM9 10.25H3C2.9337 10.25 2.87011 10.2237 2.82322 10.1768C2.77634 10.1299 2.75 10.0663 2.75 10V9.502H9.25V10C9.25 10.0663 9.22366 10.1299 9.17678 10.1768C9.12989 10.2237 9.0663 10.25 9 10.25ZM9.25 5V5.5H2.75V2C2.75 1.9337 2.77634 1.87011 2.82322 1.82322C2.87011 1.77634 2.9337 1.75 3 1.75H6V4C6 4.26522 6.10536 4.51957 6.29289 4.70711C6.48043 4.89464 6.73478 5 7 5H9.25ZM8.689 4.25H7C6.9337 4.25 6.87011 4.22366 6.82322 4.17678C6.77634 4.12989 6.75 4.0663 6.75 4V2.3105L8.689 4.25ZM2.375 6.25H9.625C9.65815 6.25 9.68995 6.26317 9.71339 6.28661C9.73683 6.31005 9.75 6.34185 9.75 6.375V8.627C9.75 8.66015 9.73683 8.69195 9.71339 8.71539C9.68995 8.73883 9.65815 8.752 9.625 8.752H2.375C2.34185 8.752 2.31005 8.73883 2.28661 8.71539C2.26317 8.69195 2.25 8.66015 2.25 8.627V6.375C2.25 6.34185 2.26317 6.31005 2.28661 6.28661C2.31005 6.26317 2.34185 6.25 2.375 6.25Z" fill="#7C8188"></path></svg>) },
                    { id: 3, label: "Image", svg: (<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8.875 1.5C9.30598 1.5 9.7193 1.6712 10.024 1.97595C10.3288 2.2807 10.5 2.69402 10.5 3.125V8.875C10.5 9.30598 10.3288 9.7193 10.024 10.024C9.7193 10.3288 9.30598 10.5 8.875 10.5H3.125C2.69402 10.5 2.2807 10.3288 1.97595 10.024C1.6712 9.7193 1.5 9.30598 1.5 8.875V3.125C1.5 2.69402 1.6712 2.2807 1.97595 1.97595C2.2807 1.6712 2.69402 1.5 3.125 1.5H8.875ZM9.165 9.7005L6.2625 6.8575C6.19918 6.79544 6.11592 6.75782 6.0275 6.75132C5.93908 6.74482 5.85121 6.76987 5.7795 6.822L5.7375 6.857L2.834 9.7005C2.925 9.7325 3.023 9.75 3.125 9.75H8.875C8.9765 9.75 9.0745 9.7325 9.165 9.7005ZM8.875 2.25H3.125C2.89294 2.25 2.67038 2.34219 2.50628 2.50628C2.34219 2.67038 2.25 2.89294 2.25 3.125V8.875C2.25 8.979 2.268 9.079 2.3015 9.172L5.213 6.3215C5.41259 6.12611 5.67772 6.01196 5.95681 6.00124C6.23591 5.99052 6.50902 6.084 6.723 6.2635L6.787 6.3215L9.698 9.1725C9.7315 9.0795 9.75 8.9795 9.75 8.875V3.125C9.75 2.89294 9.65781 2.67038 9.49372 2.50628C9.32962 2.34219 9.10706 2.25 8.875 2.25ZM7.626 3.25C7.92463 3.25 8.21104 3.36863 8.4222 3.5798C8.63337 3.79096 8.752 4.07737 8.752 4.376C8.752 4.67463 8.63337 4.96104 8.4222 5.1722C8.21104 5.38337 7.92463 5.502 7.626 5.502C7.32737 5.502 7.04096 5.38337 6.8298 5.1722C6.61863 4.96104 6.5 4.67463 6.5 4.376C6.5 4.07737 6.61863 3.79096 6.8298 3.5798C7.04096 3.36863 7.32737 3.25 7.626 3.25ZM7.626 4C7.52628 4 7.43064 4.03961 7.36013 4.11013C7.28961 4.18064 7.25 4.27628 7.25 4.376C7.25 4.47572 7.28961 4.57136 7.36013 4.64187C7.43064 4.71239 7.52628 4.752 7.626 4.752C7.72572 4.752 7.82136 4.71239 7.89187 4.64187C7.96239 4.57136 8.002 4.47572 8.002 4.376C8.002 4.27628 7.96239 4.18064 7.89187 4.11013C7.82136 4.03961 7.72572 4 7.626 4Z" fill="#7C8188"></path></svg>) },
                    { id: 4, label: 'Sticker', svg: (<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8.875 1.5C9.30598 1.5 9.7193 1.6712 10.024 1.97595C10.3288 2.2807 10.5 2.69402 10.5 3.125V8.875C10.5 9.30598 10.3288 9.7193 10.024 10.024C9.7193 10.3288 9.30598 10.5 8.875 10.5H3.125C2.69402 10.5 2.2807 10.3288 1.97595 10.024C1.6712 9.7193 1.5 9.30598 1.5 8.875V3.125C1.5 2.69402 1.6712 2.2807 1.97595 1.97595C2.2807 1.6712 2.69402 1.5 3.125 1.5H8.875ZM9.165 9.7005L6.2625 6.8575C6.19918 6.79544 6.11592 6.75782 6.0275 6.75132C5.93908 6.74482 5.85121 6.76987 5.7795 6.822L5.7375 6.857L2.834 9.7005C2.925 9.7325 3.023 9.75 3.125 9.75H8.875C8.9765 9.75 9.0745 9.7325 9.165 9.7005ZM8.875 2.25H3.125C2.89294 2.25 2.67038 2.34219 2.50628 2.50628C2.34219 2.67038 2.25 2.89294 2.25 3.125V8.875C2.25 8.979 2.268 9.079 2.3015 9.172L5.213 6.3215C5.41259 6.12611 5.67772 6.01196 5.95681 6.00124C6.23591 5.99052 6.50902 6.084 6.723 6.2635L6.787 6.3215L9.698 9.1725C9.7315 9.0795 9.75 8.9795 9.75 8.875V3.125C9.75 2.89294 9.65781 2.67038 9.49372 2.50628C9.32962 2.34219 9.10706 2.25 8.875 2.25ZM7.626 3.25C7.92463 3.25 8.21104 3.36863 8.4222 3.5798C8.63337 3.79096 8.752 4.07737 8.752 4.376C8.752 4.67463 8.63337 4.96104 8.4222 5.1722C8.21104 5.38337 7.92463 5.502 7.626 5.502C7.32737 5.502 7.04096 5.38337 6.8298 5.1722C6.61863 4.96104 6.5 4.67463 6.5 4.376C6.5 4.07737 6.61863 3.79096 6.8298 3.5798C7.04096 3.36863 7.32737 3.25 7.626 3.25ZM7.626 4C7.52628 4 7.43064 4.03961 7.36013 4.11013C7.28961 4.18064 7.25 4.27628 7.25 4.376C7.25 4.47572 7.28961 4.57136 7.36013 4.64187C7.43064 4.71239 7.52628 4.752 7.626 4.752C7.72572 4.752 7.82136 4.71239 7.89187 4.64187C7.96239 4.57136 8.002 4.47572 8.002 4.376C8.002 4.27628 7.96239 4.18064 7.89187 4.11013C7.82136 4.03961 7.72572 4 7.626 4Z" fill="#7C8188"></path></svg>) },
                    { id: 5, label: 'Video', svg: (<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2.83333 2.33333C1.82674 2.33333 1 3.16007 1 4.16667V11.8333C1 12.8399 1.82674 13.6667 2.83333 13.6667H13.1667C14.1733 13.6667 15 12.8399 15 11.8333V4.16667C15 3.16007 14.1733 2.33333 13.1667 2.33333H2.83333ZM2.83333 3.33333H13.1667C13.6327 3.33333 14 3.70059 14 4.16667V11.8333C14 12.2994 13.6327 12.6667 13.1667 12.6667H2.83333C2.36726 12.6667 2 12.2994 2 11.8333V4.16667C2 3.70059 2.36726 3.33333 2.83333 3.33333ZM6.99154 5.66667C6.87733 5.66812 6.76378 5.69863 6.66211 5.75846C6.45844 5.87846 6.33333 6.09733 6.33333 6.33333V9.66667C6.33333 9.90267 6.45844 10.1215 6.66211 10.2415C6.76611 10.3029 6.883 10.3333 7 10.3333C7.11133 10.3333 7.2229 10.305 7.32357 10.2493L10.3236 8.58268C10.5352 8.46501 10.6667 8.24233 10.6667 8C10.6667 7.75767 10.5352 7.53498 10.3236 7.41732L7.32357 5.75065C7.2204 5.69332 7.10574 5.66521 6.99154 5.66667Z" fill="#848A86"></path></svg>) }

                ]
                : selectedOption === 3
                    ? [
                        { id: 1, label: "To Agent" },
                        { id: 2, label: 'To Team' }
                    ]
                    : selectedOption === 4
                        ? [
                            { id: 1, label: "other_options" },
                            { id: 2, label: 'fleet_ownership' },
                            { id: 3, label: "chargepoint_owner ship" },
                            { id: 4, label: "become a driver" }
                        ]
                        : [];
    const subOptionsLabel = options.find((option) => option.id === selectedOption)?.subOptionsLabel || " ";
    return (
        <>
            <Modal show={show} onHide={onClose} backdrop={false}
                dialogClassName="custom_triggerpropertiesmodal">
                <div className='triggerproperties_content_container'>
                    <Modal.Header className='triggerproperties_header' closeButton>
                        <Modal.Title >Action Properties</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='triggerproperties_modal_bodycontent'>
                        <div className='trigger_text'>
                            <div className='learn_more_text'>Action will take place when your rule is triggered. This can range from sending a message to assigning the chat to a team.</div>
                            <a href='https://support.wati.io/l/en/article/emd943juoc-learn-more-about-actions?_gl=1*127aa7i*_gcl_au*ODI5NTcxMjk3LjE3MjY0OTE0NDU.*_ga*MTYxNTI3NjY1MS4xNzI2NDkxNDQ2*_ga_HYL717ZD73*MTczMTc1NDQ0Mi4xNjcuMS4xNzMxNzU0NDQ1LjU3LjAuMA..' className='learn_more_link' target='_blank'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2.66683 2.66651C2.31321 2.66651 1.97407 2.80698 1.72402 3.05703C1.47397 3.30708 1.3335 3.64622 1.3335 3.99984V11.9998C1.3335 12.3535 1.47397 12.6926 1.72402 12.9426C1.97407 13.1927 2.31321 13.3332 2.66683 13.3332H6.66683C7.17883 13.3332 7.64683 13.1405 8.00016 12.8238C8.3535 13.1405 8.8215 13.3332 9.3335 13.3332H13.3335C13.6871 13.3332 14.0263 13.1927 14.2763 12.9426C14.5264 12.6926 14.6668 12.3535 14.6668 11.9998V3.99984C14.6668 3.64622 14.5264 3.30708 14.2763 3.05703C14.0263 2.80698 13.6871 2.66651 13.3335 2.66651H9.3335C8.8215 2.66651 8.3535 2.85917 8.00016 3.17584C7.63385 2.84725 7.15892 2.66583 6.66683 2.66651H2.66683ZM7.3335 4.66651V11.3332C7.3335 11.51 7.26326 11.6796 7.13823 11.8046C7.01321 11.9296 6.84364 11.9998 6.66683 11.9998H2.66683V3.99984H6.66683C6.84364 3.99984 7.01321 4.07008 7.13823 4.1951C7.26326 4.32013 7.3335 4.48969 7.3335 4.66651ZM8.66683 11.3332V4.66651C8.66683 4.48969 8.73707 4.32013 8.86209 4.1951C8.98712 4.07008 9.15668 3.99984 9.3335 3.99984H13.3335V11.9998H9.3335C9.15668 11.9998 8.98712 11.9296 8.86209 11.8046C8.73707 11.6796 8.66683 11.51 8.66683 11.3332Z" fill="#1B74E3"></path></svg>
                                Learn more about actions
                            </a>
                        </div>
                        <div className='trigger_details'>Action Details</div>
                        <div className='trigger_type_container'>
                            <div className='triggertype_text'>Action Type</div>
                            <ActionSelect
                                options={options}
                                selectedOption={selectedOption}
                                onChange={handleChange}
                                placeholder="Select Action Type"
                            />

                        </div>
                        {selectedOption && (
                            <div className="trigger_type_container">
                                <div className="triggertype_text">{subOptionsLabel}</div>
                                <ActionSelect
                                    options={subOptionsList}
                                    selectedOption={subOptions}
                                    onChange={handleSubvalueChange}

                                />
                            </div>
                        )}

                    </Modal.Body>

                </div>
            </Modal>
        </>
    )
}

const Rules = () => {
    const [isOpenNewruleModal, setIsOpenNewruleModal] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, SetRowsPerPage] = useState(5);
    const [totalRows, setTotalRows] = useState(0);
    const [showNewrulePage, setShowNewrulePage] = useState(false);
    const [showTriggerProperties, setShowTriggerProperties] = useState(false);
    const [showFilterProperies, setShowFilterProperties] = useState(false);
    const [showActionProperties, setShowActionProperties] = useState(false);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }
    const handleChangeRowPerPage = (event) => {
        SetRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }
    const handleBackbutton = () => {
        setShowNewrulePage(false);
        setIsOpenNewruleModal(false);
    }
    const handleOpenNewruleModal = () => {
        setIsOpenNewruleModal(true);
    }
    const handleCloseNewruleModal = () => {
        setIsOpenNewruleModal(false);
    }
    const handleClickGridContent = () => {
        setShowNewrulePage(true);
    }
    const handleOpenTriggerPropeties = () => {
        setShowTriggerProperties(true);
    }
    const handleCloseTriggerProperties = () => {
        setShowTriggerProperties(false);
    }
    const handleOpenFilterProperties = () => {
        setShowFilterProperties(true);
    }
    const handleCloseFilterProperties = () => {
        setShowFilterProperties(false);
    }
    const handleOpenActionProperties = () => {
        setShowActionProperties(true);
    }
    const handleCloseActionProperties = () => {
        setShowActionProperties(false);
    }

    return (
        <>
            {
                showNewrulePage ?
                    (
                        <>
                            {
                                showTriggerProperties &&
                                <TriggerPropertiesModal show={showTriggerProperties} onClose={handleCloseTriggerProperties} />
                            }
                            {
                                showFilterProperies &&
                                <FilterPropertiesModal show={showFilterProperies} onClose={handleCloseFilterProperties} />
                            }
                            {
                                showActionProperties &&
                                <ActionPropertiesModal show={showActionProperties} onClose={handleCloseActionProperties} />
                            }
                            <div className='newruletype_container' >
                                <div className='newruletype_header'>
                                    <div className='newruletype_header_left_container'>
                                        <div className='newruletype_backbutton' onClick={handleBackbutton}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3.55967 17.9001H2.1001V6.0752H3.55967V17.9001ZM12.0116 17.9098L6.102 12.0002L12.0116 6.09057L13.0269 7.09632L8.90002 11.2579H21.9V12.7175H8.8904L13.0519 16.8944L12.0116 17.9098Z" fill="#747474"></path></svg>
                                        </div>
                                        <input type='text' className='newruletype_header_input' placeholder='Enter a rule name' />
                                    </div>
                                    <div className='newruletype_header_right_container'>
                                        <button className='btn btn-success newruletype_savechangesbtn'>Save changes</button>
                                        <div className='newruletype_toggle_container'><div className="newruletype_toggle_circle"></div><div>Off</div></div>
                                    </div>
                                </div>
                                <div className='newruletype_maincontent'>
                                    <div className='newruletype_attribute_card'>
                                        <div class="attribute_svg_image"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 12 12" fill="none"><path d="M1.89453 2.59619C1.13628 2.59619 0.519531 3.21294 0.519531 3.97119V6.72119C0.519531 7.47944 1.13628 8.09619 1.89453 8.09619H2.78271C2.77646 8.01344 2.76953 7.93069 2.76953 7.84619C2.76953 6.05419 4.22753 4.59619 6.01953 4.59619C7.81153 4.59619 9.26953 6.05419 9.26953 7.84619C9.26953 7.93069 9.26334 8.01344 9.25684 8.09619H10.1445C10.9028 8.09619 11.5195 7.47944 11.5195 6.72119V3.97119C11.5195 3.21294 10.9028 2.59619 10.1445 2.59619H1.89453ZM6.00049 5C4.48174 5 3.25049 6.23125 3.25049 7.75C3.25049 9.26875 4.48174 10.5 6.00049 10.5C7.51924 10.5 8.75049 9.26875 8.75049 7.75C8.75049 6.23125 7.51924 5 6.00049 5ZM6.00049 5.75C6.13849 5.75 6.25049 5.862 6.25049 6V7.5H7.75049C7.88849 7.5 8.00049 7.612 8.00049 7.75C8.00049 7.888 7.88849 8 7.75049 8H6.25049V9.5C6.25049 9.638 6.13849 9.75 6.00049 9.75C5.86249 9.75 5.75049 9.638 5.75049 9.5V8H4.25049C4.11249 8 4.00049 7.888 4.00049 7.75C4.00049 7.612 4.11249 7.5 4.25049 7.5H5.75049V6C5.75049 5.862 5.86249 5.75 6.00049 5.75Z" fill="white"></path></svg></div>
                                        <div className='attribute_card_rightcontent'>
                                            <div className='attribute_card_heading'>
                                                When
                                            </div>
                                            <div className='attribute_card_name'>New attribute is added to a contact
                                                <div className='select_attribute' onClick={handleOpenTriggerPropeties}>Choose attribute</div>
                                            </div>
                                            <div className='edit_attribute'>Edit</div>
                                        </div>
                                    </div>
                                    <div className='card_connectorline'></div>
                                    <div className='addfilter_card' onClick={handleOpenFilterProperties}>
                                        Add Filter (Optional)
                                    </div>
                                    <div className='card_connectorline'></div>
                                    <div className='actioncard' onClick={handleOpenActionProperties}>
                                        <div class="actioncard_svg"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 12 12" fill="none"><path d="M3.9126 11.1499L4.4126 7.6499H1.8501L6.5626 0.837402H7.7001L7.2001 4.8374H10.2751L5.0376 11.1499H3.9126Z" fill="#1F2A37"></path></svg></div>
                                        <div>
                                            <div className='empty_action_title'>Add an action you want to perform</div>
                                            <div className='empty_action_description'>Action is an event performed after the rule is triggered</div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </>
                    )
                    : (
                        <div className='rule_container'>
                            {
                                isOpenNewruleModal &&
                                <NewRuleModal show={isOpenNewruleModal} onClose={handleCloseNewruleModal} onClick={handleClickGridContent} />
                            }
                            <div className='rule_header'>
                                <div>
                                    <div className='rule_title'>Rules</div>
                                    <div className='rule_subtitle'>Create Rules to trigger automated messages, chat assignments, chatbots and more.</div>
                                </div>
                                <div className='rule_header_right_container'>
                                    <div className='header__search'>
                                        <div className='search__input'>
                                            <div className='input__wrap'>
                                                <input placeholder="Search..." />
                                                <div tabindex="0" class="header__search__icon"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></div>
                                            </div>
                                        </div>
                                    </div>
                                    <a href="https://support.wati.io/l/en/article/jih6ul0jne-how-to-create-an-attribute-rule" target="_blank" className='note-watch-tutorial'><div class="watch-tutorial-content"><svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="13.5" cy="13.5" r="13.5" fill="#269CFE"></circle><path d="M17.8691 12.6344C18.5358 13.0193 18.5358 13.9815 17.8691 14.3664L12.0648 17.7176C11.3981 18.1025 10.5648 17.6214 10.5648 16.8516L10.5648 10.1493C10.5648 9.37948 11.3981 8.89836 12.0648 9.28326L17.8691 12.6344Z" fill="white"></path></svg><span class="watch-tutorial__text">How it works</span></div></a>

                                    <button className='btn btn-success' onClick={handleOpenNewruleModal}>+ Create Rules</button>
                                </div>
                            </div>
                            <div className='rule_main_table_content'>
                                <Table className='rule__table'>
                                    <TableHead>
                                        <TableRow className='rule__row'>
                                            <TableCell className='ruletable__cell alignleft firstcell' >Rull Name</TableCell>
                                            <TableCell className='ruletable__cell'>Trigger Type</TableCell>
                                            <TableCell className='ruletable__cell'>Action</TableCell>
                                            <TableCell className='ruletable__cell'>Status</TableCell>
                                            <TableCell className='ruletable__cell'>Executed</TableCell>
                                            <TableCell className='ruletable__cell'>Last Updated</TableCell>
                                            <TableCell className='ruletable__cell lastcell'>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody className='sequence__table__body'>

                                    </TableBody>
                                </Table>
                                <div className='rule_main_image_content'>
                                    <div className='rule_image_container'>
                                        <img className='rule_no_content_svg' alt='nodata' src='https://live-6053.wati.io/static/media/no_data.f7f1c72cf9ac99dfe00aa267dbd7928f.svg' />
                                        <div className='rule_no_content_title'>It’s quiet in here!</div>
                                        <div className='rule_no_content_text'>You don’t have any Rules set up, but once you set up the first one it’ll come up here</div>
                                    </div>
                                    <button className='btn btn-success' onClick={handleOpenNewruleModal}>+ Create New rule</button>
                                </div>

                            </div>
                            <div className='rule_table_pagination'>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, 100]}
                                    component='div'
                                    count={totalRows}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowPerPage}
                                    ActionsComponent={() => (
                                        <div className='tablepagination__action'>

                                            <div>
                                                <p aria-label="Go to previous page" title="Go to previous page">
                                                    <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 24 24" className="leftRightArrow" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M1.02698 11.9929L5.26242 16.2426L6.67902 14.8308L4.85766 13.0033L22.9731 13.0012L22.9728 11.0012L4.85309 11.0033L6.6886 9.17398L5.27677 7.75739L1.02698 11.9929Z" fill="currentColor"></path>
                                                    </svg>
                                                    <span className="pagination_previousnextcont" style={{ fontSize: '1.2rem', color: 'black' }}>Previous</span>
                                                </p>
                                            </div>


                                            <div>
                                                <p aria-label="Go to next page" title="Go to next page">
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
                                            fontSize: '13px',
                                            margin: '0px',
                                            color: 'rgb(124, 129, 136)'
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
                                            fontSize: '13px',
                                            margin: '0px',
                                            color: 'rgb(124, 129, 136)',
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    )
            }

        </>
    )

}
export default Rules;