import { PostFactory } from '@/lib/blog/post-factory';
import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630
};

export const contentType = 'image/png';

const BlogImage = (props: { title: string; date?: string }) => {
  return (
    <div
      style={{
        background: 'white',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div style={{ display: 'flex' }}>
        <h1>{props.title}</h1>
      </div>
      <div style={{ width: '50%', height: 2, background: 'black', borderRadius: 2 }}></div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2>trisquare.eu | blog {props.date && `| ${props.date}`} </h2>
      </div>
    </div>
  );
};

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await PostFactory.forSlug(params.slug);
  if (!post) {
    return new ImageResponse(<BlogImage title="Post not found :(" />, {
      ...size
    });
  }

  return new ImageResponse(<BlogImage title={post.metadata.title} date={post.metadata.publishDate} />, {
    ...size
  });
}
export async function generateStaticParams() {
  const posts = await PostFactory.create();

  return posts.map((post) => ({ slug: post.slug }));
}
