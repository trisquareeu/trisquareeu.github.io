import { Alert } from '@mantine/core';
import { IconAlertCircle, IconAlertTriangle, IconInfoHexagon } from '@tabler/icons-react';
import { PropsWithChildren } from 'react';

export type NoteProps = {
  type: 'info' | 'warning' | 'error';
  title?: string;
};

const typeToIcon = {
  info: <IconInfoHexagon />,
  warning: <IconAlertTriangle />,
  error: <IconAlertCircle />
} as const;

const typeToColor = {
  info: 'green',
  warning: 'orange',
  error: 'red'
} as const;

export const Note = (props: PropsWithChildren<NoteProps>) => {
  return (
    <Alert
      mt={'xl'}
      mb={'xl'}
      title={props.title}
      icon={typeToIcon[props.type]}
      color={typeToColor[props.type]}
      {...props}
    >
      {props.children}
    </Alert>
  );
};
