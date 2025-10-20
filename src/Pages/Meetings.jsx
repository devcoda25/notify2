// Path: /src/Pages/Meetings.jsx
import React, { useState, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { notifyTheme } from '../theme/notifyTheme';
import {
  Box,
  Stack,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Menu } from "lucide-react";
import { ThemeProvider } from '@mui/material';

import MeetingsLeftNav from "../Component/Meetings/layout/MeetingsLeftNav";
import MeetingsContentFrame from "../Component/Meetings/layout/MeetingsContentFrame";

/** Desk */
import MyMeetingsView from "../Component/Meetings/views/Desk/MyMeetingsView";
import JoinNowView from "../Component/Meetings/views/Desk/JoinNowView";
import MyAttendanceView from "../Component/Meetings/views/Desk/MyAttendanceView";

/** Focus */
import PoolSchedulesView from "../Component/Meetings/views/Focus/PoolSchedulesView";
import SpecialMeetingsView from "../Component/Meetings/views/Focus/SpecialMeetingsView";
import FollowUpsView from "../Component/Meetings/views/Focus/FollowUpsView";

/** Review */
import RecordingsView from "../Component/Meetings/views/Review/RecordingsView";
import ScorecardsView from "../Component/Meetings/views/Review/ScorecardsView";
import CalibrationView from "../Component/Meetings/views/Review/CalibrationView";
import DisputesView from "../Component/Meetings/views/Review/DisputesView";

/** Organize */
import CreateMeetingWizard from "../Component/Meetings/views/Organize/CreateMeetingWizard";
import EventTypesView from "../Component/Meetings/views/Organize/EventTypesView";
import AgentPoolsView from "../Component/Meetings/views/Organize/AgentPoolsView";
import AvailabilityRoutingView from "../Component/Meetings/views/Organize/AvailabilityRoutingView";

/** My Setup */
import CalendarConnectionsView from "../Component/Meetings/views/MySetup/CalendarConnectionsView";
import EmailPairingView from "../Component/Meetings/views/MySetup/EmailPairingView";
import PreferencesDevicesView from "../Component/Meetings/views/MySetup/PreferencesDevicesView";
import PersonalLinkPoolsView from "../Component/Meetings/views/MySetup/PersonalLinkPoolsView";

/** Systems */
import CalendarIntegrationsView from "../Component/Meetings/views/Systems/CalendarIntegrationsView";
import ConferencingNodesView from "../Component/Meetings/views/Systems/ConferencingNodesView";
import ReminderPoliciesView from "../Component/Meetings/views/Systems/ReminderPoliciesView";
import SecurityRetentionView from "../Component/Meetings/views/Systems/SecurityRetentionView";

/** Chronicle */
import BookingLogsView from "../Component/Meetings/views/Chronicle/BookingLogsView";
import AuditTrailView from "../Component/Meetings/views/Chronicle/AuditTrailView";

function NotFound() {
  return (
    <Stack gap={2}>
      <Typography variant="h6" sx={{ m: 0 }}>
        Not Found
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ m: 0 }}>
        The page you’re looking for doesn’t exist.
      </Typography>
    </Stack>
  );
}

/**
 * Meetings entry page (app shell for the Meetings module).
 * Mounted at: /u/:authUser/meetings/*
 */
export default function Meetings() {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = () => setMobileOpen((v) => !v);
  const closeMobile = () => setMobileOpen(false);

  const NAV_W = 264;

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      {/* Left nav (permanent on md+, temporary drawer on xs/sm) */}
      <MeetingsLeftNav
        navWidth={NAV_W}
        mobileOpen={mobileOpen}
        onCloseMobile={closeMobile}
        title="Meetings"
      />

      {/* Content area padded by MeetingsContentFrame (respects --nav-w) */}
      <MeetingsContentFrame>
        {!mdUp && (
          <Stack direction="row" justifyContent="flex-start" sx={{ mb: 1 }}>
            <Tooltip title="Open menu">
              <IconButton onClick={toggleMobile} size="small" aria-label="Open meetings menu">
                <Menu size={18} />
              </IconButton>
            </Tooltip>
          </Stack>
        )}

        <Suspense
          fallback={
            <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
              <CircularProgress />
            </Stack>
          }
        >
          <Routes>
            {/* Default: land on Desk/My */}
            <Route index element={<Navigate to="desk/my" replace />} />

            {/* Desk */}
            <Route path="desk/my" element={<MyMeetingsView />} />
            <Route path="desk/join" element={<JoinNowView />} />
            <Route path="desk/attendance" element={<MyAttendanceView />} />

            {/* Focus */}
            <Route path="focus/pools" element={<PoolSchedulesView />} />
            <Route path="focus/special" element={<SpecialMeetingsView />} />
            <Route path="focus/followups" element={<FollowUpsView />} />

            {/* Review */}
            <Route path="review/recordings" element={<RecordingsView />} />
            <Route path="review/scorecards" element={<ScorecardsView />} />
            <Route path="review/calibration" element={<CalibrationView />} />
            <Route path="review/disputes" element={<DisputesView />} />

            {/* Organize */}
            <Route path="organize/wizard" element={<CreateMeetingWizard />} />
            <Route path="organize/event-types" element={<EventTypesView />} />
            <Route path="organize/pools" element={<AgentPoolsView />} />
            <Route path="organize/availability" element={<AvailabilityRoutingView />} />

            {/* My Setup */}
            <Route path="my/calendar" element={<CalendarConnectionsView />} />
            <Route path="my/email" element={<EmailPairingView />} />
            <Route path="my/preferences" element={<PreferencesDevicesView />} />
            <Route path="my/personal" element={<PersonalLinkPoolsView />} />

            {/* Systems */}
            <Route path="systems/calendar" element={<CalendarIntegrationsView />} />
            <Route path="systems/conferencing" element={<ConferencingNodesView />} />
            <Route path="systems/reminders" element={<ReminderPoliciesView />} />
            <Route path="systems/security" element={<SecurityRetentionView />} />

            {/* Chronicle */}
            <Route path="chronicle/bookings" element={<BookingLogsView />} />
            <Route path="chronicle/audit" element={<AuditTrailView />} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </MeetingsContentFrame>
    </Box>
  );
}

