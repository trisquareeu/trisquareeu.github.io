import { Button, Center, Stack, Title } from '@mantine/core';
import { Metadata } from 'next';
import { StyledMain } from './page.styles';
import Link from 'next/link';
import { IconArticle } from '@tabler/icons-react';

export const metadata: Metadata = {
  title: 'trisquare'
};

export default function LandingPage() {
  return (
    <StyledMain>
      <Center h={'100%'}>
        <Stack>
          <Title order={1}>trisquare.eu</Title>
          <Button leftSection={<IconArticle />} component={Link} href={'/blog'}>
            blog
          </Button>
        </Stack>
      </Center>
    </StyledMain>
  );
}
