import React from "react";

const ButtonComponent=({label,onClick,customBtn,disabled})=>{
    return(
        <>
             <button className={`button_style ${customBtn}`} disabled={disabled} onClick={onClick}>{label}</button>
        </>
    )
}
export default ButtonComponent;