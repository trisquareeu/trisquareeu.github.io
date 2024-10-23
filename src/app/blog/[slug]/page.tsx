import { MantinePostFactory } from '@/lib/blog/mantine-post-factory';
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
  const posts = await MantinePostFactory.create();

  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params, parent: ResolvingMetadata): Promise<Metadata> {
  const post = await PostFactory.forSlug(params.slug);
  if (!post) {
    return notFound();
  }

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: post.metadata.title,
    openGraph: {
      images: previousImages.concat(`https://trisquare.eu/${post.metadata.cover}`)
    }
  };
}
