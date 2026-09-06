// Shared single-source of truth for session-level FX that components must
// coordinate (route transitions + preloader), kept outside React state so it
// survives layout remounts and avoids effect-ordering races.
let transitioning = false;

export const sessionFx = {
  isTransitioning: () => transitioning,
  setTransitioning: (v: boolean) => {
    transitioning = v;
  },
};