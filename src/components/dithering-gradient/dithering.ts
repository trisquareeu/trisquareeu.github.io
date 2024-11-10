export const DitherMode = {
  NONE: "none",
  RANDOM: "random",
  FLOYD_STEINBERG: "floyd-steinberg",
  ORDERED: "ordered",
} as const;

export type DitherModeType = keyof typeof DitherMode;

export interface DitherSettings {
  mode: DitherModeType;
  levels: number;
  noiseAmount: number;
  showBlocks?: boolean; // Optional: to visualize 8x8 compression blocks
}

// Optional: Add helper types for gradient analysis settings
export interface GradientSettings {
  threshold: number; // Threshold for switching between dithering methods
  sensitivity: number; // How sensitive the gradient detection should be
}
