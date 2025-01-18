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
    const [templateMessage, setTemplateMessage] = useState('');
    const [validContacts, setValidContacts] = useState(initialValidContacts);
    const timeRef = useRef();//preview time
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalRows, setTotalRows] = useState(0);
    const [selectedValue, setSelectedValue] = useState("Send now");
    const [dateFromValue, setDateFromValue] = React.useState(dayjs('2024-11-30'));
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
                                            <button className="filter_btn"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M21.9997 26.94L22.0297 19.4988L27.7887 12.5298C28.1287 12.1237 28.0487 11.5288 27.6187 11.2077C27.4288 11.0755 27.2188 11 26.9988 11H15.5006H13.0012C12.7812 11 12.5712 11.0755 12.3813 11.2077C11.9513 11.5288 11.8713 12.1237 12.2113 12.5298L17.9703 19.4988L18.0003 25.0419C17.9603 25.3158 18.0603 25.6085 18.2903 25.8257L20.3 27.7238C20.6899 28.0921 21.3198 28.0921 21.7097 27.7238C21.9397 27.5255 22.0397 27.2233 21.9997 26.94Z" fill="#F4FFF8" stroke="#23a455" stroke-width="1.5" stroke-linecap="round"></path></svg></button>
                                        </div>
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
                                            <div>
                                                <div className="datepickerlabel">Date</div>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DemoContainer components={['DatePicker']}>

                                                        <DatePicker
                                                            value={dateFromValue}
                                                            onChange={(newValue) => setDateFromValue(newValue)}
                                                            sx={{
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