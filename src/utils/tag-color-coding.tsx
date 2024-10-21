import { MantineColor } from '@mantine/core';

const tagColorCoding = {
  company: 'blue',
  trisquare: 'violet',
  backend: 'red',
  ai: 'green'
} satisfies Record<string, MantineColor>;

export function getTagColor(tag: string): MantineColor {
  if (!Object.keys(tagColorCoding).includes(tag.toLowerCase())) {
    throw new Error(`Missing color code for tag: ${tag}`);
  }

  return tagColorCoding[tag.toLowerCase() as keyof typeof tagColorCoding];
}
