// src/TeamInbox/constants/BUBBLE_TOKENS.js
// Design tokens for chat bubbles & previews (used by MessageBubble, Router, previewers)

export const BUBBLE = Object.freeze({
  /* Bubble container */
  maxWidth: { xs: "88%", sm: "72%" },  // responsive bubble width cap
  padX: 12,                            // content padding X (px)
  padY: 10,                            // content padding Y (px)
  radius: 14,                          // default corner radius
  radiusGrouped: 6,                    // softened corner when grouped
  borderWidth: 1,

  /* Typography */
  bodyLineHeight: 1.6,
  bodyColorOpacity: 0.9,

  /* Sections */
  sectionGapY: 12,                     // space before/after attachment section

  /* Attachments layout */
  attachGridGap: 10,                   // gap between tiles

  /* File tile */
  fileTile: {
    height: 56,
    radius: 12,
    padX: 12,
    padY: 10,
    iconSize: 20,
    nameSize: 13,
    metaSize: 12,
  },

  /* Link card */
  linkCard: {
    radius: 12,
    padX: 14,
    padY: 12,
    accentWidth: 6,                    // colored spine on the left
    titleSize: 16,
    descSize: 13,
    urlSize: 13,
  },

  /* Media */
  imageRadius: 12,
  imageGap: 8,
  videoHeight: 200,
  audioHeight: 44,
});

export default BUBBLE;
