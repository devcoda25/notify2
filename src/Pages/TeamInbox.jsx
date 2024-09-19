import React, { useEffect, useState } from 'react'
import BurgerSidebar from '../Component/humburgerdiv';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import TeamBurgerLeftNav from '../Component/teamburgerMenu';
import PriorityDropDown from '../Component/assigneddrop';
import AssigneeDropDown from '../Component/AssigneeDrop';
import TicketType from '../Component/TicketType';
import ReporterType from '../Component/Reporter';
import TeaamInboxAccordion from '../Component/TeamInboxAccordin';
import Accordion from 'react-bootstrap/Accordion';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

// import { Navbar } from 'react-bootstrap';
// import { Link } from 'react-router-dom';

const TeamInbox = () => {
    const [isFullWidth, setIsFullWidth] = useState(true);

    useEffect(() => {
        const outerContainer = document.getElementById('outer-container');

        const checkStyle = () => {
            if (outerContainer.style.width === '100%' && outerContainer.style.overflow === 'hidden') {
                setIsFullWidth(false);
            } else {
                setIsFullWidth(true);
            }
        };

        checkStyle();

        // Observe changes to the outerContainer style
        const observer = new MutationObserver(checkStyle);
        observer.observe(outerContainer, { attributes: true, attributeFilter: ['style'] });

        return () => observer.disconnect();
    }, []);
    const [ticketView, setTicketView] = useState(true)
    const [isClose, setIsClose] = useState(false)
    function ticketOpen() {
        setTicketView(false);
        setIsClose((prev) => !prev)
        let bm_menu_wrap = document.querySelector(".bm-menu-wrap")
        bm_menu_wrap.style.left = 0
        document.querySelector('#react-burger-cross-btn').click()
    }
    return (
        <>
            <div id="outer-container" className='main-wrapper'>
                {ticketView &&
                    <div className='ticket-view-accordin'>
                        <Accordion defaultActiveKey="0" >
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Ticket Views</Accordion.Header>
                                <Accordion.Body>
                                    <ul className='ticket-view-dropdown'>
                                        <li>My Tickets <span>9</span></li>
                                        <li>Past Due <span>4</span></li>
                                        <li>High Priority<span>90</span></li>
                                        <li>Unassigned<span>512</span></li>
                                        <li>All Tickets<span>2,451</span></li>
                                    </ul>
                                </Accordion.Body>
                                <ul>
                                    <li><span className='acc-icon-text'><i className="fa fa-headphones" aria-hidden="true"></i> Live Chat</span></li>
                                    <li><span className='acc-icon-text'><i className="fa fa-th-large" aria-hidden="true"></i> Boards</span></li>
                                </ul>
                            </Accordion.Item>

                        </Accordion>
                    </div>}
                <BurgerSidebar setTicketView={setTicketView} setIsClose={setIsClose} isClose={isClose} />
                <main id="page-wrap" className={`${isClose ? "allleftnavclose" : ""} main-content ${ticketView ? "ticketview" : ""}`}>
                    <div>
                        <div className="panel-content">
                            {isClose &&
                                <div className='all-close-arrow-btn' onClick={ticketOpen}><i className="fa fa-angle-double-right" aria-hidden="true"></i>
                                </div>}
                            <div className="row m-0">
                                <div className="col-lg-9 col-md-9 col=sm-12 p-0">
                                    <div className="widget mt-0">
                                        <div className="widget-title white-bg float-none">
                                            <h3 className='w-100'>Tickets Title</h3>
                                            <div className='mail-create-date'><span><i className="fa fa-bug" aria-hidden="true"></i></span><span>TKT-02 NOFg000000000</span><span className='mail-time'>Created 31/08/24 10:57 PST</span></div>
                                            <div className="widget-controls inbox-control"> <span className="close-content mr-3"><i className="fa fa-envelope-o"></i></span> <span className="expand-content mr-3"><i className="fa fa-eye"></i> 5</span> <span className="refresh-content mr-3"><i className="fa fa-ellipsis-h"></i></span><span className='team-hum-avator'><img src="assets/teaminbox/images/resource/friend-avatar.jpg" alt="" /></span><span className='team-hum-avator'><img src="assets/teaminbox/images/resource/friend-avatar2.jpg" alt="" /></span><span className='team-hum-avator'><img src="assets/teaminbox/images/resource/ok.jpg" alt="" /></span></div>
                                        </div>
                                        {/* Widget title end */}

                                        <div className="support-ticket-sec">
                                            <Tabs
                                                defaultActiveKey="puplic"
                                                transition={false}
                                                id="tab-example"
                                                className="custom-nav-tab mb-0 pl-2 pb-0"
                                            >
                                                <Tab eventKey="puplic" title="Puplic Reply">
                                                    <div className="status-upload">
                                                        <form>
                                                            <div className="inline-form">
                                                                <label className="c-label">CC</label>
                                                                <input className="input-style" type="text" placeholder="To" />
                                                            </div>
                                                            <textarea placeholder="What are you doing right now?"></textarea>
                                                            <ul>
                                                                <li><a title="Audio" data-toggle="tooltip" data-placement="bottom"><i className="fa fa-bold"></i></a></li>
                                                                <li><a title="Video" data-toggle="tooltip" data-placement="bottom"><i className="fa fa-italic"></i></a></li>
                                                                <li><a title="Sound Record" data-toggle="tooltip" data-placement="bottom"><i className="fa fa-underline"></i></a></li>
                                                                <li><a className='tooltip-attach' title="Picture" data-toggle="tooltip" data-placement="bottom"><img src="assets/teaminbox/images/resource/img-attach.png" alt="" /></a></li>
                                                                <li><a className='tooltip-attach' title="Picture" data-toggle="tooltip" data-placement="bottom"><img src="assets/teaminbox/images/resource/img-attach01.png" alt="" /></a></li>
                                                                <li><a className='tooltip-attach' title="Picture" data-toggle="tooltip" data-placement="bottom"><img src="assets/teaminbox/images/resource/img-file-attach.png" alt="" /></a></li>
                                                                <li><a className='tooltip-attach' title="Picture" data-toggle="tooltip" data-placement="bottom"><img src="assets/teaminbox/images/resource/img-add-comment.png" alt="" /></a></li>
                                                                <li><a className='tooltip-attach' title="Picture" data-toggle="tooltip" data-placement="bottom"><img src="assets/teaminbox/images/resource/img-exit-folder.png" alt="" /></a></li>
                                                            </ul>
                                                            <div className='mail-send-btn'><span><label>Ask to KB <input className='ask-kb' type='checkbox' /></label></span>
                                                                <button type="submit" className="light-grey-bg"><i className="fa fa-paper-plane-o" aria-hidden="true"></i></button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </Tab>
                                                <Tab eventKey="private" title="Private Comment">
                                                    Tab content for Private Comments
                                                </Tab>
                                            </Tabs>


                                        </div>
                                        {/* Widget end */}
                                    </div>
                                    <div className="widget no-padding blank">
                                        <div className="timeline-sec">
                                            <ul>
                                                <li>
                                                    <div className="timeline">
                                                        <div className="user-timeline"> <span><img src="assets/teaminbox/images/resource/user1.jpg" alt="" /></span> </div>
                                                        <div className="timeline-detail">
                                                            <div className="timeline-head white-bg">
                                                                <h3 className='color-222 feed-tittle'><span>Jonathan Gardel<br /> <i className='small-txt'>To Name Name@gmail.com</i></span> <span className='txt-11'>Aug/31/24 14:30 PM</span></h3>
                                                                <div className="social-share p-0"> <a className='cmd-down-arrow' title=""><i className="fa fa-chevron-down" aria-hidden="true"></i>                                                                </a></div>
                                                            </div>
                                                            <div className="timeline-content pt-0">
                                                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, </p>
                                                            </div>
                                                            <div className='attach-img-btn'><button className='mr-2'>Snap-short.png<br /><span className='small-txt'>01 Sep 2024 4:30 PM</span></button><button>Snap-short.png<br /><span className='small-txt'>01 Sep 2024 4:30 PM</span></button></div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="timeline">
                                                        <div className="user-timeline"> <span><img src="assets/teaminbox/images/resource/user1.jpg" alt="" /></span> </div>
                                                        <div className="timeline-detail">
                                                            <div className="timeline-head white-bg">
                                                                <h3 className='color-222 feed-tittle'><span>Jonathan Gardel<br /> <i className='small-txt'>To Name Name@gmail.com</i></span> <span className='txt-11'>Aug/31/24 14:30 PM</span></h3>
                                                                <div className="social-share p-0"> <a className='cmd-down-arrow' title=""><i className="fa fa-chevron-down" aria-hidden="true"></i>                                                                </a></div>
                                                            </div>
                                                            <div className="timeline-content pt-0">
                                                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, </p>
                                                            </div>
                                                           
                                                        </div>
                                                    </div>
                                                </li>

                                            </ul>
                                        </div>
                                    </div>
                                    {/* Left column end */}
                                </div>
                                <div className="col-lg-3 col-md-3 col-sm-12 pl-0 pr-0">
                                    <div className="widget mt-0 btrr-20 border-left white-bg">
                                        <div className="widget-title ptb20">
                                            <div className="btn-group border-radius-5">
                                                <Dropdown data-bs-theme="default" size='md'>
                                                    <Dropdown.Toggle>To Do <span className='todo-line'>|</span></Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href="#">
                                                            <div className='todoinprogress-contain'>
                                                                <div className='todoicons'><i className="fa fa-arrow-right todoarrow-right" aria-hidden="true"></i></div>
                                                                <div className='todo-text'>
                                                                    <h4>Work In Progress</h4>
                                                                    <p>In Progress</p>
                                                                </div>
                                                            </div>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#">
                                                            <div className='todoinprogress-contain'>
                                                                <div className='todoicons'><i className="fa fa-arrow-right todoarrow-right" aria-hidden="true"></i></div>
                                                                <div className='todo-text'>
                                                                    <h4>Needs review</h4>
                                                                    <p>In Progress</p>
                                                                </div>
                                                            </div>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#">
                                                            <div className='todoinprogress-contain'>
                                                                <div className='todoicons'><i className="fa fa-arrow-right todoarrow-right" aria-hidden="true"></i></div>
                                                                <div className='todo-text'>
                                                                    <h4>Completed</h4>
                                                                    <p>Done</p>
                                                                </div>
                                                            </div>
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                            <div className="widget-controls"> <span className="close-content"><i className="fa fa-times"></i></span></div>
                                        </div>
                                        <div className="w-90">
                                            <div id="contact">
                                                <div className="contact-form">
                                                    <div className="row">
                                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                                            <div className='dropdownsection'>
                                                                <h6>Priority</h6>
                                                                <PriorityDropDown />
                                                            </div>
                                                            <div className='dropdownsection'>
                                                                <h6><span>Assigned To</span> <span>Assign to me</span></h6>
                                                                <AssigneeDropDown />
                                                            </div>
                                                            <div className='dropdownsection'>
                                                                <h6>Administarative</h6>
                                                                <Form.Select aria-label="Default select example">
                                                                    <option>Medium</option>
                                                                    <option value="1">High</option>
                                                                    <option value="2">Low</option>
                                                                </Form.Select>
                                                            </div>
                                                            <div className='dropdownsection'>
                                                                <h6>Ticket Type</h6>
                                                                <TicketType />
                                                            </div>
                                                            <div className='dropdownsection'>
                                                                <h6>Due Date</h6>
                                                                <input className='form-control' type='date' />
                                                            </div>
                                                            <div className='dropdownsection'>
                                                                <h6>Reporter</h6>
                                                                <ReporterType />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='add-tags mb-3'>
                                            <div className="widget-title"><h6>Tags</h6></div>
                                            <div className='tag'><button className='btn btn-default'>Add Tag +</button></div>
                                        </div>
                                        <TeaamInboxAccordion />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
export default TeamInbox;