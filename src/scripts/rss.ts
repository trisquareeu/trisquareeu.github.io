import { writeFile } from 'fs/promises';
import RSS from 'rss';

async function generate() {
  const { PostFactory } = await import('../lib/blog/post-factory');
  const posts = await PostFactory.create();

  const allTags = posts.reduce((tags, post) => {
    post.metadata.tags.forEach((tag) => tags.add(tag));

    return tags;
  }, new Set<string>());

  const feed = new RSS({
    title: 'trisquare.eu | blog',
    site_url: 'https://trisquare.eu/blog',
    feed_url: 'https://trisquare.eu/feed.xml',
    description: 'Trisquare blog posts',
    copyright: 'MIT',
    language: 'en',
    categories: Array.from(allTags)
  });

  posts.forEach((post) =>
    feed.item({
      title: post.metadata.title,
      url: `https://trisquare.eu/blog/${post.slug}`,
      date: post.metadata.publishDate,
      description: post.metadata.description,
      categories: post.metadata.tags,
      author: post.metadata.authors.join(', '),
      enclosure: {
        url: `https://trisquare.eu/${post.metadata.cover}`,
        size: 1668, //
        type: 'image/png'
      }
    })
  );

  await writeFile('./public/feed.xml', feed.xml({ indent: true }));
}

generate();
