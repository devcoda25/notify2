import { FIELD_META } from "./schema";

/**
 * Edit policy per origin. DB is rich; Upload is lighter but still editable.
 * Tweak here to lock fields as your schema solidifies.
 */
const POLICY = {
  db:     (key) => !!FIELD_META[key]?.editable,          // allow what's marked editable
  upload: (key) => !!FIELD_META[key]?.editable && key !== "source", // example: lock source for uploads
};

/** @param {'db'|'upload'} origin @param {string} field */
export function canEdit(origin, field) {
  const fn = POLICY[origin] || (() => false);
  return fn(field);
}

/** Returns a map of { field: boolean } for quick UI checks */
export function editableFieldsFor(origin) {
  const out = {};
  Object.keys(FIELD_META).forEach(k => { out[k] = canEdit(origin, k); });
  return out;
}
