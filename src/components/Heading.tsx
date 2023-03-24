import type { FC, ReactNode } from 'react';
import { createElement } from 'react';

type HeadingProps = {
  headingSize: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
  children: ReactNode;
};

const classes = {
  h1: 'text-4xl font-bold',
  h2: 'text-3xl font-medium',
  h3: 'font-book text-2xl',
  h4: 'font-book text-xl',
  h5: 'font-book text-lg',
};

const Heading: FC<HeadingProps> = ({ headingSize, children }) =>
  createElement(
    headingSize,
    {
      className: classes[headingSize],
    },
    children
  );

export default Heading;
