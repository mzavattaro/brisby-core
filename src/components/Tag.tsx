import type { ReactNode } from "react";
import { classNames } from "../utils/classNames";

type Tag = {
  type: "draft" | "published" | "archived";
  children: ReactNode;
};

const Tag: React.FC<Tag> = ({ type, children }) => {
  return (
    <div
      className={classNames(
        "w-fit rounded-b-sm px-2 py-1 text-xs font-medium",
        type === "draft" && "bg-orange-100 text-orange-800",
        type === "published" && "bg-green-100 text-green-800",
        type === "archived" && "bg-gray-100 text-gray-800"
      )}
    >
      {children}
    </div>
  );
};

export default Tag;