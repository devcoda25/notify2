import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import { IconButton, InputAdornment, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import { blue } from '@mui/material/colors';

const CustomTimePicker = ({ value, onChange, onClose }) => {
    const handleOkClick = () => {
        onClose();
    };

    return (
        <div style={{ position: 'relative', padding: '20px' }}>
            <StaticTimePicker
                ampm={false}
                displayStaticWrapperAs="desktop"
                value={value}
                onChange={onChange}
                renderInput={(params) => <TextField {...params} />}
                componentsProps={{
                    actionBar: {
                        hide: true,
                    },
                }}
            />
            <div>
                <Button variant="text" onClick={handleOkClick} style={{ color: blue[500], marginTop: '-41px', float: 'right' }}>
                    OK
                </Button>
            </div>
        </div>
    );
};

const WorkingHoursRow = ({ day, hours, setHours, isOpen, handleToggle, addRow, deleteRow }) => {


    return (
    <>
        <div className="working-row">
            <div className="toggle-block">
                <div className="working-day">{day}</div>
                <div className={`day-toggle ${isOpen ? 'active' : ''}`} style={{ width: '100px' }}>
                    <button type="button" className="toggle__control" onClick={handleToggle}>
                        <div className={`toggle-indicator ${isOpen ? 'active' : ''}`}></div>
                    </button>
                    <label className={`day-toggle-label ${isOpen ? 'toggle__label_on' : 'toggle__label_off'}`}>
                        {isOpen ? 'Open' : 'Closed'}
                    </label>
                </div>
            </div>
            <div className="pickers-block">
                <TextField
                    value={hours[0].fromTime.format('HH:mm')}
                    onClick={() => {
                        if(isOpen){
                            const newHours = [...hours];
                            newHours[0].showFromPicker = true;
                            setHours(newHours);
                        }
                       
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton aria-label="Choose time" onClick={() => {
                                    const newHours = [...hours];
                                    newHours[0].showFromPicker = true;
                                    setHours(newHours);
                                }}>
                                    <AccessTimeIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                        className: 'time-input-picker',
                        disabled:!isOpen,
                    }}
                />
                {hours[0].showFromPicker && isOpen && (
                    <CustomTimePicker
                        value={hours[0].fromTime}
                        onChange={(newValue) => {
                            const newHours = [...hours];
                            newHours[0].fromTime = newValue;
                            setHours(newHours);
                        }}
                        onClose={() => {
                            const newHours = [...hours];
                            newHours[0].showFromPicker = false;
                            setHours(newHours);
                        }}
                    />
                )}
                <span className="lowercase">To</span>
                <TextField
                    value={hours[0].toTime.format('HH:mm')}
                    onClick={() => {
                        if(isOpen){
                            const newHours = [...hours];
                            newHours[0].showToPicker = true;
                            setHours(newHours);
                        }
                     
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton aria-label="Choose time" onClick={() => {
                                    const newHours = [...hours];
                                    newHours[0].showToPicker = true;
                                    setHours(newHours);
                                }}>
                                    <AccessTimeIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                        className: 'time-input-picker',
                        disabled:!isOpen
                    }}
                />
                {hours[0].showToPicker && isOpen && (
                    <CustomTimePicker
                        value={hours[0].toTime}
                        onChange={(newValue) => {
                            const newHours = [...hours];
                            newHours[0].toTime = newValue;
                            setHours(newHours);
                        }}
                        onClose={() => {
                            const newHours = [...hours];
                            newHours[0].showToPicker = false;
                            setHours(newHours);
                        }}
                    />
                )}
                <button type="button" className="add-period-button" onClick={addRow} disabled={!isOpen}>
                    +
                </button>
            </div>
        </div>
        {/* Additional Rows */}

        {hours.slice(1).map((row, index) => (
            <div className="working-row" key={index}>
                <div className="pickers-block">
                    <TextField
                        value={row.fromTime.format('HH:mm')}
                        onClick={() => {
                            if(isOpen){
                                const newHours = [...hours];
                                newHours[index + 1].showFromPicker = true;
                                setHours(newHours);
                            }
                           
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton aria-label="Choose time" onClick={() => {
                                        const newHours = [...hours];
                                        newHours[index + 1].showFromPicker = true;
                                        setHours(newHours);
                                    }}>
                                        <AccessTimeIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                            className: 'time-input-picker',
                            disabled:!isOpen
                        }}
                    />
                    {row.showFromPicker && isOpen && (
                        <CustomTimePicker
                            value={row.fromTime}
                            onChange={(newValue) => {
                                const newHours = [...hours];
                                newHours[index + 1].fromTime = newValue;
                                setHours(newHours);
                            }}
                            onClose={() => {
                                const newHours = [...hours];
                                newHours[index + 1].showFromPicker = false;
                                setHours(newHours);
                            }}
                        />
                    )}
                    <span className="lowercase">To</span>
                    <TextField
                        value={row.toTime.format('HH:mm')}
                        onClick={() => {
                            if(isOpen){
                                const newHours = [...hours];
                                newHours[index + 1].showToPicker = true;
                                setHours(newHours);
                            }
                           
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton aria-label="Choose time" onClick={() => {
                                        const newHours = [...hours];
                                        newHours[index + 1].showToPicker = true;
                                        setHours(newHours);
                                    }}>
                                        <AccessTimeIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                            className: 'time-input-picker',
                            disabled:!isOpen
                        }}
                    />
                    {row.showToPicker && isOpen && (
                        <CustomTimePicker
                            value={row.toTime}
                            onChange={(newValue) => {
                                const newHours = [...hours];
                                newHours[index + 1].toTime = newValue;
                                setHours(newHours);
                            }}
                            onClose={() => {
                                const newHours = [...hours];
                                newHours[index + 1].showToPicker = false;
                                setHours(newHours);
                            }}
                        />
                    )}
                    <button type="button" className='modal-delete' title="Delete" onClick={() => deleteRow(index + 1)} disabled={!isOpen}>
                      <svg className='delete-img'  width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path><path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" stroke-width="1.25" stroke-linecap="round"></path></svg>
                    </button>
                </div>
            </div>
        ))}
    </>


    );
};

const WorkingHoursSettings = ({ show, handleClose }) => {
    const [isHolidayMode, setIsHolidayMode] = useState(false);

    const [isMondayOpen, setIsMondayOpen] = useState(true);
    const [isTuesdayOpen, setIsTuesdayOpen] = useState(true);
    const [isWednesdayOpen,setIsWednesdayOpen]=useState(true);
    const [isThursdayOpen,setIsThursdayOpen]=useState(true);
    const [isFridayOpen,setIsFridayOpen]=useState(true);
    const [isSaturdayOpen,setIsSaturdayOpen]=useState(true);

    const [mondayHours, setMondayHours] = useState([{
        fromTime: dayjs().set('hour', 6).set('minute', 0),
        toTime: dayjs().set('hour', 17).set('minute', 59),
        showFromPicker: false,
        showToPicker: false,
    }]);

    const [tuesdayHours, setTuesdayHours] = useState([{
        fromTime: dayjs().set('hour', 6).set('minute', 0),
        toTime: dayjs().set('hour', 17).set('minute', 59),
        showFromPicker: false,
        showToPicker: false,
    }]);
    const [wednesdayHours, setWednesdayHours] = useState([{
        fromTime: dayjs().set('hour', 6).set('minute', 0),
        toTime: dayjs().set('hour', 17).set('minute', 59),
        showFromPicker: false,
        showToPicker: false,
    }]);
    const [thursdayHours, setThursdayHours] = useState([{
        fromTime: dayjs().set('hour', 6).set('minute', 0),
        toTime: dayjs().set('hour', 17).set('minute', 59),
        showFromPicker: false,
        showToPicker: false,
    }]);
    const [fridayHours, setFridayHours] = useState([{
        fromTime: dayjs().set('hour', 6).set('minute', 0),
        toTime: dayjs().set('hour', 17).set('minute', 59),
        showFromPicker: false,
        showToPicker: false,
    }]);
    const [saturdayHours, setSaturdayHours] = useState([{
        fromTime: dayjs().set('hour', 6).set('minute', 0),
        toTime: dayjs().set('hour', 17).set('minute', 59),
        showFromPicker: false,
        showToPicker: false,
    }]);

    const handleToggle = () => {
        setIsHolidayMode(!isHolidayMode);
    };

    const handleToggleMonday = () => {
        setIsMondayOpen(!isMondayOpen);
    };
    const handleToggleTuesday = () => {
        setIsTuesdayOpen(!isTuesdayOpen);
    };
    const handleToggleWednesday=()=>{
        setIsWednesdayOpen(!isWednesdayOpen);
    }
    const handleToggleThursday=()=>{
        setIsThursdayOpen(!isThursdayOpen);
    }
    const handleToggleFriday=()=>{
        setIsFridayOpen(!isFridayOpen);
    }
    const handleToggleSaturday=()=>{
        setIsSaturdayOpen(!isSaturdayOpen)
    }

    const addMondayHoursRow = () => {
        setMondayHours([
            ...mondayHours,
            {
                fromTime: dayjs().set('hour', 6).set('minute', 0),
                toTime: dayjs().set('hour', 17).set('minute', 59),
                showFromPicker: false,
                showToPicker: false,
            },
        ]);
    };

    const deleteMondayHoursRow = (index) => {
        setMondayHours(mondayHours.filter((_, i) => i !== index));
    };

    const addTuesdayHoursRow = () => {
        setTuesdayHours([
            ...tuesdayHours,
            {
                fromTime: dayjs().set('hour', 6).set('minute', 0),
                toTime: dayjs().set('hour', 17).set('minute', 59),
                showFromPicker: false,
                showToPicker: false,
            },
        ]);
    };

    const deleteTuesdayHoursRow = (index) => {
        setTuesdayHours(tuesdayHours.filter((_, i) => i !== index));
    };
    
    const addWednesdayHoursRow = () => {
        setWednesdayHours([
            ...wednesdayHours,
            {
                fromTime: dayjs().set('hour', 6).set('minute', 0),
                toTime: dayjs().set('hour', 17).set('minute', 59),
                showFromPicker: false,
                showToPicker: false,
            },
        ]);
    };

    const deleteWednesdayHoursRow = (index) => {
        setWednesdayHours(wednesdayHours.filter((_, i) => i !== index));
    };

    const addThursdayHoursRow = () => {
        setThursdayHours([
            ...thursdayHours,
            {
                fromTime: dayjs().set('hour', 6).set('minute', 0),
                toTime: dayjs().set('hour', 17).set('minute', 59),
                showFromPicker: false,
                showToPicker: false,
            },
        ]);
    };

    const deleteThursdayHoursRow = (index) => {
        setThursdayHours(thursdayHours.filter((_, i) => i !== index));
    };

    const addFridayHoursRow = () => {
        setFridayHours([
            ...fridayHours,
            {
                fromTime: dayjs().set('hour', 6).set('minute', 0),
                toTime: dayjs().set('hour', 17).set('minute', 59),
                showFromPicker: false,
                showToPicker: false,
            },
        ]);
    };

    const deleteFridayHoursRow = (index) => {
        setFridayHours(fridayHours.filter((_, i) => i !== index));
    };

    const addSaturdayHoursRow = () => {
        setSaturdayHours([
            ...saturdayHours,
            {
                fromTime: dayjs().set('hour', 6).set('minute', 0),
                toTime: dayjs().set('hour', 17).set('minute', 59),
                showFromPicker: false,
                showToPicker: false,
            },
        ]);
    };

    const deleteSaturdayHoursRow = (index) => {
        setSaturdayHours(saturdayHours.filter((_, i) => i !== index));
    };


    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Modal show={show} onHide={handleClose} dialogClassName="modal-custom">
                <Modal.Header className="modal-header" closeButton>
                    <Modal.Title className="modal-title">Working Hours Setting</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body-content">
                    <div className="body-sub-content">
                        <div className="holiday-mode-text">Holiday Mode</div>
                        <div className={`holidaytoggle ${isHolidayMode ? 'active' : ''}`} style={{ width: '100px' }}>
                            <label className="toggle-label">Off</label>
                            <button
                                type="button"
                                className="toggle__control"
                                onClick={handleToggle}
                                aria-label="Toggle"
                            >
                                <div className={`toggle-indicator ${isHolidayMode ? 'active' : ''}`}></div>
                            </button>
                            <label className="toggle-label">On</label>
                        </div>
                    </div>
                    <div className="body-sub-text">Working hours in Customer time zone (GMT +3)</div>


                    <WorkingHoursRow
                        day="Monday"
                        hours={mondayHours}
                        setHours={setMondayHours}
                        isOpen={isMondayOpen}
                        handleToggle={handleToggleMonday}
                        addRow={addMondayHoursRow}
                        deleteRow={deleteMondayHoursRow}
                       
                    />
                    <WorkingHoursRow
                        day="Tuesday"
                        hours={tuesdayHours}
                        setHours={setTuesdayHours}
                        isOpen={isTuesdayOpen}
                        handleToggle={handleToggleTuesday}
                        addRow={addTuesdayHoursRow}
                        deleteRow={deleteTuesdayHoursRow}
                       
                    />
                     <WorkingHoursRow
                        day="Wednesday"
                        hours={wednesdayHours}
                        setHours={setWednesdayHours}
                        isOpen={isWednesdayOpen}
                        handleToggle={handleToggleWednesday}
                        addRow={addWednesdayHoursRow}
                        deleteRow={deleteWednesdayHoursRow}
                        
                    />
                     <WorkingHoursRow
                        day="Thursday"
                        hours={thursdayHours}
                        setHours={setThursdayHours}
                        isOpen={isThursdayOpen}
                        handleToggle={handleToggleThursday}
                        addRow={addThursdayHoursRow}
                        deleteRow={deleteThursdayHoursRow}
                      
                    />
                     <WorkingHoursRow
                        day="Friday"
                        hours={fridayHours}
                        setHours={setFridayHours}
                        isOpen={isFridayOpen}
                        handleToggle={handleToggleFriday}
                        addRow={addFridayHoursRow}
                        deleteRow={deleteFridayHoursRow}
                       
                    />
                     <WorkingHoursRow
                        day="Saturday"
                        hours={saturdayHours}
                        setHours={setSaturdayHours}
                        isOpen={isSaturdayOpen}
                        handleToggle={handleToggleSaturday}
                        addRow={addSaturdayHoursRow}
                        deleteRow={deleteSaturdayHoursRow}
                        
                    />

                </Modal.Body>
                <div className='modal-action'>
             <button className='btn btn-success modal-savebtn' >Save and close</button>
                 </div>
            </Modal>
        </LocalizationProvider>
    );
};



export default WorkingHoursSettings;

