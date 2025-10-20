import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Switch } from "@mui/material";
import { CloseIcon } from "../Icon";
import AutocompleteComponent from "../AutocompleteComponent";
import CustomButton from "./CustomButton";
import style from "../MuiStyles/muiStyle";

const EditQuestionModal = ({
    open,
    onClose,
    answerTypeOptions,
    selectedAnswerType,
    onAnswerTypeChange,
    status,
    onStatusChange,
    onSave
}) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth className="event_Edit_Question_modal">
            <DialogTitle className="modal_title">
                Edit Question
                <CloseIcon onClick={onClose} />
            </DialogTitle>

            <DialogContent className="modal_content">
                {/* Question Input */}
                <div>
                    <label>Question</label>
                    <textarea></textarea>
                </div>

                {/* Required Checkbox */}
                <div>
                    <input type="checkbox" /> <span>Required</span>
                </div>

                {/* Answer Type Selection */}
                <div>
                    <label>Answer Type</label>
                    <AutocompleteComponent
                        options={answerTypeOptions}
                        value={selectedAnswerType}
                        onChange={onAnswerTypeChange}
                        customStyles={{ ...style.newticketsAutocomplete }}
                    />
                </div>

                {/* Status Toggle */}
                <div>
                    <label>Status</label>
                    <div className="status_container">
                        {status ? "On" : "Off"}
                        <FormControlLabel
                            control={<Switch checked={status} onChange={onStatusChange} />}
                        />
                    </div>
                </div>
            </DialogContent>

            <DialogActions>
                <CustomButton variant="contained" sx={{ width: "100%" }} onClick={onSave}>
                    Done
                </CustomButton>
            </DialogActions>
        </Dialog>
    );
};

export default EditQuestionModal;
