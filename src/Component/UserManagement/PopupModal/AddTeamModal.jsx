import React,{useState} from "react";
import UserBaseModal from "./UserBaseModal";
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
          
                    <UserBaseModal show={show} onClose={onClose} onSave={handleSaveTeam} title="Add Team">
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
                       
                        </UserBaseModal>
                  
        </>
    )
}
export default AddTeamModal;