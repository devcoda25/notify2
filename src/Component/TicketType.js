import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
const TicketTypeOptions = [
    {
        key: 'Task1',
        text: 'Task1',
        value: 'Task1',
        image: { avatar: true, src: 'assets/teaminbox/images/resource/task.png' },
    },
    {
        key: 'Task2',
        text: 'Task2',
        value: 'Task2',
        image: { avatar: true, src: 'assets/teaminbox/images/resource/task.png' },
    },
    {
        key: 'Task3',
        text: 'Task3',
        value: 'Task3',
        image: { avatar: true, src: 'assets/teaminbox/images/resource/task.png' },
    },

]

const TicketType = () => (
    <Dropdown
        placeholder='Task'
        fluid
        selection
        options={TicketTypeOptions}
    />
)

export default TicketType
