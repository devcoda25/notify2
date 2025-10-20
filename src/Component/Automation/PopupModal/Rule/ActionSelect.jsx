import React from "react";
import { FormControl, Select, MenuItem } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

const actionselect = {
  container: (styleProps) => ({
    height: 36,
    backgroundColor: "white",
    border: "1px solid rgb(242, 242, 242)",
    borderRadius: "4px",
    fontSize: "13px",
    boxShadow: "none",
    width: "95%",
    ...styleProps,
    "&:hover": {
      border: "1px solid rgb(242, 242, 242)",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "&.Mui-focused": {
      border: "1px solid rgb(242, 242, 242)",
      boxShadow: "none",
    },
    "& .MuiSelect-select": {
      padding: "8px 12px",
    },
  }),

  paper: {
    borderRadius: "4px",
    border: "1px solid rgb(242, 242, 242)",
  },

  menuItem: (selected, currentId) => ({
    display: "flex",
    alignItems: "center",
    backgroundColor: selected === currentId ? "#eceff1" : "transparent",
    "&.Mui-selected": {
      backgroundColor: "#eceff1",
    },
    "&.Mui-selected:hover": {
      backgroundColor: "#eceff1",
    },
    "&:hover, &:focus": {
      backgroundColor: "#eceff1",
    },
  }),

  checkIcon: {
    position: "absolute",
    right: "12px",
    color: "green",
  },
};

const ActionSelect = ({ options, selectedOption, onChange, placeholder, styleProps }) => {
  return (
    <FormControl fullWidth>
      <Select
        value={selectedOption}
        onChange={onChange}
        sx={actionselect.container(styleProps)}
        MenuProps={{
          PaperProps: {
            sx: actionselect.paper,
          },
        }}
        displayEmpty
        renderValue={(selected) => {
          if (!selected) {
            return placeholder || " ";
          }
          const option = options.find((opt) => opt.id === selected);
          return (
            <div>
              <span className="actionproperties_dropdown_value_svg">
                {option?.svg}
              </span>
              {option?.label}
            </div>
          );
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.id}
            value={option.id}
            sx={actionselect.menuItem(selectedOption, option.id)}
          >
            <div className="actionselect_menu_content">
              <span className="actionproperties_dropdown_svg">{option.svg}</span>
              <span
                className={`triggerproperties_dropdown_label ${selectedOption === option.id ? "selected-label" : ""
                  }`}
              >
                {option.label}
              </span>
              {selectedOption === option.id && (
                <CheckIcon sx={actionselect.checkIcon} />
              )}
            </div>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ActionSelect;
