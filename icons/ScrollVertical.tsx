import type { FC } from 'react';

type ScrollVerticalProps = {
  fill?: string;
  secondaryfill?: string;
  strokewidth?: number;
  width?: string;
  height?: string;
  title?: string;
};

const ScrollVertical: FC<ScrollVerticalProps> = ({
  fill = '#e2e8f0',
  secondaryfill = fill,
  strokewidth = 2,
  width = '48',
  height = '48',
  title = 'scroll vertical',
}) => (
  <svg
    height={height}
    width={width}
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <g
      fill={secondaryfill}
      stroke={secondaryfill}
      strokeLinecap="square"
      strokeLinejoin="miter"
      strokeMiterlimit="10"
      strokeWidth={strokewidth}
    >
      <line fill="none" strokeLinecap="butt" x1="9" x2="9" y1="44" y2="28" />
      <line fill="none" strokeLinecap="butt" x1="9" x2="9" y1="4" y2="20" />
      <line fill="none" stroke={fill} x1="25" x2="25" y1="23" y2="29" />
      <polyline fill="none" points=" 15,38 9,44 3,38 " />
      <polyline fill="none" points="15,10 9,4 3,10 " />
      <path
        d="M42.113,21.223L31,19V8 c0-1.657-1.343-3-3-3h0c-1.657,0-3,1.343-3,3v15h-4c-1.105,0-2,0.895-2,2v8c0,3.5,5,6.062,5,10h18l3.258-17.107 C45.669,23.737,44.266,21.653,42.113,21.223z"
        fill="none"
        stroke={fill}
      />
    </g>
  </svg>
);

export default ScrollVertical;
