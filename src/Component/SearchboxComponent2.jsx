import React from "react";
import { SearchOutlinedIcon } from './Icon'


const SearchboxComponent2 = ({ placeholder, value, onChange,customSearch }) => {
    return (
        <div className={`searchbox_component ${customSearch} bg-gray-100 text-black`}>
            <span className="search_icon"><SearchOutlinedIcon
            sx={{  fontSize: '30px',
                backgroundColor: 'white',

                px:0.2,
                py:0.2,
                height: '34px',
                width: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
               
                borderRadius: '4px',
             }} /></span>
            <input className="default_input"
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

export default SearchboxComponent2;



