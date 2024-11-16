'use client';

import { Stack, Text } from '@mantine/core';
import { useState } from 'react';
import { DitherCanvas } from './DitherCanvas';
import { DitherControls } from './DitherControls';
import { DitherSettings } from './dithering';

const DEFAULT_SETTINGS: DitherSettings = {
  mode: 'NONE',
  levels: 16, // Changed from 4 to show banding more clearly initially
  noiseAmount: 0.5,
  showBlocks: false
};

const GRADIENT_DESCRIPTIONS = {
  NONE: 'Quantized to 16 colors without dithering - notice the visible banding.',
  RANDOM: 'Block-aligned random noise can break up banding while surviving compression.',
  FLOYD_STEINBERG: 'Error diffusion provides smooth transitions but may not survive aggressive compression.',
  ORDERED: '8x8 Bayer dithering aligns with JPEG compression blocks for better survival.'
} as const;

export const DitheredGradient: React.FC = () => {
  const [settings, setSettings] = useState<DitherSettings>(DEFAULT_SETTINGS);

  const handleSettingsChange = (newSettings: Partial<DitherSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <Stack>
      <DitherCanvas settings={settings} />

      <Text size="xs" c={'dimmed'}>
        {GRADIENT_DESCRIPTIONS[settings.mode]}
      </Text>

      <DitherControls settings={settings} onSettingsChange={handleSettingsChange} />
    </Stack>
  );
};

export default DitheredGradient;