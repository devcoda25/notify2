import React,{useState} from "react";
import { Button,  Dialog, DialogContent, DialogTitle} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import CustomButton from "./CustomButton";
const styles={
    selectdateTitle: {
        color: "black",
      },
      listview_date_apply: {
        boxShadow: "none",
        margin: "0px 0px 0px 12px",
        borderRadius: "20px",
        textTransform: "capitalize",
        width: "145px",
        height: "37px",
      },
      listview_date_cancel: {
        width: "145px",
        marginTop: "0px",
        height: "37px",
        textTransform: "capitalize",
        color: "black",
        borderRadius: "20px",
        border: "1px solid #476788",
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
         
          <Button onClick={onClose} variant="outlined" sx={{ ...styles.listview_date_cancel }}>Cancel</Button>
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
                <Button className="add_meet_hours" onClick={handleOpen}>+ Add date-specific hours</Button>

            </div>
        </>
    )
}
export default DataSpecificHoursComponent;