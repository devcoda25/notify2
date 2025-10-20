import { useMemo, useState } from "react";

/**
 * @param {object} opts
 * @param {Array<string>} [opts.pageIds]   ids on the current page (for selectPage)
 * @param {Array<string>} [opts.allIds]    optional: ids across the filtered dataset (for future 'select all filtered')
 */
export default function useSelection(opts = {}) {
  const { pageIds = [], allIds = [] } = opts;
  const [selected, setSelected] = useState(() => new Set());

  const isSelected = (id) => selected.has(id);

  const toggle = (id) => {
    setSelected((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectIds = (ids = []) => setSelected(new Set(ids));
  const clear = () => setSelected(new Set());

  const selectPage = () => setSelected(new Set(pageIds));
  const selectNone = () => clear();

  // optional: select all filtered (if you pass allIds)
  const selectAllFiltered = () => {
    if (!allIds || !allIds.length) return;
    setSelected(new Set(allIds));
  };

  const selectedIds = useMemo(() => Array.from(selected), [selected]);
  const count = selected.size;
  const isPageFullySelected = pageIds.length > 0 && pageIds.every((id) => selected.has(id));

  return {
    selectedIds,
    count,
    isSelected,
    toggle,
    selectIds,
    clear,
    selectPage,
    selectNone,
    selectAllFiltered,
    isPageFullySelected,
  };
}
