// Path: src/Component/templates/utils/UsedInPanel.jsx
import React from "react";
import {
  Paper,
  Stack,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
  Workflow,
  Rocket,
  Beaker,
  Link2,
} from "lucide-react";

/**
 * references: Array<{ type: 'campaign'|'flow'|'journey'|'test', id, name, link?, lastUsedAt? }>
 */
export default function UsedInPanel({ references = [] }) {
  const groups = React.useMemo(() => {
    const g = {};
    for (const r of references) {
      g[r.type] = g[r.type] || [];
      g[r.type].push(r);
    }
    return g;
  }, [references]);

  const IconFor = (type) => {
    if (type === "flow" || type === "journey") return Workflow;
    if (type === "campaign") return Rocket;
    if (type === "test") return Beaker;
    return Link2;
  };

  const order = ["campaign", "flow", "journey", "test"];

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2 }}>
      <Stack spacing={1.25} sx={{ p: 1.25 }}>
        <Typography variant="subtitle2">Used In</Typography>

        {!references?.length && (
          <Typography variant="body2" color="text.secondary">
            Not referenced by any flows, campaigns, or tests.
          </Typography>
        )}

        {order.map((k) => {
          const arr = groups[k] || [];
          if (!arr.length) return null;
          const Icon = IconFor(k);
          return (
            <Stack key={k} sx={{ mt: 0.5 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                <Icon size={16} />
                <Typography variant="caption" sx={{ textTransform: "capitalize" }}>
                  {k}
                </Typography>
                <Chip size="small" label={arr.length} />
              </Stack>
              <List dense sx={{ pt: 0 }}>
                {arr.map((r) => (
                  <ListItem
                    key={`${k}-${r.id}`}
                    secondaryAction={
                      r.link && (
                        <Tooltip title="Open">
                          <IconButton edge="end" size="small" onClick={() => window.open(r.link, "_blank")}>
                            <Link2 size={16} />
                          </IconButton>
                        </Tooltip>
                      )
                    }
                  >
                    <ListItemText
                      primary={r.name || r.id}
                      secondary={
                        r.lastUsedAt
                          ? `Last used: ${new Date(r.lastUsedAt).toLocaleString()}`
                          : undefined
                      }
                    />
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ my: 0.5 }} />
            </Stack>
          );
        })}
      </Stack>
    </Paper>
  );
}
