import type { ReactNode, FC } from 'react';
import { classNames } from '../utils/classNames';

type InfoBoxProps = {
  children: ReactNode;
  className?: string;
};

const InfoBox: FC<InfoBoxProps> = ({ children, className }) => (
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
