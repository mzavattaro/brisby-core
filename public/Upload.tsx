function UploadFile(props: {
  width?: string;
  height?: string;
  title?: string;
  strokeWidth?: number;
}) {
  const title = props.title || "upload";
  const strokeWidth = props.strokeWidth || 1.5;
  const width = props.width || "24";
  const height = props.height || "24";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      className="h-6 w-6"
      height={width}
      width={height}
    >
      <title>{title}</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
      />
    </svg>
  );
}

export default UploadFile;
