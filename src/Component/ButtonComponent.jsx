import React from "react";

const ButtonComponent=({label,onClick})=>{
    return(
        <>
             <button className='btn btn-success' onClick={onClick}>{label}</button>
        </>
    )
}
export default ButtonComponent;