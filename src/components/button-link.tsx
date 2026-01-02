'use client';

import { Button, ButtonProps } from "@mantine/core";
import Link, { LinkProps } from "next/link";

export const ButtonLink = (props: ButtonProps & LinkProps) => {
    return <Button component={Link} {...props}>
        {props.children}
    </Button>;
}

