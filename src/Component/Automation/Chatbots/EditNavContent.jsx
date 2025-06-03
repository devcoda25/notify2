import React from "react";

const EditNavContent = ({ svg, title, subtitle, backgroundColor, background, onClick }) => {
    return (
        <>
            <div className='navitem' style={{ backgroundColor }} onClick={onClick}>
                <div className='navitem_image' style={{ backgroundColor: background }}>
                    <span>{svg}</span>
                </div>
                <div className='nav_content'>
                    <div className='nav_title'>{title}</div>
                    <div className='nav_subtitle'>{subtitle}</div>
                </div>
            </div>
        </>
    )
}
export default EditNavContent;