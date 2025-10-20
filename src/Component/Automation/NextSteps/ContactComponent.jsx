import React from "react";
import CheckboxComponent from "../../CheckboxComponent";
import style from "../../MuiStyles/muiStyle";
import {EditOutlinedIcon,DeleteOutlineIcon} from '../../Icon'

const ContactComponent = ({
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
                                                        checked={isMaterialChecked['Contact']?.includes(data.title)}
                                                        onToggle={() => handleCheckboxToggle(data.title, 'Contact')}
                                                    />

                                                )}
                                            </div>
                                            <EditOutlinedIcon  sx={[style.tableIconBtn, style.tableeditHover]} onClick={() => handleEditTextModal(data)} />
                                            <DeleteOutlineIcon sx={[style.tableIconBtn, style.tabledeleteHover]} onClick={() => handleDeleteTextCard(data.title)}/>
                                          </div>

                                        <div className='material__action__title'>{data.title}</div>

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
export default ContactComponent;