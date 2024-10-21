import { PostFactory } from '@/lib/blog/post-factory';
import { BlogClient } from './page.client';

export default async function Blog() {
  const posts = await PostFactory.create();

  return <BlogClient posts={posts.map((post) => post.toDataFormat())} />;
}
