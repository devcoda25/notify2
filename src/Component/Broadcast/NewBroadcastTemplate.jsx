import React, { useState, useEffect, useRef } from "react";
import ButtonComponent from "../ButtonComponent";
import TextfieldComponent from "../TextfieldComponent";
import AutocompleteComponent from "../AutocompleteComponent";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { FormControlLabel, Radio, RadioGroup, FormControl } from '@mui/material';
import { Table, TableBody, TableCell, TableHead, TablePagination, TableRow, } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import dayjs from 'dayjs';
const styles = {
    radiobtn: {
        color: 'rgb(231 231 232)',
        '&.Mui-checked': {
            borderColor: 'rgb(231 231 232)',
            color: 'green',
        },

    },
}
const initialValidContacts = [
    { id: 1, name: '..MQ..', phone: '919789620888', allowBroadcast: 'TRUE' },
    { id: 2, name: '@Marie', phone: '256708863311', allowBroadcast: 'TRUE' },
    { id: 3, name: 'AM', phone: '256750112664', allowBroadcast: 'TRUE' },
    { id: 4, name: 'Aaron DHP Madithrowth', phone: '50766198844', allowBroadcast: 'TRUE' },

]
const NewBroadcastTemplate = () => {
    const templateMessageOptions = ['to_airport_for_someone_later', 'from_airport_ride_someone_12', 'ambulance_ride_later', 'driver_app', 'ride_for_someone_12'];
    const attributeOptions = ['AllowBroadcast', 'AllowSMS', 'Source'];
    const operationOptions = ['Contains', 'Does not contain', 'Exist'];
    const valueOptions = [''];
    const [attributeMessage, setAttributeMessage] = useState('');
    const [operationMessage, setOperationMessage] = useState('');
    const [valueMessage, setValueMessage] = useState('');
    const [templateMessage, setTemplateMessage] = useState('');
    const [validContacts, setValidContacts] = useState(initialValidContacts);
    const timeRef = useRef();//preview time
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalRows, setTotalRows] = useState(0);
    const [selectedValue, setSelectedValue] = useState("Send now");
    const [dateFromValue, setDateFromValue] = React.useState(dayjs('2024-11-30'));
    const [showFilterContent, setShowFilterContent] = useState(false);
    const [addFilterBtn, setAddFilterBtn] = useState([1]);
    const handlefilterbtnContent = () => {
        setAddFilterBtn(prev => [...prev, {}]);
    }
    const handleDeleteFilterbtnContent = (index) => {
        setAddFilterBtn(prev => prev.filter((_, i) => i !== index));
    }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleRadioChange = (event) => {
        setSelectedValue(event.target.value);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    //preview time
    useEffect(() => {
        // get the current time
        const getCurrentTime = () => {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        };


        if (timeRef.current) {
            timeRef.current.textContent = getCurrentTime();
            console.log('Time:', timeRef.current.textContent);
        }
    }, []);
    const handleFilterBtn = () => {
        setShowFilterContent((prev) => !prev);
    }
    return (
        <>
            <div className="new_broadcast_template">
                <div className="new_template_container">
                    <div className="new_template_header">
                        <div className="new_template_left">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.22287 12L3.33398 8M3.33398 8L7.22287 4M3.33398 8H12.6673" stroke="#353735" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                            <span className="new_template_title">New Broadcast</span>
                        </div>
                        <div className="new_template_right">
                            <ButtonComponent label='Discard' customBtn='discard_btn' />
                            <ButtonComponent label='Add Boradcast' />
                        </div>
                    </div>
                    <div className="new_template_content">
                        <div className="new_template_content_left">
                            <div className="new_broadcast_left_content">
                                <section>
                                    <div className="broadcast_name_header">
                                        <div className="broadcast_message">What message do you want to send?</div>
                                        <p className="broadcast_title">Add broadcast name and template below</p>
                                    </div>
                                    <div className="select_broadcast_message_container">
                                        <div className="broadcast_name_content">
                                            <div className="broadcast_message broadcast_template_title_name">Broadcast name</div>
                                            <TextfieldComponent value='Untitled_100120251220' customStyle='template_input broadcast_name_textbox' />
                                        </div>
                                        <div className="broadcast_name_content">
                                            <div className="broadcast_message broadcast_template_title_name">Select template message
                                                <a className="Add_new_template_btn"><AddCircleOutlineIcon />Add New Template</a>
                                            </div>
                                            <AutocompleteComponent
                                                options={templateMessageOptions}
                                                value={templateMessage}
                                                onChange={(event, newValue) => setTemplateMessage(newValue)} />
                                        </div>
                                    </div>
                                </section>
                                <section>
                                    <div className="section_grid">
                                        <div className="broadcast_message">Who do you want to send it to?</div>
                                        <p className="select_contact_link">Select contacts below or <a>Download sample format for contact upload</a></p>
                                        <ButtonComponent label='Import Contacts' customBtn='import_contact_btn' />
                                    </div>
                                    <div className="invalid_contacts_container">
                                        <div className="invalid_contacts_title">Exclude invalid contacts</div>
                                        <div>
                                            <div className="checkbox_container">
                                                <input type="checkbox" id="customCheckbox" class="usercustom-checkbox userconfirmedcheckbox" />
                                                <span className="checkbox_label">Exclude 1 invalid contacts from this broadcast</span>
                                            </div>
                                            <div className="checkbox_container">
                                                <input type="checkbox" id="customCheckbox" class="usercustom-checkbox userconfirmedcheckbox" />
                                                <span className="checkbox_label">Always exclude invalid contacts from broadcasts</span>
                                            </div>
                                        </div>
                                        <div className="invalid_contacts_delete_container">
                                            <ErrorOutlineIcon className="warning_icon" />
                                            Would you like to delete 1 invalid contacts from your contacts list?
                                            <ButtonComponent label='yes,Delete' customBtn='add_filter_btn' />
                                        </div>
                                    </div>
                                    <div className="valid_contacts">
                                        <div className="valid_contacts_title">Valid contacts : <span>111/112 contacts</span></div>
                                        <div className="validcontacts_searchbox_container">
                                            <div className="custom-action-bar-search">
                                                <div className="custom-search-input-container"   >
                                                    <div className="custom-input-wrap">
                                                        <input
                                                            type="text"
                                                            className="custom-search-input"
                                                            placeholder="Search..." />
                                                        <div tabIndex="0" className="custom-search-icon">
                                                            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="filter_btn" onClick={handleFilterBtn}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M21.9997 26.94L22.0297 19.4988L27.7887 12.5298C28.1287 12.1237 28.0487 11.5288 27.6187 11.2077C27.4288 11.0755 27.2188 11 26.9988 11H15.5006H13.0012C12.7812 11 12.5712 11.0755 12.3813 11.2077C11.9513 11.5288 11.8713 12.1237 12.2113 12.5298L17.9703 19.4988L18.0003 25.0419C17.9603 25.3158 18.0603 25.6085 18.2903 25.8257L20.3 27.7238C20.6899 28.0921 21.3198 28.0921 21.7097 27.7238C21.9397 27.5255 22.0397 27.2233 21.9997 26.94Z" fill="#F4FFF8" stroke="#23a455" stroke-width="1.5" stroke-linecap="round"></path></svg>
                                            </button>
                                        </div>
                                        {showFilterContent && (
                                            <div>
                                                {
                                                    addFilterBtn.map((_, index) => (
                                                        <div className="filterbtn_container" key={index}>
                                                            <AutocompleteComponent
                                                                options={attributeOptions}
                                                                value={attributeMessage}
                                                                onChange={(event, newValue) => setAttributeMessage(newValue)}
                                                                placeholder='Attribute' />
                                                            <AutocompleteComponent
                                                                options={operationOptions}
                                                                value={operationMessage}
                                                                onChange={(event, newValue) => setOperationMessage(newValue)}
                                                                placeholder='Operation' />
                                                            <AutocompleteComponent
                                                                options={valueOptions}
                                                                value={valueMessage}
                                                                onChange={(event, newValue) => setValueMessage(newValue)}
                                                                placeholder='Value' />
                                                            <button className="filter_delete_btn" onClick={() => handleDeleteFilterbtnContent(index)}>
                                                                <svg style={{ stroke: 'red' }} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path><path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" stroke-width="1.25" stroke-linecap="round"></path></svg>
                                                            </button>
                                                        </div>
                                                    ))}
                                                {addFilterBtn.length > 0 && (
                                                    <ButtonComponent label='Add another filter +' customBtn='add_filter_btn' onClick={handlefilterbtnContent} />
                                                )}
                                            </div>
                                        )}
                                        <Table className='valid_contacts_table'>
                                            <TableHead className='valid_contacts_header'>
                                                <TableRow >
                                                    <TableCell style={{ width: '10%' }} >

                                                        <div class="usercheckbox-container">
                                                            <input type="checkbox" id="customCheckbox" class="usercustom-checkbox" />

                                                        </div>

                                                    </TableCell>
                                                    <TableCell style={{ width: '25%' }}>Name</TableCell>
                                                    <TableCell style={{ width: '25%' }}>Phone</TableCell>

                                                    <TableCell style={{ width: '25%' }}>Allow Broadcast</TableCell>

                                                </TableRow>
                                            </TableHead>
                                            <TableBody className='valid_contacts__table__body'>
                                                {validContacts.map((data, index) => (
                                                    <TableRow key={index} >
                                                        <TableCell className='body__cell'>
                                                            <div class="usercheckbox-container">
                                                                <input type="checkbox" id="customCheckbox" class="usercustom-checkbox" />

                                                            </div>
                                                        </TableCell>
                                                        <TableCell className='body__cell' >{data.name}</TableCell>
                                                        <TableCell className='body__cell'>{data.phone}</TableCell>
                                                        <TableCell className='body__cell allowbroadcast_style'>{data.allowBroadcast}<span><DoneIcon /></span></TableCell>

                                                    </TableRow>

                                                ))}

                                            </TableBody>
                                        </Table>
                                        <TablePagination
                                            rowsPerPageOptions={[5, 10, 25]}
                                            component="div"
                                            count={totalRows}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                            sx={{
                                                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                                                    marginBottom: '0px',
                                                },
                                            }}
                                        />
                                    </div>
                                </section>
                                <section>
                                    <div className="tracking_container">
                                        <div className="tracking_left_container">
                                            <div className="broadcast_message">Enable ROI tracking </div>
                                            <p className="tracking_sub_text">Enable this feature to uncover user engagement, track conversion and optimize your broadcasts</p>
                                        </div>
                                        <ButtonComponent label="Upgrade" />
                                    </div>
                                </section>

                                <section>
                                    <div className="broadcast_message">When do you want to send it?</div>
                                    <div className="send_radio_btn">
                                        <FormControl>
                                            <RadioGroup value={selectedValue}
                                                onChange={handleRadioChange}>
                                                <FormControlLabel value="Send now" control={<Radio sx={styles.radiobtn} />} label="Send now" />
                                                <FormControlLabel value="Schedule for a specific time" control={<Radio sx={styles.radiobtn} />} label="Schedule for a specific time" />
                                            </RadioGroup>
                                        </FormControl>
                                        {
                                            selectedValue === "Schedule for a specific time" &&
                                            <div className="dateandtime_container">
                                                <div className="dateandtime_content">
                                                    <div className="dateandtime_text">Date</div>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DemoContainer components={['DatePicker']}>

                                                            <DatePicker
                                                                value={dateFromValue}
                                                                onChange={(newValue) => setDateFromValue(newValue)}
                                                                sx={{
                                                                    '& .MuiOutlinedInput-root': {
                                                                        border: 'none',
                                                                        background: 'white !Important',
                                                                        width: '80%'
                                                                    },
                                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                                        border: 'none',
                                                                    },
                                                                }}
                                                            />
                                                        </DemoContainer>
                                                    </LocalizationProvider>
                                                </div>
                                                <div className="dateandtime_content">
                                                    <div className="dateandtime_text">Time(GMT+3)</div>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DemoContainer components={['TimePicker']}>
                                                            <TimePicker
                                                                viewRenderers={{
                                                                    hours: renderTimeViewClock,
                                                                    minutes: renderTimeViewClock,
                                                                    seconds: renderTimeViewClock,
                                                                }}
                                                                sx={{
                                                                    backgroundColor: 'white',
                                                                    border: 'none',
                                                                    width: 80,
                                                                    '& .MuiOutlinedInput-root': {
                                                                        border: 'none',
                                                                    },
                                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                                        border: 'none',
                                                                    },
                                                                }}

                                                            />
                                                        </DemoContainer>
                                                    </LocalizationProvider>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </section>
                            </div>
                        </div>
                        <div className="new_template_content_right">
                            <h3 className="preview_text">Preview</h3>
                            <div className="template_preview_svg">
                                <div className="preview_message">
                                    <div className="preview_message_container">

                                        <div className="preview_message_footer">
                                            <time ref={timeRef} className="preview_message_time"></time>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default NewBroadcastTemplate;