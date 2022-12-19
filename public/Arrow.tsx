function Arrow(props: { width?: string; height?: string; title?: string }) {
  const width = props.width || "16";
  const height = props.height || "16";
  const title = props.title || "up arrow";

  return (
    <svg
      height={height}
      width={width}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <g fill="#6B7280">
        <path
          d="M14,12a1,1,0,0,1-.707-.293L8,6.414,2.707,11.707a1,1,0,0,1-1.414-1.414l6-6a1,1,0,0,1,1.414,0l6,6A1,1,0,0,1,14,12Z"
          fill="#6B7280"
        />
      </g>
    </svg>
  );
}

export default Arrow;
