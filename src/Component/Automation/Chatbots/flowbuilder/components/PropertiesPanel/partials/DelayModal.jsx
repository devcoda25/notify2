import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  FormLabel,
} from "@mui/material";
import { useForm, Controller, FormProvider } from "react-hook-form";

export default function DelayModal({ isOpen, onClose, onSave, initialData }) {
  const methods = useForm({
    defaultValues: initialData || { mode: "delay", delayMinutes: 5 },
  });

  const { control, handleSubmit, watch, reset } = methods;
  const mode = watch("mode");

  useEffect(() => {
    if (isOpen) {
      reset(initialData || { mode: "delay", delayMinutes: 5 });
    }
  }, [initialData, isOpen, reset]);

  const onSubmit = (data) => {
    onSave(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Configure Delay</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Pause the flow for a specific duration or until a set date and time.
        </DialogContentText>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: "1rem" }}>
            {/* Radio Selection */}
            <FormLabel component="legend">Mode</FormLabel>
            <Controller
              name="mode"
              control={control}
              render={({ field }) => (
                <RadioGroup row {...field}>
                  <FormControlLabel value="delay" control={<Radio />} label="Delay" />
                  <FormControlLabel
                    value="datetime"
                    control={<Radio />}
                    label="Specific Time"
                  />
                </RadioGroup>
              )}
            />

            {/* Delay in minutes */}
            {mode === "delay" ? (
              <Controller
                name="delayMinutes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Delay in minutes"
                    type="number"
                    fullWidth
                    margin="normal"
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                  />
                )}
              />
            ) : (
              // DateTime picker
              <Controller
                name="runAt"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Date and Time"
                    type="datetime-local"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            )}

            <DialogActions>
              <Button onClick={onClose} color="secondary">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
            </DialogActions>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
