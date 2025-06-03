import React from "react";
import { AddIcon, ReplayOutlinedIcon, RefreshOutlinedIcon, FormatBoldIcon, FormatItalicIcon, InsertLinkIcon } from '../Icon';
import CustomButton from "./CustomButton";

const VariableBox = ({ children, showTextFormatIcons = false }) => {
    return (
        <div className="variable_box_container">

            <div className="variable_box_header">
                {showTextFormatIcons && (
                    <>
                        <FormatBoldIcon />
                        <FormatItalicIcon />
                        <InsertLinkIcon />
                    </>
                )}
                <ReplayOutlinedIcon />
                <RefreshOutlinedIcon />
                <CustomButton variant="text" icon={<AddIcon />}>Variables</CustomButton>
            </div>


            <div className="variable_box_content">
                {children}
            </div>
        </div>
    );
};

export default VariableBox;
