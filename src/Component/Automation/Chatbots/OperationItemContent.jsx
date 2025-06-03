import React from "react";

const OperationItemContent = ({ img, text, onClick }) => {
    return (
        <>
            <div className='operation_item' onClick={onClick}>
                <div className='operation_item_image'>
                    {img}
                </div>
                <div className='operation_item_text'>
                    {text}
                </div>
            </div>
        </>
    )
}
export default OperationItemContent;