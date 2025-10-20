// /src/Component/dailer/hoverScroll.js

/**
 * Hover-to-show scrollbar styles for MUI `sx` prop.
 * - Hidden by default
 * - Appears on hover or focus-within
 * - Works on Chrome/Edge/Safari (WebKit) and Firefox
 */
export const hoverScroll = {
  overflowY: "auto",
  msOverflowStyle: "none",         // IE/Edge legacy
  scrollbarWidth: "none",          // Firefox: hide by default

  "&::-webkit-scrollbar": { width: 0, height: 0 },
  "&::-webkit-scrollbar-thumb": { backgroundColor: "transparent" },
  "&::-webkit-scrollbar-track": { background: "transparent" },

  "&:hover, &:focus-within": {
    scrollbarWidth: "thin",        // Firefox: show thin
  },
  "&:hover::-webkit-scrollbar, &:focus-within::-webkit-scrollbar": {
    width: 8,
    height: 8,
  },
  "&:hover::-webkit-scrollbar-thumb, &:focus-within::-webkit-scrollbar-thumb": (t) => ({
    backgroundColor:
      t.palette.mode === "dark"
        ? "rgba(139, 136, 136, 0.28)"
        : "rgba(0,0,0,0.28)",
    borderRadius: 8,
  }),
};
