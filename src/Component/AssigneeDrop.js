import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
const AssigneeOptions = [
    {
        key: 'Ponmariappan',
        text: 'Ponmariappan',
        value: 'Ponmariappan',
        image: { avatar: true, src: 'assets/teaminbox/images/resource/user3.jpg' },
    },
    {
        key: 'Thameem',
        text: 'Thameem',
        value: 'Thameem',
        image: { avatar: true, src: 'assets/teaminbox/images/resource/user4.jpg' },
    },
    {
        key: 'Vinu',
        text: 'Vinu',
        value: 'Vinu',
        image: { avatar: true, src: 'assets/teaminbox/images/resource/user5.jpg' },
    },

]

const AssigneeDropDown = () => (
    <Dropdown
        placeholder='Ponmarippan'
        fluid
        selection
        options={AssigneeOptions}
    />
)

export default AssigneeDropDown
