import { ArticleSvg } from '@/components/article-svg/article-svg';
import { Code } from '@/components/code';
import { Note } from '@/components/note';
import { TitleWithScroll } from '@/components/with-scroll';
import { ImageWithSkeleton } from '@/components/with-skeleton';
import { CodeHighlight, InlineCodeHighlight } from '@mantine/code-highlight';
import { Anchor, AspectRatio, Center, Stack } from '@mantine/core';
import { MDXRemoteProps } from 'next-mdx-remote/rsc';
import { Post } from './post';
import { PostFactory } from './post-factory';
import { BarChart } from '@mantine/charts';

export class MantinePostFactory extends PostFactory {
  private static components: MDXRemoteProps['components'] = {
    Image: (props) => (
      <AspectRatio mt={'xl'} mb={'xl'} w={props.w} bg={'red'} ratio={props.ratio ?? 16 / 9}>
        <ImageWithSkeleton {...props} />
      </AspectRatio>
    ),
    h1: (props) => <TitleWithScroll mt={'xl'} mb={'xl'} {...props} order={1} />,
    h2: (props) => <TitleWithScroll mt={'xl'} {...props} order={2} />,
    h3: (props) => <TitleWithScroll mt={'xl'} {...props} order={3} />,
    h4: (props) => <TitleWithScroll mt={'xl'} {...props} order={4} />,
    h5: (props) => <TitleWithScroll mt={'xl'} {...props} order={5} />,
    h6: (props) => <TitleWithScroll mt={'xl'} {...props} order={6} />,
    Center: (props) => <Center {...props} />,
    Stack: (props) => <Stack {...props} />,
    Code: (props) => <Code {...props} />,
    InlineCode: (props) => <InlineCodeHighlight {...props} />,
    CodeExample: (props) => <CodeHighlight {...props} />,
    Note: (props) => <Note {...props} />,
    a: (props) => <Anchor {...props} ref={null} />,
    ArticleSvg: (props) => (
      <Center mt={'xl'} mb={'xl'}>
        <ArticleSvg {...props} />
      </Center>
    ),
    BarChart: (props) => (
      <Center>
        <BarChart mt={'lg'} mb={'lg'} {...props} />
      </Center>
    )
  };

  public static create(): Promise<Post[]> {
    return super.create(this.components);
  }

  public static forSlug(slug: string): Promise<Post | null> {
    return super.forSlug(slug, this.components);
  }
}
