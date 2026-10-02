export const W   = 1920;
export const H   = 1080;
export const FPS = 60;

/** Seconds to frames */
export const f = (seconds: number): number => Math.round(seconds * FPS);

/** Scene safe margins */
export const SL = 120;   // safe left
export const ST = 80;    // safe top
