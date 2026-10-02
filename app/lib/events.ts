// Tiny app-wide event bus for easter eggs and cross-component actions.

type Events = {
  party: boolean;
  "robot-say": string;
  "robot-wave": void;
  "palette-open": void;
};

type Handler<T> = (payload: T) => void;
const handlers = new Map<keyof Events, Set<Handler<never>>>();

export function emit<K extends keyof Events>(type: K, payload: Events[K]) {
  handlers.get(type)?.forEach((h) => (h as Handler<Events[K]>)(payload));
}

export function on<K extends keyof Events>(type: K, handler: Handler<Events[K]>) {
  let set = handlers.get(type);
  if (!set) handlers.set(type, (set = new Set()));
  set.add(handler as Handler<never>);
  return () => {
    set.delete(handler as Handler<never>);
  };
}

let party = false;
export function isParty() {
  return party;
}
export function setParty(next: boolean) {
  party = next;
  emit("party", next);
}
