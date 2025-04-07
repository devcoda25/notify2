import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
const style = {
    autocompleteStyle: {
        border: '1px solid rgb(232, 234, 242)',
        borderRadius: '4px',
        height: '3rem',
        paddingLeft: '10px',
        fontSize: '12px',
        height: '40px',
        backgroundColor: 'white',
        '&:hover': {
            border: '1px solid green',
        },
        '&.Mui-focused': {
            border: '1px solid green',
            backgroundColor: 'white',
            outline: 'none',
        },
    },
    dropdownOption: {
        borderBottom: '1px solid rgb(232, 234, 242)',
        '&:last-child': {
            borderBottom: 'none',
        },
    },
}
const AutocompleteComponent = ({ options, value=[], onChange, placeholder,customStyles,disabled = false  }) => {
    
    return (
        <>
            <Autocomplete
          
                options={options}
                // value={value}
                value={Array.isArray(value) ? value : [value]}
                disableClearable
                onChange={onChange}
                disabled ={disabled} 
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        placeholder={placeholder}
                        InputProps={{
                            ...params.InputProps,
                            disableUnderline: true,
                            sx: {...style.autocompleteStyle,...customStyles}
                        }}

                    />
                )}
                componentsProps={{
                    paper: {
                        sx: {
                            '& .MuiAutocomplete-option': style.dropdownOption,
                        },
                    },
                }}
            />
        </>
    )
}
export default AutocompleteComponent;