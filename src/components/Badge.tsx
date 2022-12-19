import type { ReactNode } from "react";
import { classNames } from "../utils/classNames";

const Badge = (props: {
  variantColor: "blue" | "green" | "red";
  children?: ReactNode;
}) => {
  const { variantColor, children } = props;

  return (
    <div
      className={classNames(
        "shadow-sm shadow-black",
        "flex items-center justify-center",
        "rounded-full",
        variantColor === "red" && "bg-red-400 text-white",
        variantColor === "blue" && "bg-blue-400 text-white",
        variantColor === "green" && "bg-green-400 text-white",
        children
          ? "absolute -top-2 -right-1 h-8 w-8"
          : "absolute -top-1 -right-0.5 h-4 w-4"
      )}
    >
      {children}
    </div>
  );
};

export default Badge;
