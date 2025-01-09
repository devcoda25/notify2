import React from "react";
const TextfieldComponent=({placeholder,customStyle,value,onChange})=>{
    return(
        <>
         <input type="text" placeholder={placeholder}  
         className={`textfield_style ${customStyle}`} value={value} 
         onChange={onChange} />
        </>
    )
}
export default TextfieldComponent;