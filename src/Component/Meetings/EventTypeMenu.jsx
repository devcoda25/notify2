import React from "react";
import {
    Button,
    TextField,
    Menu,
    Checkbox,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
} from "@mui/material";
import CustomButton from "./CustomButton";

const styles = {

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
const EventTypeMenu = ({ anchorEl, open, onClose, selected, setSelected }) => {
    const handleToggle = () => {
        setSelected((prev) => !prev);
    };

    return (

        <Menu anchorEl={anchorEl} open={open} onClose={onClose} >
            <div className="availability_eventtype">


                <TextField
                    variant="outlined"
                    placeholder="Search..."
                    fullWidth
                    size="small"
                    className="textfield"

                />

                {/* Select / Deselect All */}
                <div className='select_deselect_container'>
                    <span className='select_deselect' onClick={() => setSelected(true)}>
                        Select all
                    </span>
                    <span className='select_deselect' onClick={() => setSelected(false)}>
                        Deselect all
                    </span>
                </div>

                {/* 30 Minute Meeting Checkbox */}
                <List className="list"
                >
                    <ListItem button onClick={handleToggle}>
                        <ListItemIcon>
                            <Checkbox checked={selected} />
                        </ListItemIcon>
                        <ListItemText primary="30 Minute Meeting" />
                    </ListItem>
                </List>
                <Button variant="outlined" sx={{ ...styles.listview_date_cancel }}>cancel</Button>
                <CustomButton variant="contained">Apply</CustomButton>

            </div>
        </Menu>

    );
};
export default EventTypeMenu;