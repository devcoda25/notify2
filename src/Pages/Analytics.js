import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Line, Bar } from 'react-chartjs-2';
import { CgArrowLongLeft } from "react-icons/cg";
import { CgArrowLongRight } from "react-icons/cg";
import { Chart, LinearScale, CategoryScale, PointElement, LineElement, BarElement } from 'chart.js';


const labelsInfo = [
    { text: 'Opened', color: 'green', fadedColor: 'rgba(0, 128, 0, 0.4)' },
    { text: 'Pending', color: 'orange', fadedColor: 'rgba(255, 165, 0, 0.4)' },
    { text: 'Solved', color: 'blue', fadedColor: 'rgba(0, 0, 255, 0.4)' },
    { text: 'Solved by Operator', color: 'purple', fadedColor: 'rgba(128, 0, 128, 0.4)' },
    { text: 'Solved by Bot', color: 'grey', fadedColor: 'rgba(128, 128, 128, 0.4)' },
    { text: 'Expired', color: 'red', fadedColor: 'rgba(255, 0, 0, 0.4)' },
    { text: 'Missed Chats', color: 'pink', fadedColor: 'rgba(255, 192, 203, 0.4)' },
];
const ticketsData = [
    {
        user: 'KnowBot',
        currentopentickets: 0,
        currentpendingtickets: 0,
        ticketsassigned: 0,
        ticketssolved: 0,
        ticketsexpired: 0,
        missedchat: 0,
        firstresponse: '-'
    },
     {
        user: 'Thameem Hameed',
        mail: 'thameem@heptotechnologies.org',
        currentopentickets: 0,
        currentpendingtickets: 0,
        ticketsassigned: 0,
        ticketssolved: 0,
        ticketsexpired: 0,
        missedchat: 0,
        firstresponse: '-'
    },
    {
        user: 'EV zone',
        mail: 'info@evzoneafrica.com',
        currentopentickets: 0,
        currentpendingtickets: 0,
        ticketsassigned: 0,
        ticketssolved: 0,
        ticketsexpired: 0,
        missedchat: 0,
        firstresponse: '-'
    },
    {
        user: 'juliet_1',
        mail: 'juliet_1@evzoneafrica.com',
        currentopentickets: 0,
        currentpendingtickets: 0,
        ticketsassigned: 0,
        ticketssolved: 0,
        ticketsexpired: 0,
        missedchat: 0,
        firstresponse: '-'
    }
]
const Analytics = () => {
    Chart.register(LinearScale, CategoryScale, PointElement, LineElement, BarElement);
    const [selectCount, setSelectCount] = useState(false);
    const [selectNumber, setSelectNumber] = useState(5);
    const [pageNum, setPageNum] = useState(1);
    const [pageTotalNum, setPageTotalNum] = useState(5);
    const [itemsPerPage, setItemsPerPage] = useState(selectNumber);
    
    const startIndex= (pageNum-1) * itemsPerPage;
    const endIndex=startIndex + itemsPerPage;
    const displayedTicketsData=ticketsData.slice(startIndex,endIndex);
    const pageLastNum = Math.min(pageNum * itemsPerPage, pageTotalNum);
   const handlePreviousChange=()=>{
       if(pageNum >1 ){
        setPageNum(prev=> prev-1);
       }
   }
   const handleNextChange=()=>{
    if(pageNum< Math.ceil(pageTotalNum/itemsPerPage)){
        setPageNum(prev => prev+1)
    }
   }
    const data = {
        labels: ['11 Sept', '12 Sept', '13 Sept', '14 Sept', '15 Sept', '16 Sept', '17 Sept'],
        datasets: [
            {
                label: 'Ticket Status Over Time',
                data: [1.0, 0],
                fill: false,
                borderColor: 'red',
                tension: 0.4,
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                min: 0,
                max: 1,
                ticks: {
                    stepSize: 0.1,
                },
            },
            x: {

                border: {
                    color: 'pink',
                    width: 3,
                },
            },
        },
    };
    const barData = {
        labels: ['Opened', 'Pending', 'Solved', 'Solved by Operator', 'Solved by Bot', 'Expired', 'Missed Chats'],
        datasets: [
            {
                label: 'Ticket Status Count',
                data: [0, 0, 0, 0, 1, 0, 0],
                backgroundColor: 'orange',
                border: "none",
                borderWidth: 1,
            },
        ],
    };

    const barOptions = {
        scales: {
            y: {
                min: 0,
                max: 1,
                ticks: {
                    stepSize: 0.1,
                },

            },
            x: {

                grid: {
                    display: false,

                },
            }

        },
    };

  
    return (
        <div className='maincontent'>
            <div className='msgCont'>
                <div className='msgContL'>
                    <li className='solo'><a><svg width='20' height='20' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><g id="Inbox_Analytics" data-name="Inbox Analytics"><path d="M11.78,33.72H1v-20H11.78ZM3,31.72H9.78v-16H3Z" fill="#309e69"/><path d="M35,33.72H24.22V7.9H35Zm-8.78-2H33V9.9H26.22Z" fill="#309e69"/><path d="M23.39,33.72H12.61V2.28H23.39Zm-8.78-2h6.78V4.28H14.61Z" fill="#309e69"/></g></svg><span >Inbox Analytics</span></a></li>
                    <li ><a><svg width='23' height='23' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><g id="Whatsapp"><path d="M29.26,6.65a16,16,0,0,0-22.54,0A15.69,15.69,0,0,0,2,17.85H2A15.83,15.83,0,0,0,4,25.35L2.06,34l8.75-2A16,16,0,0,0,18,33.72h0a15.93,15.93,0,0,0,11.28-4.65,15.7,15.7,0,0,0,0-22.42ZM18,31.22h0a13.39,13.39,0,0,1-6.41-1.63l-.42-.22L5.34,30.69,6.61,25l-.25-.42a13.38,13.38,0,0,1-1.85-6.67,13.49,13.49,0,0,1,23-9.44,13.29,13.29,0,0,1,4,9.44A13.45,13.45,0,0,1,18,31.22Z" fill="#777"/><path d="M13.65,10.87H13a1.38,1.38,0,0,0-1,.45,4.12,4.12,0,0,0-1.28,3,7,7,0,0,0,1.5,3.77c.18.24,2.53,4,6.24,5.5,3.09,1.21,3.72,1,4.39.91a3.71,3.71,0,0,0,2.47-1.73,3.07,3.07,0,0,0,.21-1.73c-.09-.15-.33-.25-.7-.43s-2.16-1.08-2.49-1.2-.58-.18-.82.19-1,1.2-1.18,1.45-.43.27-.79.09a10.36,10.36,0,0,1-2.93-1.82,11.36,11.36,0,0,1-2.06-2.56c-.21-.37,0-.56.17-.75s.38-.38.56-.59a2.39,2.39,0,0,0,.36-.61.68.68,0,0,0,0-.64c-.09-.18-.79-2-1.12-2.71h0C14.2,10.9,13.91,10.88,13.65,10.87Z" fill="#777"/></g></svg><span >Click to whatsapp ads (CTWA)</span></a></li>

                </div>
                <div className='msgContR'>
                    <div className='analtyics-content'>
                        <div className="row analytics-heading-profile">
                            <div className="col-lg-6 col-md-6 col-sm-12 column">

                                <h2>Team Inbox Analytics</h2>
                                <span>Get an overview of all your important team, operator and ticket metrics here</span> </div>

                            <div className="col-lg-6 col-md-6 col-sm-12 column">
                                <div className="top-bar-analytics">
                                    preview with sample data
                                </div>
                            </div>
                        </div>
                        <div className="row analytics-subheading">
                            <div className="col-lg-6 col-md-6 col-sm-12 column">

                                <h2>Date range filter</h2>


                                <table className='custom-table'>

                                    <tr>
                                        <th>From</th>
                                        <th>To</th>
                                        <th>Period</th>
                                    </tr>

                                    <tbody>
                                        <tr>
                                            <td>
                                                <input type="date" className='custom-input' />
                                            </td>
                                            <td>
                                                <input type="date" className='custom-input' />
                                            </td>
                                            <td>
                                                <Form.Select aria-label="Default select example" className='custom-select'>
                                                    <option>Last 7 days</option>
                                                    <option value="1"></option>
                                                    <option value="2"></option>
                                                </Form.Select>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                            </div>
                        </div>
                        <div className="row analytics-subheading">


                            <h2>Overview</h2>
                            <div className="row">
                                <div className="col grid-item">
                                    <div className='metric-value'>0</div>
                                    <div>Open</div>
                                </div>
                                <div className="col grid-item">
                                    <div className='metric-value'>0</div>
                                    <div>Pending</div>
                                </div>
                                <div className="col grid-item">
                                    <div className='metric-value'>0</div>
                                    <div>Solved</div>
                                </div>
                                <div className="col grid-item">
                                    <div className='metric-value'>0</div>
                                    <div>Solved by Bot</div>
                                </div>
                                <div className="col grid-item">
                                    <div className='metric-value'>0</div>
                                    <div>Solved by operator</div>
                                </div>
                                <div className="col grid-item">
                                    <div className='metric-value'>1</div>
                                    <div>Expired</div>
                                </div>
                                <div className="col grid-item">
                                    <div className='metric-value'>0</div>
                                    <div>Missed chats</div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className='analytics-graph-content'>
                        <div className='analytics-leftgraph-content'>
                            <div className="row analytics-subheading">
                                <h2>Ticket status over time</h2>
                                <Line data={data} options={options} />
                                <div className="label-container" >
                                    {labelsInfo.map((label, index) => (
                                        <div key={index}>
                                            <span className='graph-label' style={{
                                                color: label.color,
                                                backgroundColor: label.fadedColor
                                            }} >{label.text}</span>

                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                        <div className='analytics-rightgraph-content'>
                            <div className="row analytics-subheading">
                                <h2>Total ticket count by status</h2>
                                <Bar data={barData} options={barOptions} />
                                <div className="label-container" >
                                    {labelsInfo.map((label, index) => (
                                        <div key={index}>
                                            <span className='graph-label' style={{
                                                color: label.color,
                                                backgroundColor: label.fadedColor
                                            }} >{label.text}</span>

                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='analytics-table-content'>
                        <div className="row analytics-subheading">
                            <h2>Operator performance</h2>
                        </div>
                        <div className='col-md-12'>
                        <div className='tableCont'>
                            <div className="table">
                                <table>
                                    <tr>
                                        <th>User</th>
                                        <th>Current open tickets</th>
                                        <th>current pending tickets</th>
                                        <th >Ticket assigned</th>
                                        <th>Ticket solved</th>
                                        <th >Ticket expired</th>
                                        <th>Missed chats</th>
                                        <th>Avg. First Response Time</th>
                                    </tr>
                                    <tbody>
                                        {
                                            displayedTicketsData.map((data, index) => (
                                                <tr key={index}>
                                                    <td><div style={{ color: 'black', fontWeight: 'bold' }}>{data.user} </div>
                                                        <div>{data.mail}</div>
                                                    </td>
                                                    <td>{data.currentopentickets}</td>
                                                    <td>{data.currentpendingtickets}</td>
                                                    <td>{data.ticketsassigned}</td>
                                                    <td>{data.ticketssolved}</td>
                                                    <td>{data.ticketsexpired}</td>
                                                    <td>{data.missedchat}</td>
                                                    <td>{data.firstresponse}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>

                                </table>
                            </div>
                            <div className="bodyFooter">
                                <div>
                                    <p className="bodyFooterRow">Rows per page:</p>
                                </div>
                                <div onClick={() => { setSelectCount(!selectCount) }}
                                    className="MuiInputBase-root MuiInputBase-colorPrimary MuiTablePagination-input css-rmmij8"
                                >
                                    <div
                                        tabIndex="0"
                                        role="combobox"
                                        aria-controls="menu-list"
                                        aria-expanded={selectCount}
                                        aria-haspopup="listbox"
                                        className="MuiSelect-select MuiTablePagination-select MuiSelect-standard MuiInputBase-input css-1cccqvr"
                                    >
                                        {selectNumber}
                                    </div>
                                    <input
                                        aria-hidden="true"
                                        tabIndex="-1"
                                        className="MuiSelect-nativeInput css-1k3x8v3"
                                        value={selectNumber}
                                    />
                                    <svg
                                        className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiSelect-icon MuiTablePagination-selectIcon MuiSelect-iconStandard css-1utq5rl"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path d="M7 10l5 5 5-5z" />
                                    </svg>

                                </div>
                                {
                                    selectCount && (
                                        <div className="MuiPaper-root MuiPaper-elevation8 MuiPopover-paper MuiMenu-paper MuiMenu-paper css-pwxzbm" tabindex="-1" style={{ opacity: '1', transform: 'none', minWidth: '48px', transition: 'opacity 262ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 174ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;', top: '156px', left: '982px', transformOrigin: '24px 87.7969px', display: selectCount ? "block" : "none" }}>
                                            <ul className="MuiList-root MuiList-padding MuiMenu-list css-r8u8y9" role="listbox" tabindex="-1" aria-labelledby="menu-label" id="menu-list">
                                           {
                                            [5,10,25,100].map((val)=>(
                                                <li key={val}
                                                className={`MuiButtonBase-root MuiMenuItem-root MuiMenuItem-gutters MuiTablePagination-menuItem css-1gs62wq ${selectNumber === val ? 'Mui-selected' : ''}`}
                                                tabIndex="0" 
                                                role="option" 
                                                onClick={()=>{
                                                    setSelectCount(false);
                                                    setSelectNumber(val);
                                                    setItemsPerPage(val);
                                                }}
                                                >
                                                 {val}
                                                 <span className="MuiTouchRipple-root css-w0pj6f"></span>
                                                </li>
                                            ))
                                           }
                                            </ul>
                                        </div>
                                    )
                                }
                                <div>
                                    <p className='footerCenter'>{pageNum}-{pageLastNum} of {pageTotalNum}</p>

                                </div>
                                <div className='previousNxtCont'>
                                    <p onClick={handlePreviousChange}><CgArrowLongLeft className='leftRightArrow' /> <span className="footerPrevious">Previous</span></p>
                                </div>
                                <div className='previousNxtCont'>
                                    <p className="footerCenter" onClick={handleNextChange}><span className="footerNext">Next</span> <CgArrowLongRight className='leftRightArrow' /></p>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Analytics;