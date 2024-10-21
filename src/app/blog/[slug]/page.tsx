import { PostFactory } from '@/lib/blog/post-factory';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { PostClient } from './page.client';

type Params = {
  params: {
    slug: string;
  };
};

export default async function Post({ params }: Params) {
  const post = await PostFactory.forSlug(params.slug);
  if (!post) {
    return notFound();
  }

  return <PostClient post={post.toDataFormat()} />;
}

export async function generateStaticParams() {
  const posts = await PostFactory.create();

  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  { params }: Params,
  /* eslint-disable-next-line */
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await PostFactory.forSlug(params.slug);
  if (!post) {
    return notFound();
  }

  return {
    title: post.metadata.title
  };
}
