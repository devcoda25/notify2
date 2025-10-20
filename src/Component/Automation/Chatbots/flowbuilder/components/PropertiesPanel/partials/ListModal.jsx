import React, { lazy, Suspense } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
  Box,
  Paper,
} from '@mui/material';
import { useForm, useFieldArray, FormProvider, Controller, useFormContext } from 'react-hook-form';
import { nanoid } from 'nanoid';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useFlowStore } from '../../../store/flow';

const RichTextEditor = lazy(() => import('./RichTextEditor'));

const defaultSection = () => ({
  id: nanoid(),
  title: 'Section 1',
  items: [{ id: nanoid(), title: 'List item 1', description: 'Item description' }],
});

const defaultItem = () => ({
  id: nanoid(),
  title: '',
  description: '',
});

export default function ListModal({ isOpen, onClose, nodeId }) {
  const { getNode, updateNodeData } = useFlowStore((state) => ({
    getNode: (id) => state.nodes.find((n) => n.id === id),
    updateNodeData: state.updateNodeData,
  }));

  const node = getNode(nodeId);

  const methods = useForm({
    defaultValues: React.useMemo(() => {
      const listData = node?.data.list || {};
      const content = node?.data.content || 'Select an option';
      return {
        content,
        buttonText: listData.buttonText || 'Menu',
        sections: listData.sections && listData.sections.length > 0 ? listData.sections : [defaultSection()],
        footerText: listData.footerText || '',
        variableName: listData.variableName || '@value',
        parts: node?.data.parts || [],
      };
    }, [node?.data]),
  });

  const { reset, control, handleSubmit, register, setValue, getValues } = methods;

  const modalRef = React.useRef(null);

  React.useEffect(() => {
    if (isOpen && node) {
      const listData = node.data.list || {};
      const content = node.data.content || 'Select an option';
      reset({
        content,
        buttonText: listData.buttonText || 'Menu',
        sections: listData.sections && listData.sections.length > 0 ? listData.sections : [defaultSection()],
        footerText: listData.footerText || '',
        variableName: listData.variableName || '@value',
        parts: node.data.parts || [],
      });
    }
  }, [node, isOpen, reset]);

  const onSubmit = (data) => {
    updateNodeData(nodeId, { list: data, content: data.content, parts: data.parts });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Configure List Message</DialogTitle>
      <DialogContent dividers ref={modalRef}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Create a list of options for the user to choose from.
        </Typography>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
              {/* Body Text */}
              <div>
                <Typography variant="subtitle2">Body Text (required, max 1024 chars)</Typography>
                <Controller
                  name="content"
                  control={control}
                  render={({ field }) => (
                    <Suspense fallback={<Paper sx={{ minHeight: 120, p: 2 }}>Loading editor...</Paper>}>
                      <RichTextEditor
                        value={field.value || ''}
                        onChange={field.onChange}
                        variables={['name', 'email', 'order_id']}
                        modalRef={modalRef}
                      />
                    </Suspense>
                  )}
                />
              </div>

              {/* Footer */}
              <TextField
                {...register('footerText')}
                label="Footer Text (optional, max 60 chars)"
                placeholder="e.g. Required"
                fullWidth
                size="small"
              />

              {/* Button Text */}
              <TextField
                {...register('buttonText')}
                label="Button Text (required, max 20 chars)"
                placeholder="Menu"
                fullWidth
                size="small"
              />

              <SectionsArray />

              {/* Variable name */}
              <TextField
                {...register('variableName')}
                label="Save Answer In Variable"
                placeholder="@value"
                fullWidth
                size="small"
              />
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

function SectionsArray() {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sections',
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
      <Typography variant="subtitle2">Sections</Typography>
      {fields.map((field, index) => (
        <Paper key={field.id} sx={{ p: 2 }} variant="outlined">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2">Section {index + 1} Title</Typography>
            <IconButton
              onClick={() => remove(index)}
              disabled={fields.length <= 1}
              color="error"
              size="small"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
          <TextField
            {...register(`sections.${index}.title`)}
            placeholder="Section Title"
            fullWidth
            size="small"
            sx={{ mt: 1 }}
          />
          <ItemsArray sectionIndex={index} />
        </Paper>
      ))}
      <Button variant="outlined" onClick={() => append(defaultSection())}>
        + Add Section
      </Button>
    </Box>
  );
}

function ItemsArray({ sectionIndex }) {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.items`,
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
      {fields.map((field, index) => (
        <Paper key={field.id} sx={{ p: 2 }} variant="outlined">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2">Item {index + 1} Title</Typography>
            <IconButton
              onClick={() => remove(index)}
              disabled={fields.length <= 1}
              color="error"
              size="small"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
          <TextField
            {...register(`sections.${sectionIndex}.items.${index}.title`)}
            placeholder="Item title"
            fullWidth
            size="small"
            sx={{ mt: 1 }}
          />
          <TextField
            {...register(`sections.${sectionIndex}.items.${index}.description`)}
            placeholder="Item description"
            label="Description (optional, max 72 chars)"
            fullWidth
            size="small"
            sx={{ mt: 2 }}
          />
        </Paper>
      ))}
      <Button variant="outlined" size="small" onClick={() => append(defaultItem())}>
        + Add Item
      </Button>
    </Box>
  );
}
