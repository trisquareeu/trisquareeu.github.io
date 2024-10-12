# Trisquare Website

## Add a page

To add a page, create a new folder in the `app` directory with the page path. Inside this folder there must be a `page.tsx` file that exports the React component by default. See the [nextjs docs](https://nextjs.org/docs/getting-started/project-structure) for more details.

## Add an MDX page

To add a page, create a new folder in the `app` directory with the page path. Inside this directory there must be a `page.mdx` file with the page content. To edit the components rendered from markdown, change the `mdx-components.tsx` file.

### Example:

***./app/mdx-page/components.tsx***

```typescript
export const TestMDXComponent = () => {
  return <h4>Test</h4>;
};
```

***./app/mdx-page/page.mdx***

```md
import { TestMDXComponent } from './components'
 
export const metadata = {
  title: "My first MDX blog post",
  description: "A short MDX blog post.",
};

# Hello
#### h4
 
This is some **bold** and _italics_ text.
 
This is a list in markdown:
 
- One
- Two
- Three
 
Checkout my React component:

<TestMDXComponent />
```

## Add a blog post

To add a blog post, add a file in the `posts` directory with the path as name. To edit the components rendered from markdown, change the `MDXRemote` component.


### Example:

***./posts/hello.mdx***

```md
---
title: "Metadata Example"
date: "2024-06-01"
author: "Jane Doe"
tags: ["example", "mdx"]
---

# Hello world

5 + 4 = {5 + 4}
```