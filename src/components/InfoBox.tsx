import type { ReactNode, FC } from 'react';
import { classNames } from '../utils/classNames';

type infoBox = {
  children: ReactNode;
  className?: string;
};

const InfoBox: FC<infoBox> = ({ children, className }) => (
  <div
    className={classNames(
      'max-w-md rounded-md border bg-white p-6 shadow-lg',
      className
    )}
  >
    {children}
  </div>
);

export default InfoBox;
