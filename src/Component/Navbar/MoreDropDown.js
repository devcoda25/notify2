import React, { useState } from 'react';
// import Dropdown from 'react-bootstrap/Dropdown';
import { LuUsers2 } from "react-icons/lu";
import { MdOutlineSettingsSuggest } from "react-icons/md";
import { MdOutlineWebhook } from "react-icons/md";
import { TiLink } from "react-icons/ti";
import { TbListDetails } from "react-icons/tb";
import { ImMenu } from "react-icons/im";
// import { Prev } from 'react-bootstrap/esm/PageItem';
import { NavLink } from 'react-router-dom';
// import { useParams } from 'react-router-dom';

function MoreDropDown(props) {
  const [isOpen, setIsOpen] = useState(false);
  const authUser = props.authUser
  const currentAuthUser = authUser || 0;
  const toggleDropdown = () => {
    setIsOpen((prevState) => !prevState);
  }
  const handleTabClick = () => {
    setIsOpen(false)
  }
  return (
    <>
      <button onClick={toggleDropdown} className='header_more_btn' >
        {/* <i className="fa fa-ellipsis-h mr-10" aria-hidden="true"></i>  */}
        <ImMenu   className='mr-10' />
        More
      </button>
      {
        isOpen && (
          <ul className='header_moreoption_menu'>
            <li className='header_menu_item'>
              <NavLink
                to="/ads"
                className={({ isActive }) => `moredropdown_link ${isActive ? 'active' : ''}`}
                onClick={handleTabClick}>
                <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.09473 0.666626C6.26049 0.666626 6.41946 0.732474 6.53667 0.849684C6.65388 0.966894 6.71973 1.12587 6.71973 1.29163V3.37496C6.71973 3.54072 6.65388 3.69969 6.53667 3.8169C6.41946 3.93411 6.26049 3.99996 6.09473 3.99996C5.92897 3.99996 5.77 3.93411 5.65278 3.8169C5.53557 3.69969 5.46973 3.54072 5.46973 3.37496V1.29163C5.46973 1.12587 5.53557 0.966894 5.65278 0.849684C5.77 0.732474 5.92897 0.666626 6.09473 0.666626ZM2.11139 2.30829C2.22858 2.19125 2.38743 2.12551 2.55306 2.12551C2.71869 2.12551 2.87754 2.19125 2.99473 2.30829L4.45306 3.76663C4.51447 3.82384 4.56372 3.89284 4.59788 3.96951C4.63204 4.04618 4.65041 4.12894 4.65189 4.21286C4.65337 4.29678 4.63793 4.38013 4.6065 4.45796C4.57506 4.53578 4.52827 4.60648 4.46893 4.66582C4.40958 4.72517 4.33888 4.77196 4.26106 4.8034C4.18323 4.83483 4.09988 4.85027 4.01596 4.84879C3.93204 4.8473 3.84928 4.82894 3.77261 4.79478C3.69595 4.76062 3.62694 4.71137 3.56973 4.64996L2.11139 3.19163C1.99435 3.07444 1.92861 2.91559 1.92861 2.74996C1.92861 2.58433 1.99435 2.42548 2.11139 2.30829ZM10.0781 2.30829C10.1951 2.42548 10.2608 2.58433 10.2608 2.74996C10.2608 2.91559 10.1951 3.07444 10.0781 3.19163L8.61973 4.64996C8.56251 4.71137 8.49351 4.76062 8.41684 4.79478C8.34018 4.82894 8.25741 4.8473 8.17349 4.84879C8.08958 4.85027 8.00622 4.83483 7.92839 4.8034C7.85057 4.77196 7.77988 4.72517 7.72053 4.66582C7.66118 4.60648 7.61439 4.53578 7.58296 4.45796C7.55152 4.38013 7.53609 4.29678 7.53757 4.21286C7.53905 4.12894 7.55742 4.04618 7.59158 3.96951C7.62574 3.89284 7.67499 3.82384 7.73639 3.76663L9.19473 2.30829C9.31191 2.19125 9.47077 2.12551 9.63639 2.12551C9.80202 2.12551 9.96087 2.19125 10.0781 2.30829ZM0.469727 6.29163C0.469727 6.12587 0.535575 5.9669 0.652785 5.84968C0.769995 5.73247 0.928966 5.66663 1.09473 5.66663H3.17806C3.34382 5.66663 3.50279 5.73247 3.62 5.84968C3.73721 5.9669 3.80306 6.12587 3.80306 6.29163C3.80306 6.45739 3.73721 6.61636 3.62 6.73357C3.50279 6.85078 3.34382 6.91663 3.17806 6.91663H1.09473C0.928966 6.91663 0.769995 6.85078 0.652785 6.73357C0.535575 6.61636 0.469727 6.45739 0.469727 6.29163ZM7.28389 6.07163C6.57139 5.45996 5.46973 5.96663 5.46973 6.90579V16.3008C5.46973 17.3091 6.71556 17.7858 7.38806 17.0341L9.56639 14.5983C9.79639 14.3416 10.1197 14.19 10.4639 14.1758L13.6639 14.0475C14.6614 14.0075 15.0931 12.765 14.3347 12.1141L7.28473 6.07163H7.28389ZM6.71973 15.9058V7.23413L13.2297 12.8141L10.4131 12.9266C10.0757 12.9403 9.74461 13.0215 9.43928 13.1655C9.13395 13.3095 8.86064 13.5134 8.63556 13.765L6.71973 15.9058Z" fill="#666"></path></svg>
                Ads <span className="beta">Beta</span>
              </NavLink>
            </li>
            <li className='header_menu_item'>
              <NavLink
                to={`/u/${currentAuthUser}/usermanagement`}
                className={({ isActive }) => `moredropdown_link ${isActive ? 'active' : ''}`}
                onClick={handleTabClick}>
                <LuUsers2 /> User Management
              </NavLink>
            </li>

            <li className='header_menu_item'>
              <NavLink
                to="/integrations"
                className={({ isActive }) => `moredropdown_link ${isActive ? 'active' : ''}`}
                onClick={handleTabClick}>
                <MdOutlineSettingsSuggest /> Integrations
              </NavLink>
            </li>
            <li className='header_menu_item'>
              <NavLink
                to="/webhooks"
                className={({ isActive }) => `moredropdown_link ${isActive ? 'active' : ''}`}
                onClick={handleTabClick}>
                <MdOutlineWebhook /> Webhooks
              </NavLink>
            </li>

            <li className='header_menu_item'>
              <NavLink
                to="/commerce"
                className={({ isActive }) => `moredropdown_link ${isActive ? 'active' : ''}`}
                onClick={handleTabClick}>
                <TiLink /> Commerce
              </NavLink>
            </li>

            <li className='header_menu_item'>
              <NavLink
                to={`/u/${currentAuthUser}/accountdetails`}
                className={({ isActive }) => `moredropdown_link ${isActive ? 'active' : ''}`}
                onClick={handleTabClick}>
                <TbListDetails /> Account Details
              </NavLink>
            </li>
          </ul>
        )
      }
    </>
    // <Dropdown>
    //   <Dropdown.Toggle variant="default" id="dropdown-basic"><i className="fa fa-ellipsis-h mr-10" aria-hidden="true"></i>
    //   More
    //   </Dropdown.Toggle>

    //   <Dropdown.Menu className='moredropdown_menu'> 
    //     <li><a className='moredropdown_link'><svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.09473 0.666626C6.26049 0.666626 6.41946 0.732474 6.53667 0.849684C6.65388 0.966894 6.71973 1.12587 6.71973 1.29163V3.37496C6.71973 3.54072 6.65388 3.69969 6.53667 3.8169C6.41946 3.93411 6.26049 3.99996 6.09473 3.99996C5.92897 3.99996 5.77 3.93411 5.65278 3.8169C5.53557 3.69969 5.46973 3.54072 5.46973 3.37496V1.29163C5.46973 1.12587 5.53557 0.966894 5.65278 0.849684C5.77 0.732474 5.92897 0.666626 6.09473 0.666626ZM2.11139 2.30829C2.22858 2.19125 2.38743 2.12551 2.55306 2.12551C2.71869 2.12551 2.87754 2.19125 2.99473 2.30829L4.45306 3.76663C4.51447 3.82384 4.56372 3.89284 4.59788 3.96951C4.63204 4.04618 4.65041 4.12894 4.65189 4.21286C4.65337 4.29678 4.63793 4.38013 4.6065 4.45796C4.57506 4.53578 4.52827 4.60648 4.46893 4.66582C4.40958 4.72517 4.33888 4.77196 4.26106 4.8034C4.18323 4.83483 4.09988 4.85027 4.01596 4.84879C3.93204 4.8473 3.84928 4.82894 3.77261 4.79478C3.69595 4.76062 3.62694 4.71137 3.56973 4.64996L2.11139 3.19163C1.99435 3.07444 1.92861 2.91559 1.92861 2.74996C1.92861 2.58433 1.99435 2.42548 2.11139 2.30829ZM10.0781 2.30829C10.1951 2.42548 10.2608 2.58433 10.2608 2.74996C10.2608 2.91559 10.1951 3.07444 10.0781 3.19163L8.61973 4.64996C8.56251 4.71137 8.49351 4.76062 8.41684 4.79478C8.34018 4.82894 8.25741 4.8473 8.17349 4.84879C8.08958 4.85027 8.00622 4.83483 7.92839 4.8034C7.85057 4.77196 7.77988 4.72517 7.72053 4.66582C7.66118 4.60648 7.61439 4.53578 7.58296 4.45796C7.55152 4.38013 7.53609 4.29678 7.53757 4.21286C7.53905 4.12894 7.55742 4.04618 7.59158 3.96951C7.62574 3.89284 7.67499 3.82384 7.73639 3.76663L9.19473 2.30829C9.31191 2.19125 9.47077 2.12551 9.63639 2.12551C9.80202 2.12551 9.96087 2.19125 10.0781 2.30829ZM0.469727 6.29163C0.469727 6.12587 0.535575 5.9669 0.652785 5.84968C0.769995 5.73247 0.928966 5.66663 1.09473 5.66663H3.17806C3.34382 5.66663 3.50279 5.73247 3.62 5.84968C3.73721 5.9669 3.80306 6.12587 3.80306 6.29163C3.80306 6.45739 3.73721 6.61636 3.62 6.73357C3.50279 6.85078 3.34382 6.91663 3.17806 6.91663H1.09473C0.928966 6.91663 0.769995 6.85078 0.652785 6.73357C0.535575 6.61636 0.469727 6.45739 0.469727 6.29163ZM7.28389 6.07163C6.57139 5.45996 5.46973 5.96663 5.46973 6.90579V16.3008C5.46973 17.3091 6.71556 17.7858 7.38806 17.0341L9.56639 14.5983C9.79639 14.3416 10.1197 14.19 10.4639 14.1758L13.6639 14.0475C14.6614 14.0075 15.0931 12.765 14.3347 12.1141L7.28473 6.07163H7.28389ZM6.71973 15.9058V7.23413L13.2297 12.8141L10.4131 12.9266C10.0757 12.9403 9.74461 13.0215 9.43928 13.1655C9.13395 13.3095 8.86064 13.5134 8.63556 13.765L6.71973 15.9058Z" fill="#666"></path></svg>Ads<span class="beta">Beta</span></a></li>
    //   <li><a  className='moredropdown_link' href='UserManagement'><LuUsers2 />  User Management</a></li>
    //     <Dropdown.Item href="#/action-2" className='moredropdown_link' ><MdOutlineSettingsSuggest /> Integrations</Dropdown.Item>
    //     <Dropdown.Item href="#/action-3" className='moredropdown_link'><MdOutlineWebhook /> Webhooks</Dropdown.Item>
    //     <Dropdown.Item href="#/action-4" className='moredropdown_link'><TiLink /> Commerce</Dropdown.Item>
    //     <Dropdown.Item href="AccountDetails"><TbListDetails /> Account Details</Dropdown.Item>
    //   </Dropdown.Menu>
    // </Dropdown>

  );
}

export default MoreDropDown;