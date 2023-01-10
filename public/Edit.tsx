function Edit(props: {
  title?: string;
  className?: string;
  width?: string;
  height?: string;
  strokeWidth?: number;
}) {
  const title = props.title || "home";
  const strokeWidth = props.strokeWidth || 1.5;
  const width = props.width || "16";
  const height = props.height || "16";
  const className = props.className;

  return (
    <svg
      fill="none"
      height={height}
      viewBox="0 0 16 16"
      width={width}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>{title}</title>
      <clipPath id="a">
        <path d="m0 0h16v16h-16z" />
      </clipPath>
      <g clip-path="url(#a)">
        <path
          d="m11.2413 2.99138 1.7587 1.75866m-1.7587-1.75866 1.1247-1.12534c.2345-.23445.5524-.36616.884-.36616s.6495.13171.884.36616.3662.55244.3662.884c0 .33157-.1317.64955-.3662.884l-9.57933 9.57936c-.35245.3522-.78709.6111-1.26467.7533l-1.79.5333.53333-1.79c.14219-.4775.40109-.9122.75334-1.2646l8.45533-8.45402z"
          stroke="#6b7280"
          stroke-linecap="round"
          stroke-linejoin="round"
          strokeWidth={strokeWidth}
        />
      </g>
    </svg>
  );
}

export default Edit;
