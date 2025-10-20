// Path: src/Component/Meetings/public/BookingWizard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Box, Stack, Typography, Button, Alert } from "@mui/material";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

/** Stores (client-only) */
import { useEventTypesStore } from "../../store/scheduling/useEventTypesStore";
import { useAvailabilityStore } from "../../store/scheduling/useAvailabilityStore";
import { useMeetingsStore } from "../../store/scheduling/useMeetingsStore";

/** Orchestrator + helpers */
import BookingStepperFrames from "../components/BookingStepperFrames";
import useBookingState from "../hooks/useBookingState";
import useCalendarSwipe from "../hooks/useCalendarSwipe";

/** Utils & constants */
import { resolveHostProfile } from "../utils/hostProfile";
import { startOfToday } from "../utils/datetime";
import { STEPS } from "../constants/booking.constants";

/**
 * Public Booking wrapper — **client-only**.
 * - Loads fixtures from stores if needed
 * - Resolves eventType via slug
 * - Orchestrates wizard state and delegates booking to meetings store
 */
export default function BookingPage() {
  const { slug } = useParams();
  const [search] = useSearchParams();
  const navigate = useNavigate();

  const ets = useEventTypesStore();
  const av = useAvailabilityStore();
  const mtg = useMeetingsStore();

  // Owner context (client-only)
  const ownerType = search.get("ownerType") || "user";
  const ownerId = search.get("ownerId") || "usr_alpha";
  const owner = { ownerType, ownerId };

  // Initial prefs from URL (optional)
  const initialTz = search.get("prefill_tz") || "Africa/Kampala";
  const prefillName = search.get("prefill_name") || "";
  const prefillEmail = search.get("prefill_email") || "";

  // Core wizard state (client-only; no network here)
  const {
    activeStep, setActiveStep,
    invitee, setInvitee,
    locationPreference, setLocationPreference,
    validateInvitee,
  } = useBookingState({
    initialOwnerType: ownerType,
    initialOwnerId: ownerId,
    initialTimezone: initialTz,
  });

  // Local page-level picks
  const [pickedDay, setPickedDay] = useState(null); // Date | null
  const [slot, setSlot] = useState(null);           // { start, end } | null
  const [timezone, setTimezone] = useState(initialTz);

  // Keep invitee.timezone in sync with Timezone menu
  useEffect(() => {
    setInvitee((v) => ({ ...v, timezone }));
  }, [timezone, setInvitee]);

  // Pre-fill name/email from URL once
  useEffect(() => {
    if (prefillName || prefillEmail) {
      setInvitee((v) => ({
        ...v,
        name: v.name || prefillName,
        email: v.email || prefillEmail,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  // Ensure client fixtures are loaded
  useEffect(() => {
    ets.loaded || ets.loadFixtures?.();
    av.loaded || av.loadFixtures?.();
    mtg.loaded || mtg.loadFixtures?.();
  }, [ets, av, mtg]);

  // Resolve event type by slug
  const eventType = useMemo(
    () => (ets.eventTypes || []).find((e) => e.slug === slug) || null,
    [ets.eventTypes, slug]
  );

  // Host profile for header/HostCard
  const hostProfile = useMemo(
    () => resolveHostProfile({ eventType, ownerType, ownerId }),
    [eventType, ownerType, ownerId]
  );

  // Touch swipe month (optional; used by StepPickTime)
  const calendarSwipe = useCalendarSwipe(startOfToday());

  // Book via meetings store (client-only)
  const onConfirmBook = async () => {
    if (!eventType || !slot) throw new Error("Missing event details.");
    if (!validateInvitee()) {
      setActiveStep(1);
      throw new Error("Please complete your details.");
    }

    const payload = {
      eventTypeId: eventType.id,
      host: owner,
      invitee,
      start: slot.start,
      end: slot.end,
      locationPreference,
      channelPrefs: { email: true, sms: false, whatsapp: false },
    };

    const res = await mtg.book(payload);
    let bid = typeof res === "string" ? res : (res?.id || "");
    if (!bid) {
      // Fallback: find last meeting matching invitee/time (client-only heuristic)
      const last = (mtg.meetings || [])[0];
      if (last && last.invitee?.email === invitee.email && last.start === slot.start) bid = last.id;
    }
    return bid || "";
  };

  // Final-page actions (client-only routes)
  const onCancel = (bookingId) => {
    const id = bookingId || "bk_last";
    navigate(`/book/${encodeURIComponent(id)}/cancel`);
  };
  const onReschedule = (bookingId) => {
    const id = bookingId || "bk_last";
    navigate(`/book/${encodeURIComponent(id)}/reschedule`);
  };

  // Invalid or expired link guard
  if (!eventType) {
    return (
      <Stack gap={2} sx={{ maxWidth: 1100, m: "28px auto", px: { xs: 1.5, sm: 2 }, py: { xs: 2, sm: 3 } }}>
        <Typography variant="h5">This link is invalid or expired</Typography>
        <Alert severity="warning">
          We couldn’t find an event type for <code>{slug}</code>.
        </Alert>
        <Button onClick={() => navigate("/")} variant="contained">
          Go Home
        </Button>
      </Stack>
    );
  }

  return (
    <Box>
      <BookingStepperFrames
        eventType={eventType}
        hostProfile={hostProfile}
        owner={owner}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        pickedDay={pickedDay}
        setPickedDay={(d) => {
          setPickedDay(d);
          setSlot(null);
          // Keep calendar swipe month aligned if provided
          if (d && calendarSwipe?.setMonth) {
            const m = new Date(d);
            m.setDate(1);
            m.setHours(0, 0, 0, 0);
            calendarSwipe.setMonth(m);
          }
        }}
        timezone={timezone}
        setTimezone={setTimezone}
        slot={slot}
        setSlot={setSlot}
        invitee={invitee}
        setInvitee={setInvitee}
        locationPreference={locationPreference}
        setLocationPreference={setLocationPreference}
        validateInvitee={validateInvitee}
        onConfirmBook={onConfirmBook}
        onCancel={onCancel}
        onReschedule={onReschedule}
        // Optional swipe helpers for StepPickTime
        calendarSwipe={calendarSwipe}
      />
    </Box>
  );
}
