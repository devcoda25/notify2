import React, { useState } from "react";
import { TextField, Grid, Autocomplete,Table, TableBody, TableCell, TableHead, TablePagination, TableRow } from "@mui/material";
import TicketStatusOvertime from "./InboxAnalyticsGraph/TicketStatusOvertime";
import TicketStatusCount from "./InboxAnalyticsGraph/TicketStatusCount";
import CountofTags from "./InboxAnalyticsGraph/CountofTags";
import TicketDuration from "./InboxAnalyticsGraph/TicketDuration";
import SendandreceivedMessages from "./InboxAnalyticsGraph/SendandreceivedMessages";
import Sendmessagebytype from './InboxAnalyticsGraph/Sendmessagebytype';
import MessageDeliveryStatus from './InboxAnalyticsGraph/MessageDeleiveryStatus';
import TicketConversationbyType from "./InboxAnalyticsGraph/TicketCoversationbyType";
import dayjs from 'dayjs';
import CustomDatePicker from "../CustomDatePicker";
import ToggleSwitch from "../ToggleSwitch";
import style from "../MuiStyles/muiStyle";
import AutocompleteComponent from "../AutocompleteComponent";

const styles = {

  tablePaginationStyle: {
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
  }
}
const initialTableData = [
  { id: 1, name: "EV zone", email: 'info@evzoneafrica.com', openTickets: 0, pendingTickets: 0, ticketsassigned: 0, ticketsSolved: 0, ticketsExpired: 0, missedchats: 0, responseTime: '-', resolutionTime: '-', operator: 'Od oh 22m 50s' },
  { id: 2, name: "KnowBot", email: '', openTickets: 0, pendingTickets: 0, ticketsassigned: 0, ticketsSolved: 0, ticketsExpired: 0, missedchats: 0, responseTime: '-', resolutionTime: '-', operator: '7d 10h 48m 25s' },
  { id: 3, name: "Thameem Hameed", email: 'thameem@heptotechnologies.org', openTickets: 0, pendingTickets: 0, ticketsassigned: 0, ticketsSolved: 0, ticketsExpired: 0, missedchats: 0, responseTime: '-', resolutionTime: '-', operator: '2d 13h 34m 36s' },
  { id: 4, name: "juliet_1", email: 'juliet_1@evzoneafrica.com', openTickets: 0, pendingTickets: 0, ticketsassigned: 0, ticketsSolved: 0, ticketsExpired: 0, missedchats: 0, responseTime: '-', resolutionTime: '-', operator: '' },
]
const periodOptions = ['Custom range', 'Today', 'Yesterday', 'Last 7 days', 'Last 30 days'];
const messageType = ["Chat Messages", "SMS"];
const allUsers = ['All', 'EV zone', 'juliet_1', 'Thameem hameed', 'KnowBot'];

const InboxAnalytics = () => {
  const [state, setState] = useState({
    isActive: false,
    dateFromValue: dayjs('2024-11-30'),
    dateToValue: dayjs('2024-07-12'),
    value: '',
    operatorPerformanceData: initialTableData,
    data: messageType[0],
    periodData: '',
    selectedUsers: []
  });
  const updateState = (newState) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };
  //toggle

  const handleToggle = () => {
    updateState({ isActive: !state.isActive });
  };


  //pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, SetRowsPerPage] = useState(5);


  //pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  }
  const handleChangeRowPerPage = (event) => {
    SetRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

  const handleUserChange = (option, checked) => {
    let updatedSelection;
    // If "All" is checked, select all users
    if (option === 'All') {
      updatedSelection = checked ? [...allUsers] : [];
    } else {
      // Update selected users for individual options
      updatedSelection = checked
        ? [...state.selectedUsers, option] // Add checked option
        : state.selectedUsers.filter((user) => user !== option); // Remove unchecked option

      // If any individual option is unchecked, uncheck "All"
      if (updatedSelection.length !== allUsers.length - 1) {
        updatedSelection = updatedSelection.filter((user) => user !== 'All');
      }
    }

    updateState({ selectedUsers: updatedSelection });
  };


  const isChecked = (option) => state.selectedUsers.includes(option);


  return (
    <>
      <div className='analytics__right__content'>
        <div className="analytics_container">
          <div className="header__section">
            <div>
              <div className="title_content">Team Inbox Analytics</div>

              <div className="title__info">Get an overview of all your important team, operator and ticket metrics here</div>
            </div>
            <div className="title__sample_data">
              <ToggleSwitch leftLabel='Preview with sample data' isActive={state.isActive} onToggle={handleToggle} />

            </div>
          </div>
          <div className="datarange_content">
            <div className="dataheaderbar">
              <h3 className="headerbar__label">Data range filter</h3>
            </div>
            <div className="datepicker_container">
              <div className="datepicker_subcontent">
                <div className="datepickerlabel">From</div>
                <CustomDatePicker
                  value={state.dateFromValue}
                  onChange={(newValue) => updateState({ dateFromValue: newValue })}
                />

              </div>
              <div className="datepicker_subcontent">
                <div className="datepickerlabel">To</div>
                <CustomDatePicker
                  value={state.dateToValue}
                  onChange={(newValue) => updateState({ dateToValue: newValue })}
                />

              </div>
              <div className="datepicker_subcontent lastchild">
                <div className="datepickerlabel">Period</div>
                <AutocompleteComponent
                  options={periodOptions}
                  value={state.periodData}
                  onChange={(event, newValue) => updateState({ periodData: newValue })}
                  customStyles={{ ...style.analyticPeriodDropdown }}
                />

              </div>

            </div>
          </div>
          <div className="main_content">
            <Grid container >
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className="overview_grid_item" >
                <div className="overview_container">
                  <div className="overview_title">Overview</div>
                  <div className="overview_grid_container">
                    <div className="info__box emptybox">
                      <div className="info__count">0</div>
                      <div className="info__label">Open</div>
                    </div>
                    <div className="info__box emptybox">
                      <div className="info__count">0</div>
                      <div className="info__label">Pending</div>
                    </div>
                    <div className="info__box emptybox">
                      <div className="info__count">0</div>
                      <div className="info__label">Solved</div>
                    </div>
                    <div className="info__box emptybox">
                      <div className="info__count">0</div>
                      <div className="info__label">Solved by bot</div>
                    </div>
                    <div className="info__box emptybox">
                      <div className="info__count">0</div>
                      <div className="info__label">Solved by operator</div>
                    </div>
                    <div className="info__box emptybox">
                      <div className="info__count">0</div>
                      <div className="info__label">Expired</div>
                    </div>
                    <div className="info__box emptybox">
                      <div className="info__count">0</div>
                      <div className="info__label">Missed chats</div>
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6} xl={6} className="graph_grid_container" >
                <div className="ticket_status_container">
                  <div className="ticket_status_header">
                    <div className="ticket_status_title">Ticket status over time
                      <span ><svg className="ticket_warning_icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.9987 1.20856C17.9592 1.20856 22.7904 6.04089 22.7904 12.0002C22.7904 17.9596 17.9592 22.7919 11.9987 22.7919C6.03937 22.7919 1.20703 17.9596 1.20703 12.0002C1.20703 6.04089 6.03937 1.20856 11.9987 1.20856Z" stroke="#637E73" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.9935 7.57166V12.7272" stroke="#637E73" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.9916 16.4288H12.0032" stroke="#637E73" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>
                    </div>

                  </div>
                  <div className="graphchart_content">
                    <TicketStatusOvertime />
                  </div>
                </div>
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6} xl={6}  >
                <div className="ticket_status_container" style={{ paddingLeft: '1.5rem', paddingRight: '50px' }}>
                  <div className="ticket_status_header">
                    <div className="ticket_status_title">Total ticket count by status
                      <span ><svg className="ticket_warning_icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.9987 1.20856C17.9592 1.20856 22.7904 6.04089 22.7904 12.0002C22.7904 17.9596 17.9592 22.7919 11.9987 22.7919C6.03937 22.7919 1.20703 17.9596 1.20703 12.0002C1.20703 6.04089 6.03937 1.20856 11.9987 1.20856Z" stroke="#637E73" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.9935 7.57166V12.7272" stroke="#637E73" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.9916 16.4288H12.0032" stroke="#637E73" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>
                    </div>
                  </div>
                  <div className="graphchart_content">
                    <TicketStatusCount /></div>
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                <div className="operatorperformance">
                  <div className="operator_table_header">
                    <div className="overview_title">Operator Performance
                      <span ><svg className="ticket_warning_icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.9987 1.20856C17.9592 1.20856 22.7904 6.04089 22.7904 12.0002C22.7904 17.9596 17.9592 22.7919 11.9987 22.7919C6.03937 22.7919 1.20703 17.9596 1.20703 12.0002C1.20703 6.04089 6.03937 1.20856 11.9987 1.20856Z" stroke="#637E73" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.9935 7.57166V12.7272" stroke="#637E73" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.9916 16.4288H12.0032" stroke="#637E73" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>
                    </div>
                    <div className="operator_header_tooltip">
                      <button className="operator_updated_btn"><svg className="updated_button" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.91645 6.5334C5.52494 4.88955 7.04727 3.75 8.78454 3.75C9.7175 3.75 10.5798 4.07375 11.2768 4.62664C11.5831 4.86968 11.8575 5.15707 12.0907 5.48045C12.2316 5.67573 12.3573 5.88399 12.466 6.10331C12.6805 6.53631 13.2055 6.71341 13.6385 6.49885C14.0715 6.2843 14.2486 5.75935 14.034 5.32634C13.8826 5.02077 13.7071 4.73 13.5101 4.45676C13.1839 4.00448 12.7982 3.59984 12.3643 3.25563C11.3745 2.47039 10.1329 2 8.78454 2C6.1347 2 3.93026 3.79794 3.16921 6.24295L2.50711 5.55122C2.17296 5.20211 1.61907 5.18999 1.26997 5.52414C0.920865 5.85829 0.908743 6.41218 1.24289 6.76128L3.12731 8.73003C3.39659 9.01136 3.81938 9.08087 4.16455 8.90056L6.67711 7.58806C7.10544 7.36431 7.27129 6.8357 7.04754 6.40737C6.82379 5.97904 6.29517 5.81319 5.86685 6.03694L4.91645 6.5334ZM12.8335 11.4666C12.2251 13.1104 10.7027 14.25 8.96546 14.25C8.0325 14.25 7.17022 13.9262 6.47325 13.3734C6.16687 13.1303 5.89251 12.8429 5.65928 12.5196C5.51844 12.3243 5.3927 12.116 5.28403 11.8967C5.06948 11.4637 4.54453 11.2866 4.11152 11.5011C3.67851 11.7157 3.50142 12.2407 3.71597 12.6737C3.86738 12.9792 4.04286 13.27 4.23993 13.5432C4.56613 13.9955 4.95175 14.4002 5.38566 14.7444C6.37553 15.5296 7.61706 16 8.96546 16C11.6153 16 13.8197 14.2021 14.5808 11.757L15.2429 12.4488C15.577 12.7979 16.1309 12.81 16.48 12.4759C16.8291 12.1417 16.8413 11.5878 16.5071 11.2387L14.6227 9.26997C14.3534 8.98864 13.9306 8.91913 13.5854 9.09944L11.0729 10.4119C10.6446 10.6357 10.4787 11.1643 10.7025 11.5926C10.9262 12.021 11.4548 12.1868 11.8832 11.9631L12.8335 11.4666Z" fill="#333"></path></svg></button>
                      <Autocomplete
                        options={allUsers}
                        value={state.selectedUsers}
                        disableClearable

                        renderOption={(props, option) => (
                          <li {...props}>
                            <div class="inboxcheckbox-container">
                              <input type="checkbox" id="customCheckbox" class="usercustom-checkbox"
                                checked={isChecked(option)}
                                onChange={(e) => handleUserChange(option, e.target.checked)}
                              />

                            </div>
                            {option}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            placeholder="Select users"
                            InputProps={{
                              ...params.InputProps,
                              sx: {
                                ...style.operatorPerformaceUser

                              },
                            }}

                          />
                        )}


                      />
                      <div className="operator_menuicon"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path></svg></div>
                    </div>
                  </div>
                  <div>
                    <div className='operator_list_table'>
                      <Table className='operator_performance_table'>
                        <TableHead className='operator__head'>
                          <TableRow className='operator__row'>
                            <TableCell className='firstcolumn operator__cell' >User</TableCell>
                            <TableCell className='operator__cell gray_background'>Current open tickets</TableCell>
                            <TableCell className='operator__cell gray_background'>Current Pending tickets</TableCell>
                            <TableCell className='operator__cell'>Tickets assigned</TableCell>
                            <TableCell className='operator__cell'>Tickets solved</TableCell>
                            <TableCell className='operator__cell' >Tickets expired</TableCell>
                            <TableCell className='operator__cell' >Missed chats</TableCell>
                            <TableCell className='operator__cell'>Avg.First response Time</TableCell>
                            <TableCell className='operator__cell'>Avg.Resolution Time</TableCell>
                            <TableCell className='operator__cell'>Operator availability</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody className='operator__table__body'>
                          {state.operatorPerformanceData.map((data, index) => (
                            <TableRow key={index} className='operator__body__row'>

                              <TableCell className='firstcolumn first__cell operator_body_cell'>
                                <div>{data.name}</div>
                                <div className="operatoremail">{data.email}</div>
                              </TableCell>

                              <TableCell className="operator_body_cell gray_background" >{data.openTickets}</TableCell>
                              <TableCell className="operator_body_cell gray_background">{data.pendingTickets}</TableCell>
                              <TableCell className="operator_body_cell">{data.ticketsassigned}</TableCell>
                              <TableCell className="operator_body_cell">{data.ticketsSolved}</TableCell>
                              <TableCell className="operator_body_cell">{data.ticketsExpired}</TableCell>
                              <TableCell className="operator_body_cell">{data.missedchats}</TableCell>
                              <TableCell className="operator_body_cell">{data.responseTime}</TableCell>
                              <TableCell className="operator_body_cell">{data.resolutionTime}</TableCell>
                              <TableCell className="operator_body_cell">{data.operator}</TableCell>

                            </TableRow>
                          ))
                          }
                        </TableBody>
                      </Table>
                    </div>
                    <div className='inboxanalytics__pagination'>
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 100]}
                        component='div'
                        count={10}
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

                        sx={styles.tablePaginationStyle}

                      />
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6} xl={6} className="graph_grid_container" >
                <div className="ticket_status_container">
                  <div className="ticket_status_header">
                    <div className="ticket_status_title">Count of Tags
                      <span ><svg className="ticket_warning_icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.9987 1.20856C17.9592 1.20856 22.7904 6.04089 22.7904 12.0002C22.7904 17.9596 17.9592 22.7919 11.9987 22.7919C6.03937 22.7919 1.20703 17.9596 1.20703 12.0002C1.20703 6.04089 6.03937 1.20856 11.9987 1.20856Z" stroke="#637E73" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.9935 7.57166V12.7272" stroke="#637E73" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.9916 16.4288H12.0032" stroke="#637E73" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>
                    </div>

                  </div>
                  <div className="graphchart_content">
                    <CountofTags /></div>
                </div>
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6} xl={6} className="graph_grid_container" >
                <div className="ticket_status_container" style={{ paddingLeft: '1.5rem', paddingRight: '50px' }}>
                  <div className="ticket_status_header">
                    <div className="ticket_status_title">Ticket duration v/s count
                      <span ><svg className="ticket_warning_icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.9987 1.20856C17.9592 1.20856 22.7904 6.04089 22.7904 12.0002C22.7904 17.9596 17.9592 22.7919 11.9987 22.7919C6.03937 22.7919 1.20703 17.9596 1.20703 12.0002C1.20703 6.04089 6.03937 1.20856 11.9987 1.20856Z" stroke="#637E73" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.9935 7.57166V12.7272" stroke="#637E73" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.9916 16.4288H12.0032" stroke="#637E73" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>
                    </div>
                  </div>
                  <div className="graphchart_content">
                    <TicketDuration />
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                <div className="ticket_status_container sendandreceived_border" style={{ paddingRight: '50px' }}>
                  <div className="ticket_status_header">
                    <div className="ticket_status_title">Send v/s received messages
                      <span ><svg className="ticket_warning_icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.9987 1.20856C17.9592 1.20856 22.7904 6.04089 22.7904 12.0002C22.7904 17.9596 17.9592 22.7919 11.9987 22.7919C6.03937 22.7919 1.20703 17.9596 1.20703 12.0002C1.20703 6.04089 6.03937 1.20856 11.9987 1.20856Z" stroke="#637E73" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.9935 7.57166V12.7272" stroke="#637E73" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.9916 16.4288H12.0032" stroke="#637E73" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>
                    </div>
                  </div>
                  <div className="graphchart_content">
                    <SendandreceivedMessages />
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                <div className="ticket_status_container sendmessage_border" style={{ paddingRight: '50px' }} >
                  <div className="ticket_status_header">
                    <div className="ticket_status_title">Send messages by type
                      <span ><svg className="ticket_warning_icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.9987 1.20856C17.9592 1.20856 22.7904 6.04089 22.7904 12.0002C22.7904 17.9596 17.9592 22.7919 11.9987 22.7919C6.03937 22.7919 1.20703 17.9596 1.20703 12.0002C1.20703 6.04089 6.03937 1.20856 11.9987 1.20856Z" stroke="#637E73" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.9935 7.57166V12.7272" stroke="#637E73" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.9916 16.4288H12.0032" stroke="#637E73" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>
                    </div>
                  </div>
                  <div className="graphchart_content">
                    <Sendmessagebytype />
                  </div>
                </div>
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6} xl={6} className="graph_grid_container" >
                <div className="ticket_status_container">
                  <div className="ticket_status_header">
                    <div className="ticket_status_title">Message Delivery Status
                      <span ><svg className="ticket_warning_icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.9987 1.20856C17.9592 1.20856 22.7904 6.04089 22.7904 12.0002C22.7904 17.9596 17.9592 22.7919 11.9987 22.7919C6.03937 22.7919 1.20703 17.9596 1.20703 12.0002C1.20703 6.04089 6.03937 1.20856 11.9987 1.20856Z" stroke="#637E73" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.9935 7.57166V12.7272" stroke="#637E73" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.9916 16.4288H12.0032" stroke="#637E73" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>

                      <div className="message_deliverystatus_drodpown">
                        <AutocompleteComponent
                          options={messageType}
                          value={state.data}
                          onChange={(event, newValue) => updateState({ data: newValue })}
                          customStyles={style.newticketsAutocomplete}
                        />
                      </div>
                    </div>

                  </div>
                  <div className="graphchart_content">
                    <MessageDeliveryStatus /></div>
                </div>
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6} xl={6} className="graph_grid_container" >
                <div className="ticket_status_container" style={{ paddingLeft: '1.5rem', paddingRight: '50px' }}>
                  <div className="ticket_status_header">
                    <div className="ticket_status_title">Ticket Conversations by type
                      <span ><svg className="ticket_warning_icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.9987 1.20856C17.9592 1.20856 22.7904 6.04089 22.7904 12.0002C22.7904 17.9596 17.9592 22.7919 11.9987 22.7919C6.03937 22.7919 1.20703 17.9596 1.20703 12.0002C1.20703 6.04089 6.03937 1.20856 11.9987 1.20856Z" stroke="#637E73" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.9935 7.57166V12.7272" stroke="#637E73" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.9916 16.4288H12.0032" stroke="#637E73" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>
                    </div>
                  </div>
                  <div className="graphchart_content">
                    <TicketConversationbyType /></div>
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </>
  )
}
export default InboxAnalytics;