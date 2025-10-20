import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
const ReporterOptions = [
    {
        key: 'Reporter1',
        text: 'Reporter1',
        value: 'Reporter1',
        image: { avatar: true, src: 'assets/teaminbox/images/resource/user4.jpg' },
    },
    {
        key: 'Reporter2',
        text: 'Reporter2',
        value: 'Reporter2',
        image: { avatar: true, src: 'assets/teaminbox/images/resource/user3.jpg' },
    },
    {
        key: 'Reporter3',
        text: 'Reporter3',
        value: 'Reporter3',
        image: { avatar: true, src: 'assets/teaminbox/images/resource/user5.jpg' },
    },

]

const ReporterType = () => (
    <Dropdown
        placeholder='Task'
        fluid
        selection
        options={ReporterOptions}
    />
)

export default ReporterType
