/**
 * Demo‑grade evaluator. It compiles an expression as a function with strict mode,
 * injecting (helpers, ...context) as parameters.
 *
 * NOTE: Do not use this in production without additional hardening. For real apps,
 * evaluate server‑side or in a hardened sandbox/worker and apply allow‑lists.
 */
export function safeEval(expr, ctx, helpers) {
  // block obviously dangerous tokens
  const banned = /(import|export|await|function\s*\(|=>|new\s+Function|constructor|window|document|eval)/g;
  if (banned.test(expr)) {
    throw new Error('Expression contains disallowed syntax.');
  }

  const helperNames = Object.keys(helpers);
  const names = Object.keys(ctx);
  const values = Object.values(ctx);

  const fn = new Function(...helperNames, ...names, '"use strict"; return ( ' + expr + ' );');
  return fn(...Object.values(helpers), ...values);
}

/** A tiny default helper library, safe & pure. */
export function defaultHelpers() {
  return {
    len: (x) => (typeof x === 'string' || Array.isArray(x)) ? x.length : 0,
    includes: (text, part) => (String(text)).includes(String(part)),
    startsWith: (text, part) => String(text).startsWith(String(part)),
    endsWith: (text, part) => String(text).endsWith(String(part)),
    regex: (pattern, flags) => new RegExp(pattern, flags),
    inList: (x, list) => list.includes(x),
    minutesSince: (iso) => {
      const then = Date.parse(iso); if (!then) return NaN;
      return Math.floor((Date.now() - then) / 60000);
    },
    toLower: (s) => String(s).toLowerCase(),
    toUpper: (s) => String(s).toUpperCase()
  };
}