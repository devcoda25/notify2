import React from "react";
const TextfieldComponent=({placeholder,customStyle,value,onChange,type})=>{
    return(
        <>
         <input type={type} placeholder={placeholder}  
         className={`textfield_style ${customStyle}`} value={value} 
         onChange={onChange} />
        </>
    )
}
export default TextfieldComponent;