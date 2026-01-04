'use client';

import { Group, MantineSize, ThemeIcon, Title, TitleOrder, TitleProps, Tooltip } from '@mantine/core';
import { useClipboard, useHover } from '@mantine/hooks';
import { IconLink } from '@tabler/icons-react';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';

export const WithScroll = (props: { id: string; children: (navigate: () => void, href: string) => ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  return props.children(() => router.push(`#${props.id}`, { scroll: true }), `${pathname}#${props.id}`);
};

const idFromString = (text: string) => text.toLowerCase().replaceAll(' ', '_');

const orderToSize = {
  1: 'xl',
  2: 'lg',
  3: 'md',
  4: 'sm',
  5: 'xs',
  6: 'xs'
} satisfies Record<TitleOrder, MantineSize>;

export const TitleWithScroll = (props: TitleProps) => {
  const { hovered, ref } = useHover();
  const clipboard = useClipboard({ timeout: 500 });

  const id = idFromString(props.children!.toString());

  return (
    <WithScroll id={id}>
      {(onClick, href) => (
        <Group align="center" mt={props.mt} mb={props.mb} gap={0}>
          <Title {...props} mt={0} mb={0} id={id} onClick={onClick} style={{ cursor: 'pointer' }}>
            {props.children}
          </Title>
          <Tooltip
            label={clipboard.copied ? 'Copied' : 'Copy'}
            color={clipboard.copied ? 'green' : undefined}
            withArrow
          >
            <ThemeIcon
              size={orderToSize[props.order ?? 1]}
              onClick={() => {
                onClick();
                clipboard.copy(`https://trisquare.eu${href}`); // FIXME
              }}
              ref={ref}
              variant={hovered ? 'light' : 'white'}
              style={{ cursor: 'pointer' }}
              m={0}
            >
              <IconLink />
            </ThemeIcon>
          </Tooltip>
        </Group>
      )}
    </WithScroll>
  );
};
