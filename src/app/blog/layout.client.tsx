'use client';

import { UnstyledLink } from '@/components/unstyled-link';
import { PostMetadata } from '@/lib/blog/post';
import { CodeHighlightAdapterProvider, createShikiAdapter } from '@mantine/code-highlight';
import { AppShell, AppShellHeader, Burger, Group, NavLink, Title } from '@mantine/core';
import { useDisclosure, useHeadroom } from '@mantine/hooks';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { PropsWithChildren } from 'react';

// Shiki requires async code to load the highlighter
async function loadShiki() {
  const { createHighlighter } = await import('shiki');
  const shiki = await createHighlighter({
    langs: ['tsx', 'python', 'json'],
    // You can load supported themes here
    themes: [],
  });

  return shiki;
}

const shikiAdapter = createShikiAdapter(loadShiki);


export default function BlogClientLayout(
  props: PropsWithChildren<{ posts: { slug: string; metadata: PostMetadata }[] }>
) {
  const [opened, { toggle }] = useDisclosure();
  const params = useParams<{ slug?: string }>();
  const isHomePage = params.slug === undefined;

  const pinned = useHeadroom({ fixedAt: 80 });

  return (
    <CodeHighlightAdapterProvider adapter={shikiAdapter}>
      <AppShell
        header={{ height: 80, collapsed: !pinned }}
        navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !isHomePage && !opened, desktop: isHomePage } }}
        padding="md"
      >
        <AppShellHeader>
          <Group h={'100%'} justify={'space-between'}>
            <Group h={'100%'} ml={'md'}>
              <UnstyledLink href={'/blog'} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Title order={1} fz={'h2'}>
                  trisquare.eu | blog
                </Title>
              </UnstyledLink>
            </Group>
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
    </CodeHighlightAdapterProvider>

  );
}
