import { AspectRatio, Center, Image, Title } from '@mantine/core';
import { readFile } from 'fs/promises';
import { compileMDX } from 'next-mdx-remote/rsc';
import { join } from 'path';

export type PostMetadata = {
  description: string;
  publishDate: string;
  title: string;
  cover: string;
  authors: string[];
  tags: string[];
  readTime: number;
  hidden?: boolean;
};

export type PostData = {
  slug: string;
  isNew: boolean;
  metadata: PostMetadata;
  content: React.ReactNode;
};

export class Post {
  constructor(
    readonly source: string,
    readonly content: React.ReactNode,
    readonly metadata: PostMetadata,
    readonly slug: string
  ) {}

  public static async create(postsPath: string, post: string): Promise<Post> {
    if (!post.endsWith('.mdx')) {
      throw new Error('Invalid post extension');
    }

    const source = await readFile(join(postsPath, post), 'utf8');
    const slug = post.replace('.mdx', '');
    const { frontmatter, content } = await compileMDX<PostMetadata>({
      source,
      components: {
        Image: (props) => (
          <Center>
            <AspectRatio ratio={16 / 9}>
              <Image {...props} radius={'sm'} />
            </AspectRatio>
          </Center>
        ),
        h1: (props) => (
          <Title order={1} mb={'lg'}>
            {props.children}
          </Title>
        ),
        h2: (props) => (
          <Title mb={'lg'} mt={'lg'} order={2}>
            {props.children}
          </Title>
        )
      },
      options: { parseFrontmatter: true }
    });

    return new Post(source, content, frontmatter, slug);
  }

  public toDataFormat(): PostData {
    return {
      slug: this.slug,
      isNew: this.isNew(),
      metadata: this.metadata,
      content: this.content
    };
  }

  public isNew(): boolean {
    return new Date().getTime() - new Date(this.metadata.publishDate).getTime() < 7 * 24 * 60 * 60 * 1000;
  }
}
