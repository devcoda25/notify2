import React,{useState} from "react";
import { Modal, ModalBody } from 'react-bootstrap';
import ButtonComponent from "../../ButtonComponent";
import TextfieldComponent from "../../TextfieldComponent";

const AddTeamModal = ({ show, onClose, onAddTeam, initialData }) => {
    const [teamName, setTeamName] = useState(initialData?.teamName || '');
    const [isDefaultTeam, setIsDefaultTeam] = useState(initialData?.defaultTeam === 'Yes');
    const handleSaveTeam = () => {
        if (teamName.trim()) {
            const teamData = {
                id: initialData?.id || Date.now(),
                teamName,
                defaultTeam: isDefaultTeam ? 'Yes' : 'No',
                teamSize: initialData?.teamSize || 0
            };
            onAddTeam(teamData);
            setTeamName('');
            setIsDefaultTeam(false);
            onClose();
        }
    };
    return (
        <>
            <Modal show={show} onHide={onClose} dialogClassName="user__modal">
                <div className='userrule_main_content'>
                    <Modal.Header className='userrule_header' closeButton>
                        <Modal.Title >Add User</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='userrule_modal_bodycontent'>
                        <div >
                            <TextfieldComponent type="text" placeholder="Team Name" value={teamName}
                                onChange={(e) => setTeamName(e.target.value)} />

                            <div class="usercheckbox-container">
                                <input type="checkbox" id="customCheckbox" class="usercustom-checkbox userconfirmedcheckbox"
                                    checked={isDefaultTeam}
                                    onChange={(e) => setIsDefaultTeam(e.target.checked)} />

                                <span className='edit__text__label'>Default Team</span>
                            </div>
                        </div>
                        <div className='savebtn'>
                            <ButtonComponent onClick={handleSaveTeam} label='Add Team' />
                            
                        </div>
                    </Modal.Body>

                </div>
            </Modal>
        </>
    )
}
export default AddTeamModal;