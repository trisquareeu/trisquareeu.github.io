import { ButtonLink } from '@/components/button-link';
import { Center, Stack, Text, Title } from '@mantine/core';
import { IconHomeShield } from '@tabler/icons-react';

export default function NotFound() {
  return (
    <Center h={'100vh'} ml="xl" mr={'xl'}>
      <Stack align={'center'}>
        <Title order={1} size={'h2'}>
          Ooops! Page not found
        </Title>
        <Text style={{ textAlign: 'center' }}>
          We couldn&apos;t find what you were looking for. Consider going to the safe place!
        </Text>
        <ButtonLink leftSection={<IconHomeShield />} href="/">
          safe space
        </ButtonLink>
      </Stack>
    </Center>
  );
}
