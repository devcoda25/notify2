import React,{useState} from "react";
import { Button,  Dialog, DialogContent, DialogTitle} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import CustomButton from "./CustomButton";
import {AddOutlinedIcon} from '../Icon'
const styles={
    selectdateTitle: {
        color: "black",
      },
     
      listview_date_cancel: {
        width: "130px",
        marginRight:"5px"
       },

}
const DatePickerModal = ({ open, onClose }) => {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
        PaperProps={{
          sx: { maxWidth: "360px !important" }
        }}
      >
        <DialogTitle sx={{ ...styles.selectdateTitle }}>Select the date(s) you want to assign specific hours</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticDatePicker
              displayStaticWrapperAs="desktop"
              value={null} />
          </LocalizationProvider>
         
          <CustomButton onClick={onClose} variant="outlined" sx={{ ...styles.listview_date_cancel }}>Cancel</CustomButton>
          <CustomButton variant="contained">Apply</CustomButton>
        </DialogContent>
  
      </Dialog>
    );
  };
const DataSpecificHoursComponent = () => {
     const [open, setOpen] = useState(false);
      const handleOpen = () => setOpen(true);
      const handleClose = () => setOpen(false);
    return (
        <>
           <DatePickerModal open={open} onClose={handleClose} />
            <div className="data_specific_hours">
                <h4>Data Specific Hours</h4>
                <p>Override your availability for specific dates when your hours differ from your regular weekly hours.</p>
                <CustomButton variant="outlined" onClick={handleOpen} icon={<AddOutlinedIcon/>} > Add date-specific hours</CustomButton>
             

            </div>
        </>
    )
}
export default DataSpecificHoursComponent;