import type { FC, ReactNode } from 'react';
import { classNames } from '../utils/classNames';

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

const Container: FC<ContainerProps> = ({ children, className }) => (
  <div
    className={classNames('mx-auto max-w-7xl px-2 sm:px-6 lg:px-8', className)}
  >
    {children}
  </div>
);
export default Container;
