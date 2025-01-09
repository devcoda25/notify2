import React from "react";

const ButtonComponent=({label,onClick,customBtn})=>{
    return(
        <>
             <button className={`btn btn-success ${customBtn}`}  onClick={onClick}>{label}</button>
        </>
    )
}
export default ButtonComponent;