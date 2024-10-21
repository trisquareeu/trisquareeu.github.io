'use client';

import { UnstyledLink } from '@/components/unstyled-link';
import { PostMetadata } from '@/lib/blog/post';
import { AppShell, AppShellHeader, Burger, Group, NavLink, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { PropsWithChildren } from 'react';

export default function BlogClientLayout(
  props: PropsWithChildren<{ posts: { slug: string; metadata: PostMetadata }[] }>
) {
  const [opened, { toggle }] = useDisclosure();
  const params = useParams<{ slug?: string }>();
  const isHomePage = params.slug === undefined;

  return (
    <AppShell
      header={{ height: 80 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !isHomePage && !opened, desktop: isHomePage } }}
      padding="md"
    >
      <AppShellHeader>
        <Group h={'100%'} justify={'space-between'}>
          <UnstyledLink href={'/blog'} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Title ml={'md'} order={1} fz={'h2'}>
              trisquare.eu | blog
            </Title>
          </UnstyledLink>
          {!isHomePage && <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" mr={'md'} />}
        </Group>
      </AppShellHeader>
      {!isHomePage && (
        <AppShell.Navbar>
          {props.posts.map((post) => (
            <NavLink
              key={post.slug}
              href={`/blog/${post.slug}`}
              component={Link}
              label={post.metadata.title}
              active={post.slug === params.slug}
              description={`${post.metadata.publishDate} | ${post.metadata.tags.slice(0, 3).join(', ')}`}
              variant={'light'}
            />
          ))}
        </AppShell.Navbar>
      )}
      <AppShell.Main>{props.children}</AppShell.Main>
    </AppShell>
  );
}
