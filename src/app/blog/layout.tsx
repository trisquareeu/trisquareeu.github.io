import { MantinePostFactory } from '@/lib/blog/mantine-post-factory';
import { PropsWithChildren } from 'react';
import BlogClientLayout from './layout.client';

export default async function BlogLayout(props: PropsWithChildren) {
  const posts = await MantinePostFactory.create();

  return (
    <BlogClientLayout posts={posts.map((post) => ({ slug: post.slug, metadata: post.metadata }))}>
      {props.children}
    </BlogClientLayout>
  );
}
