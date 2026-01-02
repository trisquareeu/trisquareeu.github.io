
import { ButtonLink } from '@/components/button-link';
import { Center, Stack, Title } from '@mantine/core';
import { IconArticle } from '@tabler/icons-react';
import { Metadata } from 'next';
import { StyledMain } from './page.styles';

export const metadata: Metadata = {
  title: 'trisquare'
};

export default function LandingPage() {
  return (
    <StyledMain>
      <Center h={'100%'}>
        <Stack>
          <Title order={1}>trisquare.eu</Title>
          <ButtonLink leftSection={<IconArticle />} href="/blog">
            blog
          </ButtonLink>
        </Stack>
      </Center>
    </StyledMain>
  );
}
