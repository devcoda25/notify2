import { decryptString, encryptString } from './crypto.js';
import { idbDelete, idbGet, idbGetAll, idbPut } from './idb.js';
import { nanoid } from 'nanoid';

/** List summaries (no plaintext). */
export async function listCredentials() {
  const all = await idbGetAll();
  // newest first
  return all.sort((a, b) => b.updatedAt - a.updatedAt).map(({ enc, ...summary }) => summary);
}

/** Create credential with secret payload. Returns summary. */
export async function createCredential(input) {
  const now = Date.now();
  const enc = await encryptString(JSON.stringify(input.secret));
  const rec = {
    id: nanoid(),
    name: input.name,
    type: input.type,
    createdAt: now,
    updatedAt: now,
    rotatedAt: now,
    apiKeyName: input.type === 'apiKey' ? (input.apiKeyName || 'x-api-key') : undefined,
    apiKeyIn: input.type === 'apiKey' ? (input.apiKeyIn || 'header') : undefined,
    enc
  };
  await idbPut(rec);
  const { enc: _e, ...summary } = rec;
  return summary;
}

/** Rotate secret. */
export async function rotateCredential(id, secret) {
  const rec = await idbGet(id);
  if (!rec) throw new Error('Credential not found');
  rec.enc = await encryptString(JSON.stringify(secret));
  rec.rotatedAt = Date.now();
  rec.updatedAt = rec.rotatedAt;
  await idbPut(rec);
}

/** Delete. */
export async function deleteCredential(id) {
  await idbDelete(id);
}

/** Decrypt secret for injection. */
export async function resolveSecret(id) {
  const rec = await idbGet(id);
  if (!rec) throw new Error('Credential not found');
  const json = await decryptString(rec.enc);
  return JSON.parse(json);
}

/** Get summary by id (no plaintext). */
export async function getSummary(id) {
  const rec = await idbGet(id);
  if (!rec) return undefined;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { enc, ...summary } = rec;
  return summary;
}