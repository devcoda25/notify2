import React, { useState } from "react";
import AutocompleteComponent from "../AutocompleteComponent";
import TextfieldComponent from "../TextfieldComponent";
import style from "../MuiStyles/muiStyle";
import CustomButton from "../Meetings/CustomButton";

const dataRangeOptions = ['Yesterday', 'Last 7 days', 'Last month', 'Custom period'];

const GenerateReport = () => {
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
                    customStyles={{...style.newticketsAutocomplete,width:'50%'}}
                />
            </div>
            <div className="datarange_container">
                <label>Send report to</label>
                <div>
                    <TextfieldComponent customStyle='custom_textfield_box report_textbox' />
                </div>

            </div>
            <p className="subheading">Note: This report contains sensitive data, check if the provided emails are correct.</p>
            <CustomButton variant="contained">Send report</CustomButton>
        </div>
    )
}
export default GenerateReport;
