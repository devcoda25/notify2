// Path: src/Component/Automation/DefaultAction.jsx
import React, { useState } from "react";
import {
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Stack,
  Box,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import Workinghourssettings from "./PopupModal/DefaultAction/Workinghourssettings";
import Dropdown from "../Dropdown";
import CheckboxComponent from "../CheckboxComponent";
import ButtonComponent from "../ButtonComponent";
import style from "../MuiStyles/muiStyle";
import { CloseIcon } from "../Icon";

/** --- Options (unchanged) --- */
const StickerOptions = [
  { value: "01_Cuppy_smile.webp", label: "01_Cuppy_smile.webp" },
  { value: "02_Cuppy_lol.webp", label: "02_Cuppy_lol.webp" },
  { value: "03_Cuppy_rofl.webp", label: "03_Cuppy_rofl.webp" },
];
const SequenceOptions = [
  { value: "normal", label: "normal" },
  { value: "incomplete", label: "incomplete" },
  { value: "test", label: "test" },
  { value: "finish", label: "finish" },
];
const ChatbotOptions = [
  { value: "Other_Options", label: "Other_Options" },
  { value: "Fleet_ownership", label: "Fleet_ownership" },
  { value: "Become a driver", label: "Become a driver" },
  { value: "Charging", label: "Charging" },
];
const TextOptions = [
  { value: "Offline_mess", label: "Offline_mess" },
  { value: "confirmed order", label: "confirmed order" },
  { value: "Rating", label: "Rating" },
];
const TemplateOptions = [
  { value: "wake_up", label: "wake_up" },
  { value: "emergency_update", label: "emergency_update" },
  { value: "welcomenote", label: "welcomenote" },
];
const ImageOptions = [{ value: "Catalog.jpeg", label: "Catalog.jpeg" }];
const groupedOptions = [
  { value: "add_new", label: "Add New +", isSpecial: true },
  { label: "Sticker", options: StickerOptions },
  { label: "Sequence", options: SequenceOptions },
  { label: "Chatbot", options: ChatbotOptions },
  { label: "Text", options: TextOptions },
  { label: "Template", options: TemplateOptions },
  { label: "Image", options: ImageOptions },
];

const DefaultAction = () => {
  const [state, setState] = useState({
    showModal: false,
    showCurrentplanModal: false,
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
    checkbox4: false,
    checkbox5: false,
    checkbox6: false,
    checkbox7: false,
    checkbox8: false,
    checkbox9: false,
  });

  const update = (patch) => setState((prev) => ({ ...prev, ...patch }));

  const handleOpenModal = () => update({ showModal: true });
  const handleCloseModal = () => update({ showModal: false });

  const handleCheckboxModal = (checked) => {
    update({ checkbox9: checked, showCurrentplanModal: true });
  };
  const handleCheckboxCloseModal = () => {
    update({ showCurrentplanModal: false, checkbox9: false });
  };

  const handleCheckboxChange = (checkboxName, checked) => {
    update({ [checkboxName]: checked });
  };

  return (
    <>
      {/* Working hours settings (kept as-is) */}
      {state.showModal && (
        <Workinghourssettings show={state.showModal} handleClose={handleCloseModal} />
      )}

      {/* Current plan modal → now MUI Dialog */}
      <Dialog
        open={state.showCurrentplanModal}
        onClose={handleCheckboxCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ pr: 5 }}>
          <IconButton
            onClick={handleCheckboxCloseModal}
            sx={{ position: "absolute", right: 8, top: 8 }}
            aria-label="close"
          >
            {/* You had a custom CloseIcon; keep it if you want */}
            {/* <CloseIcon className='modal-close-btn' /> */}
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Not included in your current plan.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Your Current Plan: <strong>Professional</strong>
          </Typography>
          <Typography variant="body2">
            Automatic chat assignment in a round-robin manner is not included in your
            current plan. You must upgrade your plan to use this feature.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <ButtonComponent
            label="Cancel"
            onClick={handleCheckboxCloseModal}
            customBtn="cancel_button_style"
          />
          <ButtonComponent label="Upgrade Now" />
        </DialogActions>
      </Dialog>

      {/* Page body */}
      <div className="defaultaction__right__content">
        <div className="default-heading-profile">Default Actions</div>

        <div className="sub-container">
          <div className="sub-text">
            Check when the keyword reply does not match, according to the set working time,
            use the default reply.
          </div>

          <a
            href="https://www.youtube.com/watch?v=Gt3qhW24tiE"
            target="_blank"
            rel="noreferrer"
            className="note-watch-tutorial"
          >
            <div className="watch-tutorial-content">
              <svg
                width="27"
                height="27"
                viewBox="0 0 27 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="importicon"
              >
                <circle cx="13.5" cy="13.5" r="13.5" fill="#269CFE" />
                <path
                  d="M17.8691 12.6344C18.5358 13.0193 18.5358 13.9815 17.8691 14.3664L12.0648 17.7176C11.3981 18.1025 10.5648 17.6214 10.5648 16.8516L10.5648 10.1493C10.5648 9.37948 11.3981 8.89836 12.0648 9.28326L17.8691 12.6344Z"
                  fill="white"
                />
              </svg>
              <span>Watch Tutorial</span>
            </div>
          </a>
        </div>

        <div className="defaultbodycontent">
          <Grid item xs={12} className="grid-working-item">
            <div className="working-text">Current Working hours :</div>
            <ButtonComponent label="Set Working Hours" onClick={handleOpenModal} />
          </Grid>

          <div className="form-select-group">
            {/* LEFT column */}
            <div className="select-left-content">
              {/* 1 */}
              <Grid item xs={12} className="checkbox-grid">
                <CheckboxComponent
                  checked={state.checkbox1}
                  onToggle={(checked) => handleCheckboxChange("checkbox1", checked)}
                />
                <div className="check-label">
                  When it is not working hours, reply the following
                </div>
              </Grid>
              <Grid item xs={12} sx={style.defaultActionGrid}>
                <Dropdown
                  options={groupedOptions}
                  selectLabel="Select material"
                  disabled={!state.checkbox1}
                />
              </Grid>

              {/* 2 */}
              <Grid item xs={12} className="checkbox-grid-style">
                <CheckboxComponent
                  checked={state.checkbox2}
                  onToggle={(checked) => handleCheckboxChange("checkbox2", checked)}
                />
                <div className="check-label">
                  When there is no customer service online during working hours, reply the
                  following
                </div>
              </Grid>
              <Grid item xs={12} sx={style.defaultActionGrid}>
                <Dropdown
                  options={groupedOptions}
                  selectLabel="Select material"
                  disabled={!state.checkbox2}
                />
              </Grid>

              {/* 3 */}
              <Grid item xs={12} className="checkbox-grid-style">
                <CheckboxComponent
                  checked={state.checkbox3}
                  onToggle={(checked) => handleCheckboxChange("checkbox3", checked)}
                />
                <div className="check-label">
                  Send the following welcome message when a new chat is started and no
                  keyword search criteria is met
                </div>
              </Grid>
              <Grid item xs={12} sx={style.defaultActionGrid}>
                <Dropdown
                  options={groupedOptions}
                  selectLabel="intro_welcome"
                  disabled={!state.checkbox3}
                />
              </Grid>

              {/* 4 */}
              <Grid item xs={12} className="checkbox-grid-style">
                <CheckboxComponent
                  checked={state.checkbox4}
                  onToggle={(checked) => handleCheckboxChange("checkbox4", checked)}
                />
                <div className="check-label">
                  During working hours, users wait more than 2 minutes without any reply
                  and no keyword matched, reply the following
                </div>
              </Grid>
              <Grid item xs={12} sx={style.defaultActionGrid}>
                <Dropdown
                  options={groupedOptions}
                  selectLabel="Select material"
                  disabled={!state.checkbox4}
                />
              </Grid>
            </div>

            {/* RIGHT column */}
            <div className="select-right-content">
              {/* 1 */}
              <Grid item xs={12} className="checkbox-grid">
                <CheckboxComponent
                  checked={state.checkbox5}
                  onToggle={(checked) => handleCheckboxChange("checkbox5", checked)}
                />
                <div className="check-label">
                  Send the following fallback message if no keyword search criteria is met
                  and no default action criteria is met.
                </div>
              </Grid>
              <Grid item xs={12} sx={style.defaultActionGrid}>
                <Dropdown
                  options={groupedOptions}
                  selectLabel="Select material"
                  disabled={!state.checkbox5}
                />
              </Grid>

              {/* 2 */}
              <Grid item xs={12} className="checkbox-grid-style">
                <CheckboxComponent
                  checked={state.checkbox6}
                  onToggle={(checked) => handleCheckboxChange("checkbox6", checked)}
                />
                <div className="check-label">
                  If customer does not respond and it's not SOLVED, when it almost reaches
                  24 hours since last message, use the following reply
                </div>
              </Grid>
              <Grid item xs={12} sx={style.defaultActionGrid}>
                <Dropdown
                  options={groupedOptions}
                  selectLabel="Soon_to_be_closed"
                  disabled={!state.checkbox6}
                />
              </Grid>

              {/* 3 */}
              <Grid item xs={12} className="checkbox-grid-style">
                <CheckboxComponent
                  checked={state.checkbox7}
                  onToggle={(checked) => handleCheckboxChange("checkbox7", checked)}
                />
                <div className="check-label">
                  Expired or Closed chat will not be assigned to Bot but leave the last
                  assignee in case of new message
                </div>
              </Grid>

              {/* 4 */}
              <Grid item xs={12} className="checkbox-grid-style">
                <CheckboxComponent
                  checked={state.checkbox8}
                  onToggle={(checked) => handleCheckboxChange("checkbox8", checked)}
                />
                <div className="check-label">
                  During out of office, send out of office message always (even if a
                  keyword match is found).
                </div>
              </Grid>

              {/* 5 (Round robin → plan gate) */}
              <Grid item xs={12} className="checkbox-grid-style">
                <CheckboxComponent onToggle={handleCheckboxModal} />
                <div className="check-label">
                  Assign newly opened chats in round robin manner within users of the
                  assigned team
                </div>
              </Grid>
            </div>
          </div>
        </div>

        <Grid item xs={12} className="grid__footer">
          <ButtonComponent label="Save Settings" />
        </Grid>
      </div>
    </>
  );
};

export default DefaultAction;
