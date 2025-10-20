import React, { lazy, Suspense, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  TextField,
  Switch,
  Divider,
  Box,
  IconButton,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { useForm, FormProvider, Controller, useFieldArray } from "react-hook-form";
import { nanoid } from "nanoid";
import { useFlowStore } from "../../../store/flow";

const RichTextEditor = lazy(() => import("./RichTextEditor"));

const MAX_BUTTONS = 10;

export default function ButtonsModal({ isOpen, onClose, nodeId }) {
  const { getNode, updateNodeData } = useFlowStore((state) => ({
    getNode: (id) => state.nodes.find((n) => n.id === id),
    updateNodeData: state.updateNodeData,
  }));

  const node = getNode(nodeId);

  const methods = useForm({
    defaultValues: React.useMemo(() => {
      const data = node?.data || {};
      return {
        content: data.content || "Ask a question here",
        quickReplies:
          data.quickReplies && data.quickReplies.length > 0
            ? data.quickReplies
            : [{ id: nanoid(), label: "Answer 1" }],
        parts: data.parts || [],
        headerText: data.headerText || "",
        footerText: data.footerText || "",
        variableName: data.variableName || "@value",
        mediaHeader: data.mediaHeader || false,
      };
    }, [node?.data]),
  });

  const { control, handleSubmit, register, reset } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "quickReplies",
  });

  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && node) {
      const data = node.data || {};
      reset({
        content: data.content || "Ask a question here",
        quickReplies:
          data.quickReplies && data.quickReplies.length > 0
            ? data.quickReplies
            : [{ id: nanoid(), label: "Answer 1" }],
        parts: data.parts || [],
        headerText: data.headerText || "",
        footerText: data.footerText || "",
        variableName: data.variableName || "@value",
        mediaHeader: data.mediaHeader || false,
      });
    }
  }, [node, isOpen, reset]);

  const onSubmit = (data) => {
    updateNodeData(nodeId, data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Configure Buttons</DialogTitle>
          <DialogContent dividers ref={modalRef}>
            <DialogContentText>
              Configure quick-reply buttons for your question.
            </DialogContentText>

            {/* Media Header Toggle */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
              <Typography variant="subtitle2">Media Header</Typography>
              <Controller
                name="mediaHeader"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Body Text */}
            <Box>
              <Typography variant="subtitle2">
                Body Text <span style={{ color: "#888" }}>(required, max 1024 chars)</span>
              </Typography>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <Suspense fallback={<Box p={2}>Loading editor...</Box>}>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Type your message here..."
                      variables={["name", "email", "order_id"]}
                      modalRef={modalRef}
                    />
                  </Suspense>
                )}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Footer Text */}
            <Box>
              <Typography variant="subtitle2">
                Footer Text <span style={{ color: "#888" }}>(optional, max 60 chars)</span>
              </Typography>
              <TextField
                {...register("footerText")}
                placeholder="E.g. Reply to this message"
                fullWidth
                size="small"
                sx={{ mt: 1, maxWidth: 400 }}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Buttons */}
            <Box>
              <Typography variant="subtitle2">Buttons</Typography>
              {fields.map((field, index) => (
                <Box key={field.id} display="flex" alignItems="center" gap={1} mt={1}>
                  <TextField
                    {...register(`quickReplies.${index}.label`)}
                    placeholder={`Button ${index + 1}`}
                    fullWidth
                    size="small"
                  />
                  <IconButton onClick={() => remove(index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}

              {fields.length < MAX_BUTTONS && (
                <Button
                  type="button"
                  variant="outlined"
                  size="small"
                  onClick={() => append({ id: nanoid(), label: "" })}
                  sx={{ mt: 1 }}
                >
                  + Add Button
                </Button>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Save Answer Variable */}
            <Box>
              <Typography variant="subtitle2">Save Answer In Variable</Typography>
              <TextField
                {...register("variableName")}
                placeholder="@value"
                fullWidth
                size="small"
                sx={{ mt: 1, maxWidth: 300 }}
              />
            </Box>
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose} variant="text">Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
}
