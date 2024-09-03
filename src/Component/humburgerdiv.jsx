import React, { useState } from 'react';
import { push as Menu } from 'react-burger-menu';



const BurgerSidebar = ({isOpenSideMenu, setIsOpenSideMenu}) => {
   
const CustomBurgerIcon = () => <i className="fa fa-bars" aria-hidden="true" onClick={changeBurgerIcon}></i>;

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
            top: '116px'
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
            display:'none'
        },
        bmCross: {
            background: '#bdc3c7'
        },
        bmMenuWrap: {
            position: 'fixed',
            height: '100%',
            // left:'200px'
        },
        bmMenu: {
            background: '#373a47',
            padding: '2em 1em 0',
            fontSize: '1.15em',
            height:'auto'
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
        maincontent:{
            width:'80%'
        }
    }
    const changeBurgerIcon = () => {
        alert('safkj');
        setIsOpenSideMenu(false);
      };
    return (
        <Menu noOverlay styles={styles} customBurgerIcon={<i className="fa fa-bars" aria-hidden="true" onClick={changeBurgerIcon}></i>}  width={'300px'} pageWrapId={"page-wrap"} outerContainerId={"outer-container"}>
            <div className="widget mt-0">
                <div className="widget-title p-2">
                    <span><i className="fa fa-bars" aria-hidden="true"></i></span>
                    <h3>My Tickets</h3>
                    <div className="widget-controls"><span className="refresh-content"><i className="fa fa-th-list" aria-hidden="true"></i>
                    </span> </div>
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
    );
};

export default BurgerSidebar;