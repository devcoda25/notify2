import Dropdown from 'react-bootstrap/Dropdown';

function MoreDropDown() {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="default" id="dropdown-basic"><i class="fa fa-ellipsis-h mr-10" aria-hidden="true"></i>
      More
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item href="#/action-1">User Management</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Integrations</Dropdown.Item>
        <Dropdown.Item href="#/action-3">Webhooks</Dropdown.Item>
        <Dropdown.Item href="#/action-4">Commerce</Dropdown.Item>
        <Dropdown.Item href="#/action-5">Account Details</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default MoreDropDown;