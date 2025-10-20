// /src/Component/dailer/DialerLogPanel.jsx
import { Card, CardContent, Stack, Typography, Divider, Box } from '@mui/material';
import { useDialerStore } from '../store/useDialerStore';
import { hoverScroll } from '../hoverScroll'; // ⬅️ import reusable style

export default function DialerLogPanel({ height = 700, sx = {} }) {
  const log = useDialerStore((s) => s.log);

  return (
    <Card
      sx={{
        m: 0,
        height,                 // fixed height
        minHeight: height,
        maxHeight: height,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        ...sx,
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
          p: 1,
        }}
      >
        <Stack spacing={0.5} sx={{ flexShrink: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Activity Log
          </Typography>
          <Divider />
        </Stack>

        {/* Scroller fills remaining height, never grows the card */}
        <Box
          tabIndex={0}                 // ⬅️ enables focus to reveal scrollbar
          sx={{
            flex: 1,
            minHeight: 0,
            pr: 1,
            mt: 0.5,
            ...hoverScroll,           // ⬅️ hide scrollbar until hover/focus
          }}
        >
          {log.length === 0 ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                No activity yet.
              </Typography>
            </Box>
          ) : (
            log.map((e, i) => (
              <Stack key={i} direction="row" spacing={0.75} sx={{ py: 0.5 }}>
                <Typography
                  variant="caption"
                  sx={{ minWidth: 76, color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}
                >
                  {new Date(e.t).toLocaleTimeString()}
                </Typography>
                <Typography variant="body2">
                  {e.src && <strong style={{ marginRight: 6 }}>[{String(e.src).toUpperCase()}]</strong>}
                  {e.msg}
                </Typography>
              </Stack>
            ))
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
