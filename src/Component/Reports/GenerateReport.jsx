import React, { useState } from "react";
import AutocompleteComponent from "../AutocompleteComponent";
import TextfieldComponent from "../TextfieldComponent";
import { Button } from "@mui/material";

const styles = {
    newticketsAutocomplete: {
        height: '32px',
        border: '1px solid #c9c9cd',
        width: '50%',
        '&:hover': {
            border: '1px solid blue !important',
        },
        '&.Mui-focused': {
            border: '1px solid blue !important',
            outline: 'none',
        },

    }
}
const GenerateReport = () => {
    const dataRangeOptions = ['Yesterday', 'Last 7 days', 'Last month', 'Custom period'];
  
      
    const [dataContent, setDataContent] = useState('Yesterday');
    return (
        <div className="generate_report">
            <h5 className="heading">Export and send report</h5>
            <p className="subheading">Export your data to gain in-depth insight about tickets and create custom analytics. Enter the email address to send the report in CSV.
            </p><a className="link">Learn more</a>
            <div className="datarange_container">
                <label>Data Range</label>
                <AutocompleteComponent
                    options={dataRangeOptions}
                    value={dataContent}
                    onChange={(event, newValue) => setDataContent(newValue)}
                    customStyles={styles.newticketsAutocomplete}
                />
            </div>
            <div className="datarange_container">
                <label>Send report to</label>
                <div>
                    <TextfieldComponent customStyle='new_tickets_textbox report_textbox' />
                </div>

            </div>
            <p className="subheading">Note: This report contains sensitive data, check if the provided emails are correct.</p>
            <Button variant="contained">Send report</Button>
        </div>
    )
}
export default GenerateReport;
