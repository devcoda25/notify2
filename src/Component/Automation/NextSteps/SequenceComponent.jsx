import React from "react";
import CheckboxComponent from "../../CheckboxComponent";
import style from "../../MuiStyles/muiStyle";
import {EditOutlinedIcon} from '../../Icon';

const SequencesComponent = ({
    isMaterialChecked,
    handleCheckboxToggle,
    filterCardData,
    handleEditTextModal,
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
                                                      checked={isMaterialChecked['Sequences']?.includes(data.title)}
                                                      onToggle={() => handleCheckboxToggle(data.title, 'Sequences')}
                                                  />
                                                   
                                                )}
                                            </div>
                                            <EditOutlinedIcon  sx={[style.tableIconBtn, style.tableeditHover]} onClick={() => handleEditTextModal(data)} />
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
export default SequencesComponent;