import React from "react";
import { AddIcon, ReplayOutlinedIcon,RefreshOutlinedIcon } from '../Icon';
import CustomButton from "./CustomButton";

const VariableBox = ({ children }) => {
    return (
        <div className="variable_box_container">

            <div className="variable_box_header">
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
