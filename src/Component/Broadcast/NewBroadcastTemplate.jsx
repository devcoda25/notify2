import React, { useState, useEffect, useRef } from "react";
import ButtonComponent from "../ButtonComponent";
import TextfieldComponent from "../TextfieldComponent";
import AutocompleteComponent from "../AutocompleteComponent";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { FormControlLabel, Radio, RadioGroup, IconButton,FormControl,TablePagination} from '@mui/material';
import CheckboxComponent from "../CheckboxComponent";
import SearchboxComponent from "../SearchboxComponent";
import style from "../MuiStyles/muiStyle";
import TableComponent from "../TableComponent";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import dayjs from 'dayjs';
import { ArrowBackIcon, DeleteOutlineIcon,ErrorOutlineIcon,DoneIcon } from "../Icon";


const initialValidContacts = [
    { id: 1, name: '..MQ..', phone: '919789620888', allowBroadcast: 'TRUE' },
    { id: 2, name: '@Marie', phone: '256708863311', allowBroadcast: 'TRUE' },
    { id: 3, name: 'AM', phone: '256750112664', allowBroadcast: 'TRUE' },
    { id: 4, name: 'Aaron DHP Madithrowth', phone: '50766198844', allowBroadcast: 'TRUE' },

]
const templateMessageOptions = ['to_airport_for_someone_later', 'from_airport_ride_someone_12', 'ambulance_ride_later', 'driver_app', 'ride_for_someone_12'];
const attributeOptions = ['AllowBroadcast', 'AllowSMS', 'Source'];
const operationOptions = ['Contains', 'Does not contain', 'Exist'];

const NewBroadcastTemplate = ({isOpenTemplateMessage, setIsOpenTemplateMessage}) => {

    const valueOptions = [''];
    const [state, setState] = useState({
        attributeMessage: '',
        operationMessage: '',
        valueMessage: '',
        templateMessage: templateMessageOptions[0],
        validContacts: initialValidContacts,
        page: 0,
        rowsPerPage: 5,
        totalRows: 0,
        selectedValue: "Send now",
        dateFromValue: dayjs('2024-11-30'),
        showFilterContent: false,
        addFilterBtn: [1],
        ExcludeOneInvalidContacts: false,
        alwaysExcludeInvalidContacts: false,
        searchBroadcast: '',
        checkedValidContacts: initialValidContacts.map(() => false),
        validContactHeaderChecked: false,
    });
    const timeRef = useRef();//preview time

   const updateState = (updates) => {
        setState(prev => ({ ...prev, ...updates }));
    };

   
    const handlefilterbtnContent = () => {
        updateState({ addFilterBtn: [...state.addFilterBtn, {}] });
    };

    const handleDeleteFilterbtnContent = (index) => {
        updateState({ addFilterBtn: state.addFilterBtn.filter((_, i) => i !== index) });
    };
    const handleChangePage = (event, newPage) => {
        updateState({ page: newPage });
    };

    const handleRadioChange = (event) => {
        updateState({ selectedValue: event.target.value });
    };

    const handleChangeRowsPerPage = (event) => {
        updateState({
            rowsPerPage: parseInt(event.target.value, 10),
            page: 0
        });
    };

    const handleBackBroadcast =()=>{
        setIsOpenTemplateMessage(false);
    }

    const handleFilterBtn = () => {
        updateState({ showFilterContent: !state.showFilterContent });
    };
    const handleCheckboxChange = (checkboxName, checked) => {
        setState(prev => ({
            ...prev,
            [checkboxName]: checked,
        }));
    };
   

    const validContactsColumns = [
        {
            id: "checkbox",
            label: (
                <CheckboxComponent
                    checked={state.validContactHeaderChecked}
                    onToggle={(checked) => {
                        const allChecked = Array(state.validContacts.length).fill(checked);
                        setState((prev) => ({
                            ...prev,
                            checkedValidContacts: allChecked,
                            validContactHeaderChecked: checked,
                        }));
                    }}
                />
            ),
        },
        { id: "name", label: "Name" },
        { id: "phone", label: "Phone" },
        { id: "allowBroadcast", label: "Allow Broadcast" },
    ];
    const customRenderValidCell = (row, column) => {
        if (column.id === "checkbox") {
            return (
                <CheckboxComponent
                    checked={state.checkedValidContacts[row.id - 1]}
                    onToggle={() => {
                        const updated = [...state.checkedValidContacts];
                        updated[row.id - 1] = !updated[row.id - 1];
                        setState((prev) => ({
                            ...prev,
                            checkedValidContacts: updated,
                            validContactHeaderChecked: updated.every(Boolean),
                        }));
                    }}
                />
            );
        }

        if (column.id === "allowBroadcast") {
            return (
                <span className="allowbroadcast_style">
                    {row.allowBroadcast} <DoneIcon />
                </span>
            );
        }

        return row[column.id];
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
                        <div onClick={()=>handleBackBroadcast()} className="new_template_left">
                            <ArrowBackIcon />
                            <span className="new_template_title">New Broadcast</span>
                        </div>
                        <div className="new_template_right">
                            <ButtonComponent label='Discard' customBtn='discard_btn' />
                            <ButtonComponent label='Add Broadcast' />
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
                                                value={state.templateMessage}
                                                onChange={(event, newValue) => updateState({ templateMessage: newValue })}
                                            />
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
                                                <CheckboxComponent
                                                    checked={state.ExcludeOneInvalidContacts}
                                                    onToggle={(checked) => handleCheckboxChange('ExcludeOneInvalidContacts', checked)} />

                                                <span className="checkbox_label">Exclude 1 invalid contacts from this broadcast</span>
                                            </div>
                                            <div className="checkbox_container">
                                                <CheckboxComponent
                                                    checked={state.alwaysExcludeInvalidContacts}
                                                    onToggle={(checked) => handleCheckboxChange('alwaysExcludeInvalidContacts', checked)} />

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
                                         
                                            <SearchboxComponent value={state.searchBroadcast} onChange={(e) => setState(prev => ({ ...prev, searchBroadcast: e.target.value }))} customSearch='custom__search_box' placeholder='Search...' />
                                            <button className="filter_btn" onClick={handleFilterBtn}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M21.9997 26.94L22.0297 19.4988L27.7887 12.5298C28.1287 12.1237 28.0487 11.5288 27.6187 11.2077C27.4288 11.0755 27.2188 11 26.9988 11H15.5006H13.0012C12.7812 11 12.5712 11.0755 12.3813 11.2077C11.9513 11.5288 11.8713 12.1237 12.2113 12.5298L17.9703 19.4988L18.0003 25.0419C17.9603 25.3158 18.0603 25.6085 18.2903 25.8257L20.3 27.7238C20.6899 28.0921 21.3198 28.0921 21.7097 27.7238C21.9397 27.5255 22.0397 27.2233 21.9997 26.94Z" fill="#F4FFF8" stroke="#23a455" stroke-width="1.5" stroke-linecap="round"></path></svg>
                                            </button>
                                        </div>
                                        {state.showFilterContent && (
                                            <div>
                                                {
                                                    state.addFilterBtn.map((_, index) => (
                                                        <div className="filterbtn_container" key={index}>
                                                            <AutocompleteComponent
                                                                options={attributeOptions}
                                                                value={state.attributeMessage}
                                                                onChange={(event, newValue) => updateState({ attributeMessage: newValue })}
                                                                placeholder='Attribute' />
                                                            <AutocompleteComponent
                                                                options={operationOptions}
                                                                value={state.operationMessage}
                                                                onChange={(event, newValue) => updateState({ operationMessage: newValue })}
                                                                placeholder='Operation' />
                                                            <AutocompleteComponent
                                                                options={valueOptions}
                                                                value={state.valueMessage}
                                                                onChange={(event, newValue) => updateState({ valueMessage: newValue })}
                                                                placeholder='Value' />
                                                            <IconButton
                                                                onClick={() => handleDeleteFilterbtnContent(index)}
                                                                sx={[style.tableIconBtn, style.tabledeleteHover]} >
                                                                <DeleteOutlineIcon />
                                                            </IconButton>

                                                        </div>
                                                    ))}
                                                {state.addFilterBtn.length > 0 && (
                                                    <ButtonComponent label='Add another filter +' customBtn='add_filter_btn' onClick={handlefilterbtnContent} />
                                                )}
                                            </div>
                                        )}
                                       
                                        <TableComponent
                                            columns={validContactsColumns}
                                            data={state.validContacts}
                                            customRenderCell={customRenderValidCell}
                                            showActions={false}
                                        />

                                        <TablePagination
                                            rowsPerPageOptions={[5, 10, 25]}
                                            component="div"
                                            count={state.totalRows}
                                            rowsPerPage={state.rowsPerPage}
                                            page={state.page}
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
                                            <div className="broadcast_message">Enable ROI tracking
                                                <span className="business_feature_btn">
                                                    <svg width="12" height="12" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="fluent:crown-16-regular"><path id="Vector" d="M6 7.99975C6.19891 7.99975 6.38968 7.92074 6.53033 7.78008C6.67098 7.63943 6.75 7.44867 6.75 7.24975C6.75 7.05084 6.67098 6.86008 6.53033 6.71942C6.38968 6.57877 6.19891 6.49975 6 6.49975C5.80109 6.49975 5.61032 6.57877 5.46967 6.71942C5.32902 6.86008 5.25 7.05084 5.25 7.24975C5.25 7.44867 5.32902 7.63943 5.46967 7.78008C5.61032 7.92074 5.80109 7.99975 6 7.99975ZM7.79925 4.78825L6.56925 3.23875C6.66277 3.1299 6.7231 2.9965 6.74307 2.85439C6.76305 2.71228 6.74183 2.56742 6.68194 2.437C6.62205 2.30659 6.526 2.19609 6.40519 2.11863C6.28438 2.04117 6.14389 2 6.00038 2C5.85687 2 5.71637 2.04117 5.59556 2.11863C5.47475 2.19609 5.3787 2.30659 5.31881 2.437C5.25892 2.56742 5.2377 2.71228 5.25768 2.85439C5.27765 2.9965 5.33798 3.1299 5.4315 3.23875L4.2 4.7875C4.14748 4.85385 4.07406 4.90047 3.99168 4.91981C3.9093 4.93914 3.82281 4.93005 3.74625 4.89401L1.86375 4.00675C1.87125 3.96375 1.875 3.91975 1.875 3.87475C1.87499 3.72354 1.82927 3.57586 1.74385 3.45109C1.65842 3.32632 1.53727 3.23029 1.3963 3.17559C1.25533 3.12089 1.10111 3.11008 0.953885 3.14458C0.806659 3.17908 0.673301 3.25728 0.571305 3.36891C0.469309 3.48055 0.40344 3.62041 0.382339 3.77014C0.361238 3.91987 0.385891 4.07249 0.453063 4.20796C0.520235 4.34344 0.62679 4.45545 0.758747 4.52929C0.890704 4.60313 1.0419 4.63536 1.1925 4.62175L2.1675 9.49675C2.21009 9.70894 2.32478 9.89985 2.4921 10.0371C2.65943 10.1744 2.86909 10.2495 3.0855 10.2498H8.913C9.12978 10.2498 9.33987 10.1747 9.50752 10.0373C9.67517 9.89986 9.79001 9.70858 9.8325 9.496L10.8075 4.62175C10.8295 4.62375 10.8518 4.62475 10.8743 4.62475C11.0282 4.62466 11.1784 4.57718 11.3045 4.48876C11.4305 4.40034 11.5263 4.27527 11.5788 4.13053C11.6313 3.98579 11.638 3.82839 11.598 3.67972C11.5579 3.53104 11.4731 3.39829 11.355 3.2995C11.2369 3.20071 11.0913 3.14065 10.9379 3.1275C10.7845 3.11434 10.6307 3.14872 10.4975 3.22597C10.3643 3.30321 10.2581 3.41958 10.1934 3.55926C10.1286 3.69895 10.1084 3.85519 10.1355 4.00675L8.253 4.89475C8.17645 4.9308 8.08995 4.93989 8.00757 4.92056C7.92519 4.90122 7.85178 4.8546 7.79925 4.78825ZM5.99925 3.72775L7.212 5.25475C7.36973 5.45335 7.58994 5.59283 7.8369 5.65055C8.08386 5.70828 8.34308 5.68086 8.5725 5.57275L9.98625 4.90675L9.0975 9.349C9.08901 9.39149 9.06606 9.42973 9.03256 9.45721C8.99906 9.4847 8.95708 9.49973 8.91375 9.49975H3.08625C3.04292 9.49973 3.00094 9.4847 2.96744 9.45721C2.93394 9.42973 2.91099 9.39149 2.9025 9.349L2.01375 4.90675L3.4275 5.57275C3.65692 5.68086 3.91614 5.70828 4.1631 5.65055C4.41006 5.59283 4.63027 5.45335 4.788 5.25475L5.99925 3.72775Z" fill="white"></path></g></svg>
                                                    BUSINESS FEATURE
                                                </span>
                                            </div>
                                            <p className="tracking_sub_text">Enable this feature to uncover user engagement, track conversion and optimize your broadcasts</p>
                                        </div>
                                        <ButtonComponent label="Upgrade" />
                                    </div>
                                </section>

                                <section>
                                    <div className="broadcast_message">When do you want to send it?</div>
                                    <div className="send_radio_btn">
                                        <FormControl>
                                            <RadioGroup value={state.selectedValue}
                                                onChange={handleRadioChange}>
                                                <FormControlLabel value="Send now" control={<Radio sx={style.broadcastRadiobtn} />} label="Send now" />
                                                <FormControlLabel value="Schedule for a specific time" control={<Radio sx={style.broadcastRadiobtn} />} label="Schedule for a specific time" />
                                            </RadioGroup>
                                        </FormControl>
                                        {
                                            state.selectedValue === "Schedule for a specific time" &&
                                            <div className="dateandtime_container">
                                                <div className="dateandtime_content">
                                                    <div className="dateandtime_text">Date</div>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DemoContainer components={['DatePicker']}>

                                                            <DatePicker
                                                                value={state.dateFromValue}
                                                                onChange={(newValue) => updateState({ dateFromValue: newValue })}

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
                            <div className="broadcast_template_preview_svg">
                                <div className="preview_message">
                                    <div className="broadcast_preview_message_container">

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