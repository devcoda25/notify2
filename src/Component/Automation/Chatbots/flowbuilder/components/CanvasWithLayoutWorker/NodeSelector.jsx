import React, { useMemo, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { SECTION_DATA } from '../SidebarPalette/sections-data.js';
import {
  TextField,
  IconButton,
  Box,
  Button,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import { X } from 'lucide-react';

export default function NodeSelector({ onSelect, onClose }) {
  const [search, setSearch] = useState('');

  const filteredItems = useMemo(() => {
    if (!search) return SECTION_DATA.flatMap((sec) => sec.items);
    const lowerSearch = search.toLowerCase();
    return SECTION_DATA.flatMap((sec) => sec.items).filter(
      (item) =>
        item.label.toLowerCase().includes(lowerSearch) ||
        item.description?.toLowerCase().includes(lowerSearch)
    );
  }, [search]);

  function toPayload(it) {
    return { key: it.key, label: it.label, icon: it.icon, type: it.type, color: it.color, description: it.description };
  }

  return (
    <Paper elevation={3} sx={{ width: 220, height: 250, display: 'flex', flexDirection: 'column', position: 'relative', borderRadius: 2 }}>
      {/* Close button */}
      <IconButton
  onClick={onClose}
  size="small"
  sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}
>
  <X size={16} style={{ pointerEvents: 'none' }} />
</IconButton>

      {/* Search input */}
      <Box sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <TextField
          placeholder="Search nodes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          fullWidth
          variant="outlined"
        />
      </Box>

      {/* Node list */}
      <Box sx={{ maxHeight: 300, overflowY: 'auto', p: 1 }}>
        <List disablePadding>
          {filteredItems.map((item) => {
            const Icon =
              typeof item.icon === 'string'
                ? LucideIcons[item.icon] ?? LucideIcons.HelpCircle
                : item.icon;

            return (
              <ListItemButton
                key={item.key}
                onClick={() => onSelect(toPayload(item))}
                sx={{ borderRadius: 1, mb: 0.5 }}
              >
                <ListItemIcon>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 1,
                      bgcolor: 'primary.light',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={20} />
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant="body2">{item.label}</Typography>}
                  secondary={<Typography variant="caption" color="text.secondary">{item.description}</Typography>}
                />
              </ListItemButton>
            );
          })}

          {filteredItems.length === 0 && (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No nodes found.
              </Typography>
            </Box>
          )}
        </List>
      </Box>
    </Paper>
  );
}
