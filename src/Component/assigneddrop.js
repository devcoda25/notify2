import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
const LevelOptions = [
    {
        key: 'Medium',
        text: 'Medium',
        value: 'Medium',
        image: { avatar: true, src: 'assets/teaminbox/images/resource/medium.png' },
    },
    {
        key: 'High',
        text: 'High',
        value: 'High',
        image: { avatar: true, src: 'assets/teaminbox/images/resource/high.png' },
    },
    {
        key: 'Low',
        text: 'Low',
        value: 'Low',
        image: { avatar: true, src: 'assets/teaminbox/images/resource/low.png' },
    },

]

const PriorityDropDown = () => (
    <Dropdown
        placeholder='Medium'
        fluid
        selection
        options={LevelOptions}
    />
)

export default PriorityDropDown
