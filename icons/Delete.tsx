import type { FC } from 'react';

type DeleteProps = {
  title?: string;
  className?: string;
  width?: string;
  height?: string;
  strokeWidth?: number;
};

const Delete: FC<DeleteProps> = ({
  title = 'delete',
  strokeWidth = 1.5,
  width = '16',
  height = '16',
  className,
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {' '}
    <title>{title}</title>
    <path
      d="M9.82667 5.99998L9.596 12M6.404 12L6.17333 5.99998M12.8187 3.85998C13.0467 3.89465 13.2733 3.93131 13.5 3.97065M12.8187 3.86065L12.1067 13.1153C12.0776 13.4921 11.9074 13.8441 11.63 14.1008C11.3527 14.3575 10.9886 14.5001 10.6107 14.5H5.38933C5.0114 14.5001 4.64735 14.3575 4.36999 14.1008C4.09262 13.8441 3.92239 13.4921 3.89333 13.1153L3.18133 3.85998M12.8187 3.85998C12.0492 3.74366 11.2758 3.65538 10.5 3.59531M2.5 3.96998C2.72667 3.93065 2.95333 3.89398 3.18133 3.85998M3.18133 3.85998C3.95076 3.74366 4.72416 3.65538 5.5 3.59531M10.5 3.59531V2.98465C10.5 2.19798 9.89333 1.54198 9.10667 1.51731C8.36908 1.49374 7.63092 1.49374 6.89333 1.51731C6.10667 1.54198 5.5 2.19865 5.5 2.98465V3.59531M10.5 3.59531C8.83581 3.4667 7.16419 3.4667 5.5 3.59531"
      stroke="#6B7280"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Delete;
