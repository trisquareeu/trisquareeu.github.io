import { MantinePostFactory } from '@/lib/blog/mantine-post-factory';
import { BlogClient } from './page.client';

export default async function Blog() {
  const posts = await MantinePostFactory.create();

  return <BlogClient posts={posts.map((post) => post.toDataFormat())} />;
}
