import React, { useMemo, useState } from 'react';
import {
    Box,
    Button,
    List,
    ListItemButton,
    Popover,
    TextField,
    Typography
} from '@mui/material';

export default function VariableChipAutocomplete({
    variables = [],
    onInsert,
    label = 'Insert variable'
}) {
    const [q, setQ] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);

    const list = useMemo(
        () => variables.filter(v => v.toLowerCase().includes(q.toLowerCase())).slice(0, 8),
        [variables, q]
    );

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleInsert = (v) => {
        onInsert(v);
        handleClose();
    };

    const open = Boolean(anchorEl);
    const isVariableButton = label === 'Variables';

    return (
        <>
            {isVariableButton ? (
                <Button
                    variant="contained"
                    size="small"
                    onClick={handleClick}
                    sx={{ backgroundColor: '#16a34a', '&:hover': { backgroundColor: '#15803d' } }}
                >
                    {label}
                </Button>
            ) : (
                <Button variant="text" onClick={handleClick} title={label} sx={{ minWidth: 'auto', p: 1}}>
                    <Typography component="span" sx={{ fontFamily: 'monospace', fontSize: 16, lineHeight: 1 }}>{`{{}}`}</Typography>
                </Button>
            )}
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Box sx={{ width: 240 }}>
                    <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
                        <TextField
                            fullWidth
                            size="small"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Search variables…"
                            variant="outlined"
                        />
                    </Box>
                    <List dense sx={{ maxHeight: 200, overflowY: 'auto', p: 0.5 }}>
                        {list.length > 0 ? list.map(v => (
                            <ListItemButton key={v} onClick={() => handleInsert(v)} sx={{ borderRadius: 1, fontSize: 13 }}>
                                {v}
                            </ListItemButton>
                        )) : (
                            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', p: 2, color: 'text.secondary' }}>
                                No matches
                            </Typography>
                        )}
                    </List>
                </Box>
            </Popover>
        </>
    );
}