import { Chip, Group, Slider, Stack, Switch, Text } from '@mantine/core';
import { DitherModeType, DitherSettings } from './dithering';

interface DitherControlsProps {
  settings: DitherSettings;
  onSettingsChange: (settings: Partial<DitherSettings>) => void;
}

export const DitherControls: React.FC<DitherControlsProps> = ({ settings, onSettingsChange }) => {
  return (
    <Stack gap={'xl'}>
      <Chip.Group
        multiple={false}
        value={settings.mode}
        onChange={(value) => onSettingsChange({ mode: value as DitherModeType })}
      >
        <Group justify="center">
          <Chip value={'NONE'}>None</Chip>
          <Chip value={'RANDOM'}>Random</Chip>
          <Chip value={'FLOYD_STEINBERG'}>Floyd-Steinberg</Chip>
          <Chip value={'ORDERED'}>Ordered</Chip>
        </Group>
      </Chip.Group>

      <Stack>
        <Text size="sm">Color Levels: {settings.levels}</Text>
        <Slider
          min={2}
          max={128}
          restrictToMarks
          value={settings.levels}
          onChange={(value) => onSettingsChange({ levels: value })}
          marks={[
            { value: 2, label: '2' },
            { value: 8, label: '8' },
            { value: 16, label: '16' },
            { value: 32, label: '32' },
            { value: 64, label: '64' },
            { value: 128, label: '128' }
          ]}
          pb={'xl'}
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
            showLabelOnHover={false}
            onChange={(value) => onSettingsChange({ noiseAmount: value })}
            marks={[
              { value: 0, label: '0%' },
              { value: 0.5, label: '50%' },
              { value: 1, label: '100%' }
            ]}
            pb={'xl'}
          />
        </Stack>
      )}

      <Switch
        label="Show Compression Blocks (8x8)"
        checked={settings.showBlocks}
        onChange={(event) => onSettingsChange({ showBlocks: event.currentTarget.checked })}
      />
    </Stack>
  );
};
