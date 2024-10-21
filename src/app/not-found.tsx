import { Button, Center, Stack, Title, Text } from '@mantine/core';
import Link from 'next/link';
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
        <Button leftSection={<IconHomeShield />} w={'50%'} component={Link} href={'/'}>
          safe space
        </Button>
      </Stack>
    </Center>
  );
}
