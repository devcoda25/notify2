import { useEffect, useMemo, useRef, useState } from "react";

const DEFAULTS = {
  search: "",
  sortBy: "updatedAt",
  sortDir: "desc",
  page: 0,
  pageSize: 25,
  filters: {},
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
    setState((s) => ({ ...s, ...patch, page: patch.search ? 0 : (patch?.page ?? s.page) }));
  const resetQuery = () => setState({ ...DEFAULTS, ...(initial || {}) });

  // URL sync (optional)
  const firstLoad = useRef(true);
  useEffect(() => {
    if (!syncToUrl) return;
    const params = new URLSearchParams(window.location.search);
    if (firstLoad.current) {
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
        pageSize: ps ? Math.max(1, parseInt(ps, 10) || 25) : s.pageSize,
      }));
      return;
    }
    params.set("q", state.search || "");
    params.set("sb", state.sortBy || "updatedAt");
    params.set("sd", state.sortDir || "desc");
    params.set("pg", String(state.page || 0));
    params.set("ps", String(state.pageSize || 25));
    const url = `${window.location.pathname}?${params.toString()}${window.location.hash || ""}`;
    window.history.replaceState(null, "", url);
  }, [syncToUrl, state]);

  // This is the object that will be sent to the API
  const queryParams = useMemo(() => {
    const params = {
      ...state,
      search: debouncedSearch,
    };
    if (params.filters && Object.keys(params.filters).length > 0) {
      params.filters = JSON.stringify(params.filters);
    } else {
      delete params.filters;
    }
    return params;
  }, [state, debouncedSearch, state.page]);

  return {
    queryParams,
    setQuery,
    resetQuery,
    // Pass back original search term for UI binding
    search: state.search, 
  };
}
