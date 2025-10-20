import React from "react";
import { Select, MenuItem,ListItemText } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import style from "../MuiStyles/muiStyle";

const CustomDropdown = ({
  value,
  onChange,
  options,
  renderOption,
  getValueLabel,
  fullWidth = true,
  sx = {},
  disabled = false,
 }) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      displayEmpty
      fullWidth={fullWidth}
      disabled={disabled} 
    //  sx={style.oneonone_select_container}
    sx={{
      ...style.oneonone_select_container,
      ...sx, 
    }}

      renderValue={(selected) =>
        getValueLabel ? getValueLabel(selected) : selected || 'Select'
      }
      MenuProps={{
        PaperProps: {
          sx: {
            maxHeight: 300,
            overflowY: 'auto'
          }
        }
      }}
    >
      {options.map((opt) => (
        <MenuItem key={opt.value || opt.label} value={opt.value || opt} sx={style.oneone_select_menu}
        >
          {renderOption ? (
            renderOption(opt, value)
          ) : (
            <>
              <ListItemText primary={opt.label || opt} />
              {value === (opt.value || opt) && (
                <CheckIcon fontSize="small" sx={{ color: '#006bff' }} />
              )}
            </>
          )}
        </MenuItem>
      ))}
    </Select>
  );
};

export default CustomDropdown;
