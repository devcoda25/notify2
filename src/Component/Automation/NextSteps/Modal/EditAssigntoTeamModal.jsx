import React, { useState, useEffect } from "react";
import AutocompleteComponent from "../../../AutocompleteComponent";
import TextfieldComponent from "../../../TextfieldComponent";
import KeywordBaseModal from "./KeywordBaseModal";

const options = ["EV_Zone_everyone", "call_center_Kampala", "Ride_Agents_officers", "Corporate_Liasion_officers"]

const EditAssigntoTeamModal = ({ show, onClose, onSave, initialTitle, initialContent }) => {
    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState(initialContent);

    useEffect(() => {
        setTitle(initialTitle);
        setContent(initialContent)
    }, [initialTitle, initialContent])
    const handleEditSave = () => {
        onSave(title, content)
    }
    return (

        <>
            <KeywordBaseModal show={show} onClose={onClose} onSave={handleEditSave} title='New Routing Material'>
                <div>
                    <div className='edit__text__label'>Material name</div>
                    <TextfieldComponent type="text" placeholder="Please input" value={title} onChange={(e) => setTitle(e.target.value)} />

                </div>
                <div>
                    <div className='edit__text__label'>Selected Team</div>
                    <AutocompleteComponent options={options}
                        value={content}
                        onChange={(event, newValue) => setContent(newValue)} />

                </div>

            </KeywordBaseModal>
        </>

    )
}
export default EditAssigntoTeamModal;