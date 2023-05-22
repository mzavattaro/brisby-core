import type { FC } from 'react';

type ChevronDownProps = {
  title?: string;
  className?: string;
  strokeWidth?: number;
};

const ChevronDown: FC<ChevronDownProps> = ({
  title = 'check',
  className = 'h-6 w-6',
  strokeWidth = 1.5,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke="currentColor"
    className={className}
  >
    <title>{title}</title>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
    />
  </svg>
);

export default ChevronDown;
