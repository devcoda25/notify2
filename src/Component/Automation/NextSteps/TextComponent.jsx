import React from "react";
import CheckboxComponent from '../../CheckboxComponent'
import style from "../../MuiStyles/muiStyle";
import { DeleteOutlineIcon,EditOutlinedIcon } from '../../Icon';
const TextComponent = ({
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
                                                      checked={isMaterialChecked['Text']?.includes(data.title)}
                                                      onToggle={() => handleCheckboxToggle(data.title, 'Text')}
                                                  />
                                                   
                                                )}
                                            </div>
                                            <EditOutlinedIcon  sx={[style.tableIconBtn, style.tableeditHover]} onClick={() => handleEditTextModal(data)} />
                                            <DeleteOutlineIcon sx={[style.tableIconBtn, style.tabledeleteHover]} onClick={() => handleDeleteTextCard(data.title)}/>
                                          
                                        </div>

                                        <div className='material__action__title'>{data.title}</div>
                                        <div className='material__action__content'>{data.content}</div>
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
export default TextComponent;