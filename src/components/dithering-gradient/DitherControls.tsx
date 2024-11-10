import { Select, Slider, Stack, Text, Switch } from '@mantine/core';
import { DitherModeType, DitherSettings } from './dithering';

interface DitherControlsProps {
  settings: DitherSettings;
  onSettingsChange: (settings: Partial<DitherSettings>) => void;
}

export const DitherControls: React.FC<DitherControlsProps> = ({
  settings,
  onSettingsChange,
}) => {
  return (
    <Stack>
      <Select
        label="Dithering Method"
        value={settings.mode}
        onChange={(value) => onSettingsChange({ mode: value as DitherModeType })}
        data={[
          { value: 'NONE', label: 'None (Quantized)' },
          { value: 'RANDOM', label: 'Random (Block-Aligned)' },
          { value: 'FLOYD_STEINBERG', label: 'Floyd-Steinberg' },
          { value: 'ORDERED', label: 'Ordered (8x8 Bayer)' },
        ]}
      />

      <Stack>
        <Text size="sm">Color Levels: {settings.levels}</Text>
        <Slider
          min={2}
          max={32}
          step={2}
          value={settings.levels}
          onChange={(value) => onSettingsChange({ levels: value })}
          marks={[
            { value: 2, label: '2' },
            { value: 16, label: '16' },
            { value: 32, label: '32' }
          ]}
        />
      </Stack>

      {settings.mode === 'RANDOM' && (
        <Stack>
          <Text size="sm">Noise Amount: {(settings.noiseAmount * 100).toFixed(0)}%</Text>
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={settings.noiseAmount}
            onChange={(value) => onSettingsChange({ noiseAmount: value })}
            marks={[
              { value: 0, label: '0%' },
              { value: 0.5, label: '50%' },
              { value: 1, label: '100%' }
            ]}
          />
        </Stack>
      )}

      <Switch
        label="Show Compression Blocks (8x8)"
        checked={settings.showBlocks}
        onChange={(event) => onSettingsChange({ showBlocks: event.currentTarget.checked })}
      />

      <Text size="xs" c="dimmed">
        {settings.mode === 'ORDERED' && (
          "8x8 Bayer matrix aligned with JPEG compression blocks."
        )}
        {settings.mode === 'RANDOM' && (
          "Random noise applied in 2x2 blocks, aligned to compression grid."
        )}
      </Text>
    </Stack>
  );
};