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
 * Validate a whole template object, including its variants.
 * @param {object} payload The complete template payload, including a `variants` array.
 */
export function validateTemplate(payload = {}) {
  const out = { errors: [], warnings: [] };
  const template = payload;
  const variants = Array.isArray(payload.variants) ? payload.variants : [];

  if (!template?.name) out.errors.push("Template name is required.");
  if (!template?.type) out.errors.push("Template type is required.");
  if (!template?.channel) {
    out.errors.push("A channel must be selected.");
  }

  if (variants.length === 0) {
    out.errors.push("At least one variant must be created.");
  }

  variants.forEach((v) => {
    // The variant snapshot is the `content` property within the variant object
    const res = validateVariant(template.channel, v.content);
    out.errors.push(...res.errors.map((e) => `[${v.locale || 'variant'}] ${e}`));
    out.warnings.push(...res.warnings.map((w) => `[${v.locale || 'variant'}] ${w}`));
  });

  return out.errors; // The calling code expects an array of errors
}

const Validators = { validateVariant, validateTemplate };
export default Validators;