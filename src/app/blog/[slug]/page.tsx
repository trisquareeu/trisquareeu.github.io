import { MantinePostFactory } from '@/lib/blog/mantine-post-factory';
import { PostFactory } from '@/lib/blog/post-factory';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { PostClient } from './page.client';

type Params = {
  params: Promise<{ slug: string }>;
};

export default async function Post({ params }: Params) {
  const slug = (await params).slug;
  const post = await MantinePostFactory.forSlug(slug);
  if (!post) {
    return notFound();
  }

  return <PostClient post={post.toDataFormat()} />;
}

export async function generateStaticParams() {
  const posts = await MantinePostFactory.create();

  return posts.map((post) => ({ slug: post.slug }));
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function generateMetadata({ params }: Params, parent: ResolvingMetadata): Promise<Metadata> {
  const slug = (await params).slug;
  const post = await PostFactory.forSlug(slug);
  if (!post) {
    return notFound();
  }

  return {
    title: post.metadata.title,
    description: post.metadata.description,
    applicationName: 'trisquare.eu | blog',
    authors: post.metadata.authors.map((author) => ({ name: author, url: `https://trisquare.eu/authors/${author}` })), // FIXME
    keywords: post.metadata.tags,
    publisher: 'Trisquare',
    openGraph: {
      authors: post.metadata.authors,
      type: 'article',
      publishedTime: post.metadata.publishDate,
      section: 'AI',
      tags: post.metadata.tags,
      locale: 'en_US',
      siteName: 'trisquare.eu',
      url: `https://trisquare.eu/blog/${slug}`
    },
    twitter: {
      site: 'trisquareeu',
      creator: 'trisquareeu'
    }
  };
}
