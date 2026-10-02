// Tiny store for the custom cursor. Two channels: "dom" (hovered HTML element)
// and "scene" (hovered 3D object). The DOM channel wins when it has something to say.

export type CursorVariant = "default" | "hover" | "label";
export type CursorState = { variant: CursorVariant; label: string | null };
type Channel = "dom" | "scene";

const IDLE: CursorState = { variant: "default", label: null };
const channels: Record<Channel, CursorState> = { dom: IDLE, scene: IDLE };
const listeners = new Set<(s: CursorState) => void>();

function current(): CursorState {
  return channels.dom.variant !== "default" ? channels.dom : channels.scene;
}

export function setCursor(channel: Channel, next: CursorState | null) {
  channels[channel] = next ?? IDLE;
  const s = current();
  listeners.forEach((l) => l(s));
}

export function subscribeCursor(listener: (s: CursorState) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
