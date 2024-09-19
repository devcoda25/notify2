import React, { useState } from 'react';
import { push as Menu } from 'react-burger-menu';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
const BurgerSidebar = ({setTicketView, setIsClose, isClose}) => {
    const [open, setOpen] = useState(false);
    // const [isVisible, setIsVisible] = useState(false);

    const CustomBurgerIcon = () => <i className="fa fa-bars" aria-hidden="true"></i>;

    // function changeBurgerIcon(){
    //     alert("test")
    //     setIsOpenSideMenu((prev)=>!prev);
    // }
    var styles = {
        bmBurgerButton: {
            position: 'fixed',
            width: '36px',
            height: '30px',
            left: '27px',
            top: '116px',
            display:'none'
          
        },
        bmBurgerBars: {
            background: '#373a47'
        },
        bmBurgerBarsHover: {
            background: '#a90000'
        },
        bmCrossButton: {
            height: '24px',
            width: '24px',
            display: 'none'

        },
        bmCross: {
            background: '#bdc3c7'
        },
        bmMenuWrap: {
            position: 'absolute',
            height: '100%',
            left: '225px'
        },
        bmMenu: {
            background: '#373a47',
            padding: '2em 1em 0',
            fontSize: '1.15em',
            height: 'auto'
        },
        bmMorphShape: {
            fill: '#373a47'
        },
        bmItemList: {
            color: '#b8b7ad',
            padding: '0.8em'
        },
        bmItem: {
            display: 'inline-block'
        },
        bmOverlay: {
            background: 'rgba(0, 0, 0, 0.3)'
        },
        maincontent: {
            width: '80%'
        }
    }
    function ticketview(){
        // var closeButton = document.querySelector('#react-burger-menu-btn');
            // closeButton.click();
            let bm_menu_wrap = document.querySelector(".bm-menu-wrap")
            setTicketView((prev)=>{
                if(prev){
                    bm_menu_wrap.style.left = 0
                }else{
                    bm_menu_wrap.style.left = "200px"
                }
                return !prev;
            });
    }
    function ticketClose(){
        setTicketView(false);
        setIsClose((prev)=>!prev)
        document.querySelector('#react-burger-cross-btn').click()
    }

    return (
        <>
       
                    <Menu noOverlay styles={styles} isOpen={'true'} customBurgerIcon={<CustomBurgerIcon />} width={'320px'} pageWrapId={"page-wrap"} outerContainerId={"outer-container"}>
                        {!isClose &&
                        <div className='close-line' onClick={ticketClose}>&nbsp;</div>}
                        <div className="widget mt-0">
                            <div className="widget-title p-2">
                                <span className='ticketview-open' onClick={ticketview}><i className="fa fa-bars" aria-hidden="true"></i></span>
                                <h3>My Tickets</h3>
                                <div className="widget-controls ticket-filter-contain ticket-filter-btn">
                                    <Button
                                        onClick={() => setOpen(!open)}
                                        aria-controls="ticket-filter"
                                        aria-expanded={open}
                                    >
                                        <i className="fa fa-th-list" aria-hidden="true"></i>
                                    </Button>
                                    <Collapse in={open}>
                                        <div id="ticket-filter" className='ticket-filters'>
                                            <div className='ticket-filter-title'><span className='ticket-sub-title'> <i className="fa fa-filter mr-2" aria-hidden="true"></i>
                                                Ticket Filter</span><span><i className="fa fa-repeat mr-2" aria-hidden="true"></i>
                                                    Reset</span></div>
                                            <div className='ticket-filter-body'>
                                                <div className='ticket-filter-option mt-3'>
                                                    <FloatingLabel
                                                        controlId="floatingInput"
                                                        label="Project"
                                                        className="mb-3"
                                                    >
                                                        <Form.Select aria-label="Default select example">
                                                            <option>All</option>
                                                            <option value="1">One</option>
                                                            <option value="2">Two</option>
                                                            <option value="3">Three</option>
                                                        </Form.Select>
                                                    </FloatingLabel>
                                                </div>
                                                <div className='ticket-filter-option mt-3'>
                                                    <FloatingLabel
                                                        controlId="floatingInput"
                                                        label="Type"
                                                        className="mb-3"
                                                    >
                                                        <Form.Select aria-label="Default select example">
                                                            <option>All</option>
                                                            <option value="1">One</option>
                                                            <option value="2">Two</option>
                                                            <option value="3">Three</option>
                                                        </Form.Select>
                                                    </FloatingLabel>
                                                </div>
                                                <div className='ticket-filter-option mt-3'>
                                                    <FloatingLabel
                                                        controlId="floatingInput"
                                                        label="Status"
                                                        className="mb-3"
                                                    >
                                                        <Form.Select aria-label="Default select example">
                                                            <option>All</option>
                                                            <option value="1">One</option>
                                                            <option value="2">Two</option>
                                                            <option value="3">Three</option>
                                                        </Form.Select>
                                                    </FloatingLabel>
                                                </div>
                                                <div className='ticket-filter-option mt-3'>
                                                    <FloatingLabel
                                                        controlId="floatingInput"
                                                        label="Assignee"
                                                        className="mb-3"
                                                    >
                                                        <Form.Select aria-label="Default select example">
                                                            <option>All</option>
                                                            <option value="1">One</option>
                                                            <option value="2">Two</option>
                                                            <option value="3">Three</option>
                                                        </Form.Select>
                                                    </FloatingLabel>
                                                </div>
                                            </div>
                                            <Button className='mt-3' variant="link"><i className="fa fa-plus-circle mr-2" aria-hidden="true"></i>
                                                More</Button>
                                            <div className='ticket-filter-footer mt-4'>
                                                <Form>
                                                    <Form.Group className="mb-3 input-btn" controlId="">
                                                        <Form.Control className='name-this' type="text" placeholder="Name this view" />
                                                        <Button className='btn btn-primary' variant="primary">Save New View</Button>
                                                    </Form.Group>
                                                </Form>
                                            </div>
                                        </div>
                                    </Collapse>
                                </div>

                            </div>
                        </div>
                        <div className="search-dashboard">
                            <div className="responsive-search"> <i className="fa fa-search"></i> </div>
                            <form>
                                <input type="text" placeholder="Search Tickets" />
                                <button type="submit"><i className="fa fa-search"></i></button>
                            </form>
                        </div>
                        <div className="slimScrollDiv">
                            <ul className="your-emails">
                                <li className="email unread">
                                    <div className='ticket-title'><h3>My Ticket Name</h3><p className='ticket-date'>Aug 31</p></div>
                                    <input type="checkbox" className="checkall" />
                                    <h3>Amare Hale</h3>
                                    <a title="" className="inbox-msg"><span className="blue-bg">To Do</span></a><span className='hum-clock'><i className="fa fa-clock-o"></i></span> <span className='hub-alert'><i className="fa fa-exclamation-circle"></i></span> <span className='hum-avator'><img src="assets/teaminbox/images/resource/friend-avatar.jpg" alt="" /></span> <span className='alert-count red-bg'>5</span>
                                </li>
                                <li className="email unread">
                                    <div className='ticket-title'><h3>My Ticket Name</h3><p className='ticket-date'>Aug 31</p></div>
                                    <input type="checkbox" className="checkall" />
                                    <h3>Amare Hale</h3>
                                    <a title="" className="inbox-msg"><span className="blue-bg">To Do</span></a><span className='hum-clock'><i className="fa fa-clock-o"></i></span> <span className='hub-alert'><i className="fa fa-exclamation-circle"></i></span> <span className='hum-avator'><img src="assets/teaminbox/images/resource/friend-avatar.jpg" alt="" /></span> <span className='alert-count red-bg'>5</span>
                                </li>
                                <li className="email unread">
                                    <div className='ticket-title'><h3>My Ticket Name</h3><p className='ticket-date'>Aug 31</p></div>
                                    <input type="checkbox" className="checkall" />
                                    <h3>Amare Hale</h3>
                                    <a title="" className="inbox-msg"><span className="blue-bg">To Do</span></a><span className='hum-clock'><i className="fa fa-clock-o"></i></span> <span className='hub-alert'><i className="fa fa-exclamation-circle"></i></span> <span className='hum-avator'><img src="assets/teaminbox/images/resource/friend-avatar.jpg" alt="" /></span> <span className='alert-count red-bg'>5</span>
                                </li>
                                <li className="email unread">
                                    <div className='ticket-title'><h3>My Ticket Name</h3><p className='ticket-date'>Aug 31</p></div>
                                    <input type="checkbox" className="checkall" />
                                    <h3>Amare Hale</h3>
                                    <a title="" className="inbox-msg"><span className="blue-bg">To Do</span></a><span className='hum-clock'><i className="fa fa-clock-o"></i></span> <span className='hub-alert'><i className="fa fa-exclamation-circle"></i></span> <span className='hum-avator'><img src="assets/teaminbox/images/resource/friend-avatar.jpg" alt="" /></span> <span className='alert-count red-bg'>5</span>
                                </li>
                            </ul>
                        </div>

                    </Menu>
                </>
                );
};

                export default BurgerSidebar;