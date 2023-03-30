import { Head, Html, Main, NextScript } from 'next/document';
import type { FC } from 'react';

const CustomDocument: FC = () => (
  <Html className="min-h-screen" lang="en">
    <Head />
    <body className="min-h-screen">
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default CustomDocument;
