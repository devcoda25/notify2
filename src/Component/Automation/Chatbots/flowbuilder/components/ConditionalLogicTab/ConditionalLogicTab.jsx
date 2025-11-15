import React, { useEffect, useMemo, useState } from 'react';
import { logicSchema } from './schema.js';
import { clampIndex, normalizeElse, uid } from './utils.js';
import BranchRow from './parts/BranchRow.jsx';
import SimulatorPanel from './parts/SimulatorPanel.jsx';
import ExpressionBuilder from '../ExpressionBuilder/ExpressionBuilder.jsx';
import {
    Box,
    Grid,
    Typography,
    Button,
    Paper,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    List,
    ListItem,
    ListItemIcon
} from '@mui/material';
import { AlertTriangle } from 'lucide-react';

const DEFAULT_BRANCH = () => ({
    id: uid(),
    label: 'Branch',
    condition: "country === 'US'",
    delay: { value: 0, unit: 'm' },
    target: '',
    isElse: false,
    disabled: false
});

const DEFAULT_ELSE = () => ({
    id: uid(),
    label: 'Otherwise',
    condition: 'true',
    delay: { value: 0, unit: 'm' },
    isElse: true,
    target: '',
    disabled: false
});

export default function ConditionalLogicTab({
    value,
    onChange,
    variables = [],
    branchTargets = [],
    initialTestContext,
    className
}) {
    const logic = useMemo(() => {
        const b = Array.isArray(value.branches) ? value.branches : [];
        return { expression: value.expression ?? '', branches: b.length ? b : [DEFAULT_BRANCH(), DEFAULT_ELSE()] };
    }, [value]);

    const [branches, setBranches] = useState(logic.branches);
    const [selectedId, setSelectedId] = useState(logic.branches[0]?.id);

    useEffect(() => {
        const [norm, changed] = normalizeElse(branches);
        if (changed) setBranches(norm);
    }, [branches]);

    useEffect(() => {
        onChange({ ...value, branches });
    }, [branches]);

    const selectedIdx = useMemo(() => branches.findIndex(b => b.id === selectedId), [branches, selectedId]);
    const selected = selectedIdx > -1 ? branches[selectedIdx] : undefined;

    function addBranch(kind) {
        setBranches((prev) => {
            const next = [...prev];
            if (kind === 'else') {
                if (!next.some(b => b.isElse)) {
                    next.push(DEFAULT_ELSE());
                }
            } else {
                const insertAt = Math.max(0, next.length - (next[next.length - 1]?.isElse ? 1 : 0));
                next.splice(insertAt, 0, DEFAULT_BRANCH());
            }
            return next;
        });
    }

    function updateBranch(idx, patch) {
        setBranches((prev) => prev.map((b, i) => i === idx ? { ...b, ...patch } : b));
    }

    function moveBranch(idx, dir) {
        setBranches((prev) => {
            const to = clampIndex(idx + dir, prev.length);
            if (to === idx || prev[idx].isElse || (prev[to]?.isElse && dir === 1)) return prev;
            const arr = [...prev];
            const [m] = arr.splice(idx, 1);
            arr.splice(to, 0, m);
            return arr;
        });
    }

    function removeBranch(idx) {
        setBranches((prev) => {
            const arr = prev.filter((_, i) => i !== idx);
            if (arr.length === 0) arr.push(DEFAULT_BRANCH());
            if (!arr.some(b => b.isElse)) arr.push(DEFAULT_ELSE());
            return arr;
        });
    }

    function duplicateBranch(idx) {
        setBranches((prev) => {
            const src = prev[idx];
            const dup = { ...src, id: uid(), label: `${src.label} (copy)` };
            const arr = [...prev];
            arr.splice(idx + 1, 0, dup);
            return arr;
        });
    }

    const problems = useMemo(() => {
        const issues = [];
        const parsed = logicSchema.safeParse({ expression: value.expression ?? '', branches });
        if (!parsed.success) {
            for (const err of parsed.error.issues) issues.push(`${err.path.join('.')} — ${err.message}`);
        }
        const elseCount = branches.filter(b => b.isElse).length;
        if (elseCount === 0) issues.push('Add a fallback ELSE branch.');
        if (elseCount > 1) issues.push('Only one ELSE branch is allowed.');
        let trueSeen = false;
        branches.forEach((b, i) => {
            if (trueSeen && !b.isElse) issues.push(`Branch #${i + 1} (${b.label}) may be unreachable.`);
            if (b.isElse || b.condition.trim() === 'true') trueSeen = true;
            if (!b.isElse && !b.condition.trim()) issues.push(`Branch #${i + 1} is missing a condition.`);
        });
        const labelSet = new Set();
        for (const b of branches) {
            if (labelSet.has(b.label)) { issues.push(`Duplicate branch label: "${b.label}".`); break; }
            labelSet.add(b.label);
        }
        return issues;
    }, [branches, value.expression]);

    return (
        <Grid container spacing={1.5}>
            <Grid item xs={12} md={5.5}>
                <Box sx={{ display: 'grid', alignContent: 'start', gap: 1.25 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6" sx={{ fontSize: 14, fontWeight: 700 }}>Branches</Typography>
                        <Box sx={{ display: 'inline-flex', gap: 0.75 }}>
                            <Button size="small" variant="outlined" onClick={() => addBranch('if')}>+ Add ELSE IF</Button>
                            <Button size="small" variant="outlined" onClick={() => addBranch('else')}>+ Add ELSE</Button>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'grid', gap: 0.75 }}>
                        {branches.map((b, i) => (
                            <BranchRow key={b.id} branch={b} idx={i} selected={selectedId === b.id} onSelect={() => setSelectedId(b.id)} onMoveUp={() => moveBranch(i, -1)} onMoveDown={() => moveBranch(i, 1)} onDuplicate={() => duplicateBranch(i)} onRemove={() => removeBranch(i)} onToggleDisabled={() => updateBranch(i, { disabled: !b.disabled })} />
                        ))}
                    </Box>

                    <Box sx={{ p: '6px 2px' }}>
                        {problems.length === 0 ? (
                            <Typography variant="caption" color="success.main">All good ✓</Typography>
                        ) : (
                            <List dense disablePadding aria-live="polite">
                                {problems.map((p, i) => (
                                    <ListItem key={i} disableGutters sx={{ color: 'error.main' }}>
                                        <ListItemIcon sx={{ minWidth: 20 }}><AlertTriangle size={14} color="inherit" /></ListItemIcon>
                                        <Typography variant="caption" color="inherit">{p}</Typography>
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Box>
                </Box>
            </Grid>

            <Grid item xs={12} md={6.5}>
                <Box sx={{ display: 'grid', alignContent: 'start', gap: 1.25 }}>
                    {!selected ? (
                        <Paper sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>Select a branch to edit.</Paper>
                    ) : (
                        <>
                            <Paper variant="outlined" sx={{ p: 1.25, display: 'grid', gap: 1 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label="Label" value={selected.label} onChange={(e) => updateBranch(selectedIdx, { label: e.target.value })} size="small" />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Delay before next</InputLabel>
                                            <Select value={selected.delay?.unit ?? 'm'} label="Delay before next" onChange={(e) => updateBranch(selectedIdx, { delay: { ...selected.delay, unit: e.target.value } })} startAdornment={<TextField type="number" min={0} value={selected.delay?.value ?? 0} onChange={(e) => updateBranch(selectedIdx, { delay: { ...selected.delay, value: Number(e.target.value) } })} size="small" sx={{ width: 80, mr: 1, '& input': { p: '8.5px 10px' } }} />}>
                                                <MenuItem value="s">Seconds</MenuItem>
                                                <MenuItem value="m">Minutes</MenuItem>
                                                <MenuItem value="h">Hours</MenuItem>
                                                <MenuItem value="d">Days</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    {branchTargets.length > 0 && (
                                        <Grid item xs={12}>
                                            <FormControl fullWidth size="small">
                                                <InputLabel>Route to</InputLabel>
                                                <Select value={selected.target ?? ''} label="Route to" onChange={(e) => updateBranch(selectedIdx, { target: e.target.value || undefined })}>
                                                    <MenuItem value=""><em>— default —</em></MenuItem>
                                                    {branchTargets.map(opt => <MenuItem key={opt.id} value={opt.id}>{opt.label}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    )}
                                </Grid>

                                {!selected.isElse && (
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ mt: 1, mb: 0.5, fontWeight: 700 }}>Condition</Typography>
                                        <ExpressionBuilder value={selected.condition} onChange={(next) => updateBranch(selectedIdx, { condition: next })} variables={variables} initialTestContext={initialTestContext} height={140} />
                                    </Box>
                                )}

                                {selected.isElse && (
                                    <Typography variant="body2" sx={{ color: 'text.secondary', p: 2, textAlign: 'center' }}>ELSE branch catches any unmatched case. No condition needed.</Typography>
                                )}
                            </Paper>

                            <Paper variant="outlined" sx={{ p: 1.25, display: 'grid', gap: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Simulator</Typography>
                                <SimulatorPanel branches={branches} initial={initialTestContext} onMatch={(i) => { if (i != null && branches[i]) setSelectedId(branches[i].id) }} />
                            </Paper>
                        </>
                    )}
                </Box>
            </Grid>
        </Grid>
    );
}