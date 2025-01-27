import Dropdown from 'react-bootstrap/Dropdown';
import { LuUsers2 } from "react-icons/lu";
import { MdOutlineSettingsSuggest } from "react-icons/md";
import { MdOutlineWebhook } from "react-icons/md";
import { TiLink } from "react-icons/ti";
import { TbListDetails } from "react-icons/tb";

function MoreDropDown() {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="default" id="dropdown-basic"><i className="fa fa-ellipsis-h mr-10" aria-hidden="true"></i>
      More
      </Dropdown.Toggle>

      <Dropdown.Menu className='moredropdown_menu'> 
      <li><a  className='moredropdown_link' href='UserManagement'><LuUsers2 />  User Management</a></li>
        <Dropdown.Item href="#/action-2" className='moredropdown_link' ><MdOutlineSettingsSuggest /> Integrations</Dropdown.Item>
        <Dropdown.Item href="#/action-3" className='moredropdown_link'><MdOutlineWebhook /> Webhooks</Dropdown.Item>
        <Dropdown.Item href="#/action-4" className='moredropdown_link'><TiLink /> Commerce</Dropdown.Item>
        <Dropdown.Item href="AccountDetails"><TbListDetails /> Account Details</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default MoreDropDown;