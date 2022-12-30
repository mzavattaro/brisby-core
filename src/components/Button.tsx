import type { ReactNode } from "react";
import { classNames } from "../utils/classNames";

const Button = (props: {
  buttonType: "primary" | "secondary" | "tertiary";
  buttonSize: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  onClick?: () => void;
  children: ReactNode;
  type: "button" | "submit" | "reset";
}) => {
  const { className, buttonType, buttonSize, type, children } = props;

  return (
    <button
      type={type}
      className={classNames(
        "inline-flex items-center rounded border border-transparent font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        className,
        buttonType === "primary" &&
          "bg-indigo-600 text-white hover:bg-indigo-700",
        buttonType === "secondary" &&
          "bg-indigo-100 text-indigo-700 hover:bg-indigo-200",
        buttonType === "tertiary" &&
          "border-gray-300 bg-white hover:bg-gray-50",
        buttonSize === "xs" && "px-2.5 py-1.5 text-xs",
        buttonSize === "sm" && "px-3 py-2 text-sm",
        buttonSize === "md" && "px-4 py-2 text-sm",
        buttonSize === "lg" && "px-4 py-2 text-base",
        buttonSize === "xl" && "px-6 py-3 text-base"
      )}
    >
      {children}
    </button>
  );
};

export default Button;
