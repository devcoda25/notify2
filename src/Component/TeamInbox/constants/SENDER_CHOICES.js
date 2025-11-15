// Canonical choices for the composer menus (cards-style like your mock).
// Keeps ONLY data; UI decides how to render (badge, icon, pill tags, etc.)

import {
  Mail, Smartphone, MessageSquare, Bot, Sparkles, MessageCircle
} from "lucide-react";
import { CHANNELS } from "./CHANNELS";

// helper for tags
const T = (...xs) => xs.map((x) => String(x));

/** CHANNELS — cards */
export const CHANNEL_CARDS = [
  {
    id: CHANNELS.EMAIL,
    title: "Sales Recovery",
    description:
      "Sales recovery is the process of regaining lost revenue and re-engaging customers after a decline in sales.",
    tags: T("Sales", "Recovery", "Customers"),
    // top-right badge/icon meta
    badge: { kind: "icon", Icon: Mail, tone: "primary" },
  },
  {
    id: CHANNELS.SMS,
    title: "Sales Recovery",
    description:
      "Sales recovery is the process of regaining lost revenue and re-engaging customers after a decline in sales.",
    tags: T("Sales", "Recovery", "Customers"),
    badge: { kind: "chip", label: "SMS", tone: "info" },
    Icon: Smartphone,
  },
  {
    id: CHANNELS.WABA,
    title: "Sales Recovery",
    description:
      "Sales recovery is the process of regaining lost revenue and re-engaging customers after a decline in sales.",
    tags: T("Sales", "Recovery", "Customers"),
    // there’s no WhatsApp brand icon in lucide; we use a chat bubble + label
    badge: { kind: "chip", label: "WA", tone: "success" },
    Icon: MessageCircle,
  },
];

/** QUICK REPLIES — cards */
export const QUICK_REPLY_CARDS = [
  {
    id: "qr-followup-1",
    title: "Follow-up (24h)",
    description: "Quick nudge to check if the customer got our last update.",
    tags: T("Follow-up", "Reminder"),
    badge: { kind: "icon", Icon: MessageSquare, tone: "default" },
  },
  {
    id: "qr-thanks-1",
    title: "Thank You",
    description: "Appreciation template after successful resolution.",
    tags: T("Thanks", "CSAT"),
    badge: { kind: "icon", Icon: MessageSquare, tone: "default" },
  },
];

/** TEMPLATES — cards */
export const TEMPLATE_CARDS = [
  {
    id: "tpl-sales-recovery",
    title: "Sales Recovery",
    description:
      "Re-engage customers and recover sales with a concise offer and CTA.",
    tags: T("Offer", "Win-back"),
    badge: { kind: "icon", Icon: Sparkles, tone: "warning" },
  },
  {
    id: "tpl-onboarding-welcome",
    title: "Onboarding Welcome",
    description: "Warm welcome + first-steps checklist.",
    tags: T("Onboarding", "Guide"),
    badge: { kind: "icon", Icon: Sparkles, tone: "warning" },
  },
];

/** BOTS — list-ish, still align to card fields for consistency */
export const BOT_CARDS = [
  {
    id: "bot-routing",
    title: "Routing Bot",
    description: "Auto-triage, tags and assignment.",
    tags: T("Triage", "Tags"),
    badge: { kind: "icon", Icon: Bot, tone: "default" },
  },
  {
    id: "bot-faq",
    title: "FAQ Bot",
    description: "Handles common questions before handoff.",
    tags: T("Self-serve", "FAQ"),
    badge: { kind: "icon", Icon: Bot, tone: "default" },
  },
];

/** Index helpers (optional) */
export const CHANNEL_BY_ID = Object.fromEntries(
  CHANNEL_CARDS.map((c) => [c.id, c])
);
export const TEMPLATE_BY_ID = Object.fromEntries(
  TEMPLATE_CARDS.map((c) => [c.id, c])
);
export const QUICK_REPLY_BY_ID = Object.fromEntries(
  QUICK_REPLY_CARDS.map((c) => [c.id, c])
);
export const BOT_BY_ID = Object.fromEntries(
  BOT_CARDS.map((c) => [c.id, c])
);
