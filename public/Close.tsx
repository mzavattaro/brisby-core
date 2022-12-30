import React from "react";

function Close(props: {
  title?: string;
  height?: string;
  width?: string;
  viewBox?: string;
  className?: string;
}) {
  const title = props.title || "close";
  const height = props.height || "16";
  const width = props.width || "16";
  const viewBox = props.viewBox || "0 0 16 16";
  const className = props.className;

  return (
    <svg
      height={height}
      width={width}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>{title}</title>
      <g fill="#111827">
        <path
          d="M14.7,1.3c-0.4-0.4-1-0.4-1.4,0L8,6.6L2.7,1.3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4L6.6,8l-5.3,5.3 c-0.4,0.4-0.4,1,0,1.4C1.5,14.9,1.7,15,2,15s0.5-0.1,0.7-0.3L8,9.4l5.3,5.3c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3 c0.4-0.4,0.4-1,0-1.4L9.4,8l5.3-5.3C15.1,2.3,15.1,1.7,14.7,1.3z"
          fill="#111827"
        />
      </g>
    </svg>
  );
}

export default Close;
