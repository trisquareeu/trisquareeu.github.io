import { readdirSync } from 'fs';
import { join } from 'path';
import { Post } from './post';
import { isFuture } from '@/components/is-future';
import { MDXRemoteProps } from 'next-mdx-remote/rsc';

export class PostFactory {
  private static readonly postsPath = join(process.cwd(), 'src', 'posts');
  private static readonly DEV = !!process.env.DEV;

  public static async create(components?: MDXRemoteProps['components']): Promise<Post[]> {
    const postSlugs = readdirSync(this.postsPath);
    const posts = await Promise.all(postSlugs.map((post) => Post.create(this.postsPath, post, components)));

    return posts
      .filter((post) => this.DEV || !isFuture(new Date(post.metadata.publishDate)))
      .filter((post) => this.DEV || !post.metadata.hidden)
      .toSorted((a, b) => new Date(b.metadata.publishDate).getTime() - new Date(a.metadata.publishDate).getTime());
  }

  public static async forSlug(slug: string): Promise<Post | null> {
    try {
      const post = await Post.create(this.postsPath, `${slug}.mdx`);
      if (!this.DEV && (post.metadata.hidden || isFuture(new Date(post.metadata.publishDate)))) {
        return null;
      }

      return post;
    } catch {
      return null;
    }
  }
}
