// src/TeamInbox/hooks/useComposer.js
// Use: Manage composer state for active room — text value, enter-to-send behavior, WS gating,
//      optimistic enqueue into Chat Store, and attachment intake (files/media/etc).
// Adds: availability + auth readiness gating; WS 'registered' awareness; sendBlockedReason.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useRoomsStore, selectActiveRoomId } from "../store/useRoomsStore.js";
import { useChatStore } from "../store/useChatStore.js";
import { wsService } from "../services/ws.service.js";
import { UX } from "../constants/UX.js";
import { EVENTS } from "../constants/EVENTS.js";

// NEW: user readiness & availability
import { useUserStore } from "../../../auth/user.store.js";
import { isUserReady } from "../../../auth/selectors.js";

// -------------------------- Tunables & helpers ------------------------------

const MAX_CHUNK = UX.UPLOAD_CHUNK_BYTES ?? 2 * 1024 * 1024; // ~2MB default
const TEXT_MAX_INLINE = UX.TEXT_MAX_INLINE ?? 64 * 1024;     // 64KB inline cap
const ALLOWED_AVAIL = new Set(["available", "busy", "away"]); // 'offline' blocks send

function tempId(prefix = "tmp") {
  const rnd = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now().toString(36)}_${rnd}`;
}

function detectKind(file) {
  const name = (file?.name || "").toLowerCase();
  const type = (file?.type || "").toLowerCase();

  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("audio/")) return "audio";
  if (type === "text/plain" || name.endsWith(".txt")) return "textfile";
  if (type === "text/html" || name.endsWith(".html") || name.endsWith(".htm")) return "html";
  if (name.endsWith(".gif")) return "image";
  if (name.endsWith(".svg")) return "image";
  if (name.endsWith(".apk")) return "binary";
  if (/\.(zip|rar|7z|tar|gz|bz2|xz)$/i.test(name)) return "archive";
  if (/\.(pdf|doc|docx|ppt|pptx|xls|xlsx)$/i.test(name)) return "document";
  if (/\.(json|js|ts|py|go|rb|java|cs|cpp|c|rs|php|sh|yml|yaml|toml|ini)$/i.test(name)) return "code";
  if (!type && !name) return "unknown";
  return "file";
}

async function chunkBlob(file, chunkBytes = MAX_CHUNK) {
  const size = file.size | 0;
  const total = Math.max(1, Math.ceil(size / chunkBytes));
  const chunks = [];
  const uploadId = tempId("upl");

  for (let i = 0; i < total; i++) {
    const start = i * chunkBytes;
    const end = Math.min(size, start + chunkBytes);
    chunks.push({
      uploadId,
      index: i,
      count: total,
      byteStart: start,
      byteEnd: end,
      size: end - start,
    });
  }
  return { uploadId, total, chunks };
}

function textToParts(text) {
  const t = String(text ?? "");
  if (!t) return [];
  if (t.length <= TEXT_MAX_INLINE) {
    return [{ kind: "text", text: t }];
  }
  const parts = [];
  const id = tempId("txt");
  const chunkSize = TEXT_MAX_INLINE;
  const total = Math.ceil(t.length / chunkSize);
  for (let i = 0; i < total; i++) {
    const start = i * chunkSize;
    const end = Math.min(t.length, start + chunkSize);
    parts.push({
      kind: "text-chunk",
      groupId: id,
      index: i,
      count: total,
      text: t.slice(start, end),
    });
  }
  return parts;
}

// ------------------------------- Hook ---------------------------------------

export function useComposer() {
  const roomId = useRoomsStore(selectActiveRoomId);

  // WS status stream (supports 'registered' if available)
  const [wsStatus, setWsStatus] = useState(wsService.status$?.get?.() ?? "closed");
  useEffect(() => {
    const off = wsService.status$?.subscribe?.((s) => setWsStatus(s)) ?? null;
    return () => { try { off?.(); } catch {} };
  }, []);

  // User identity + availability
  const userState = useUserStore.getState();
  const userReady = isUserReady(userState);
  const availability = userState.currentUser?.availability || "available";

  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState([]); // [{ id, file, name, size, type, kind, previewUrl? }]
  const [isSending, setIsSending] = useState(false);

  const valueRef = useRef(value);
  const attsRef  = useRef(attachments);
  useEffect(() => { valueRef.current = value; }, [value]);
  useEffect(() => { attsRef.current = attachments; }, [attachments]);

  // Intake helpers ------------------------------------------------------------

  const addAttachments = useCallback(async (filesLike) => {
    if (!filesLike || !filesLike.length) return;
    const list = Array.from(filesLike);
    const mapped = await Promise.all(list.map(async (f) => {
      const id = tempId("att");
      const kind = detectKind(f);
      let previewUrl = null;
      if (kind === "image" || kind === "video" || kind === "audio") {
        try { previewUrl = URL.createObjectURL(f); } catch {}
      }
      return {
        id,
        file: f,
        name: f.name || `file-${id}`,
        size: f.size | 0,
        type: f.type || "",
        kind,
        previewUrl,
      };
    }));
    setAttachments((prev) => [...prev, ...mapped]);
  }, []);

  const removeAttachment = useCallback((id) => {
    setAttachments((prev) => {
      for (const a of prev) {
        if (a.id === id && a.previewUrl) {
          try { URL.revokeObjectURL(a.previewUrl); } catch {}
        }
      }
      return prev.filter((a) => a.id !== id);
    });
  }, []);

  const clearComposer = useCallback(() => {
    setValue("");
    setAttachments((prev) => {
      for (const a of prev) { if (a.previewUrl) { try { URL.revokeObjectURL(a.previewUrl); } catch {} } }
      return [];
    });
  }, []);

  // Sendability ---------------------------------------------------------------

  const hasPayload = useMemo(() => {
    const t = (value || "").trim();
    return !!t || (attachments && attachments.length > 0);
  }, [value, attachments]);

  const wsReady = useMemo(() => {
    return wsStatus === "open" || wsStatus === "connected" || wsStatus === "registered";
  }, [wsStatus]);

  const [sendBlockedReason, canSend] = useMemo(() => {
    if (!userReady) return ["auth-not-ready", false];
    if (!ALLOWED_AVAIL.has(availability)) return ["user-offline", false];
    if (!roomId) return ["no-room", false];
    if (!hasPayload) return ["no-payload", false];
    if (isSending) return ["in-flight", false];
    if (!wsReady) return ["ws-not-ready", false];
    return [null, true];
  }, [userReady, availability, roomId, hasPayload, isSending, wsReady]);

  // sendNow -------------------------------------------------------------------

  const sendNow = useCallback(async () => {
    if (!canSend) return;
    const text = valueRef.current || "";
    const atts = attsRef.current || [];
    const now = Date.now();

    const tempMsgId = tempId("msg");
    const parts = [
      ...textToParts(text),
      ...(await Promise.all(atts.map(async (a) => {
        const { uploadId, total, chunks } = await chunkBlob(a.file, MAX_CHUNK);
        return {
          kind: "attachment",
          attachmentId: a.id,
          name: a.name,
          mime: a.type || "",
          size: a.size,
          detectedKind: a.kind,
          upload: { uploadId, total, chunks },
        };
      }))),
    ];

    // 1) Optimistic enqueue
    useChatStore.getState().enqueuePending(String(roomId), {
      id: tempMsgId,
      roomId: String(roomId),
      createdAt: new Date(now).toISOString(),
      parts,
      status: "pending",
      optimistic: true,
      userMeta: {},
    });

    setIsSending(true);

    try {
      // 2) Transport send (normalized envelope)
      wsService.send?.({
        type: EVENTS.MESSAGE_SEND,
        roomId: String(roomId),
        tempId: tempMsgId,
        createdAt: now,
        parts,
      });

      clearComposer();
    } catch (e) {
      useChatStore.getState().failPending(
        String(roomId),
        tempMsgId,
        String(e?.message || e || "send failed"),
      );
    } finally {
      setIsSending(false);
    }
  }, [canSend, clearComposer, roomId]);

  useEffect(() => {
    return () => {
      for (const a of attsRef.current) {
        if (a.previewUrl) { try { URL.revokeObjectURL(a.previewUrl); } catch {} }
      }
    };
  }, []);

  return {
    value,
    setValue,

    canSend,
    sendBlockedReason,

    sendNow,

    attachments,
    addAttachments,
    removeAttachment,
    clearComposer,
    isSending,
  };
}

export default useComposer;
