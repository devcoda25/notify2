import React from "react";
import CheckboxComponent from "../../CheckboxComponent";
import { EditOutlinedIcon,DeleteOutlineIcon } from "../../Icon";
import style from "../../MuiStyles/muiStyle";

const AssigntoTeamComponent = ({

    isMaterialChecked,
    handleCheckboxToggle,
    filterCardData,
    handleEditTextModal,
    handleDeleteTextCard,
    showCheckboxes,
}) => {
    return (
        <>
            <div>

                <div className='materials__action__item'>
                    <div className='action__item__'>
                        <div className='action__cards'>
                            {
                                filterCardData.map((data, index) => (
                                    <div key={index} className='material__action__cards'>
                                        <div className='action__edit'>
                                            <div className='action__edit__check'>
                                                {showCheckboxes && (
                                                    <CheckboxComponent
                                                    checked={isMaterialChecked['AssigntoUser']?.includes(data.title)}
                                                    onToggle={() => handleCheckboxToggle(data.title, 'AssigntoUser')}
                                                />
                                                   
                                                )}
                                            </div>
                                            <EditOutlinedIcon  sx={[style.tableIconBtn, style.tableeditHover]} onClick={() => handleEditTextModal(data)} />
                                            <DeleteOutlineIcon sx={[style.tableIconBtn, style.tabledeleteHover]} onClick={() => handleDeleteTextCard(data.title)}/>
                                      </div>

                                        <div className='material__action__title'>{data.title}</div>
                                        <div className='material__action__content'>
                                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.75 16.8973C2.75 15.0619 4.08361 13.4986 5.89603 13.2093L6.05929 13.1833C7.51058 12.9517 8.98942 12.9517 10.4407 13.1833L10.604 13.2093C12.4164 13.4986 13.75 15.0619 13.75 16.8973C13.75 17.6906 13.1069 18.3337 12.3136 18.3337H4.18639C3.39309 18.3337 2.75 17.6906 2.75 16.8973Z" stroke="#666666" stroke-width="1.375"></path><path d="M11.4583 6.87533C11.4583 8.64724 10.0219 10.0837 8.25 10.0837C6.47809 10.0837 5.04167 8.64724 5.04167 6.87533C5.04167 5.10341 6.47809 3.66699 8.25 3.66699C10.0219 3.66699 11.4583 5.10341 11.4583 6.87533Z" stroke="#666666" stroke-width="1.375"></path><path d="M13.75 10.0837C15.5219 10.0837 16.9583 8.64724 16.9583 6.87533C16.9583 5.10341 15.5219 3.66699 13.75 3.66699M15.9407 18.3337H17.8136C18.6069 18.3337 19.25 17.6906 19.25 16.8973C19.25 15.0619 17.9164 13.4986 16.104 13.2093V13.2093C15.9953 13.192 15.8852 13.1833 15.7752 13.1833C15.4821 13.1833 15.391 13.1833 14.8877 13.1833" stroke="#666666" stroke-width="1.375" stroke-linecap="round"></path></svg>
                                            {data.content}

                                        </div>
                                    </div>
                                ))
                            }

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default AssigntoTeamComponent;