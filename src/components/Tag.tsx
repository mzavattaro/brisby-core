import type { ReactNode } from "react";
import { classNames } from "../utils/classNames";

type Tag = {
  type: "draft" | "published" | "archived";
  children: ReactNode;
  state: string | null;
};

const Tag: React.FC<Tag> = ({ type, state, children }) => {
  return (
    <div
      className={classNames(
        "w-fit rounded-b-sm px-2 py-1 text-xs font-medium",
        state === "draft" && "bg-orange-100 text-orange-800",
        state === "published" && "bg-green-100 text-green-800",
        state === "archived" && "bg-gray-100 text-gray-800"
      )}
    >
      {children}
    </div>
  );
};

export default Tag;
