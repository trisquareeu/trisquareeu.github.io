import { TitleWithScroll } from '@/components/with-scroll';
import { ImageWithSkeleton } from '@/components/with-skeleton';
import { AspectRatio } from '@mantine/core';
import { MDXRemoteProps } from 'next-mdx-remote/rsc';
import { Post } from './post';
import { PostFactory } from './post-factory';

export class MantinePostFactory extends PostFactory {
  private static components: MDXRemoteProps['components'] = {
    Image: (props) => (
      <AspectRatio mt={'md'} mb={'md'} w={'100%'} ratio={16 / 9}>
        <ImageWithSkeleton {...props} />
      </AspectRatio>
    ),
    h1: (props) => <TitleWithScroll {...props} order={1} />,
    h2: (props) => <TitleWithScroll {...props} order={2} />,
    h3: (props) => <TitleWithScroll {...props} order={3} />,
    h4: (props) => <TitleWithScroll {...props} order={4} />,
    h5: (props) => <TitleWithScroll {...props} order={5} />,
    h6: (props) => <TitleWithScroll {...props} order={6} />
  };

  public static create(): Promise<Post[]> {
    return super.create(this.components);
  }

  public static forSlug(slug: string): Promise<Post | null> {
    return super.forSlug(slug, this.components);
  }
}
