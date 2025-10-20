// Path: src/Component/templates/core/idGen.js

export function generateId(prefix = "id") {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${ts}${rand}`;
}

const IdGen = { generateId };
export default IdGen;