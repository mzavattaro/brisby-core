import type { ReactNode } from "react";
import { classNames } from "../utils/classNames";
import Link from "next/link";

type StyledLink = {
  styleType: "button" | "link";
  href: string;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
};

const StyledLink: React.FC<StyledLink> = ({
  styleType,
  href,
  className,
  children,
}) => {
  return (
    <Link
      href={href}
      className={classNames(
        className,
        styleType === "button" &&
          "inline-flex items-center rounded border border-transparent bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        styleType === "link" &&
          "h-max text-sm text-gray-500 hover:text-gray-900 hover:underline"
      )}
    >
      {children}
    </Link>
  );
};

export default StyledLink;
