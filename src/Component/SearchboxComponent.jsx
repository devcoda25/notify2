import React from "react";
import { SearchOutlinedIcon } from './Icon'


const SearchboxComponent = ({ placeholder, value, onChange,customSearch }) => {
    return (
        <div className={`searchbox_component ${customSearch}`}>
            <span className="search_icon"><SearchOutlinedIcon
             /></span>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

export default SearchboxComponent;



