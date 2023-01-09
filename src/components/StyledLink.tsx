import type { ReactNode } from "react";
import { classNames } from "../utils/classNames";
import Link from "next/link";

const StyledLink = (props: {
  fontSize: "xs" | "sm" | "md" | "lg" | "xl";
  styleType: "button" | "link";
  href: string;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}) => {
  const { className, fontSize, href, styleType, children } = props;

  return (
    <Link
      href={href}
      className={classNames(
        className,
        `text-${fontSize}`,
        styleType === "button" &&
          "inline-flex h-10 items-center rounded border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        styleType === "link" &&
          "h-max text-sm text-gray-500 hover:text-gray-900 hover:underline"
      )}
    >
      {children}
    </Link>
  );
};

export default StyledLink;
