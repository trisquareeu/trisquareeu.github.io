'use client';

import { UnstyledLink } from '@/components/unstyled-link';
import { PostData } from '@/lib/blog/post';
import { getTagColor } from '@/utils/tag-color-coding';
import {
  AspectRatio,
  Avatar,
  Badge,
  Card,
  Center,
  Chip,
  Divider,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Transition
} from '@mantine/core';
import Link from 'next/link';
import { useState } from 'react';

export const BlogClient = (props: { posts: PostData[] }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleBadgeClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((selectedTag) => selectedTag !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const allTags = props.posts.reduce(
    (acc, post) => {
      post.metadata.tags.forEach((tag) => {
        acc[tag] = (acc[tag] ?? 0) + 1;
      });

      return acc;
    },
    {} as Record<string, number>
  );

  if (props.posts.length <= 0) {
    return (
      <Center h={100} style={{ textAlign: 'center' }}>
        <Stack>
          <Group>
            <Text>It&apos;s a little bit empty here...</Text>
          </Group>
        </Stack>
      </Center>
    );
  }

  return (
    <>
      <Chip.Group value={selectedTags} onChange={(value) => setSelectedTags(value)} multiple={true}>
        <Group w={'100%'} justify={'center'} mb={'xl'} mt={'lg'}>
          {Object.entries(allTags)
            .toSorted((a, b) => b[1] - a[1])
            .map(([tag, articles]) => (
              <Chip
                color={getTagColor(tag)}
                key={tag}
                size={'md'}
                variant={selectedTags.includes(tag) ? 'filled' : 'outline'}
                value={tag}
                radius={'sm'}
              >{`${tag} | ${articles}`}</Chip>
            ))}
        </Group>
      </Chip.Group>
      <SimpleGrid cols={{ xs: 1, sm: 2, lg: 3 }} spacing={'xl'}>
        {props.posts.map((post) => (
          <Transition
            key={post.slug}
            mounted={
              selectedTags.length === 0
                ? true
                : selectedTags.filter((selectedTag) => post.metadata.tags.includes(selectedTag)).length > 0
            }
            transition="pop"
            duration={300}
            timingFunction="ease"
          >
            {(styles) => (
              <Card key={post.slug} component={'article'} style={{ ...styles }}>
                <Card.Section>
                  <Link href={`/blog/${post.slug}`}>
                    <AspectRatio ratio={16 / 9}>
                      <Image src={`/${post.metadata.cover}`} alt={post.metadata.title} />
                    </AspectRatio>
                  </Link>
                </Card.Section>

                <Card.Section>
                  <UnstyledLink href={`/blog/${post.slug}`}>
                    <Title order={2} mt={'md'} lineClamp={2}>
                      {post.metadata.title}
                    </Title>
                  </UnstyledLink>
                </Card.Section>

                <Card.Section>
                  <Group mt={'md'} align={'center'}>
                    <Avatar.Group>
                      {post.metadata.authors.map((author) => (
                        <UnstyledLink key={author} href={`/blog/authors/${author}`}>
                          <Avatar name={author} key={author} color="initials" />
                        </UnstyledLink>
                      ))}
                    </Avatar.Group>
                    <Text size="lg" c={'dimmed'}>
                      {post.metadata.publishDate}
                    </Text>
                    <Divider orientation={'vertical'} />
                    <Text size="lg" c={'dimmed'}>
                      {post.metadata.readTime}min
                    </Text>
                  </Group>
                </Card.Section>

                <Card.Section h={'50%'}>
                  <Text size="md" c="dimmed" mt={'md'} lineClamp={4}>
                    {post.metadata.description}
                  </Text>
                </Card.Section>

                <Card.Section>
                  <Group mt={'md'}>
                    {post.metadata.tags.map((tag) => (
                      <Badge
                        radius={'sm'}
                        variant={selectedTags.includes(tag) ? 'filled' : 'outline'}
                        key={tag}
                        onClick={() => handleBadgeClick(tag)}
                        color={getTagColor(tag) ?? 'green'}
                        style={{ cursor: 'pointer' }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </Group>
                </Card.Section>
              </Card>
            )}
          </Transition>
        ))}
      </SimpleGrid>
    </>
  );
};
