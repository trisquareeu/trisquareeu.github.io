import { noop, Skeleton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
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

export { WithSkeleton };
