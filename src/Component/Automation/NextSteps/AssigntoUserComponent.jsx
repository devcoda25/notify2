import React from "react";
import CheckboxComponent from "../../CheckboxComponent";
import { EditOutlinedIcon,DeleteOutlineIcon } from "../../Icon";
import style from "../../MuiStyles/muiStyle";
const AssigntoUserComponent = ({

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
                                            <EditOutlinedIcon  sx={[style.tableIconBtn, style.tableeditHover]}  onClick={() => handleEditTextModal(data)} />
                                            <DeleteOutlineIcon sx={[style.tableIconBtn, style.tabledeleteHover]}  onClick={() => handleDeleteTextCard(data.title)}/>
                                      
                                        </div>

                                        <div className='material__action__title'>{data.title}</div>
                                        <div className='material__action__content'>Assign to User:{data.content}

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
export default AssigntoUserComponent;