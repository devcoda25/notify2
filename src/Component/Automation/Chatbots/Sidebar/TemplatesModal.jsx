import React, { useState } from "react";
import AutocompleteComponent from "../../../AutocompleteComponent";
import BaseModal from "./BaseModal";

const options = ["sell_ev_market", 'buy_ev_market', 'agent_signup', 'become_a_driver', 'charge_point_owner', 'agent_register', 'charging_point']
const messages = {
    sell_ev_market: "You can sell Electric Vehicles, Charge Points and Accessories from our market",
    buy_ev_market: "You can buy Electric Vehicles, Charge Points and Accessories from our market.",
    agent_signup: "To become an EV zone Agent",
    become_a_driver: "Register from website : https://www.evzoneride.com/#",
    charge_point_owner: "Email on investors@evzoneafrica.com",
    agent_register: "To become an EV zone Agent",
    charging_point: "Book through Website https://www.evzoneride.com/#"
};

const TemplatesModal = ({ show, onClose, onSave }) => {

    const [content, setContent] = useState('');
    const filteredOptions = options.filter(option => option !== content);
    return (
        <BaseModal show={show} onClose={onClose} onSave={onSave} title="Message Template">
            <AutocompleteComponent
                options={filteredOptions}
                value={content}
                onChange={(event, newValue) => setContent(newValue)}
                placeholder='Select'
            />

            {content && (
                <div className='message_templates_body'>
                    {messages[content]}
                </div>
            )}

        </BaseModal>


    );
};
export default TemplatesModal;