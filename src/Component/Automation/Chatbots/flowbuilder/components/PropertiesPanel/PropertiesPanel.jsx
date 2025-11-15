import React, { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDebouncedCallback } from './utils/useDebouncedCallback';
import { useKeybind } from './utils/useKeybind';

import {
    Box,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Tab,
    Tabs,
    Typography
} from '@mui/material';
import { X, AlertTriangle } from 'lucide-react';

import { generalSchema, messageSchema, apiSchema, logicSchema, scheduleSchema, campaignSchema, aiSchema, handoffSchema, analyticsSchema, subflowSchema, googleSheetsSchema } from './schemas';
import GeneralTab from './tabs/GeneralTab';
import MessageTab from './tabs/MessageTab';
import APITab from './tabs/APITab';
import LogicTab from './tabs/LogicTab';
import ScheduleTab from './tabs/ScheduleTab';
import CampaignTab from './tabs/CampaignTab';
import AITab from './tabs/AITab';
import HandoffTab from './tabs/HandoffTab';
import AnalyticsTab from './tabs/AnalyticsTab';
import SubflowTab from './tabs/SubflowTab';
import GoogleSheetsTab from './tabs/GoogleSheetsTab';

const TAB_KEYS = [
    'general', 'message', 'api', 'logic', 'schedule', 'campaign', 'ai', 'handoff', 'analytics', 'subflow', 'googleSheets'
];

const TAB_LABEL = {
    general: 'General', message: 'Message', api: 'API/Webhook', logic: 'Logic',
    schedule: 'Schedule', campaign: 'Campaign', ai: 'AI Assist', handoff: 'Handoff',
    analytics: 'Analytics', subflow: 'Sub‑flow', googleSheets: 'Google Sheets'
};

const TABS_BY_TYPE = {
    triggers: ['general', 'schedule'],
    messaging: ['general', 'message', 'schedule'],
    inputs: ['general', 'message', 'schedule'],
    logic: ['general', 'logic', 'schedule'],
    integrations: ['general', 'api', 'googleSheets', 'schedule'],
    handoff: ['general', 'handoff', 'schedule'],
    end: ['general', 'analytics'],
};

const drawerWidth = 420;

export default function PropertiesPanel({
    node,
    onSave,
    onClose,
    waContext = 'template',
    channels,
    open
}) {
    const visible = !!node && (open ?? true);
    const [activeTab, setActiveTab] = useState('general');

    const schema = useMemo(() => {
        switch (activeTab) {
            case 'general': return generalSchema;
            case 'message': return messageSchema(waContext);
            case 'api': return apiSchema;
            case 'logic': return logicSchema;
            case 'schedule': return scheduleSchema;
            case 'campaign': return campaignSchema;
            case 'ai': return aiSchema;
            case 'handoff': return handoffSchema;
            case 'analytics': return analyticsSchema;
            case 'subflow': return subflowSchema;
            case 'googleSheets': return googleSheetsSchema;
            default: return generalSchema;
        }
    }, [activeTab, waContext]);

    const methods = useForm({
        resolver: zodResolver(schema),
        defaultValues: node?.data || {},
        mode: 'onChange'
    });

    useEffect(() => {
        methods.reset(node?.data || {});
        setActiveTab('general'); // Reset to general tab when node changes
    }, [node?.id]);

    useKeybind('Escape', (e) => { if (visible) { e.preventDefault(); onClose() } });

    const debouncedSave = useDebouncedCallback((vals) => {
        if (!node) return;
        onSave(node.id, vals);
    }, 400);

    useEffect(() => {
        const sub = methods.watch((vals) => debouncedSave(vals));
        return () => sub.unsubscribe();
    }, [methods, debouncedSave]);

    const availableTabs = useMemo(() => {
        if (!node) return [];
        const nodeType = node.data?.type;
        if (!nodeType) return TAB_KEYS;
        if (node.data.label === 'Google Sheets') return ['general', 'googleSheets', 'schedule'];
        if (node.data.label === 'Set a Condition') return ['general', 'logic', 'schedule'];
        if (node.data.type === 'integrations' && node.data.label !== 'Google Sheets') return ['general', 'api', 'schedule'];
        return TABS_BY_TYPE[nodeType] || TAB_KEYS;
    }, [node]);

    const TabComponent = useMemo(() => ({
        general: GeneralTab,
        message: () => <MessageTab waContext={waContext} channels={channels} />,
        api: APITab,
        logic: LogicTab,
        schedule: ScheduleTab,
        campaign: CampaignTab,
        ai: AITab,
        handoff: HandoffTab,
        analytics: AnalyticsTab,
        subflow: SubflowTab,
        googleSheets: GoogleSheetsTab,
    }[activeTab]), [activeTab, waContext, channels]);

    return (
        <Drawer
            open={visible}
            onClose={onClose}
            anchor="right"
            variant="persistent"
            PaperProps={{
                sx: {
                    width: drawerWidth,
                    maxWidth: '92vw',
                    boxShadow: -5,
                    display: 'grid',
                    gridTemplateRows: 'auto auto 1fr auto',
                    // ProseMirror global styles
                    '& .ProseMirror': { outline: 'none', caretColor: 'currentColor' },
                    '& .ProseMirror ul, & .ProseMirror ol': { paddingInlineStart: '1.5rem', listStyle: 'revert' },
                }
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '10px 12px', borderBottom: 1, borderColor: 'divider' }}>
                <Box>
                    <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 700 }}>Node Properties</Typography>
                    <Typography variant="body2" color="text.secondary">{node?.data?.label ?? node?.id}</Typography>
                </Box>
                <IconButton onClick={onClose} aria-label="Close properties"><X size={20} /></IconButton>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile>
                    {availableTabs.map((k) => (
                        <Tab key={k} label={TAB_LABEL[k]} value={k} sx={{ textTransform: 'none' }} />
                    ))}
                </Tabs>
            </Box>

            <Box sx={{ overflow: 'auto', p: 2 }}>
                <FormProvider {...methods}>
                    <TabComponent />
                </FormProvider>
            </Box>

            <Paper elevation={2} square sx={{ p: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.25 }}>
                <ValidationSummary errors={methods.formState.errors} />
                <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>Changes autosave</Typography>
            </Paper>
        </Drawer>
    );
}

function ValidationSummary({ errors }) {
    const list = Object.entries(errors).map(([k, v]) => ({ field: k, msg: v?.message || 'Invalid value' }));

    if (list.length === 0) return <Typography variant="caption" color="success.main">All good ✓</Typography>;
    
    return (
        <List dense disablePadding aria-live="polite">
            {list.slice(0, 2).map((e) => (
                <ListItem key={e.field} disableGutters sx={{ color: 'error.main' }}>
                    <ListItemIcon sx={{ minWidth: 20 }}><AlertTriangle size={14} /></ListItemIcon>
                    <ListItemText primary={`${e.field}: ${String(e.msg)}`} primaryTypographyProps={{ variant: 'caption' }} />
                </ListItem>
            ))}
            {list.length > 2 && <ListItem disableGutters sx={{ color: 'error.main' }}><Typography variant="caption">...and {list.length - 2} more issues</Typography></ListItem>}
        </List>
    );
}