import type { ReactNode } from "react";
import { classNames } from "../utils/classNames";

const Button = (props: {
  fontSize: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}) => {
  const { className, fontSize, children } = props;

  return (
    <button
      type="button"
      className={classNames(
        "text-sm text-gray-500 hover:text-gray-900 hover:underline",
        className,
        fontSize
      )}
    >
      {children}
    </button>
  );
};

export default Button;
