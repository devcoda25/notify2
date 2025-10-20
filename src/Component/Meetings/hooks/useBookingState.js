// Path: src/Component/Meetings/hooks/useBookingState.js
import { useEffect, useMemo, useState } from "react";
import { EMAIL_RE, STEPS } from "../constants/booking.constants";

/**
 * Central, client-only state for the Booking wizard.
 * Owns: step, invitee, locationPreference, simple validation.
 * Does NOT talk to network; delegates booking to store elsewhere.
 */
export default function useBookingState({
  initialOwnerType = "user",
  initialOwnerId = "usr_alpha",
  initialTimezone = "Africa/Kampala",
} = {}) {
  const [activeStep, setActiveStep] = useState(0);
  const [ownerType] = useState(initialOwnerType);
  const [ownerId] = useState(initialOwnerId);

  const [locationPreference, setLocationPreference] = useState("google_meet");
  const [invitee, setInvitee] = useState({
    name: "",
    email: "",
    countryIso: "UG",
    nationalPhone: "",
    phone: "", // E.164
    purpose: "",
    timezone: initialTimezone,
  });

  const [vErr, setVErr] = useState({ name: "", email: "", phone: "" });

  const emailLiveError = useMemo(
    () => (invitee.email ? !EMAIL_RE.test(invitee.email) : false),
    [invitee.email]
  );

  function validateInvitee({ requirePhone = false } = {}) {
    const next = { name: "", email: "", phone: "" };
    if (!String(invitee.name || "").trim()) next.name = "Full name is required.";
    if (!EMAIL_RE.test(invitee.email || "")) next.email = "Enter a valid email.";
    if (requirePhone && !invitee.phone) next.phone = "Phone is required.";
    setVErr(next);
    return !next.name && !next.email && !next.phone;
  }

  return {
    steps: STEPS,
    activeStep,
    setActiveStep,
    ownerType,
    ownerId,
    locationPreference,
    setLocationPreference,
    invitee,
    setInvitee,
    vErr,
    setVErr,
    emailLiveError,
    validateInvitee,
  };
}
