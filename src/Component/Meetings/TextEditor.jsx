import React, { useRef, useState } from "react";
import { IconButton } from "@mui/material";
import {FormatBoldIcon,FormatItalicIcon,FormatUnderlinedIcon,FormatListBulletedIcon,FormatListNumberedIcon,InsertLinkIcon,UndoIcon,RedoIcon} from "../Icon"

const TextEditor = ({ placeholder = "" }) => {
  const editorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  const applyFormatting = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  return (
    <div className="meet_editor_textbox">
         <h4>Description/Instructions</h4>
      {/* Toolbar */}
      <div className="icons_container">
        <IconButton onClick={() => applyFormatting("bold")}>
          <FormatBoldIcon />
        </IconButton>
        <IconButton onClick={() => applyFormatting("italic")}>
          <FormatItalicIcon />
        </IconButton>
        <IconButton onClick={() => applyFormatting("underline")}>
          <FormatUnderlinedIcon />
        </IconButton>
        <IconButton onClick={() => applyFormatting("insertUnorderedList")}>
          <FormatListBulletedIcon />
        </IconButton>
        <IconButton onClick={() => applyFormatting("insertOrderedList")}>
          <FormatListNumberedIcon />
        </IconButton>
        <IconButton onClick={() => applyFormatting("createLink", prompt("Enter URL"))}>
          <InsertLinkIcon />
        </IconButton>
        <IconButton onClick={() => applyFormatting("undo")}>
          <UndoIcon />
        </IconButton>
        <IconButton onClick={() => applyFormatting("redo")}>
          <RedoIcon />
        </IconButton>
      </div>

      {/* Editable Text Box */}
      <div
        ref={editorRef}
        contentEditable
        className="description_box"
        data-placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          border: isFocused ? "2px solid blue" : "1px solid #ccc",
         
        }}
      ></div>
    </div>
  );
};

export default TextEditor;
