function Draft(props: {
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
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>{title}</title>
      <path
        d="M13.5 5L13.0833 12.088C13.0609 12.47 12.8933 12.829 12.6148 13.0915C12.3363 13.354 11.968 13.5001 11.5853 13.5H4.41467C4.03198 13.5001 3.6637 13.354 3.38522 13.0915C3.10674 12.829 2.93912 12.47 2.91667 12.088L2.5 5M6.5 7.75L8 9.25M8 9.25L9.5 10.75M8 9.25L9.5 7.75M8 9.25L6.5 10.75M2.25 5H13.75C14.164 5 14.5 4.664 14.5 4.25V3.25C14.5 2.836 14.164 2.5 13.75 2.5H2.25C1.836 2.5 1.5 2.836 1.5 3.25V4.25C1.5 4.664 1.836 5 2.25 5Z"
        stroke="#6B7280"
        strokeWidth={strokeWidth}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

export default Draft;
