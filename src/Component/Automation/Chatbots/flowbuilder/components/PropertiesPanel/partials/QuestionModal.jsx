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

// Lazy load editor
const RichTextEditor = lazy(() => import("./RichTextEditor"));

export default function QuestionModal({ isOpen, onClose, nodeId }) {
  const { getNode, updateNodeData } = useFlowStore((state) => ({
    getNode: (id) => state.nodes.find((n) => n.id === id),
    updateNodeData: state.updateNodeData,
  }));

  const node = getNode(nodeId);

  const methods = useForm({
    defaultValues: React.useMemo(() => {
      const data = node?.data || {};
      return {
        content: data.content || "",
        answerVariants: data.answerVariants || [],
        acceptMedia: data.acceptMedia || false,
        variableName: data.variableName || "@value",
        advancedOptions: data.advancedOptions || false,
        parts: data.parts || [],
      };
    }, [node?.data]),
  });

  const { control, handleSubmit, register, reset, setValue, getValues } = methods;
  const { fields, append, remove } = useFieldArray({ control, name: "answerVariants" });

  const modalRef = useRef(null);

  const handleAddMedia = (type, media) => {
    if (!media) return;
    const currentParts = getValues("parts") || [];
    setValue("parts", [
      ...currentParts,
      { id: nanoid(), type, url: media.url, name: media.name },
    ]);
  };

  useEffect(() => {
    if (isOpen && node) {
      const data = node.data || {};
      reset({
        content: data.content || "",
        answerVariants: data.answerVariants || [],
        acceptMedia: data.acceptMedia || false,
        variableName: data.variableName || "@value",
        advancedOptions: data.advancedOptions || false,
        parts: data.parts || [],
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
          <DialogTitle>Ask a Question</DialogTitle>
          <DialogContent dividers ref={modalRef}>
            <DialogContentText>
              Ask an open-ended question and save the user's reply.
            </DialogContentText>

            <Box mt={2}>
              <Typography variant="subtitle2">Question Text</Typography>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <Suspense fallback={<Box p={2}>Loading editor...</Box>}>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Ask a question here"
                      variables={["name", "email", "order_id"]}
                      modalRef={modalRef}
                      onAddMedia={handleAddMedia}
                    />
                  </Suspense>
                )}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="subtitle2">Answer Variants (optional)</Typography>
              <Typography variant="body2" color="textSecondary">
                Add expected variations of an answer, like "Hi" or "Hello".
              </Typography>
              {fields.map((field, index) => (
                <Box key={field.id} display="flex" alignItems="center" mt={1} gap={1}>
                  <Controller
                    name={`answerVariants.${index}.value`}
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} placeholder="e.g. Yes" fullWidth size="small" />
                    )}
                  />
                  <IconButton onClick={() => remove(index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                onClick={() => append({ value: "" })}
                variant="outlined"
                size="small"
                sx={{ mt: 1 }}
              >
                + Add Variant
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            <FormControlLabel
              control={
                <Controller
                  name="acceptMedia"
                  control={control}
                  render={({ field }) => (
                    <Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                  )}
                />
              }
              label="Accept a media response"
            />

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="subtitle2">Save Answer In Variable</Typography>
              <TextField
                {...register("variableName")}
                placeholder="@value"
                fullWidth
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <FormControlLabel
              control={
                <Controller
                  name="advancedOptions"
                  control={control}
                  render={({ field }) => (
                    <Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                  )}
                />
              }
              label="Advanced options"
            />
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
