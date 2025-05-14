import React,{useState} from "react";
import { Button,  Dialog, DialogContent, DialogTitle} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import CustomButton from "./CustomButton";
import CustomDatePicker from "./CustomDatePicker";
import TimePickerComponent from "../TimePickerComponent";
import {AddIcon,CloseIcon} from '../Icon'
import style from "../MuiStyles/muiStyle";
const styles={
    selectdateTitle: {
        color: "black",
      },
     
      listview_date_cancel: {
        width: "130px",
        marginRight:"5px"
       },

}
// const DatePickerModal = ({ open, onClose }) => {
//     return (
//       <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
//         PaperProps={{
//           sx: { maxWidth: "360px !important" }
//         }}
//       >
//         <DialogTitle sx={{ ...styles.selectdateTitle }}>Select the date(s) you want to assign specific hours</DialogTitle>
//         <DialogContent>
//           <LocalizationProvider dateAdapter={AdapterDayjs}>
//             <StaticDatePicker
//               displayStaticWrapperAs="desktop"
//               value={null} />
//           </LocalizationProvider>
         
//           <CustomButton onClick={onClose} variant="outlined" sx={{ ...styles.listview_date_cancel }}>Cancel</CustomButton>
//           <CustomButton variant="contained">Apply</CustomButton>
//         </DialogContent>
  
//       </Dialog>
//     );
//   };
// const DataSpecificHoursComponent = () => {
//      const [open, setOpen] = useState(false);
//       const handleOpen = () => setOpen(true);
//       const handleClose = () => setOpen(false);
//     return (
//         <>
//            <DatePickerModal open={open} onClose={handleClose} />
//             <div className="data_specific_hours">
//                 <h4>Data Specific Hours</h4>
//                 <p>Override your availability for specific dates when your hours differ from your regular weekly hours.</p>
//                 <CustomButton variant="outlined" onClick={handleOpen} icon={<AddOutlinedIcon/>} > Add date-specific hours</CustomButton>
             

//             </div>
//         </>
//     )
// }
// export default DataSpecificHoursComponent;

const DataSpecificHoursModal = ({ open, onClose, disablePastDates, onDataChange, showTimeSlots, selectedDate }) => {

  const [timePickers, setTimePickers] = useState([
      { id: Date.now(), from: '', to: '' }
  ]);
  const handleAddTimepicker = () => {
      setTimePickers([
          ...timePickers,
          { id: Date.now(), from: '', to: '' }
      ]);
  };
  const handleRemoveTimepicker = (id) => {
      const updated = timePickers.filter(tp => tp.id !== id);
      setTimePickers(updated);
  };
  return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
          PaperProps={{
              sx: { maxWidth: "420px !important" }
          }}
      >
          <DialogTitle sx={{ ...styles.selectdateTitle }}>Select the date(s) you want to assign specific hours</DialogTitle>
          <DialogContent>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                  <div style={{ width: 320, overflow: 'hidden', paddingLeft: '15px' }}>
                      <div className="copylink_datepicker">
                          <CustomDatePicker
                              value={selectedDate}
                              onChange={onDataChange}
                              disablePastDates={disablePastDates}
                          />

                      </div>
                  </div>
              </LocalizationProvider>
              {showTimeSlots && (
                  <div className="workinghours_list_addhours">
                      <h4>What hours are you available?</h4>
                      <div className="addhours_container">
                          {timePickers.map((tp) => (
                              <div key={tp.id} className="timepicker">
                                  <TimePickerComponent
                                      initialValue={tp.from}
                                      disabled={false}
                                      customStyles={{ ...style.calendarlist_timePickerStyles, width: '139px' }}

                                  />
                                  <span style={{ margin: "0 5px" }}>—</span>
                                  <TimePickerComponent
                                      initialValue={tp.to}
                                      disabled={false}
                                      customStyles={{ ...style.calendarlist_timePickerStyles, width: '139px' }}
                                  />
                                  <CloseIcon onClick={() => handleRemoveTimepicker(tp.id)} sx={{ cursor: 'pointer' }}
                                  />

                              </div>
                          ))}
                          <AddIcon onClick={handleAddTimepicker} sx={{ position: 'absolute', right: '-14px', top: '5px', cursor: 'pointer' }} />
                      </div>
                  </div>
              )}
              <div className="workinghours_list_btn">
                  <CustomButton variant="outlined" sx={{ ...styles.listview_date_cancel }} onClick={onClose}>Cancel</CustomButton>
                  <CustomButton variant="contained" onClick={onClose}>Apply</CustomButton>
              </div>
          </DialogContent>

      </Dialog>
  )
}
export default DataSpecificHoursModal;