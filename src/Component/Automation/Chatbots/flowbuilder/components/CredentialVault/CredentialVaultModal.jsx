import React, { useMemo, useState } from 'react';
import { useCredentialVault } from '../../cred/useCredentials.jsx';
import { useToast } from '../../hooks/use-toast.js';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
    CircularProgress
} from '@mui/material';

export default function CredentialVaultModal({ open, onClose }) {
    const { credentials, remove, create, rotate, resolve, canViewSecrets } = useCredentialVault();
    const [filter, setFilter] = useState('all');
    const [form, setForm] = useState({ mode: 'idle' });
    const [busy, setBusy] = useState(false);
    const { toast } = useToast();

    const items = useMemo(
        () => credentials.filter(c => filter === 'all' ? true : c.type === filter),
        [credentials, filter]
    );

    if (!open) return null;

    const onDelete = async (id) => {
        if (!window.confirm('Delete credential? This cannot be undone.')) return;
        setBusy(true); await remove(id); setBusy(false);
    };

    const onCopy = async (c) => {
        if (!canViewSecrets) return;
        const s = await resolve(c.id);
        let text = '';
        if (c.type === 'bearer') text = s.token;
        if (c.type === 'basic') text = `${s.username}:${s.password}`;
        if (c.type === 'apiKey') text = s.key;
        await navigator.clipboard.writeText(text);
        toast({ title: 'Copied to clipboard' });
    };

    const isFormOpen = form.mode !== 'idle';

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Credential Vault</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 2 }}>
                    <FormControl size="small" sx={{ minWidth: 180 }}>
                        <InputLabel>Filter by type</InputLabel>
                        <Select value={filter} label="Filter by type" onChange={(e) => setFilter(e.target.value)}>
                            <MenuItem value="all">All types</MenuItem>
                            <MenuItem value="bearer">Bearer</MenuItem>
                            <MenuItem value="basic">Basic</MenuItem>
                            <MenuItem value="apiKey">API Key</MenuItem>
                        </Select>
                    </FormControl>
                    <Box sx={{ flex: 1 }} />
                    <Button variant="contained" onClick={() => setForm({ mode: 'create', type: 'bearer' })}>+ New Credential</Button>
                </Box>

                <Box sx={{ py: 1 }}>
                    {items.length === 0 ? (
                        <Typography sx={{ color: 'text.secondary', p: 2, textAlign: 'center' }}>No credentials yet.</Typography>
                    ) : (
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Details</TableCell>
                                    <TableCell>Rotated</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((c) => (
                                    <TableRow key={c.id}>
                                        <TableCell sx={{ fontWeight: 700 }}>{c.name}</TableCell>
                                        <TableCell>{c.type}</TableCell>
                                        <TableCell sx={{ color: 'text.secondary' }}>
                                            {c.type === 'apiKey' ? `${c.apiKeyName} in ${c.apiKeyIn}` : '—'}
                                        </TableCell>
                                        <TableCell>{c.rotatedAt ? new Date(c.rotatedAt).toLocaleString() : '—'}</TableCell>
                                        <TableCell align="right" sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                                            {canViewSecrets && <Button size="small" variant="text" onClick={() => onCopy(c)}>Copy</Button>}
                                            <Button size="small" variant="text" onClick={() => setForm({ mode: 'rotate', id: c.id, type: c.type, name: c.name })}>Rotate</Button>
                                            <Button size="small" color="error" disabled={busy} onClick={() => onDelete(c.id)}>Delete</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </Box>

                {isFormOpen && (
                    <Dialog open={isFormOpen} onClose={() => setForm({ mode: 'idle' })} fullWidth maxWidth="sm">
                        {form.mode === 'create' &&
                            <CreateForm
                                type={form.type}
                                onCancel={() => setForm({ mode: 'idle' })}
                                onSubmit={async (payload) => { setBusy(true); await create(payload); setBusy(false); setForm({ mode: 'idle' }); }}
                            />
                        }
                        {form.mode === 'rotate' &&
                            <RotateForm
                                type={form.type}
                                name={form.name}
                                onCancel={() => setForm({ mode: 'idle' })}
                                onSubmit={async (secret) => { setBusy(true); await rotate(form.id, secret); setBusy(false); setForm({ mode: 'idle' }); }}
                            />
                        }
                    </Dialog>
                )}
            </DialogContent>
        </Dialog>
    );
}

function CreateForm({ type, onCancel, onSubmit }) {
    const [name, setName] = useState('');
    const [apiKeyName, setApiKeyName] = useState('x-api-key');
    const [apiKeyIn, setApiKeyIn] = useState('header');
    const [token, setToken] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [key, setKey] = useState('');

    const isSubmitDisabled = !name || (type === 'bearer' && !token) || (type === 'basic' && (!username || !password)) || (type === 'apiKey' && !key);

    const handleSubmit = () => {
        const payload = type === 'bearer' ? { type, name, secret: { token } } :
                        type === 'basic'  ? { type, name, secret: { username, password } } :
                                            { type, name, apiKeyName, apiKeyIn, secret: { key } };
        onSubmit(payload);
    };

    return (
        <>
            <DialogTitle>Create New {type} Credential</DialogTitle>
            <DialogContent sx={{ display: 'grid', gap: 1.5, p: 2 }}>
                <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Prod API Token" size="small" fullWidth />

                {type === 'bearer' && <TextField label="Bearer token" value={token} onChange={(e) => setToken(e.target.value)} multiline rows={3} fullWidth />}
                
                {type === 'basic' && (
                    <>
                        <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} size="small" fullWidth />
                        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} size="small" fullWidth />
                    </>
                )}

                {type === 'apiKey' && (
                    <>
                        <TextField label="Key" value={key} onChange={(e) => setKey(e.target.value)} size="small" fullWidth />
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <TextField label="Header name" value={apiKeyName} onChange={(e) => setApiKeyName(e.target.value)} size="small" fullWidth />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Send in</InputLabel>
                                    <Select value={apiKeyIn} label="Send in" onChange={(e) => setApiKeyIn(e.target.value)}>
                                        <MenuItem value="header">Header</MenuItem>
                                        <MenuItem value="query">Query</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={isSubmitDisabled}>Save</Button>
            </DialogActions>
        </>
    );
}

function RotateForm({ type, name, onCancel, onSubmit }) {
    const [token, setToken] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [key, setKey] = useState('');

    const isSubmitDisabled = (type === 'bearer' && !token) || (type === 'basic' && (!username || !password)) || (type === 'apiKey' && !key);

    const handleSubmit = () => {
        const secret = type === 'bearer' ? { token } : type === 'basic' ? { username, password } : { key };
        onSubmit(secret);
    };

    return (
        <>
            <DialogTitle>Rotate: <Typography component="span" sx={{ fontWeight: 'bold' }}>{name}</Typography> ({type})</DialogTitle>
            <DialogContent sx={{ display: 'grid', gap: 1.5, p: 2 }}>
                {type === 'bearer' && <TextField label="New token" value={token} onChange={(e) => setToken(e.target.value)} multiline rows={3} fullWidth />}
                {type === 'basic' && (
                    <>
                        <TextField label="New username" value={username} onChange={(e) => setUsername(e.target.value)} size="small" fullWidth />
                        <TextField label="New password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} size="small" fullWidth />
                    </>
                )}
                {type === 'apiKey' && <TextField label="New key" value={key} onChange={(e) => setKey(e.target.value)} size="small" fullWidth />}
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={isSubmitDisabled}>Rotate</Button>
            </DialogActions>
        </>
    );
}
