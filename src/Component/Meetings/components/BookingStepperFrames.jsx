// Path: src/Component/Meetings/components/BookingStepperFrames.jsx
import React, { useState } from "react";
import {
  Box,
  Paper,
  Stack,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
} from "@mui/material";
import { STEPS } from "../constants/booking.constants";

import BookingHeaderRow from "./BookingHeaderRow";
import StepPickTime from "./steps/StepPickTime";
import StepInviteeDetails from "./steps/StepInviteeDetails";
import StepConfirm from "./steps/StepConfirm";
import StepScheduled from "./steps/StepScheduled";

/**
 * Orchestrates the 4-step booking wizard (client-only).
 *
 * Required props:
 * - eventType, hostProfile, owner
 * - activeStep, setActiveStep
 * - pickedDay, setPickedDay
 * - timezone, setTimezone
 * - slot, setSlot
 * - invitee, setInvitee
 * - locationPreference, setLocationPreference
 * - validateInvitee(): boolean
 * - onConfirmBook(): Promise<string> -> bookingId
 * - onCancel(bookingId), onReschedule(bookingId)
 * - calendarSwipe? (optional; from useCalendarSwipe)
 */
export default function BookingStepperFrames(props) {
  const {
    eventType,
    hostProfile,
    owner,
    activeStep,
    setActiveStep,
    pickedDay,
    setPickedDay,
    timezone,
    setTimezone,
    slot,
    setSlot,
    invitee,
    setInvitee,
    locationPreference,
    setLocationPreference,
    validateInvitee,
    onConfirmBook,
    onCancel,
    onReschedule,
    calendarSwipe,
  } = props;

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [bookingId, setBookingId] = useState("");

  const containerSx = {
    maxWidth: 1100,
    m: "28px auto",
    px: { xs: 1.5, sm: 2 },
    py: { xs: 2, sm: 3 },
  };

  return (
    <Box component="main" sx={containerSx}>
      <Paper variant="outlined" sx={{ p: { xs: 1.5, sm: 2 } }}>
        <BookingHeaderRow eventType={eventType} />

        <Divider sx={{ my: 1.5 }} />

        <Box sx={{ maxWidth: 760, mx: "auto", width: "100%" }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* STEP 1: Pick day & time (Calendly style) */}
        {activeStep === 0 && (
          <StepPickTime
            eventType={eventType}
            hostProfile={hostProfile}
            owner={owner}
            pickedDay={pickedDay}
            setPickedDay={setPickedDay}
            timezone={timezone}
            setTimezone={setTimezone}
            slot={slot}                
            setSlot={setSlot}
            onNext={() => setActiveStep(1)}  
            calendarSwipe={calendarSwipe}
          />
        )}

        {/* STEP 2: Invitee details */}
        {activeStep === 1 && (
          <StepInviteeDetails
            invitee={invitee}
            setInvitee={setInvitee}
            locationPreference={locationPreference}
            setLocationPreference={setLocationPreference}
            validateInvitee={validateInvitee}
            pickedDay={pickedDay}
            slot={slot}
            timezone={timezone}
            onBack={() => setActiveStep(0)}
            onNext={() => setActiveStep(2)}
          />
        )}

        {/* STEP 3: Confirm */}
        {activeStep === 2 && (
          <StepConfirm
            eventType={eventType}
            invitee={invitee}
            pickedDay={pickedDay}
            slot={slot}
            timezone={timezone}
            locationPreference={locationPreference}
            error={err}
            busy={busy}
            onBack={() => setActiveStep(1)}
            onConfirm={async () => {
              if (!validateInvitee?.()) {
                setActiveStep(1);
                return;
              }
              setBusy(true);
              setErr("");
              try {
                const id = await onConfirmBook?.();
                setBookingId(id || "");
                setActiveStep(3);
              } catch (e) {
                setErr(e?.message || "Failed to schedule.");
              } finally {
                setBusy(false);
              }
            }}
          />
        )}

        {/* STEP 4: Scheduled */}
        {activeStep === 3 && (
          <StepScheduled
            eventType={eventType}
            invitee={invitee}
            pickedDay={pickedDay}
            slot={slot}
            timezone={timezone}
            locationPreference={locationPreference}
            bookingId={bookingId}
            onCancel={() => onCancel?.(bookingId)}
            onReschedule={() => onReschedule?.(bookingId)}
          />
        )}

        {busy && (
          <Stack alignItems="center" sx={{ mt: 2 }}>
            <CircularProgress size={20} />
          </Stack>
        )}
        {err && <Alert sx={{ mt: 2 }} severity="error">{err}</Alert>}
      </Paper>
    </Box>
  );
}
