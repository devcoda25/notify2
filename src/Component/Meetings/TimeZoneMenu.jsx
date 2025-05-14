import React,{useState} from "react";
import SearchboxComponent from "../SearchboxComponent";
import { KeyboardArrowDownIcon,KeyboardArrowUpIcon } from "../Icon";
// import  {
//     Menu,
//     List,
//     ListItem,
//     ListItemText,
//     TextField,
//     Typography
//   } from "@mui/material";

// const TimeZoneMenu = ({ anchorEl, open, onClose, onSelect  }) => {

//     const timeZones = [
//       { region: "AFRICA", zones: ["Africa/Cairo", "Central Africa Time", "West Africa Time", "Africa/Windhoek"] },
//       { region: "ASIA", zones: ["Jordan Time"] },
//     ];
//     const [searchTerm, setSearchTerm] = useState("");
  
//     // Filter time zones based on search
//     const filteredZones = timeZones.map((group) => ({
//       region: group.region,
//       zones: group.zones.filter((zone) => zone.toLowerCase().includes(searchTerm.toLowerCase())),
//     }));
  
//     return (
//       <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
//         <div className="timezone">
        
//           <TextField
//             variant="outlined"
//             placeholder="Search..."
//             fullWidth
//             size="small"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="textfield"
            
//           />
  
//           {/* Time Zones List */}
//           <List  className='list'>
//             {filteredZones.map((group) =>
//               group.zones.length > 0 ? (
//                 <div key={group.region}>
//                   <Typography variant="body2" className='listitem'>
//                     {group.region}
//                   </Typography>
//                   {group.zones.map((zone) => (
//                     <ListItem button key={zone}  onClick={() => onSelect(zone)}>
//                       <ListItemText primary={zone} secondary="1:42pm" />
//                     </ListItem>
//                   ))}
//                 </div>
//               ) : null
//             )}
//           </List>
//         </div>
//       </Menu>
//     );
//   };
//   export default TimeZoneMenu;

const TimezoneDropdown = ({ options, selectedValue, onSelect, placeholder = "Select...", showSearch = true }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const handleSelect = (label) => {
      onSelect(label);
      setShowDropdown(false);
  };

  const filteredOptions = options.filter((tz) =>
      tz.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <div className="country_timezone_wrapper">
          <div className="selected_timezone" onClick={toggleDropdown}>
              {selectedValue || placeholder}
              {showDropdown ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </div>

          {showDropdown && (
              <div className="dropdown">
                  {showSearch && (
                      <SearchboxComponent
                          placeholder="Search..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                      />
                  )}
                  <div className="dropdown_list">
                      {filteredOptions.map((tz) => (
                          <div
                              key={tz.label}
                              className={`dropdown_item ${tz.label === selectedValue ? "active" : ""}`}
                              onClick={() => handleSelect(tz.label)}
                          >
                              <span>{tz.label}</span>
                              <span className="time">{tz.time}</span>
                          </div>
                      ))}
                  </div>
              </div>
          )}
      </div>
  );
};
export default TimezoneDropdown;