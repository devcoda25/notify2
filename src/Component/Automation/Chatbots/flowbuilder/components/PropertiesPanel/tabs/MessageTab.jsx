import React from 'react';
import { useFieldArray, useFormContext, Controller } from 'react-hook-form';
import styles from '../properties-panel.module.css';
import { WhatsAppRules } from '../../../config/whatsapp-rules';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Trash2 } from 'lucide-react';
import RichTextEditor from '../partials/RichTextEditor';
import { nanoid } from 'nanoid';

export default function MessageTab({ waContext = 'template', channels }) {
  const { register, control, formState: { errors }, watch, getValues, setValue } = useFormContext();

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
    <div className={styles.tabBody}>
      {isMessagingNode && (
        <Card>
          <CardHeader>
            <CardTitle>Message</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      )}

      {(isMessagingNode || isButtonsOrList) && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Reply Buttons</CardTitle>
            <CardDescription>
              Add buttons to guide the user's response.
              <span className="block mt-1 text-xs font-semibold text-primary">{`WhatsApp Limit: ${qrCap} replies for ${waContext} context.`}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className={styles.list}>
              {fields.map((f, i) => (
                <li key={f.id} className={styles.listItem}>
                  <Input
                    placeholder={`Button ${i + 1} label`}
                    {...register(`quickReplies.${i}.label`)}
                    maxLength={WhatsAppRules.template.quickReplyLabelMaxChars}
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)} aria-label="Remove">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  {Array.isArray(errors.quickReplies) && errors.quickReplies[i]?.label && (
                    <span className={styles.err}>{String(errors.quickReplies[i]?.label?.message)}</span>
                  )}
                </li>
              ))}
            </ul>
            {over && <div className={styles.warn}>Too many buttons. Remove {currentQr.length - qrCap}.</div>}

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append({ id: nanoid(), label: '' })}
              disabled={currentQr.length >= qrCap}
            >+ Add Button</Button>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
