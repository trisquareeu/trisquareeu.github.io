'use client';

import { PostData } from '@/lib/blog/post';
import { getTagColor } from '@/utils/tag-color-coding';
import { Badge, Box, Center, Divider, Group, Text } from '@mantine/core';
import { useHash } from '@mantine/hooks';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const PostClient = ({ post }: { post: PostData }) => {
  const [id] = useHash();
  const router = useRouter();

  useEffect(() => {
    router.push(id, { scroll: true });
  }, [id, router]);

  return (
    <Center w={'100%'}>
      <Box w={{ base: '90%', md: '75%', lg: '75%', xl: '75%' }} mt={'lg'}>
        {post.content}
        <Divider mt={'md'} />

        <Group mt={'md'}>
          {post.metadata.tags.map((tag) => (
            <Badge radius={'sm'} variant={'filled'} key={tag} color={getTagColor(tag)}>
              {tag}
            </Badge>
          ))}
        </Group>
        <Group mt={'md'} align={'center'}>
          <Text size="lg" c={'dimmed'}>
            {post.metadata.publishDate}
          </Text>
          <Group justify="center">
            {post.metadata.authors.map((author) => (
              <Link key={author} href={`/blog/authors/${author}`} style={{ color: 'inherit' }}>
                <Text>{author}</Text>
              </Link>
            ))}
          </Group>
        </Group>
      </Box>
    </Center>
  );
};
