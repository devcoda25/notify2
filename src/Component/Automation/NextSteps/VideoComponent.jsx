import React from "react";
import CheckboxComponent from "../../CheckboxComponent";
import style from "../../MuiStyles/muiStyle";
import {EditOutlinedIcon,DeleteOutlineIcon,FileDownloadOutlinedIcon} from '../../Icon'

const VideoComponent = ({
    isMaterialChecked,
    handleCheckboxToggle,
    filterCardData,
    handleEditTextModal,
    handleDeleteTextCard,
    showCheckboxes,
}) => {
    const handleDownload = (url, title) => {
        const link = document.createElement('a');
        link.href = url; // The URL of the image
        link.download = title; // downloaded file
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
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
                                                        checked={isMaterialChecked['Video']?.includes(data.title)}
                                                        onToggle={() => handleCheckboxToggle(data.title, 'Video')}
                                                    />
                                                  
                                                )}
                                            </div>
                                            <EditOutlinedIcon  sx={[style.tableIconBtn, style.tableeditHover]} onClick={() => handleEditTextModal(data)} />
                                            <DeleteOutlineIcon sx={[style.tableIconBtn, style.tabledeleteHover]} onClick={() => handleDeleteTextCard(data.title)}/>
                                          <FileDownloadOutlinedIcon  sx={[style.tableIconBtn, style.tableeditHover]} onClick={() => handleDownload(data.fileUrl, data.title)}/>
                                          
                                        </div>

                                        <div className='material__action__title'>{data.title}</div>
                                        <div className='material__action__content'>
                                            <video width="100%" height="auto" controls>
                                                <source src={data.content} type="video/mp4" />
                                            </video>
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
export default VideoComponent;