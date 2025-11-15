import React from 'react';
import { useFieldArray, useFormContext, Controller } from 'react-hook-form';
import { nanoid } from 'nanoid';
import { WhatsAppRules } from '../../../config/whatsapp-rules';
import RichTextEditor from '../partials/RichTextEditor';
import {
    Box,
    Button,
    IconButton,
    Paper,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { Trash2 } from 'lucide-react';

const FormSection = ({ title, description, children }) => (
    <Paper variant="outlined">
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{title}</Typography>
            {description && <Typography variant="body2" color="text.secondary">{description}</Typography>}
        </Box>
        <Box sx={{ p: 2 }}>
            {children}
        </Box>
    </Paper>
);

export default function MessageTab({ waContext = 'template', channels }) {
    const { control, formState: { errors }, watch, getValues, setValue } = useFormContext();

    const nodeLabel = getValues('label');
    const isButtonsOrList = nodeLabel === 'Buttons' || nodeLabel === 'List';
    const isMessagingNode = getValues('type') === 'messaging';

    const { fields, append, remove } = useFieldArray({ control, name: 'quickReplies' });

    const qrCap = waContext === 'template'
        ? WhatsAppRules.template.quickReplyMax
        : WhatsAppRules.interactive.replyButtonsInSessionMax;

    const currentQr = watch('quickReplies') ?? [];
    const over = currentQr.length > qrCap;

    const attachments = watch('attachments');

    return (
        <Stack spacing={3} sx={{ p: 1 }}>
            {isMessagingNode && (
                <FormSection title="Message">
                    <Controller
                        name="content"
                        control={control}
                        render={({ field }) => (
                            <RichTextEditor
                                value={field.value}
                                onChange={field.onChange}
                                channel={channels?.[0]}
                                attachments={attachments}
                                onAttachmentsChange={(newAttachments) => setValue('attachments', newAttachments, { shouldDirty: true })}
                            />
                        )}
                    />
                </FormSection>
            )}

            {(isMessagingNode || isButtonsOrList) && (
                <FormSection
                    title="Quick Reply Buttons"
                    description={
                        <>
                            Add buttons to guide the user's response.
                            <Typography component="span" sx={{ display: 'block', mt: 1, fontSize: '0.75rem', fontWeight: 'bold', color: 'primary.main' }}>
                                {`WhatsApp Limit: ${qrCap} replies for ${waContext} context.`}
                            </Typography>
                        </>
                    }
                >
                    <Stack spacing={1}>
                        {fields.map((f, i) => (
                            <Stack direction="row" key={f.id} spacing={1} alignItems="flex-start">
                                <Controller
                                    name={`quickReplies.${i}.label`}
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            size="small"
                                            placeholder={`Button ${i + 1} label`}
                                            inputProps={{ maxLength: WhatsAppRules.template.quickReplyLabelMaxChars }}
                                            error={!!errors.quickReplies?.[i]?.label}
                                            helperText={errors.quickReplies?.[i]?.label?.message}
                                        />
                                    )}
                                />
                                <IconButton onClick={() => remove(i)} aria-label="Remove">
                                    <Trash2 size={16} />
                                </IconButton>
                            </Stack>
                        ))}
                    </Stack>
                    {over && <Typography color="error" variant="caption" sx={{ mt: 1 }}>Too many buttons. Remove {currentQr.length - qrCap}.</Typography>}

                    <Button
                        type="button"
                        variant="outlined"
                        size="small"
                        sx={{ mt: 2 }}
                        onClick={() => append({ id: nanoid(), label: '' })}
                        disabled={currentQr.length >= qrCap}
                    >
                        + Add Button
                    </Button>
                </FormSection>
            )}
        </Stack>
    );
}