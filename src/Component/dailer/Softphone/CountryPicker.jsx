import { useMemo, useState } from 'react';
import { Button, Menu, MenuItem, ListItemText, ListItemIcon } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';
import { flagFromISO, callingCode } from './phoneUtils';
import { getCountries } from 'libphonenumber-js/min';

export default function CountryPicker({ iso = 'UG', onChange }) {
  const [anchor, setAnchor] = useState(null);

  // Build once at mount
  const countries = useMemo(() => {
    try {
      const list = (getCountries() || []).map((c) => ({
        iso: c,
        cc: callingCode(c),
      }));
      return list.sort((a, b) => a.iso.localeCompare(b.iso));
    } catch {
      return [
        { iso: 'UG', cc: '256' }, { iso: 'KE', cc: '254' }, { iso: 'TZ', cc: '255' },
        { iso: 'RW', cc: '250' }, { iso: 'NG', cc: '234' }, { iso: 'ZA', cc: '27'  },
        { iso: 'US', cc: '1'   }, { iso: 'GB', cc: '44'  }, { iso: 'IN', cc: '91'  },
      ];
    }
  }, []);

  const current = countries.find(c => c.iso === iso) || { iso, cc: '' };

  return (
    <>
      <Button
        size="small"
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{
          px: 1.2, minWidth: 64,
          border: 'none', bgcolor: 'transparent',
          '&:hover': { bgcolor: 'action.hover' }
        }}
      >
        <span style={{ fontSize: 18, marginRight: 6 }}>{flagFromISO(current.iso)}</span>
        {current.iso}
        <ArrowDropDown sx={{ ml: 0.5 }} />
      </Button>

      <Menu
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        MenuListProps={{ dense: true }}
      >
        {countries.map((c) => (
          <MenuItem
            key={c.iso}
            onClick={() => {
              setAnchor(null);
              onChange?.(c);
            }}
          >
            <ListItemIcon sx={{ minWidth: 28 }}>
              <span style={{ fontSize: 18 }}>{flagFromISO(c.iso)}</span>
            </ListItemIcon>
            <ListItemText primary={`${c.iso}  (+${c.cc})`} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
