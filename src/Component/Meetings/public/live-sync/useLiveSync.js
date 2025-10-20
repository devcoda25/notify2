import { useEffect, useMemo } from "react";
import { useRole } from "./RoleContext";
import { useLiveBus } from "./LiveBusContext";

/**
 * useLiveSync
 * Host calls methods -> apply local setters AND broadcast to others.
 * Participants listen -> apply received updates.
 *
 * @param {string} roomId
 * @param {"host"|"participant"} role
 * @param {{
 *   setMeetingState: (state:string)=>void,    // expects "SETUP"|"LOBBY"|"LIVE"|"PAUSED"|"ENDED"|...
 *   setMeetingStartAt: (ts:number|null)=>void,
 *   setRecState: (state:"idle"|"recording"|"paused")=>void,
 *   setScreenOnBool: (fnOrBool:boolean|((prev:boolean)=>boolean))=>void,
 * }} setters
 */
export default function useLiveSync(roomId, role, setters) {
  const { setMeetingState, setMeetingStartAt, setRecState, setScreenOnBool } = setters || {};
  const { can } = useRole();
  const bus = useLiveBus();

  // participants mirror the host
  useEffect(() => {
    return bus.subscribe((msg) => {
      const { type, payload } = msg || {};
      if (type === "meeting.state") {
        setMeetingState?.(payload.state);               // expects upper-case enum string or your handler maps it
        if (payload.state === "LIVE" && payload.startAt) {
          setMeetingStartAt?.(payload.startAt);
        }
      } else if (type === "record.state") {
        setRecState?.(payload.state);                   // "idle"|"recording"|"paused"
      } else if (type === "screen.state") {
        setScreenOnBool?.(payload.on);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bus]);

  // host-side actions
  const host = useMemo(() => ({
    start: () => {
      if (role !== "host") return;
      const startAt = Date.now();
      setMeetingStartAt?.(startAt);
      setMeetingState?.("LIVE");
      bus.emit("meeting.state", { state: "LIVE", startAt });
    },
    pause: () => { if (can("pause")) { setMeetingState?.("PAUSED"); bus.emit("meeting.state", { state: "PAUSED" }); } },
    resume: () => { if (can("resume")) { setMeetingState?.("LIVE"); bus.emit("meeting.state", { state: "LIVE" }); } },
    end: () => { if (can("end")) { setMeetingState?.("ENDED"); bus.emit("meeting.state", { state: "ENDED" }); } },

    recStart: () => { if (can("record")) { setRecState?.("recording"); bus.emit("record.state", { state: "recording" }); } },
    recPause: () => { if (can("record")) { setRecState?.("paused");    bus.emit("record.state", { state: "paused"    }); } },
    recStop:  () => { if (can("record")) { setRecState?.("idle");      bus.emit("record.state", { state: "idle"      }); } },

    screenOn:  () => { if (can("screenshare")) { setScreenOnBool?.(true);  bus.emit("screen.state", { on: true  }); } },
    screenOff: () => { if (can("screenshare")) { setScreenOnBool?.(false); bus.emit("screen.state", { on: false }); } },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [role, can, bus]);

  return { host };
}
