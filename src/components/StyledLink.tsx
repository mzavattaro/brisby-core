import type { ReactNode, FC } from 'react';
import { classNames } from '../utils/classNames';
import Link from 'next/link';

type StyledLinkProps = {
  type: 'button' | 'link';
  href: string | string | { pathname: string; query: { buildingId: string } };
  className?: string;
  onClick?: () => void;
  children: ReactNode;
};

const StyledLink: FC<StyledLinkProps> = ({
  type,
  href,
  className,
  children,
  onClick,
}) => (
  <Link
    href={href}
    onClick={onClick}
    className={classNames(
      className,
      type === 'button' &&
        'inline-flex items-center rounded border border-transparent bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
      type === 'link' &&
        'h-max text-sm text-gray-500 hover:text-gray-900 hover:underline'
    )}
  >
    {children}
  </Link>
);

export default StyledLink;
