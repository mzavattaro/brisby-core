import type { ReactNode, FC } from 'react';
import { classNames } from '../utils/classNames';

type BadgeProps = {
  children: ReactNode;
  status: string | null;
};

const Badge: FC<BadgeProps> = ({ status, children }) => (
  <div
    className={classNames(
      status === 'draft' &&
        'inline-flex h-6 items-center rounded-md bg-red-100 px-2.5 py-0.5 text-sm font-medium capitalize text-red-800',
      status === 'published' &&
        'inline-flex h-6 items-center rounded-md bg-green-100 px-2.5 py-0.5 text-sm font-medium capitalize text-green-800',
      status === 'archived' &&
        'inline-flex h-6 items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-sm font-medium capitalize text-gray-800'
    )}
  >
    {children}
  </div>
);

export default Badge;
