// Path: src/Component/templates/core/channelAdapters.preview.js

import { resolveVariablesInObject } from "./variableResolver.js";
import CAP from "./channelCapabilities.js";

/**
 * Produce a preview-ready payload per channel.
 * This is FRONTEND-ONLY: no provider formatting, just a visual model for our preview components.
 *
 * @param {string} channel - "email" | "platform" | "push" | "sms" | "whatsapp"
 * @param {object} variant  - { content_type, snapshot, themeId }
 * @param {object} vars     - sample variables to inject (e.g., from variable kits)
 * @returns {object} preview model suitable for channel preview components
 */
export function toPreview(channel, variant = {}, vars = {}) {
  const { snapshot = {}, content_type = "json", themeId } = variant || {};
  const injected = resolveVariablesInObject(snapshot, vars);

  // Minimal shaping per channel for our preview shells
  switch (channel) {
    case "sms": {
      // SMS: text only; enforce a string body
      const body =
        typeof injected === "string"
          ? injected
          : injected.body ?? injected.text ?? "";
      return { channel, themeId: themeId ?? "plain", title: null, body, media: null, buttons: [] };
    }

    case "push": {
      // Push: title/body, optional actions, optional sound
      return {
        channel,
        themeId: themeId ?? "compact",
        title: injected.title ?? "",
        body: injected.body ?? "",
        actions: injected.actions ?? [],
        sound: Boolean(injected.sound),
      };
    }

    case "email": {
      // Email: subject, header/body/footer HTML blocks, attachments (name only for preview)
      const attachments = Array.isArray(injected.attachments) ? injected.attachments : [];
      return {
        channel,
        themeId: themeId ?? "cards_grid",
        subject: injected.subject ?? "",
        header: injected.header ?? "",
        body: injected.body ?? "",
        footer: injected.footer ?? "",
        attachments,
      };
    }

    case "platform": {
      // Platform: flexible header/body/buttons/media
      return {
        channel,
        themeId: themeId ?? "simple_box",
        header: injected.header ?? "",
        body: injected.body ?? "",
        buttons: injected.buttons ?? [],
        media: injected.media ?? null,
        position: injected.position ?? "floating",
      };
    }

    case "whatsapp": {
      // WhatsApp: header/body/footer + interactive buttons
      return {
        channel,
        themeId: themeId ?? "wa_basic",
        header: injected.header ?? "",
        body: injected.body ?? "",
        footer: injected.footer ?? "",
        buttons: injected.buttons ?? [],
        media: injected.media ?? null,
      };
    }

    default:
      // Fallback for unknown channels
      return { channel, themeId, ...injected };
  }
}

/**
 * Convenience: produce previews for ALL supported channels of a template,
 * given a map of variants by channel.
 */
export function buildAllChannelPreviews(variantsByChannel = {}, vars = {}) {
  const previews = {};
  Object.keys(CAP).forEach((ch) => {
    if (variantsByChannel[ch]) {
      previews[ch] = toPreview(ch, variantsByChannel[ch], vars);
    }
  });
  return previews;
}

const PreviewAdapters = { toPreview, buildAllChannelPreviews };
export default PreviewAdapters;