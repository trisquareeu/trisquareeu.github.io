import { PostFactory } from '@/lib/blog/post-factory';
import { PropsWithChildren } from 'react';
import BlogClientLayout from './layout.client';

export default async function BlogLayout(props: PropsWithChildren) {
  const posts = await PostFactory.create();

  return (
    <BlogClientLayout posts={posts.map((post) => ({ slug: post.slug, metadata: post.metadata }))}>
      {props.children}
    </BlogClientLayout>
  );
}
