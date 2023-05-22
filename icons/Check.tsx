import type { FC } from 'react';

type CheckProps = {
  title?: string;
  className?: string;
  strokeWidth?: number;
};

const Check: FC<CheckProps> = ({
  title = 'check',
  className,
  strokeWidth = 1.5,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="white"
    // viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke="currentColor"
    className={className}
  >
    <title>{title}</title>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 12.75l6 6 9-13.5"
    />
  </svg>
);

export default Check;
