import { Badge } from '@mantine/core';
import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h4: (props) => <Badge>{props.children}</Badge>
  };
}
