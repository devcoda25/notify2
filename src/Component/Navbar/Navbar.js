import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { FiInbox } from "react-icons/fi";
import logo from '../Assets/img/ev-notify-logo.png'
import { PiBroadcastDuotone } from "react-icons/pi";
import { RiContactsBook2Line } from "react-icons/ri";
import { FiSettings } from "react-icons/fi";
import { BiGridAlt } from "react-icons/bi";
import { TfiMore } from "react-icons/tfi";
import { BiLogoMeta } from "react-icons/bi";
import { LiaWalletSolid } from "react-icons/lia";
import { GoBellFill } from "react-icons/go";
import { IoMdPerson } from "react-icons/io";
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import { Modal } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
// import '../Style.css'
import MoreDropDown from './MoreDropDown';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import { AccessTimeIcon } from '../Icon';
import ToggleSwitch from '../ToggleSwitch';

const Navbar = () => {
  const location = useLocation();
  const { authUser: routeAuthUser } = useParams();
  
  const authUser = useMemo(() => {
    if (routeAuthUser) {
      return routeAuthUser;
    }
    
    const regex = /\/u\/([^/]+)/;
    const match = location.pathname.match(regex);
    return match ? match[1] : '0';
  }, [routeAuthUser, location.pathname]);

  const [activeItem, setActiveItem] = useState('TeamInbox');
  const [breakTime, setBreakTime] = useState(false);
  
  const [toggles, setToggles] = useState({
    lunch: false,
    teaBreak: false,
    bioBreak: false,
    meeting: false,
    qa: false,
    briefing: false,
    technical: false,
    unwell: false
  });

  // Memoize menu items to prevent unnecessary re-renders
  const menuItems = useMemo(() => [
    { 
      path: `/u/${authUser}/Teaminbox`, 
      label: 'Team Inbox', 
      icon: <FiInbox /> 
    },
    { 
      path: `/u/${authUser}/meetings`, 
      label: 'Meetings', 
      icon: <EventIcon /> 
    },
    { 
      path: `/u/${authUser}/Broadcast`, 
      label: 'Broadcast', 
      icon: <PiBroadcastDuotone /> 
    },
    { 
      path: `/u/${authUser}/contactus`, 
      label: 'Contacts', 
      icon: <RiContactsBook2Line /> 
    },
    { 
      path: `/u/${authUser}/automations`, 
      label: 'Automations', 
      icon: <FiSettings /> 
    },
    { 
      path: `/u/${authUser}/analytics`, 
      label: 'Analytics', 
      icon: <BiGridAlt /> 
    },
    { 
      path: `/u/${authUser}/Reports`, 
      label: 'Reports', 
      icon: <SignalCellularAltIcon /> 
    }
  ], [authUser]);

  // Memoize handlers to prevent unnecessary re-renders
  const handleClick = useCallback((item) => {
    setActiveItem(item);
  }, []);

  const handleToggle = useCallback((key) => {
    setToggles((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    sessionStorage.setItem('selectedToggle', key);
    sessionStorage.setItem('auth', 'false');
    window.location.reload();
  }, []);

  const handleBreakTime = useCallback(() => {
    setBreakTime(!breakTime);
  }, [breakTime]);

  // Memoize active path check
  const isActivePath = useCallback((itemPath) => {
    return location.pathname === itemPath;
  }, [location.pathname]);

  // Set active item based on current path
  useEffect(() => {
    const currentMenuItem = menuItems.find(item => isActivePath(item.path));
    if (currentMenuItem) {
      setActiveItem(currentMenuItem.label);
    }
  }, [location.pathname, menuItems, isActivePath]);

  // Memoize toggle switches to prevent re-rendering
  const toggleSwitches = useMemo(() => [
    { key: 'lunch', label: 'Lunch' },
    { key: 'teaBreak', label: 'Tea Break' },
    { key: 'bioBreak', label: 'Bio Break' },
    { key: 'meeting', label: 'Meeting' },
    { key: 'qa', label: 'QA' },
    { key: 'briefing', label: 'Briefing' },
    { key: 'technical', label: 'Technical' },
    { key: 'unwell', label: 'Unwell' }
  ], []);

  return (
    <div className='main-header'>
      <div className='nav bg-white'>
        <div className='lnav'>
          <img src={logo} alt='car' className="navImg" />
          <span style={{marginRight:"10px"}} className='border'></span>
          {menuItems.map((item) => (
            <li
              key={item.path}
              className={isActivePath(item.path) ? 'active' : ''}
            >
              <NavLink 
                to={item.path} 
                className='header_nav_link'
                onClick={() => handleClick(item.label)}
              >
                {item.icon}
                {item.label}
                <span className='beta'>{item.content}</span>
              </NavLink>
            </li>
          ))}
          
          <li><MoreDropDown authUser= {authUser} /></li>
        </div>
        
        <div className='rnav'>
          <li className='navicon1'><BiLogoMeta /></li>
          <span className='border'></span>
          <li className='navicon2'>
            <a 
              href="https://wallet.evzone.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="wallet-icon"
            >
              <LiaWalletSolid />
            </a>
          </li>
          <span className='border'></span>
          <li className='navicon3'><GoBellFill /></li>
          <span className='border'></span>
          <li className='navicon3' onClick={handleBreakTime}>
            <AccessTimeIcon />
          </li>
          <span className='border'></span>
          <li className='navicon3'><IoMdPerson /></li>
        </div>
      </div>
      
      {breakTime && (
        <div className='breaktime_modal'>
          {toggleSwitches.map(({ key, label }) => (
            <ToggleSwitch 
              key={key}
              isActive={toggles[key]} 
              onToggle={() => handleToggle(key)} 
              rightLabel={label}
              customRightLabel='toggleRightLabel' 
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Navbar