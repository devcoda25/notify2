// Path: src/Component/templates/core/variableResolver.js

const VAR_REGEX = /\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g;

/** Resolve {{placeholders}} in a string using a flat vars map */
export function resolveVariablesInString(str = "", vars = {}) {
  if (typeof str !== "string") return str;
  return str.replace(VAR_REGEX, (_, key) => {
    const v = vars[key];
    return v === undefined || v === null ? `{{${key}}}` : String(v);
  });
}

/** Recursively resolve variables in objects/arrays/strings */
export function resolveVariablesInObject(node, vars = {}) {
  if (node == null) return node;
  if (typeof node === "string") return resolveVariablesInString(node, vars);
  if (Array.isArray(node)) return node.map((n) => resolveVariablesInObject(n, vars));
  if (typeof node === "object") {
    const out = {};
    for (const k of Object.keys(node)) {
      out[k] = resolveVariablesInObject(node[k], vars);
    }
    return out;
  }
  return node;
}

/** Collect unique placeholders from a string */
export function extractPlaceholdersFromString(str = "") {
  const set = new Set();
  if (typeof str !== "string") return set;
  let m;
  while ((m = VAR_REGEX.exec(str)) !== null) set.add(m[1]);
  return set;
}

/** Collect placeholders from any JSON-ish structure */
export function extractPlaceholders(node) {
  const set = new Set();
  const walk = (n) => {
    if (n == null) return;
    if (typeof n === "string") {
      extractPlaceholdersFromString(n).forEach((k) => set.add(k));
      return;
    }
    if (Array.isArray(n)) return n.forEach(walk);
    if (typeof n === "object") return Object.values(n).forEach(walk);
  };
  walk(node);
  return set;
}

/**
 * Given a snapshot/content and a vars map, report missing variables.
 * Returns { missing: string[], resolved: any }
 */
export function resolveAndReport(snapshot, vars = {}) {
  const required = extractPlaceholders(snapshot);
  const provided = new Set(Object.keys(vars || {}));
  const missing = [...required].filter((k) => !provided.has(k));
  const resolved = resolveVariablesInObject(snapshot, vars);
  return { missing, resolved };
}

const VariableResolver = {
  resolveVariablesInString,
  resolveVariablesInObject,
  extractPlaceholders,
  resolveAndReport,
};
export default VariableResolver;