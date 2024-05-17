import React, { useState } from 'react'
import logo from '../img/showFile.png'
import { CiLink } from "react-icons/ci";
import { LiaWalletSolid } from "react-icons/lia";
import { GoBellFill } from "react-icons/go";
import { IoMdPerson } from "react-icons/io";
import { FiInbox } from "react-icons/fi";
import { PiBroadcastDuotone } from "react-icons/pi";
import { RiContactsBook2Line } from "react-icons/ri";
import { FiSettings } from "react-icons/fi";
import { TfiMore } from "react-icons/tfi";
import { CgDanger } from "react-icons/cg";
import { RiMessage2Line } from "react-icons/ri";
import { FaClockRotateLeft } from "react-icons/fa6";
import { RiCalendarScheduleLine } from "react-icons/ri";
import Popup from '../Popup/Popup';


const Navbar = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
      setIsModalOpen(true);
    };
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };

  return (
    <div>
      <div className='nav'>
        <div className='lnav'>
            <img src={logo} alt='car' width='10%'/>
            <li><a href='#'><FiInbox />Team Inbox</a></li>
            <li className='solo'><a href='#'><PiBroadcastDuotone />Broadcast</a></li>
            <li><a href='#'><RiContactsBook2Line /></a>Contacts</li>
            <li><a href='#'><FiSettings />Automations</a></li>
            <li><a href='#'><TfiMore />More</a></li>
        </div>
        <div className='rnav'>
            <li className='navicon1'><CiLink /></li>
            <li className='navicon2'><LiaWalletSolid /></li>
            <li className='navicon3'><GoBellFill /></li>
            <li className='navcont'>CONNECTED</li>     {/*<CgDanger />  */}
            <li className='navicon3'><IoMdPerson /></li>
        </div>
      </div>
      <div style={{display:'flex'}}>
        <div className='msgContL'>
            <li className='solo'><a><RiMessage2Line style={{fontSize:'1.5rem'}} />Template Messages</a></li>
            <li><a><FaClockRotateLeft style={{fontSize:'1.5rem'}}/>Broadcast Analytics</a></li>
            <li><a><RiCalendarScheduleLine style={{fontSize:'1.5rem'}}/>Scheduled Broadcasts</a></li>
        </div>
        <div className='msgContR'>
            <button className='btn' onClick={handleOpenModal}>New Template Message</button>
            {isModalOpen && <Popup onClose={handleCloseModal} />}
        </div>
      </div>
    </div>
  )
}

export default Navbar
