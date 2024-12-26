import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TablePagination, TableRow, IconButton, Tooltip, Badge } from '@mui/material';
import dayjs from "dayjs";
import { MdClose } from "react-icons/md";
import { Modal, ModalBody, ModalFooter } from 'react-bootstrap';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { TextField } from "@mui/material";
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
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
const ScheduledBroadcast = () => {
    const [isEditBroadcastModal, setIsEditBroadcast] = useState(false);
    const [isOpenScheduleDeleteModal, setIsOpeSchedulenDeleteModal] = useState(false);
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

    const OpenEditBroadcastModal = () => {
        setIsEditBroadcast(true);
    };

    const closeEditBroadcastModal = () => {
        setIsEditBroadcast(false);
    };

   const OpenScheduleDeleteModal = () => {
        setIsOpeSchedulenDeleteModal(true);
    };

    const closeScheduleDeleteModal = () => {
        setIsOpeSchedulenDeleteModal(false);
    };
  
  
    return (
        <>
            {isEditBroadcastModal && (
                <EditBroadcastModal show={isEditBroadcastModal} onClose={closeEditBroadcastModal} />
            )}
            {isOpenScheduleDeleteModal && (
                <ScheduleDeleteModal show={OpenScheduleDeleteModal} onClose={closeScheduleDeleteModal} />
            )}
            <div className='schedule_broadcast'>
                <div className="scheduled-broadcast">
                    <div className="action-bar__left-side">
                        <h3 className="action-bar__header">Scheduled Broadcast</h3>
                        <div className="custom-action-bar-search">
                            <div className="custom-search-input-container"   >
                                <div className="custom-input-wrap">
                                    <input
                                        type="text"
                                        className="custom-search-input"
                                        placeholder="Search..."
                                        value="Search"


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
                            <div className="row-name" >
                                payment_success_1_171220241423
                            </div>
                            <div className="row-scheduled" >
                                Start In: 2/21/2025 10:00:01 AM
                            </div>
                            <div className="row-actions" >
                                <Tooltip title="edit" >
                                    <button aria-label="edit" className='cell__edit' onClick={OpenEditBroadcastModal} ><svg className='editsvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.3753 9.16041C12.6078 9.74959 10.2511 7.39287 10.8402 5.62533M11.5664 4.89913L7.75841 8.70716C6.10291 10.3627 4.92846 12.437 4.36063 14.7083L4.17663 15.4443C4.11929 15.6736 4.32702 15.8814 4.55635 15.824L5.29236 15.64C7.56369 15.0722 9.638 13.8977 11.2935 12.2422L15.1015 8.43421C15.5703 7.96543 15.8337 7.32963 15.8337 6.66667C15.8337 5.28614 14.7145 4.16699 13.334 4.16699C12.671 4.16699 12.0352 4.43035 11.5664 4.89913Z" stroke="#333" stroke-width="1.25"></path></svg></button>
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
        </>
    )
}
export default ScheduledBroadcast;