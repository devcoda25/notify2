import React, { useState, useRef, useCallback } from "react";
import { Card } from "@mui/material";
import {
  RichToolbar,
  VariableDialog,
  EditorAttachments,
  toolbarConfigForChannel,
  RichHtmlArea,
} from "./EditorPieces";

// A dummy list of variables
const dummyVariables = ["firstName", "lastName", "companyName"];

export default function RichTextEditor({
  value,
  onChange,
  channel = "email",
  attachments,
  onAttachmentsChange
}) {
  const richHtmlAreaRef = useRef(null);
  const [variablesDialogOpen, setVariablesDialogOpen] = useState(false);
  const [selectedVariable, setSelectedVariable] = useState("");

  const toolbarConfig = toolbarConfigForChannel(channel);

  const handleToolbarAction = useCallback((command, commandValue = null) => {
    if (richHtmlAreaRef.current) {
      richHtmlAreaRef.current.focus();
      setTimeout(() => {
        document.execCommand(command, false, commandValue);
      }, 0);
    }
  }, []);

  const handleVarsClick = useCallback(() => {
    if (richHtmlAreaRef.current) {
      richHtmlAreaRef.current.focus();
    }
    setVariablesDialogOpen(true);
  }, []);

  const handleInsertVariable = useCallback((key) => {
    if (richHtmlAreaRef.current && key) {
      richHtmlAreaRef.current.insertText(`{{${key}}}`);
    }
    setVariablesDialogOpen(false);
    setSelectedVariable("");
  }, []);

  const handleVariableSelect = useCallback(
    (key) => {
      setSelectedVariable(key);
      handleInsertVariable(key);
    },
    [handleInsertVariable]
  );

  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 1,
        gap: 1
      }}
    >
      <VariableDialog
        open={variablesDialogOpen}
        onClose={() => {
          setVariablesDialogOpen(false);
          setSelectedVariable("");
        }}
        variableKeys={dummyVariables}
        onSave={handleVariableSelect}
      />

      <RichToolbar
        config={toolbarConfig}
        onBold={() => handleToolbarAction("bold")}
        onItalic={() => handleToolbarAction("italic")}
        onUnderline={() => handleToolbarAction("underline")}
        onStrike={() => handleToolbarAction("strikeThrough")}
        onLink={() => {
          const url = prompt("Enter the link URL:");
          if (url) handleToolbarAction("createLink", url);
        }}
        onUL={() => handleToolbarAction("insertUnorderedList")}
        onOL={() => handleToolbarAction("insertOrderedList")}
        onQuote={() => handleToolbarAction("formatBlock", "blockquote")}
        onLeft={() => handleToolbarAction("justifyLeft")}
        onCenter={() => handleToolbarAction("justifyCenter")}
        onRight={() => handleToolbarAction("justifyRight")}
        onVars={handleVarsClick}
      />

      {/* Now RichHtmlArea is *always* rich only */}
      <RichHtmlArea
        ref={richHtmlAreaRef}
        value={value}
        onChangeHtml={onChange}
      />

      <EditorAttachments
        attachments={attachments}
        setAttachments={onAttachmentsChange}
      />
    </Card>
  );
}
