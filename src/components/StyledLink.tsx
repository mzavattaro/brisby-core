import type { ReactNode } from "react";
import { classNames } from "../utils/classNames";
import Link from "next/link";

const StyledLink = (props: {
  fontSize: "xs" | "sm" | "md" | "lg" | "xl";
  href: string;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}) => {
  const { className, fontSize, href, children } = props;

  return (
    <Link
      href={href}
      className={classNames(
        "text-sm text-gray-500 hover:text-gray-900 hover:underline",
        className,
        fontSize
      )}
    >
      {children}
    </Link>
  );
};

export default StyledLink;
