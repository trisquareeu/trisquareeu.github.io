'use client';

import { noop, Skeleton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Image, { ImageProps } from 'next/image';
import { createContext, ReactNode } from 'react';

export type SkeletonContextData = {
  visible: boolean;
  toggle: () => void;
};

const SkeletonContext = createContext<SkeletonContextData>({ visible: true, toggle: noop });

export type WithSkeletonProps = {
  children: (context: SkeletonContextData) => ReactNode;
};

const WithSkeleton = (props: WithSkeletonProps) => {
  const [visible, { toggle }] = useDisclosure(true);

  return (
    <Skeleton visible={visible}>
      <SkeletonContext.Provider value={{ visible, toggle }}>
        <SkeletonContext.Consumer>{(context) => props.children(context)}</SkeletonContext.Consumer>
      </SkeletonContext.Provider>
    </Skeleton>
  );
};

WithSkeleton.Consumer = SkeletonContext.Consumer;

const ImageWithSkeleton = (props: ImageProps) => {
  return <WithSkeleton>{({ toggle }) => <Image {...props} onLoad={() => toggle()} fill alt={'alt'} />}</WithSkeleton>;
};

export { WithSkeleton, ImageWithSkeleton };
