import { useEffect, useMemo, useRef, useState } from "react";

/** @typedef {'lastUpdated'|'name'|'createdAt'} SortBy */
/** @typedef {'asc'|'desc'} SortDir */

const DEFAULTS = {
  search: "",
  sortBy: /** @type {SortBy} */ ("lastUpdated"),
  sortDir: /** @type {SortDir} */ ("desc"),
  page: 0,
  pageSize: 25,
  filters: {},    // free-form object consumed by utils/ContactFilter (or NOP)
};

function useDebouncedValue(value, delay = 250) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export default function useContactsQueryState(opts = {}) {
  const { initial = {}, syncToUrl = false } = opts;
  const [state, setState] = useState({ ...DEFAULTS, ...initial });
  const debouncedSearch = useDebouncedValue(state.search, 250);

  const setQuery = (patch) =>
    setState((s) => ({ ...s, ...patch, page: patch?.page ?? s.page })); // don’t auto-reset page unless caller sets it
  const resetQuery = () => setState({ ...DEFAULTS, ...(initial || {}) });

  // URL sync (optional)
  const firstLoad = useRef(true);
  useEffect(() => {
    if (!syncToUrl) return;
    const params = new URLSearchParams(window.location.search);
    if (firstLoad.current) {
      // hydrate from URL once
      firstLoad.current = false;
      const q = params.get("q");
      const sb = params.get("sb");
      const sd = params.get("sd");
      const pg = params.get("pg");
      const ps = params.get("ps");
      setState((s) => ({
        ...s,
        search: q ?? s.search,
        sortBy: (sb || s.sortBy),
        sortDir: (sd || s.sortDir),
        page: pg ? Math.max(0, parseInt(pg, 10) || 0) : s.page,
        pageSize: ps ? Math.max(1, parseInt(ps, 10) || s.pageSize) : s.pageSize,
      }));
      return;
    }
    // push to URL
    params.set("q", state.search || "");
    params.set("sb", state.sortBy || "lastUpdated");
    params.set("sd", state.sortDir || "desc");
    params.set("pg", String(state.page || 0));
    params.set("ps", String(state.pageSize || 25));
    const url = `${window.location.pathname}?${params.toString()}${window.location.hash || ""}`;
    window.history.replaceState(null, "", url);
  }, [syncToUrl, state]);

  // Stable queryKey for memoization in selectors
  const queryKey = useMemo(
    () => `q:${debouncedSearch}|sb:${state.sortBy}|sd:${state.sortDir}|pg:${state.page}|ps:${state.pageSize}|f:${JSON.stringify(state.filters)}`,
    [debouncedSearch, state.sortBy, state.sortDir, state.page, state.pageSize, state.filters]
  );

  return {
    state,
    setQuery,
    resetQuery,
    debouncedSearch,
    queryKey,
  };
}
