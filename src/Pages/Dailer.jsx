// /src/pages/DailerPage.jsx
import { ThemeProvider, CssBaseline, Container, Stack, Box } from '@mui/material';
import { dialerTheme } from '../theme/dialerTheme';
import {
  AgentProfileCard,
  ServiceEngagementCard,
  DialerLogPanel,
  NextCallCard,
} from '../Component/dailer';
import SoftphoneCard from '../Component/dailer/Softphone/SoftphoneCard';
import { useEffect } from 'react';
import { useDialerStore } from '../Component/dailer/store/useDialerStore';
import { DialingPlanPanel } from '../Component/dailer/dialingPlan';
import LeftNav from '../Component/dailer/LeftNav';

export default function DailerPage() {
  const setCurrentLead = useDialerStore((s) => s.setCurrentLead);

  useEffect(() => {
    setCurrentLead({
      name: 'John Doe',
      phone: '+256 781 234 567',
      leadId: 'LD-00123',
      language: 'EN',
    });
  }, [setCurrentLead]);

  // integers only
  const RIGHT_SPACING = 16;
  const COL_GAP = 10;
  const ROW_GAP = 10;

  // column widths
  const LEFT_RAIL = 360;
  const RIGHT_RAIL = 420;

  return (
    <ThemeProvider theme={dialerTheme}>
      <CssBaseline />
      <Container maxWidth={false} disableGutters sx={{ py: 1 }}>
        {/* fixed left navigation */}
        <LeftNav />

        {/* content starts to the right of the nav */}
        <Box
          sx={{
            width: '100vw',
            boxSizing: 'border-box',
            pl: 'var(--nav-w, 230px)',
            pr: `${RIGHT_SPACING}px`,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${ROW_GAP}px` }}>

            {/* ===== TOP ROW (Dialing Plan FIRST) ===== */}
            <Box
              sx={{
                display: { xs: 'block', md: 'grid' },
                gridTemplateColumns: { md: `${LEFT_RAIL}px minmax(0, 1fr) ${RIGHT_RAIL}px` },
                columnGap: { md: `${COL_GAP}px` },
                width: '100%',
                pl: 1,
                minWidth: 0,
              }}
            >
              <Box sx={{ gridColumn: { md: '1 / span 3' }, width: '100%', minWidth: 0 }}>
                {/* wrapper guarantees height and lets child fill */}
                <Box
                  sx={{
                    height: 600,
                    display: 'flex',
                    flexDirection: 'column',
                    '& > *': { flex: 1, minHeight: 0 },
                    mb: 0,
                  }}
                >
                  <DialingPlanPanel />
                </Box>
              </Box>
            </Box>

            {/* ===== BOTTOM ROW (Grid layout) — GROWS WITH CONTENT ===== */}
            <Box
              sx={{
                display: { xs: 'block', md: 'grid' },
                gridTemplateColumns: { md: `${LEFT_RAIL}px minmax(0, 1fr) ${RIGHT_RAIL}px` },
                columnGap: { md: '2px' },            // tighter horizontal spacing
                alignItems: { md: 'stretch' },
                width: '100%',
                minWidth: 0,
                // ⬇️ allow the row to expand so right-rail cards push each other instead of overlapping
                minHeight: 850,
              }}
            >
              {/* LEFT column: NextCall (auto/max) + Log (fills), tiny gap */}
              <Box
                sx={{
                  width: '100%',
                  maxWidth: '100%',
                  minWidth: 0,
                  p: 1,
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  gap: 1,
                  '& .MuiCard-root': { m: 0, width: '100%' },
                }}
              >
                {/* NextCall — content height with cap; card fills; keep shadow visible */}
                <Box
                  sx={{
                    flex: '0 0 auto',
                    maxHeight: 320,        // tune 260–360
                    minHeight: 250,
                    pb: 1,                 // breathing room for bottom shadow
                    '& > *': {
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      minHeight: 0,
                      boxSizing: 'border-box',
                    },
                    '& .MuiCardContent-root': {
                      flex: 1,
                      minHeight: 0,
                      overflow: 'auto',
                      p: 1,
                    },
                  }}
                >
                  <NextCallCard />
                </Box>

                {/* Log — fills remaining space; content scrolls; shadow visible */}
                <Box
                  sx={{
                    flex: '1 1 auto',
                    minHeight: 0,
                    '& > *': {
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                      minHeight: 0,
                      boxSizing: 'border-box',
                    },
                    '& .MuiCardContent-root': {
                      flex: 1,
                      minHeight: 0,
                      overflow: 'auto',
                      p: 1,
                    },
                  }}
                >
                  <DialerLogPanel />
                </Box>
              </Box>

              {/* CENTER column: Service Engagement fills */}
              <Box
                sx={{
                  width: '100%',
                  minWidth: 0,
                  p: 1,
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <Box sx={{ flex: 1, minHeight: 0, '& > *': { height: '100%' } }}>
                  <ServiceEngagementCard />
                </Box>
              </Box>

              {/* RIGHT rail: Agent (auto) on top + Softphone fills bottom */}
              <Box
                sx={{
                  width: { xs: '100%', md: `${RIGHT_RAIL}px` },
                  justifySelf: { md: 'end' },
                  position: { md: 'static', lg: 'sticky' },
                  top: { lg: 16 },
                  p: 1,
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  gap: 1,
                  '& .MuiCard-root': { m: 0 },
                  overflow: 'visible',
                }}
              >
                {/* Agent card sizes to content (pushes Softphone down if taller) */}
                <Box sx={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <AgentProfileCard />
                </Box>

                {/* Softphone fills remainder with a sensible floor */}
                <Box sx={{ flex: '1 1 auto', minHeight: 360, '& > *': { height: '100%' } }}>
                  <SoftphoneCard style={{ width: '100%', height: '100%' }} />
                </Box>
              </Box>
            </Box>

          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
