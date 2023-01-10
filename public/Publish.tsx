function Publish(props: {
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
        d="M2 11V12.5C2 12.8978 2.15804 13.2794 2.43934 13.5607C2.72064 13.842 3.10218 14 3.5 14H12.5C12.8978 14 13.2794 13.842 13.5607 13.5607C13.842 13.2794 14 12.8978 14 12.5V11M5 5L8 2M8 2L11 5M8 2V11"
        stroke="#6B7280"
        strokeWidth={strokeWidth}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

export default Publish;
