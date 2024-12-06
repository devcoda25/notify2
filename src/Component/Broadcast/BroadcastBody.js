import React, { useState } from 'react'
import { MdKeyboardArrowDown } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { PiExport } from "react-icons/pi";
import { BiImport } from "react-icons/bi";
// import '../Style.css'
import DataJsonFile from '../Data.json';
import { IoMdArrowDropdown } from "react-icons/io";
import { CgArrowLongLeft } from "react-icons/cg";
import { CgArrowLongRight } from "react-icons/cg";
import Button from 'react-bootstrap/Button';
import NewPopup from '../newpopup';


const BroadcastBody = () => {

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectCount, setSelectCount] = useState(false);

  const [selectNumber, setSelectNumber] = useState(5);
  const [pageNum, setPageNum] = useState(1);
  const [pageLastNum, setPageLastNum] = useState(5);
  const [pageTotalNum, setPageTotalNum] = useState(127);

  const [copyIconHover, setCopyIconHover] = useState(null);
  const [deleteIconHover, setDeleteIconHover] = useState(null);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const [checkedValues, setCheckedValues] = useState([]);

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setCheckedValues([...checkedValues, value]);
    } else {
      setCheckedValues(checkedValues.filter(item => item !== value));
    }
  };
  const [activeTab, setActiveTab] = useState("templateLibrary"); // Default to Template Library

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  return (
    <div className='main-wrapper broadcast_wrapper'>
      <div className='msgCont'>
        <div className='msgContL'>
          <li className='solo'>
            <a onClick={() => handleTabClick("templateLibrary")}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 3.125C0 2.2962 0.32924 1.50134 0.915291 0.915291C1.50134 0.32924 2.2962 0 3.125 0H14.375C15.2038 0 15.9987 0.32924 16.5847 0.915291C17.1708 1.50134 17.5 2.2962 17.5 3.125V7.54375C17.293 7.51438 17.0841 7.49976 16.875 7.5H16.25V3.125C16.25 2.62772 16.0525 2.15081 15.7008 1.79917C15.3492 1.44754 14.8723 1.25 14.375 1.25H3.125C2.62772 1.25 2.15081 1.44754 1.79917 1.79917C1.44754 2.15081 1.25 2.62772 1.25 3.125V14.375C1.25 14.8723 1.44754 15.3492 1.79917 15.7008C2.15081 16.0525 2.62772 16.25 3.125 16.25H5V16.875C5 17.0875 5.015 17.2962 5.04375 17.5H3.125C2.2962 17.5 1.50134 17.1708 0.915291 16.5847C0.32924 15.9987 0 15.2038 0 14.375V3.125ZM13.75 6.875C13.75 7.04076 13.6842 7.19973 13.5669 7.31694C13.4497 7.43415 13.2908 7.5 13.125 7.5H6.875C6.70924 7.5 6.55027 7.43415 6.43306 7.31694C6.31585 7.19973 6.25 7.04076 6.25 6.875C6.25 6.70924 6.31585 6.55027 6.43306 6.43306C6.55027 6.31585 6.70924 6.25 6.875 6.25H13.125C13.2908 6.25 13.4497 6.31585 13.5669 6.43306C13.6842 6.55027 13.75 6.70924 13.75 6.875ZM3.75 4.375C3.75 4.20924 3.81585 4.05027 3.93306 3.93306C4.05027 3.81585 4.20924 3.75 4.375 3.75H13.125C13.2908 3.75 13.4497 3.81585 13.5669 3.93306C13.6842 4.05027 13.75 4.20924 13.75 4.375C13.75 4.54076 13.6842 4.69973 13.5669 4.81694C13.4497 4.93415 13.2908 5 13.125 5H4.375C4.20924 5 4.05027 4.93415 3.93306 4.81694C3.81585 4.69973 3.75 4.54076 3.75 4.375ZM6.25 11.875C6.25 11.0462 6.57924 10.2513 7.16529 9.66529C7.75134 9.07924 8.5462 8.75 9.375 8.75H16.875C17.7038 8.75 18.4987 9.07924 19.0847 9.66529C19.6708 10.2513 20 11.0462 20 11.875V16.875C20 17.7038 19.6708 18.4987 19.0847 19.0847C18.4987 19.6708 17.7038 20 16.875 20H9.375C8.5462 20 7.75134 19.6708 7.16529 19.0847C6.57924 18.4987 6.25 17.7038 6.25 16.875V11.875ZM9.375 10C8.93598 9.99991 8.51084 10.1539 8.17368 10.4351C7.83653 10.7163 7.60873 11.1068 7.53 11.5387L13.125 14.8962L18.72 11.5387C18.6413 11.1068 18.4135 10.7163 18.0763 10.4351C17.7392 10.1539 17.314 9.99991 16.875 10H9.375ZM7.5 16.875C7.5 17.3723 7.69754 17.8492 8.04917 18.2008C8.40081 18.5525 8.87772 18.75 9.375 18.75H16.875C17.3723 18.75 17.8492 18.5525 18.2008 18.2008C18.5525 17.8492 18.75 17.3723 18.75 16.875V12.9788L13.4462 16.1612C13.3492 16.2194 13.2382 16.2501 13.125 16.2501C13.0118 16.2501 12.9008 16.2194 12.8038 16.1612L7.5 12.9788V16.875Z" fill="#666"></path></svg>
              <span className="templateMessagesSvg">Template Messages</span>
            </a>
            <div className="templateContent">
              <a onClick={() => handleTabClick("templateLibrary")}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 3.125C0 2.2962 0.32924 1.50134 0.915291 0.915291C1.50134 0.32924 2.2962 0 3.125 0H14.375C15.2038 0 15.9987 0.32924 16.5847 0.915291C17.1708 1.50134 17.5 2.2962 17.5 3.125V7.54375C17.293 7.51438 17.0841 7.49976 16.875 7.5H16.25V3.125C16.25 2.62772 16.0525 2.15081 15.7008 1.79917C15.3492 1.44754 14.8723 1.25 14.375 1.25H3.125C2.62772 1.25 2.15081 1.44754 1.79917 1.79917C1.44754 2.15081 1.25 2.62772 1.25 3.125V14.375C1.25 14.8723 1.44754 15.3492 1.79917 15.7008C2.15081 16.0525 2.62772 16.25 3.125 16.25H5V16.875C5 17.0875 5.015 17.2962 5.04375 17.5H3.125C2.2962 17.5 1.50134 17.1708 0.915291 16.5847C0.32924 15.9987 0 15.2038 0 14.375V3.125ZM13.75 6.875C13.75 7.04076 13.6842 7.19973 13.5669 7.31694C13.4497 7.43415 13.2908 7.5 13.125 7.5H6.875C6.70924 7.5 6.55027 7.43415 6.43306 7.31694C6.31585 7.19973 6.25 7.04076 6.25 6.875C6.25 6.70924 6.31585 6.55027 6.43306 6.43306C6.55027 6.31585 6.70924 6.25 6.875 6.25H13.125C13.2908 6.25 13.4497 6.31585 13.5669 6.43306C13.6842 6.55027 13.75 6.70924 13.75 6.875ZM3.75 4.375C3.75 4.20924 3.81585 4.05027 3.93306 3.93306C4.05027 3.81585 4.20924 3.75 4.375 3.75H13.125C13.2908 3.75 13.4497 3.81585 13.5669 3.93306C13.6842 4.05027 13.75 4.20924 13.75 4.375C13.75 4.54076 13.6842 4.69973 13.5669 4.81694C13.4497 4.93415 13.2908 5 13.125 5H4.375C4.20924 5 4.05027 4.93415 3.93306 4.81694C3.81585 4.69973 3.75 4.54076 3.75 4.375ZM6.25 11.875C6.25 11.0462 6.57924 10.2513 7.16529 9.66529C7.75134 9.07924 8.5462 8.75 9.375 8.75H16.875C17.7038 8.75 18.4987 9.07924 19.0847 9.66529C19.6708 10.2513 20 11.0462 20 11.875V16.875C20 17.7038 19.6708 18.4987 19.0847 19.0847C18.4987 19.6708 17.7038 20 16.875 20H9.375C8.5462 20 7.75134 19.6708 7.16529 19.0847C6.57924 18.4987 6.25 17.7038 6.25 16.875V11.875ZM9.375 10C8.93598 9.99991 8.51084 10.1539 8.17368 10.4351C7.83653 10.7163 7.60873 11.1068 7.53 11.5387L13.125 14.8962L18.72 11.5387C18.6413 11.1068 18.4135 10.7163 18.0763 10.4351C17.7392 10.1539 17.314 9.99991 16.875 10H9.375ZM7.5 16.875C7.5 17.3723 7.69754 17.8492 8.04917 18.2008C8.40081 18.5525 8.87772 18.75 9.375 18.75H16.875C17.3723 18.75 17.8492 18.5525 18.2008 18.2008C18.5525 17.8492 18.75 17.3723 18.75 16.875V12.9788L13.4462 16.1612C13.3492 16.2194 13.2382 16.2501 13.125 16.2501C13.0118 16.2501 12.9008 16.2194 12.8038 16.1612L7.5 12.9788V16.875Z" fill="#666"></path></svg>
                <span className="templateMessagesSvg">Template Library</span>
              </a>
              <a  onClick={() => handleTabClick("yourTemplate")}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 3.125C0 2.2962 0.32924 1.50134 0.915291 0.915291C1.50134 0.32924 2.2962 0 3.125 0H14.375C15.2038 0 15.9987 0.32924 16.5847 0.915291C17.1708 1.50134 17.5 2.2962 17.5 3.125V7.54375C17.293 7.51438 17.0841 7.49976 16.875 7.5H16.25V3.125C16.25 2.62772 16.0525 2.15081 15.7008 1.79917C15.3492 1.44754 14.8723 1.25 14.375 1.25H3.125C2.62772 1.25 2.15081 1.44754 1.79917 1.79917C1.44754 2.15081 1.25 2.62772 1.25 3.125V14.375C1.25 14.8723 1.44754 15.3492 1.79917 15.7008C2.15081 16.0525 2.62772 16.25 3.125 16.25H5V16.875C5 17.0875 5.015 17.2962 5.04375 17.5H3.125C2.2962 17.5 1.50134 17.1708 0.915291 16.5847C0.32924 15.9987 0 15.2038 0 14.375V3.125ZM13.75 6.875C13.75 7.04076 13.6842 7.19973 13.5669 7.31694C13.4497 7.43415 13.2908 7.5 13.125 7.5H6.875C6.70924 7.5 6.55027 7.43415 6.43306 7.31694C6.31585 7.19973 6.25 7.04076 6.25 6.875C6.25 6.70924 6.31585 6.55027 6.43306 6.43306C6.55027 6.31585 6.70924 6.25 6.875 6.25H13.125C13.2908 6.25 13.4497 6.31585 13.5669 6.43306C13.6842 6.55027 13.75 6.70924 13.75 6.875ZM3.75 4.375C3.75 4.20924 3.81585 4.05027 3.93306 3.93306C4.05027 3.81585 4.20924 3.75 4.375 3.75H13.125C13.2908 3.75 13.4497 3.81585 13.5669 3.93306C13.6842 4.05027 13.75 4.20924 13.75 4.375C13.75 4.54076 13.6842 4.69973 13.5669 4.81694C13.4497 4.93415 13.2908 5 13.125 5H4.375C4.20924 5 4.05027 4.93415 3.93306 4.81694C3.81585 4.69973 3.75 4.54076 3.75 4.375ZM6.25 11.875C6.25 11.0462 6.57924 10.2513 7.16529 9.66529C7.75134 9.07924 8.5462 8.75 9.375 8.75H16.875C17.7038 8.75 18.4987 9.07924 19.0847 9.66529C19.6708 10.2513 20 11.0462 20 11.875V16.875C20 17.7038 19.6708 18.4987 19.0847 19.0847C18.4987 19.6708 17.7038 20 16.875 20H9.375C8.5462 20 7.75134 19.6708 7.16529 19.0847C6.57924 18.4987 6.25 17.7038 6.25 16.875V11.875ZM9.375 10C8.93598 9.99991 8.51084 10.1539 8.17368 10.4351C7.83653 10.7163 7.60873 11.1068 7.53 11.5387L13.125 14.8962L18.72 11.5387C18.6413 11.1068 18.4135 10.7163 18.0763 10.4351C17.7392 10.1539 17.314 9.99991 16.875 10H9.375ZM7.5 16.875C7.5 17.3723 7.69754 17.8492 8.04917 18.2008C8.40081 18.5525 8.87772 18.75 9.375 18.75H16.875C17.3723 18.75 17.8492 18.5525 18.2008 18.2008C18.5525 17.8492 18.75 17.3723 18.75 16.875V12.9788L13.4462 16.1612C13.3492 16.2194 13.2382 16.2501 13.125 16.2501C13.0118 16.2501 12.9008 16.2194 12.8038 16.1612L7.5 12.9788V16.875Z" fill="#666"></path></svg>
                <span className="templateMessagesSvg">Your Template</span>
              </a>
            </div>
          </li>
          <li><a><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.0312 9.67641V9.98707L10.2509 10.2067L13.095 13.0508C13.1073 13.0631 13.1072 13.0828 13.0951 13.095L13.095 13.095C13.0828 13.1072 13.063 13.1072 13.0508 13.095L9.97791 10.0221L9.97784 10.022C9.97207 10.0163 9.96875 10.0083 9.96875 10V5.39062C9.96875 5.37335 9.98273 5.35938 10 5.35938C10.0173 5.35938 10.0312 5.37335 10.0312 5.39062V9.67641ZM1.63473 1.69836V3.34451L2.87688 2.2643C4.02874 1.26261 5.46716 0.75 6.92707 0.75H13.0729C16.4783 0.75 19.25 3.52167 19.25 6.92707V13.0729C19.25 16.4783 16.4783 19.25 13.0729 19.25H6.92707C3.52167 19.25 0.75 16.4783 0.75 13.0729V10C0.75 9.98273 0.763979 9.96875 0.78125 9.96875C0.798521 9.96875 0.8125 9.98273 0.8125 10V13.0729C0.8125 16.4452 3.55481 19.1875 6.92707 19.1875H13.0729C16.4452 19.1875 19.1875 16.4452 19.1875 13.0729V6.92707C19.1875 3.55481 16.4452 0.8125 13.0729 0.8125H6.92707C5.32361 0.8125 3.80341 1.448 2.67801 2.53299L1.57223 3.59907V0.78125C1.57223 0.763979 1.58621 0.75 1.60348 0.75C1.62075 0.75 1.63473 0.763979 1.63473 0.78125V1.69836ZM1.57223 3.85418V3.82293H3.19855H4.67641C4.69368 3.82293 4.70766 3.83691 4.70766 3.85418C4.70766 3.87145 4.69368 3.88543 4.67641 3.88543H1.60348C1.59706 3.88543 1.58965 3.8834 1.5818 3.87558C1.57797 3.87175 1.57553 3.86783 1.57417 3.86465C1.57305 3.86202 1.57223 3.85897 1.57223 3.85418Z" stroke="#666" stroke-width="1.5"></path></svg><span className="svgSpan">Broadcast Analytics</span></a></li>
          <li><a><svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.3035 20.125H4.79167C4.28333 20.125 3.79582 19.923 3.43638 19.5636C3.07693 19.2041 2.875 18.7166 2.875 18.2083V6.70829C2.875 6.19996 3.07693 5.71245 3.43638 5.353C3.79582 4.99356 4.28333 4.79163 4.79167 4.79163H16.2917C16.8 4.79163 17.2875 4.99356 17.647 5.353C18.0064 5.71245 18.2083 6.19996 18.2083 6.70829V10.5416" stroke="#666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M17.2474 21.0833C19.3645 21.0833 21.0807 19.3671 21.0807 17.25C21.0807 15.1329 19.3645 13.4166 17.2474 13.4166C15.1303 13.4166 13.4141 15.1329 13.4141 17.25C13.4141 19.3671 15.1303 21.0833 17.2474 21.0833Z" stroke="#666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M14.375 2.875V6.70833" stroke="#666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6.71094 2.875V6.70833" stroke="#666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M2.875 10.5416H18.2083" stroke="#666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M17.25 15.8087V17.25L18.2083 18.2083" stroke="#666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg><span className="templateMessagesSvg">Scheduled Broadcasts</span></a></li>
        </div>
       
        {activeTab === "yourTemplate" && (
          <> 
           <div className='msgContR'> 
              <div className='wholemsgContR'>
                <div className='broadcastBodyCont'>
                  <div className='msgContRLeft'>
                    <div className='sortCont'>
                      <p>Sorted by:</p>
                    </div>
                    <div className="input-icon-wrapper1">
                      <input type="text" placeholder="Latest" className="input-field1" />
                      <MdKeyboardArrowDown className="icon1" />
                    </div>
                    <div className="input-icon-wrapper2">
                      <input type="text" placeholder="Search..." className="input-field2" />
                      <CiSearch className="icon2" />
                    </div>
                    <div className="sortIcon">
                      <svg onClick={togglePopup} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.1169 17.9867H2.88281" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M21.1174 17.9864C21.1174 19.577 19.828 20.8664 18.2374 20.8664C16.6468 20.8664 15.3574 19.577 15.3574 17.9864C15.3574 16.3947 16.6468 15.1064 18.2374 15.1064C19.828 15.1064 21.1174 16.3947 21.1174 17.9864Z" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M13.8828 6.26206H21.1181" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M2.88281 6.26208C2.88281 7.85384 4.17222 9.14208 5.76281 9.14208C7.3534 9.14208 8.64281 7.85384 8.64281 6.26208C8.64281 4.67149 7.3534 3.38208 5.76281 3.38208C4.17222 3.38208 2.88281 4.67149 2.88281 6.26208Z" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                      {isPopupOpen && (
                        <div className="popup-overlay">
                          <div className="popupExtra">
                            <div className="">
                              <div className="filterPoppup">
                                <div>
                                  <p className="filterCont">Attributes</p>
                                </div>
                                <div>
                                  <button className="close-btn" onClick={togglePopup}>×</button>
                                </div>
                              </div>
                              <div className="popup-content">
                                <div className="popup-box">
                                  <form action="/action_page.php" className="attributesForm">
                                    <p className="popupInputHead">Choose attributes to filter</p>
                                    <div className="popupFilterInput">
                                      <input className="popupInputFilter" type="checkbox" id="DRAFT" name="DRAFT" value="DRAFT" checked={checkedValues.includes("DRAFT")} onChange={handleCheckboxChange} />
                                      <label for="DRAFT"> DRAFT </label>
                                    </div>
                                    <div className="popupFilterInput">
                                      <input className="popupInputFilter" type="checkbox" id="PENDING" name="PENDING" value="PENDING" checked={checkedValues.includes("PENDING")} onChange={handleCheckboxChange} />
                                      <label for="PENDING"> PENDING </label>
                                    </div>
                                    <div className="popupFilterInput">
                                      <input className="popupInputFilter" type="checkbox" id="APPROVED" name="APPROVED" value="APPROVED" checked={checkedValues.includes("APPROVED")} onChange={handleCheckboxChange} />
                                      <label for="APPROVED"> APPROVED</label>
                                    </div>
                                    <div className="popupFilterInput">
                                      <input className="popupInputFilter" type="checkbox" id="REJECTED" name="REJECTED" value="REJECTED" checked={checkedValues.includes("REJECTED")} onChange={handleCheckboxChange} />
                                      <label for="REJECTED"> REJECTED </label>
                                    </div>
                                    <div className="popupFilterInput">
                                      <input className="popupInputFilter" type="checkbox" id="DELETED" name="DELETED" value="DELETED" checked={checkedValues.includes("DELETED")} onChange={handleCheckboxChange} />
                                      <label for="DELETED"> DELETED </label>
                                    </div>
                                    <div className="popupFilterInput">
                                      <input className="popupInputFilter" type="checkbox" id="PAUSED" name="PAUSED" value="PAUSED" checked={checkedValues.includes("PAUSED")} onChange={handleCheckboxChange} />
                                      <label for="vehicle2"> PAUSED </label>
                                    </div>
                                    <div className="popupFilterInput">
                                      <input className="popupInputFilter" type="checkbox" id="DIASBLED" name="DIASBLED" value="DIASBLED" checked={checkedValues.includes("DIASBLED")} onChange={handleCheckboxChange} />
                                      <label for="DIASBLED"> DIASBLED</label>
                                    </div>
                                  </form>
                                </div>
                                <input className="poppupSubmit" type="submit" value="save" onClick={togglePopup} />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {checkedValues.length > 0 && (
                        <div className='selectCount'>
                          {checkedValues.length}
                        </div>
                      )}
                    </div>
                    <div className='portCont'>
                      <div className='exportWholeCont'>
                        <a className='ImportExport'><svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.10189 0.825209L9.10189 10.8594" stroke="#666666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.5322 3.27344L9.10223 0.833437L6.67223 3.27344" stroke="#666666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12.963 5.78125H13.7405C15.4364 5.78125 16.8105 7.15542 16.8105 8.85208V12.9221C16.8105 14.6137 15.4397 15.9846 13.748 15.9846L4.46471 15.9846C2.76888 15.9846 1.39388 14.6096 1.39388 12.9137L1.39388 8.84292C1.39388 7.15208 2.76555 5.78125 4.45638 5.78125L5.24138 5.78125" stroke="#666666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg> Export</a>
                      </div>
                      {/* <span className="exportImportHr"></span> */}
                      <div className='importWholeCont'>
                        <a className='ImportExport'><svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.10189 10.8623L9.10189 0.828125" stroke="#666666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.5322 8.42188L9.10223 10.8619L6.67223 8.42187" stroke="#666666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12.963 5.77344H13.7405C15.4364 5.77344 16.8105 7.1476 16.8105 8.84427V12.9143C16.8105 14.6059 15.4397 15.9768 13.748 15.9768L4.46471 15.9768C2.76888 15.9768 1.39388 14.6018 1.39388 12.9059L1.39388 8.8351C1.39388 7.14427 2.76555 5.77344 4.45638 5.77344L5.24138 5.77344" stroke="#666666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg> Import</a>
                      </div>
                    </div>
                  </div>
                  <div className='wholemsgContRRight'>
                    <div className='msgContRRight'>
                      {/* <div>
                        <h4 className='vdoCont'><img src={vdo}/> <a href="https://www.youtube.com/watch?v=Zyk7bby9URE" target="_blank">Watch Tutorial</a></h4>
                        </div> */}
                      <button className='btn' onClick={handleShow}>New Template Message</button>
                      {/* {isModalOpen && <NewTemplatePopup onClose={handleCloseModal} />} */}
                      <NewPopup show={show} setShow={setShow} />
                    </div>
                  </div>
                </div>
              </div>
              <div className='tableCont'>
                <div className="table">
                  <table>
                    <tr>
                      <th className="tableTemplateName">Template Name</th>
                      <th className='tableCategory'>Category</th>
                      <th>Status</th>
                      <th className='tableLang'>Language</th>
                      <th className='tableUpdate'>Last Updated</th>
                      <th className='tableAction'>Actions</th>
                    </tr>
                    {/* <hr className="tableTemplateNameBorderBottom"/> */}
                    {DataJsonFile.data.slice((pageNum - 1) * selectNumber, selectNumber * pageNum).map((val, key) => (
                      <tr className="tableTemplateNameTr" key={key}>
                        <td className="tableTemplateTd"><span>{val.templateName}</span></td>
                        <td>{val.Category}</td>
                        <td><button className="statusBtn">{val.Status}</button></td>
                        <td>{val.Language}</td>
                        <td>{val.lastUpdated}</td>
                        <td className="action">
                          <button className="actionBtn">{val.Actions}</button>
                          <hr className="tableTemplateNameHr" />
                          <span className="actionSpanCopy" onMouseEnter={() => setCopyIconHover(key)}
                            onMouseLeave={() => setCopyIconHover(null)}>
                            <div>
                              <svg className="copy-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.66406 3.33341V13.3334C6.66406 13.7754 6.83966 14.1994 7.15222 14.5119C7.46478 14.8245 7.8887 15.0001 8.33073 15.0001H14.9974C15.4394 15.0001 15.8633 14.8245 16.1759 14.5119C16.4885 14.1994 16.6641 13.7754 16.6641 13.3334V6.03508C16.664 5.81305 16.6196 5.59326 16.5335 5.38862C16.4473 5.18398 16.3212 4.99862 16.1624 4.84341L13.3999 2.14175C13.0885 1.8373 12.6704 1.6668 12.2349 1.66675H8.33073C7.8887 1.66675 7.46478 1.84234 7.15222 2.1549C6.83966 2.46746 6.66406 2.89139 6.66406 3.33341V3.33341Z" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className='copyIconHover'></path>
                                <path d="M13.332 15.0002V16.6668C13.332 17.1089 13.1564 17.5328 12.8439 17.8453C12.5313 18.1579 12.1074 18.3335 11.6654 18.3335H4.9987C4.55667 18.3335 4.13275 18.1579 3.82019 17.8453C3.50763 17.5328 3.33203 17.1089 3.33203 16.6668V7.50016C3.33203 7.05814 3.50763 6.63421 3.82019 6.32165C4.13275 6.00909 4.55667 5.8335 4.9987 5.8335H6.66536" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className='copyIconHover'></path>
                              </svg>
                              {copyIconHover === key && (
                                <div className="icon-popup">
                                  Copy template
                                </div>
                              )}
                            </div>
                          </span>
                          <span className="actionSpanDelete" onMouseEnter={() => setDeleteIconHover(key)}
                            onMouseLeave={() => setDeleteIconHover(null)}>
                            <div>
                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333" className='deleteIconHover'></path>
                                <path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" strokeWidth="1.25" strokeLinecap="round" className='deleteIconHover'></path>
                              </svg>
                              {deleteIconHover === key && (
                                <div className="icon-popup">
                                  Delete template
                                </div>
                              )}
                            </div>
                          </span>
                        </td>
                      </tr>
                    ))}

                  </table>
                </div>
                <div className="bodyFooter">
                  <div>
                    <p className="bodyFooterRow">Rows per page:</p>
                  </div>
                  {/* <div>
                    <p className="footerCenter">5 <IoMdArrowDropdown /></p>
                  </div> */}
                  {!selectCount ? <div onClick={() => { setSelectCount(!selectCount) }} className="MuiInputBase-root MuiInputBase-colorPrimary MuiTablePagination-input css-rmmij8"><div tabindex="0" role="combobox" aria-controls=":r5:" aria-expanded="false" aria-haspopup="listbox" aria-labelledby=":r4: :r3:" id=":r3:" className="MuiSelect-select MuiTablePagination-select MuiSelect-standard MuiInputBase-input css-1cccqvr" >{selectNumber}</div><input aria-invalid="false" aria-hidden="true" tabindex="-1" className="MuiSelect-nativeInput css-1k3x8v3" value={selectNumber} /><svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiSelect-icon MuiTablePagination-selectIcon MuiSelect-iconStandard css-1utq5rl" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ArrowDropDownIcon"><path d="M7 10l5 5 5-5z"></path></svg></div> : null}


                  <div className="MuiPaper-root MuiPaper-elevation8 MuiPopover-paper MuiMenu-paper MuiMenu-paper css-pwxzbm" tabindex="-1" style={{ opacity: '1', transform: 'none', minWidth: '48px', transition: 'opacity 262ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 174ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;', top: '156px', left: '982px', transformOrigin: '24px 87.7969px', display: selectCount ? "block" : "none" }}>
                    <ul className="MuiList-root MuiList-padding MuiMenu-list css-r8u8y9" role="listbox" tabindex="-1" aria-labelledby="menu-label" id="menu-list">
                      <li onClick={() => {
                        setSelectCount(!selectCount)
                        setSelectNumber(5)
                      }} className="MuiButtonBase-root MuiMenuItem-root MuiMenuItem-gutters Mui-selected MuiTablePagination-menuItem css-1gs62wq" tabindex="0" role="option" aria-selected="true" data-value="5">5
                        <span className="MuiTouchRipple-root css-w0pj6f"></span>
                      </li>
                      <li className="MuiButtonBase-root MuiMenuItem-root MuiMenuItem-gutters MuiTablePagination-menuItem css-1gs62wq" tabindex="-1" role="option" aria-selected="false" data-value="10" onClick={() => {
                        setSelectCount(!selectCount)
                        setSelectNumber(10)
                      }}>10
                        <span className="MuiTouchRipple-root css-w0pj6f"></span>
                      </li>
                      <li className="MuiButtonBase-root MuiMenuItem-root MuiMenuItem-gutters MuiTablePagination-menuItem css-1gs62wq" tabindex="-1" role="option" aria-selected="false" data-value="25" onClick={() => {
                        setSelectCount(!selectCount)
                        setSelectNumber(25)
                      }}>25
                        <span className="MuiTouchRipple-root css-w0pj6f"></span>
                      </li>
                      <li className="MuiButtonBase-root MuiMenuItem-root MuiMenuItem-gutters MuiTablePagination-menuItem css-1gs62wq" tabindex="-1" role="option" aria-selected="false" data-value="100" onClick={() => {
                        setSelectCount(!selectCount)
                        setSelectNumber(100)
                      }}>100
                        <span className="MuiTouchRipple-root css-w0pj6f"></span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="footerCenter">{pageNum}–{pageLastNum} of {pageTotalNum}</p>
                  </div>
                  <div className='previousNxtCont'>
                    <p><CgArrowLongLeft className='leftRightArrow' /> <span className="footerPrevious">Previous</span></p>
                  </div>
                  <div className='previousNxtCont'>
                    <p className="footerCenter"><span className="footerNext">Next</span> <CgArrowLongRight className='leftRightArrow' /></p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {activeTab === "templateLibrary" && (
          <> 
          <div className='msgContR  Template_librabry-Container'>
            <div className="template-library-wrapper">
              <div className="template-library-intro">
                <div className="template-library-header">
                  <h2 className="template-library-title">Template Library</h2>
                  <p className="template-library-guideline">
                    Select or create your template and submit it for WhatsApp approval.
                    All templates must adhere to{" "}
                    <a
                      href="https://support.wati.io/l/en/article/d0ewqzh7gv-how-to-avoid-template-message-rejection"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="template-library-link"
                    >
                      WhatsApp's guidelines
                    </a>
                    .
                  </p>
                </div>
                <div className="template-library-actions">
                  <a
                    href="https://www.youtube.com/watch?v=Zyk7bby9URE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="template-library-tutorial"
                  >
                    <div className="tutorial-content">
                      <svg
                        width="27"
                        height="27"
                        viewBox="0 0 27 27"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="13.5" cy="13.5" r="13.5" fill="#269CFE"></circle>
                        <path
                          d="M17.8691 12.6344C18.5358 13.0193 18.5358 13.9815 17.8691 14.3664L12.0648 17.7176C11.3981 18.1025 10.5648 17.6214 10.5648 16.8516L10.5648 10.1493C10.5648 9.37948 11.3981 8.89836 12.0648 9.28326L17.8691 12.6344Z"
                          fill="white"
                        ></path>
                      </svg>
                      <span className="tutorial-text">Watch Tutorial</span>
                    </div>
                  </a>
                  <button className="btn btn-success template-library-new-button">New Template Message</button>
                </div>
              </div>
            </div>
            <div className="template-navigation-wrapper">
              <div className="template-navigation">
                <nav
                  role="navigation"
                  aria-label="Template Filter"
                  className="template-nav"
                >
                  <ul className="template-nav-list">
                    <li className="template-nav-item active">
                      <div className="template-tab">
                        All<span className="template-count selected">12</span>
                      </div>
                    </li>
                    <li className="template-nav-item">
                      <div className="template-tab">
                        Festival<span className="template-count">3</span>
                      </div>
                    </li>
                    <li className="template-nav-item">
                      <div className="template-tab">
                        Education<span className="template-count">4</span>
                      </div>
                    </li>
                    <li className="template-nav-item">
                      <div className="template-tab">
                        E-Commerce<span className="template-count">1</span>
                      </div>
                    </li>
                    <li className="template-nav-item">
                      <div className="template-tab">
                        Others<span className="template-count">5</span>
                      </div>
                    </li>
                  </ul>
                </nav>
              </div>
              <div className="template-search">
                <div className="search-input-wrap">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="search-input"
                    aria-label="Search Templates"
                  />
                  <button className="search-icon">
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
                  </button>
                </div>
              </div>
            </div>
          </div>
          </>
        )}
        </div>
      </div>

  )
}

export default BroadcastBody


