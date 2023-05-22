import type { FC } from 'react';

type MagnifyingGlassProps = {
  title?: string;
  className?: string;
  width?: string;
  height?: string;
  strokeWidth?: number;
};

const MagnifyingGlass: FC<MagnifyingGlassProps> = ({
  title = 'magnifying glass',
  className,
  width = '16',
  height = '16',
  strokeWidth = 1.5,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke="currentColor"
    className={className}
    width={width}
    height={height}
  >
    <title>{title}</title>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
    />
  </svg>
);

export default MagnifyingGlass;
