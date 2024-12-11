import React, { useEffect, useState } from 'react';
// import Form from 'react-bootstrap/Form';
// import { Line, Bar } from 'react-chartjs-2';
// import { CgArrowLongLeft } from "react-icons/cg";
// import { CgArrowLongRight } from "react-icons/cg";
// import { Chart, LinearScale, CategoryScale, PointElement, LineElement, BarElement } from 'chart.js';


// const labelsInfo = [
//     { text: 'Opened', color: 'green', fadedColor: 'rgba(0, 128, 0, 0.4)' },
//     { text: 'Pending', color: 'orange', fadedColor: 'rgba(255, 165, 0, 0.4)' },
//     { text: 'Solved', color: 'blue', fadedColor: 'rgba(0, 0, 255, 0.4)' },
//     { text: 'Solved by Operator', color: 'purple', fadedColor: 'rgba(128, 0, 128, 0.4)' },
//     { text: 'Solved by Bot', color: 'grey', fadedColor: 'rgba(128, 128, 128, 0.4)' },
//     { text: 'Expired', color: 'red', fadedColor: 'rgba(255, 0, 0, 0.4)' },
//     { text: 'Missed Chats', color: 'pink', fadedColor: 'rgba(255, 192, 203, 0.4)' },
// ];
// const ticketsData = [
//     {
//         user: 'KnowBot',
//         currentopentickets: 0,
//         currentpendingtickets: 0,
//         ticketsassigned: 0,
//         ticketssolved: 0,
//         ticketsexpired: 0,
//         missedchat: 0,
//         firstresponse: '-'
//     },
//      {
//         user: 'Thameem Hameed',
//         mail: 'thameem@heptotechnologies.org',
//         currentopentickets: 0,
//         currentpendingtickets: 0,
//         ticketsassigned: 0,
//         ticketssolved: 0,
//         ticketsexpired: 0,
//         missedchat: 0,
//         firstresponse: '-'
//     },
//     {
//         user: 'EV zone',
//         mail: 'info@evzoneafrica.com',
//         currentopentickets: 0,
//         currentpendingtickets: 0,
//         ticketsassigned: 0,
//         ticketssolved: 0,
//         ticketsexpired: 0,
//         missedchat: 0,
//         firstresponse: '-'
//     },
//     {
//         user: 'juliet_1',
//         mail: 'juliet_1@evzoneafrica.com',
//         currentopentickets: 0,
//         currentpendingtickets: 0,
//         ticketsassigned: 0,
//         ticketssolved: 0,
//         ticketsexpired: 0,
//         missedchat: 0,
//         firstresponse: '-'
//     }
// ]
// const Analytics = () => {
//     Chart.register(LinearScale, CategoryScale, PointElement, LineElement, BarElement);
//     const [selectCount, setSelectCount] = useState(false);
//     const [selectNumber, setSelectNumber] = useState(5);
//     const [pageNum, setPageNum] = useState(1);
//     const [pageTotalNum, setPageTotalNum] = useState(5);
//     const [itemsPerPage, setItemsPerPage] = useState(selectNumber);

//     const startIndex= (pageNum-1) * itemsPerPage;
//     const endIndex=startIndex + itemsPerPage;
//     const displayedTicketsData=ticketsData.slice(startIndex,endIndex);
//     const pageLastNum = Math.min(pageNum * itemsPerPage, pageTotalNum);
//    const handlePreviousChange=()=>{
//        if(pageNum >1 ){
//         setPageNum(prev=> prev-1);
//        }
//    }
//    const handleNextChange=()=>{
//     if(pageNum< Math.ceil(pageTotalNum/itemsPerPage)){
//         setPageNum(prev => prev+1)
//     }
//    }
//     const data = {
//         labels: ['11 Sept', '12 Sept', '13 Sept', '14 Sept', '15 Sept', '16 Sept', '17 Sept'],
//         datasets: [
//             {
//                 label: 'Ticket Status Over Time',
//                 data: [1.0, 0],
//                 fill: false,
//                 borderColor: 'red',
//                 tension: 0.4,
//                 borderWidth: 1,
//             },
//         ],
//     };

//     const options = {
//         scales: {
//             y: {
//                 min: 0,
//                 max: 1,
//                 ticks: {
//                     stepSize: 0.1,
//                 },
//             },
//             x: {

//                 border: {
//                     color: 'pink',
//                     width: 3,
//                 },
//             },
//         },
//     };
//     const barData = {
//         labels: ['Opened', 'Pending', 'Solved', 'Solved by Operator', 'Solved by Bot', 'Expired', 'Missed Chats'],
//         datasets: [
//             {
//                 label: 'Ticket Status Count',
//                 data: [0, 0, 0, 0, 1, 0, 0],
//                 backgroundColor: 'orange',
//                 border: "none",
//                 borderWidth: 1,
//             },
//         ],
//     };

//     const barOptions = {
//         scales: {
//             y: {
//                 min: 0,
//                 max: 1,
//                 ticks: {
//                     stepSize: 0.1,
//                 },

//             },
//             x: {

//                 grid: {
//                     display: false,

//                 },
//             }

//         },
//     };


//     return (
//         <div className='maincontent'>
//             <div className='msgCont'>
//                 <div className='msgContL'>
//                     <li className='solo'><a><svg width='20' height='20' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><g id="Inbox_Analytics" data-name="Inbox Analytics"><path d="M11.78,33.72H1v-20H11.78ZM3,31.72H9.78v-16H3Z" fill="#309e69"/><path d="M35,33.72H24.22V7.9H35Zm-8.78-2H33V9.9H26.22Z" fill="#309e69"/><path d="M23.39,33.72H12.61V2.28H23.39Zm-8.78-2h6.78V4.28H14.61Z" fill="#309e69"/></g></svg><span >Inbox Analytics</span></a></li>
//                     <li ><a><svg width='23' height='23' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><g id="Whatsapp"><path d="M29.26,6.65a16,16,0,0,0-22.54,0A15.69,15.69,0,0,0,2,17.85H2A15.83,15.83,0,0,0,4,25.35L2.06,34l8.75-2A16,16,0,0,0,18,33.72h0a15.93,15.93,0,0,0,11.28-4.65,15.7,15.7,0,0,0,0-22.42ZM18,31.22h0a13.39,13.39,0,0,1-6.41-1.63l-.42-.22L5.34,30.69,6.61,25l-.25-.42a13.38,13.38,0,0,1-1.85-6.67,13.49,13.49,0,0,1,23-9.44,13.29,13.29,0,0,1,4,9.44A13.45,13.45,0,0,1,18,31.22Z" fill="#777"/><path d="M13.65,10.87H13a1.38,1.38,0,0,0-1,.45,4.12,4.12,0,0,0-1.28,3,7,7,0,0,0,1.5,3.77c.18.24,2.53,4,6.24,5.5,3.09,1.21,3.72,1,4.39.91a3.71,3.71,0,0,0,2.47-1.73,3.07,3.07,0,0,0,.21-1.73c-.09-.15-.33-.25-.7-.43s-2.16-1.08-2.49-1.2-.58-.18-.82.19-1,1.2-1.18,1.45-.43.27-.79.09a10.36,10.36,0,0,1-2.93-1.82,11.36,11.36,0,0,1-2.06-2.56c-.21-.37,0-.56.17-.75s.38-.38.56-.59a2.39,2.39,0,0,0,.36-.61.68.68,0,0,0,0-.64c-.09-.18-.79-2-1.12-2.71h0C14.2,10.9,13.91,10.88,13.65,10.87Z" fill="#777"/></g></svg><span >Click to whatsapp ads (CTWA)</span></a></li>

//                 </div>
//                 <div className='msgContR'>
//                     <div className='analtyics-content'>
//                         <div className="row analytics-heading-profile">
//                             <div className="col-lg-6 col-md-6 col-sm-12 column">

//                                 <h2>Team Inbox Analytics</h2>
//                                 <span>Get an overview of all your important team, operator and ticket metrics here</span> </div>

//                             <div className="col-lg-6 col-md-6 col-sm-12 column">
//                                 <div className="top-bar-analytics">
//                                     preview with sample data
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="row analytics-subheading">
//                             <div className="col-lg-6 col-md-6 col-sm-12 column">

//                                 <h2>Date range filter</h2>


//                                 <table className='custom-table'>

//                                     <tr>
//                                         <th>From</th>
//                                         <th>To</th>
//                                         <th>Period</th>
//                                     </tr>

//                                     <tbody>
//                                         <tr>
//                                             <td>
//                                                 <input type="date" className='custom-input' />
//                                             </td>
//                                             <td>
//                                                 <input type="date" className='custom-input' />
//                                             </td>
//                                             <td>
//                                                 <Form.Select aria-label="Default select example" className='custom-select'>
//                                                     <option>Last 7 days</option>
//                                                     <option value="1"></option>
//                                                     <option value="2"></option>
//                                                 </Form.Select>
//                                             </td>
//                                         </tr>
//                                     </tbody>
//                                 </table>

//                             </div>
//                         </div>
//                         <div className="row analytics-subheading">


//                             <h2>Overview</h2>
//                             <div className="row">
//                                 <div className="col grid-item">
//                                     <div className='metric-value'>0</div>
//                                     <div>Open</div>
//                                 </div>
//                                 <div className="col grid-item">
//                                     <div className='metric-value'>0</div>
//                                     <div>Pending</div>
//                                 </div>
//                                 <div className="col grid-item">
//                                     <div className='metric-value'>0</div>
//                                     <div>Solved</div>
//                                 </div>
//                                 <div className="col grid-item">
//                                     <div className='metric-value'>0</div>
//                                     <div>Solved by Bot</div>
//                                 </div>
//                                 <div className="col grid-item">
//                                     <div className='metric-value'>0</div>
//                                     <div>Solved by operator</div>
//                                 </div>
//                                 <div className="col grid-item">
//                                     <div className='metric-value'>1</div>
//                                     <div>Expired</div>
//                                 </div>
//                                 <div className="col grid-item">
//                                     <div className='metric-value'>0</div>
//                                     <div>Missed chats</div>
//                                 </div>
//                             </div>
//                         </div>

//                     </div>
//                     <div className='analytics-graph-content'>
//                         <div className='analytics-leftgraph-content'>
//                             <div className="row analytics-subheading">
//                                 <h2>Ticket status over time</h2>
//                                 <Line data={data} options={options} />
//                                 <div className="label-container" >
//                                     {labelsInfo.map((label, index) => (
//                                         <div key={index}>
//                                             <span className='graph-label' style={{
//                                                 color: label.color,
//                                                 backgroundColor: label.fadedColor
//                                             }} >{label.text}</span>

//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>

//                         </div>
//                         <div className='analytics-rightgraph-content'>
//                             <div className="row analytics-subheading">
//                                 <h2>Total ticket count by status</h2>
//                                 <Bar data={barData} options={barOptions} />
//                                 <div className="label-container" >
//                                     {labelsInfo.map((label, index) => (
//                                         <div key={index}>
//                                             <span className='graph-label' style={{
//                                                 color: label.color,
//                                                 backgroundColor: label.fadedColor
//                                             }} >{label.text}</span>

//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <div className='analytics-table-content'>
//                         <div className="row analytics-subheading">
//                             <h2>Operator performance</h2>
//                         </div>
//                         <div className='col-md-12'>
//                         <div className='tableCont'>
//                             <div className="table">
//                                 <table>
//                                     <tr>
//                                         <th>User</th>
//                                         <th>Current open tickets</th>
//                                         <th>current pending tickets</th>
//                                         <th >Ticket assigned</th>
//                                         <th>Ticket solved</th>
//                                         <th >Ticket expired</th>
//                                         <th>Missed chats</th>
//                                         <th>Avg. First Response Time</th>
//                                     </tr>
//                                     <tbody>
//                                         {
//                                             displayedTicketsData.map((data, index) => (
//                                                 <tr key={index}>
//                                                     <td><div style={{ color: 'black', fontWeight: 'bold' }}>{data.user} </div>
//                                                         <div>{data.mail}</div>
//                                                     </td>
//                                                     <td>{data.currentopentickets}</td>
//                                                     <td>{data.currentpendingtickets}</td>
//                                                     <td>{data.ticketsassigned}</td>
//                                                     <td>{data.ticketssolved}</td>
//                                                     <td>{data.ticketsexpired}</td>
//                                                     <td>{data.missedchat}</td>
//                                                     <td>{data.firstresponse}</td>
//                                                 </tr>
//                                             ))
//                                         }
//                                     </tbody>

//                                 </table>
//                             </div>
//                             <div className="bodyFooter">
//                                 <div>
//                                     <p className="bodyFooterRow">Rows per page:</p>
//                                 </div>
//                                 <div onClick={() => { setSelectCount(!selectCount) }}
//                                     className="MuiInputBase-root MuiInputBase-colorPrimary MuiTablePagination-input css-rmmij8"
//                                 >
//                                     <div
//                                         tabIndex="0"
//                                         role="combobox"
//                                         aria-controls="menu-list"
//                                         aria-expanded={selectCount}
//                                         aria-haspopup="listbox"
//                                         className="MuiSelect-select MuiTablePagination-select MuiSelect-standard MuiInputBase-input css-1cccqvr"
//                                     >
//                                         {selectNumber}
//                                     </div>
//                                     <input
//                                         aria-hidden="true"
//                                         tabIndex="-1"
//                                         className="MuiSelect-nativeInput css-1k3x8v3"
//                                         value={selectNumber}
//                                     />
//                                     <svg
//                                         className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiSelect-icon MuiTablePagination-selectIcon MuiSelect-iconStandard css-1utq5rl"
//                                         viewBox="0 0 24 24"
//                                         aria-hidden="true"
//                                     >
//                                         <path d="M7 10l5 5 5-5z" />
//                                     </svg>

//                                 </div>
//                                 {
//                                     selectCount && (
//                                         <div className="MuiPaper-root MuiPaper-elevation8 MuiPopover-paper MuiMenu-paper MuiMenu-paper css-pwxzbm" tabindex="-1" style={{ opacity: '1', transform: 'none', minWidth: '48px', transition: 'opacity 262ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 174ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;', top: '156px', left: '982px', transformOrigin: '24px 87.7969px', display: selectCount ? "block" : "none" }}>
//                                             <ul className="MuiList-root MuiList-padding MuiMenu-list css-r8u8y9" role="listbox" tabindex="-1" aria-labelledby="menu-label" id="menu-list">
//                                            {
//                                             [5,10,25,100].map((val)=>(
//                                                 <li key={val}
//                                                 className={`MuiButtonBase-root MuiMenuItem-root MuiMenuItem-gutters MuiTablePagination-menuItem css-1gs62wq ${selectNumber === val ? 'Mui-selected' : ''}`}
//                                                 tabIndex="0" 
//                                                 role="option" 
//                                                 onClick={()=>{
//                                                     setSelectCount(false);
//                                                     setSelectNumber(val);
//                                                     setItemsPerPage(val);
//                                                 }}
//                                                 >
//                                                  {val}
//                                                  <span className="MuiTouchRipple-root css-w0pj6f"></span>
//                                                 </li>
//                                             ))
//                                            }
//                                             </ul>
//                                         </div>
//                                     )
//                                 }
//                                 <div>
//                                     <p className='footerCenter'>{pageNum}-{pageLastNum} of {pageTotalNum}</p>

//                                 </div>
//                                 <div className='previousNxtCont'>
//                                     <p onClick={handlePreviousChange}><CgArrowLongLeft className='leftRightArrow' /> <span className="footerPrevious">Previous</span></p>
//                                 </div>
//                                 <div className='previousNxtCont'>
//                                     <p className="footerCenter" onClick={handleNextChange}><span className="footerNext">Next</span> <CgArrowLongRight className='leftRightArrow' /></p>
//                                 </div>
//                             </div>
//                         </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }
// export default Analytics;


import InboxAnalytics from '../Component/Analytics/InboxAnalytics';
import WhatsappAds from '../Component/Analytics/WhatsapAds';

const Analytics = () => {


    const [activeContent, setActiveContent] = useState('inboxanalytics');
    const handleNavigationClick = (e, content) => {
        e.preventDefault();
        setActiveContent(content);
    };

    const renderContent = () => {
        switch (activeContent) {
            case 'inboxanalytics':
                return <InboxAnalytics/>
            case 'whatsappads':
                return <WhatsappAds/>
            default:
                return <InboxAnalytics/>
        }
    }

    return (
        <>
            <div className='maincontent'>


                <div className='msgCont'>

                    <div className='msgContL analytics__left__content'>
                        <li className='solo'><a href='#' onClick={(e) => handleNavigationClick(e, 'inboxanalytics')}><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_54_1471)"><path d="M4.37766 8.41309H0.586969C0.262793 8.41309 0 8.67591 0 9.00005V16.5814C0 16.9055 0.262793 17.1683 0.586969 17.1683H4.37766C4.7018 17.1683 4.96463 16.9056 4.96463 16.5814V9.00005C4.96459 8.67584 4.7018 8.41309 4.37766 8.41309ZM3.79069 15.9944H1.1739V9.58702H3.79069V15.9944Z" fill="#23a455" stroke="#23a455" stroke-width="0.2"></path><path d="M10.8928 0.832031H7.10211C6.77796 0.832031 6.51514 1.09479 6.51514 1.419V16.5816C6.51514 16.9058 6.77793 17.1686 7.10211 17.1686H10.8928C11.2169 17.1686 11.4798 16.9058 11.4798 16.5816V1.41896C11.4797 1.09479 11.2169 0.832031 10.8928 0.832031ZM10.3058 15.9947H7.68904V2.00593H10.3058V15.9947Z" fill="#23a455" stroke="#23a455" stroke-width="0.2"></path><path d="M17.4123 4.62256H13.6216C13.2975 4.62256 13.0347 4.88535 13.0347 5.20953V16.5815C13.0347 16.9057 13.2975 17.1685 13.6216 17.1685H17.4124C17.7365 17.1685 17.9993 16.9057 17.9993 16.5815V5.20953C17.9993 4.88539 17.7365 4.62256 17.4123 4.62256ZM16.8254 15.9946H14.2086V5.7965H16.8254V15.9946Z" fill="#23a455" stroke="#23a455" stroke-width="0.2"></path></g><defs><clipPath id="clip0_54_1471"><rect width="18" height="18" fill="white"></rect></clipPath></defs></svg><span className='leftbar__item__title' >Inbox Analytics</span></a></li>
                        <li ><a href='#' onClick={(e) => handleNavigationClick(e, 'whatsappads')}><svg width="30" height="30" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.07196 7.63225C8.93041 7.56148 8.23644 7.22043 8.10724 7.17293C7.97804 7.1259 7.88399 7.10263 7.78946 7.24418C7.69541 7.38478 7.42514 7.70303 7.34296 7.79708C7.26031 7.8916 7.17814 7.903 7.03706 7.8327C6.89599 7.76145 6.44094 7.61278 5.90181 7.13208C5.48239 6.75778 5.19881 6.2956 5.11664 6.15405C5.03446 6.01298 5.10761 5.9365 5.17839 5.8662C5.24204 5.80303 5.31946 5.70138 5.39024 5.6192C5.46101 5.53655 5.48429 5.47765 5.53131 5.38313C5.57881 5.28908 5.55506 5.2069 5.51944 5.13613C5.48429 5.06535 5.20214 4.37043 5.08434 4.0878C4.96986 3.81278 4.85349 3.8503 4.76704 3.84555C4.68439 3.84175 4.59034 3.8408 4.49629 3.8408C4.40224 3.8408 4.24929 3.87595 4.12009 4.0175C3.99041 4.15858 3.62609 4.5001 3.62609 5.19503C3.62609 5.88948 4.13149 6.56065 4.20226 6.65518C4.27304 6.74923 5.19739 8.17518 6.61336 8.7865C6.95061 8.93185 7.21329 9.01878 7.41801 9.08338C7.75621 9.1912 8.06401 9.176 8.30721 9.13943C8.57796 9.09905 9.14226 8.7979 9.26006 8.46825C9.37739 8.1386 9.37739 7.85598 9.34224 7.79708C9.30709 7.73818 9.21304 7.70303 9.07149 7.63225H9.07196ZM6.49651 11.1487H6.49461C5.65359 11.1488 4.82801 10.9227 4.10441 10.4941L3.93341 10.3925L2.15596 10.8589L2.63049 9.12613L2.51886 8.94848C2.04868 8.20004 1.79985 7.33385 1.80114 6.44998C1.80209 3.86123 3.90824 1.75508 6.49841 1.75508C7.75241 1.75508 8.93136 2.24433 9.81771 3.13163C10.2549 3.567 10.6014 4.08474 10.8372 4.6549C11.073 5.22506 11.1934 5.83631 11.1914 6.4533C11.1905 9.04205 9.08431 11.1487 6.49651 11.1487V11.1487ZM10.4922 2.4576C9.96885 1.93079 9.34615 1.51308 8.66018 1.22868C7.97421 0.944281 7.23862 0.798845 6.49604 0.800801C3.38289 0.800801 0.848285 3.33493 0.847335 6.4495C0.84686 7.4451 1.10669 8.41695 1.60116 9.27338L0.799835 12.2008L3.79424 11.4152C4.62258 11.8665 5.55083 12.1029 6.49414 12.103H6.49651C9.60966 12.103 12.1443 9.56883 12.1452 6.45378C12.1475 5.71148 12.0026 4.9761 11.7189 4.29017C11.4351 3.60423 11.0182 2.98137 10.4922 2.4576" fill="#666"></path><path d="M10.4922 2.4576C9.96885 1.93079 9.34615 1.51308 8.66018 1.22868C7.97421 0.944281 7.23862 0.798845 6.49604 0.800801C3.38289 0.800801 0.848285 3.33493 0.847335 6.4495C0.84686 7.4451 1.10669 8.41695 1.60116 9.27338L0.799835 12.2008L3.79424 11.4152C4.62258 11.8665 5.55083 12.1029 6.49414 12.103H6.49651C9.60966 12.103 12.1443 9.56883 12.1452 6.45378C12.1475 5.71148 12.0026 4.9761 11.7189 4.29017C11.4351 3.60423 11.0182 2.98137 10.4922 2.4576M9.07196 7.63225C8.93041 7.56148 8.23644 7.22043 8.10724 7.17293C7.97804 7.1259 7.88399 7.10263 7.78946 7.24418C7.69541 7.38478 7.42514 7.70303 7.34296 7.79708C7.26031 7.8916 7.17814 7.903 7.03706 7.8327C6.89599 7.76145 6.44094 7.61278 5.90181 7.13208C5.48239 6.75778 5.19881 6.2956 5.11664 6.15405C5.03446 6.01298 5.10761 5.9365 5.17839 5.8662C5.24204 5.80303 5.31946 5.70138 5.39024 5.6192C5.46101 5.53655 5.48429 5.47765 5.53131 5.38313C5.57881 5.28908 5.55506 5.2069 5.51944 5.13613C5.48429 5.06535 5.20214 4.37043 5.08434 4.0878C4.96986 3.81278 4.85349 3.8503 4.76704 3.84555C4.68439 3.84175 4.59034 3.8408 4.49629 3.8408C4.40224 3.8408 4.24929 3.87595 4.12009 4.0175C3.99041 4.15858 3.62609 4.5001 3.62609 5.19503C3.62609 5.88948 4.13149 6.56065 4.20226 6.65518C4.27304 6.74923 5.19739 8.17518 6.61336 8.7865C6.95061 8.93185 7.21329 9.01878 7.41801 9.08338C7.75621 9.1912 8.06401 9.176 8.30721 9.13943C8.57796 9.09905 9.14226 8.7979 9.26006 8.46825C9.37739 8.1386 9.37739 7.85598 9.34224 7.79708C9.30709 7.73818 9.21304 7.70303 9.07149 7.63225H9.07196ZM6.49651 11.1487H6.49461C5.65359 11.1488 4.82801 10.9227 4.10441 10.4941L3.93341 10.3925L2.15596 10.8589L2.63049 9.12613L2.51886 8.94848C2.04868 8.20004 1.79985 7.33385 1.80114 6.44998C1.80209 3.86123 3.90824 1.75508 6.49841 1.75508C7.75241 1.75508 8.93136 2.24433 9.81771 3.13163C10.2549 3.567 10.6014 4.08474 10.8372 4.6549C11.073 5.22506 11.1934 5.83631 11.1914 6.4533C11.1905 9.04205 9.08431 11.1487 6.49651 11.1487V11.1487Z" stroke="#666" stroke-width="0.2"></path></svg><span className='leftbar__item__title'>Click to whatsapp ads(CTWA)</span></a></li>

                    </div>
                    <div className='msgContR'>

                        {renderContent()}
                    </div>
                </div>

            </div>

        </>
    );
}
export default Analytics;