// Path: src/Component/templates/core/validators.js

import CAP from "./channelCapabilities.js";
import { estimateSmsSegments } from "./channelCapabilities.js";

/**
 * Validate a single variant snapshot for a channel.
 * Returns { errors: string[], warnings: string[] }
 */
export function validateVariant(channel, snapshot = {}) {
  const errors = [];
  const warnings = [];
  const caps = CAP[channel]?.limits || {};

  switch (channel) {
    case "sms": {
      const text =
        typeof snapshot === "string"
          ? snapshot
          : snapshot.body ?? snapshot.text ?? "";
      if (!text || !text.trim()) errors.push("SMS body is required.");
      const { segments, encoding } = estimateSmsSegments(text);
      if (segments > 3) warnings.push(`SMS length is ${segments} segments (${encoding}).`);
      break;
    }

    case "push": {
      const title = snapshot.title ?? "";
      const body = snapshot.body ?? "";
      if (!title.trim()) errors.push("Push title is required.");
      if (!body.trim()) errors.push("Push body is required.");
      if (caps.titleMax && title.length > caps.titleMax)
        warnings.push(`Push title exceeds ${caps.titleMax} chars.`);
      if (caps.bodyMax && body.length > caps.bodyMax)
        warnings.push(`Push body exceeds ${caps.bodyMax} chars.`);
      break;
    }

    case "email": {
      const subject = snapshot.subject ?? "";
      if (!subject.trim()) warnings.push("Email subject is empty.");
      if (caps.subjectMax && subject.length > caps.subjectMax)
        warnings.push(`Email subject exceeds ${caps.subjectMax} chars.`);
      // Quick unsafe HTML hint (very light)
      if (typeof snapshot.body === "string" && /<script/i.test(snapshot.body))
        errors.push("Email body contains disallowed <script> tag.");
      break;
    }

    case "whatsapp": {
      const header = snapshot.header ?? "";
      const body = snapshot.body ?? "";
      const footer = snapshot.footer ?? "";
      const btns = snapshot.buttons ?? [];
      if (!body.trim()) errors.push("WhatsApp body is required.");
      if (caps.headerMax && header.length > caps.headerMax)
        warnings.push(`Header exceeds ${caps.headerMax} chars.`);
      if (caps.bodyMax && body.length > caps.bodyMax)
        warnings.push(`Body exceeds ${caps.bodyMax} chars.`);
      if (caps.footerMax && footer.length > caps.footerMax)
        warnings.push(`Footer exceeds ${caps.footerMax} chars.`);
      if (caps.buttonsMax && btns.length > caps.buttonsMax)
        errors.push(`Too many buttons (${btns.length}). Max ${caps.buttonsMax}.`);
      break;
    }

    case "platform": {
      const body = snapshot.body ?? "";
      if (!body.trim()) warnings.push("Platform body is empty.");
      break;
    }

    default:
      break;
  }

  // Attachment support check (generic)
  if (snapshot.attachments && !CAP[channel]?.supportsAttachments) {
    warnings.push(`${CAP[channel]?.label || channel} does not support attachments; they will be ignored.`);
  }

  return { errors, warnings };
}

/**
 * Validate a whole template across its channel variants.
 * @param {object} template
 * @param {Array<{channel: string, snapshot: object}>} variants
 */
export function validateTemplate(template, variants = []) {
  const out = { errors: [], warnings: [] };

  if (!template?.name) out.errors.push("Template name is required.");
  if (!template?.type) out.errors.push("Template type is required.");
  if (!Array.isArray(template?.channels) || !template.channels.length)
    out.errors.push("At least one channel must be selected.");

  const declaredChannels = new Set(template?.channels || []);
  variants.forEach((v) => {
    if (!declaredChannels.has(v.channel)) {
      out.warnings.push(`Variant found for '${v.channel}' but channel is not selected on template.`);
    }
    const res = validateVariant(v.channel, v.snapshot);
    out.errors.push(...res.errors.map((e) => `[${v.channel}] ${e}`));
    out.warnings.push(...res.warnings.map((w) => `[${v.channel}] ${w}`));
  });

  return out;
}

const Validators = { validateVariant, validateTemplate };
export default Validators;