function Check(props: { title?: string; className?: string }) {
  const title = props.title || "check";
  const className = props.className;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="white"
      // viewBox="0 0 24 24"
      strokeWidth={1.5}
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
}

export default Check;
