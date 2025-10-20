import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
  IconButton,
  Box,
  Paper,
  MenuItem,
  Select,
} from '@mui/material';
import { useForm, useFieldArray, FormProvider, Controller, useFormContext } from 'react-hook-form';
import { Delete as DeleteIcon } from '@mui/icons-material';

const OPERATORS = [
  'equals',
  'does not equal',
  'contains',
  'does not contain',
  'starts with',
  'ends with',
  'is empty',
  'is not empty',
];

export default function ConditionModal({ isOpen, onClose, onSave, initialData }) {
  const methods = useForm({
    defaultValues:
      initialData || {
        groups: [{ type: 'and', conditions: [{ variable: '', operator: 'equals', value: '' }] }],
      },
  });

  const { control, handleSubmit, reset } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'groups',
  });

  useEffect(() => {
    if (isOpen) {
      reset(
        initialData || {
          groups: [{ type: 'and', conditions: [{ variable: '', operator: 'equals', value: '' }] }],
        }
      );
    }
  }, [initialData, isOpen, reset]);

  const onSubmit = (data) => {
    onSave(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Set a Condition</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Define the logic to branch your flow. All conditions in a group must be true (AND). Create
          multiple groups for OR logic.
        </Typography>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              {fields.map((field, groupIndex) => (
                <Paper key={field.id} sx={{ p: 2 }} variant="outlined">
                  <ConditionGroupComponent groupIndex={groupIndex} />

                  {fields.length > 1 && (
                    <Button
                      type="button"
                      color="error"
                      variant="outlined"
                      size="small"
                      sx={{ mt: 2 }}
                      onClick={() => remove(groupIndex)}
                    >
                      Remove OR Group
                    </Button>
                  )}
                </Paper>
              ))}

              <Button
                type="button"
                variant="outlined"
                onClick={() =>
                  append({ type: 'and', conditions: [{ variable: '', operator: 'equals', value: '' }] })
                }
              >
                + Add OR condition group
              </Button>
            </Box>

            <DialogActions sx={{ mt: 3 }}>
              <Button onClick={onClose} color="inherit">
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Save
              </Button>
            </DialogActions>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

function ConditionGroupComponent({ groupIndex }) {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `groups.${groupIndex}.conditions`,
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {fields.map((field, index) => (
        <Box key={field.id} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {/* Variable */}
          <TextField
            {...register(`groups.${groupIndex}.conditions.${index}.variable`)}
            placeholder="Variable"
            size="small"
            fullWidth
          />

          {/* Operator */}
          <Controller
            control={control}
            name={`groups.${groupIndex}.conditions.${index}.operator`}
            render={({ field }) => (
              <Select {...field} size="small" fullWidth displayEmpty>
                {OPERATORS.map((op) => (
                  <MenuItem key={op} value={op}>
                    {op}
                  </MenuItem>
                ))}
              </Select>
            )}
          />

          {/* Value */}
          <TextField
            {...register(`groups.${groupIndex}.conditions.${index}.value`)}
            placeholder="Value"
            size="small"
            fullWidth
          />

          {/* Remove */}
          <IconButton
            onClick={() => remove(index)}
            disabled={fields.length <= 1}
            color="error"
            size="small"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}

      <Button
        type="button"
        variant="outlined"
        size="small"
        onClick={() => append({ variable: '', operator: 'equals', value: '' })}
      >
        + Add AND condition
      </Button>
    </Box>
  );
}
