import React from "react";
import {
  TableRow,
  TableCell,
  Checkbox,
  Typography,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import ContactCells from "./ContactCells";

/**
 * Props:
 * - row: Contact
 * - columns: same shape as table columns
 * - selected: boolean
 * - onToggleSelect: () => void
 * - onClick: () => void  (row click opens Details)
 * - rightActions: ReactNode
 */
export default function ContactRow({
  row,
  columns,
  selected = false,
  onToggleSelect,
  onClick,
  rightActions = null,
}) {
  const theme = useTheme();

  return (
    <TableRow
      hover
      selected={selected}
      onClick={onClick}
      sx={{
        cursor: "pointer",
        "&:last-child td, &:last-child th": { border: 0 },
        // subtle purple hover
        "&:hover": {
          backgroundColor: alpha(theme.palette.primary.main, 0.03),
        },
        // selected row tint (reinforced by theme override)
        "&.Mui-selected": {
          backgroundColor: `${alpha(theme.palette.primary.main, 0.10)} !important`,
          "&:hover": {
            backgroundColor: `${alpha(theme.palette.primary.main, 0.14)} !important`,
          },
        },
        // left accent when selected
        ...(selected && {
          boxShadow: `inset 3px 0 0 0 ${theme.palette.primary.main}`,
        }),
        // focus ring when keyboard-focused
        "&.Mui-focusVisible": {
          outline: `2px solid ${alpha(theme.palette.primary.main, 0.5)}`,
          outlineOffset: -2,
        },
      }}
    >
      <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          size="small"
          color="primary"
          checked={selected}
          onChange={onToggleSelect}
          inputProps={{ "aria-label": "Select contact" }}
        />
      </TableCell>

      {columns.map((c) => (
        <TableCell key={c.key} sx={{ verticalAlign: "middle" }}>
          <Cell valueKey={c.key} row={row} />
        </TableCell>
      ))}

      <TableCell align="right" onClick={(e) => e.stopPropagation()}>
        {rightActions}
      </TableCell>
    </TableRow>
  );
}

/* --------------------------- cell resolver --------------------------- */
function Cell({ valueKey, row }) {
  switch (valueKey) {
    case "name":
      return (
        <ContactCells.Name
          value={row?.name}
          subtitle={row?.company}
          avatarName={row?.name}
        />
      );

    case "phone":
      return (
        <ContactCells.Phone
          value={row?.phone}
          whatsapp={row?.whatsapp}
          iso={row?.iso}
        />
      );

    case "email":
      return <ContactCells.Email value={row?.email} />;

    case "company":
      return <ContactCells.Text value={row?.company} mutedIfEmpty />;

    case "source":
      return <ContactCells.Source value={row?.source} origin={row?._origin} />;

    case "attributes":
      return <ContactCells.Attributes value={row?.attributes} />;

    default: {
      const v = row?.[valueKey];
      return (
        <Typography variant="body2" color={v ? "text.primary" : "text.secondary"}>
          {v || "—"}
        </Typography>
      );
    }
  }
}
