'use client';

import { CodeHighlightTabs } from '@mantine/code-highlight';
import '@mantine/code-highlight/styles.css';
import { noop, ThemeIcon } from '@mantine/core';
import { IconBrandAmongUs, IconBrandPython, IconBrandTypescript } from '@tabler/icons-react';
import { createContext, PropsWithChildren, ReactNode, useContext, useState } from 'react';

export type CodeContextData = {
  language: string | null;
  setLanguage: (language: string) => void;
};

const CodeContext = createContext<CodeContextData>({ language: null, setLanguage: noop });

export type CodeProps = {
  code: {
    language: string;
    code: string;
  }[];
};

const languageToIconMap = {
  typescript: <IconBrandTypescript />,
  java: <IconBrandAmongUs />,
  python: <IconBrandPython />
} as Record<string, ReactNode>;

export const Code = (props: CodeProps) => {
  const { language, setLanguage } = useContext(CodeContext);

  const activeTab = props.code.findIndex((code) => code.language === language);

  return (
    <CodeHighlightTabs
      mt={16}
      mb={16}
      activeTab={activeTab === -1 ? 0 : activeTab}
      onTabChange={(tab) => setLanguage(props.code[tab].language)}
      code={props.code.map((code) => ({
        ...code,
        fileName: code.language,
        icon: languageToIconMap[code.language] && <ThemeIcon>{languageToIconMap[code.language]}</ThemeIcon>
      }))}
    />
  );
};

export const CodeContextProvider = (props: PropsWithChildren) => {
  const [language, setLanguage] = useState<string | null>(null);

  return <CodeContext.Provider value={{ language, setLanguage }}>{props.children}</CodeContext.Provider>;
};
