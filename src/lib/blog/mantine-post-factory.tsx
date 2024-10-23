import { Center, AspectRatio, Title, Image } from '@mantine/core';
import { Post } from './post';
import { PostFactory } from './post-factory';

export class MantinePostFactory extends PostFactory {
  public static create(): Promise<Post[]> {
    return super.create({
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
    });
  }
}
