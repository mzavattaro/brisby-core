import type { ReactNode } from "react";
import { classNames } from "../utils/classNames";

type Tag = {
  children: ReactNode;
  status: string | null;
};

const Tag: React.FC<Tag> = ({ status, children }) => {
  return (
    <div
      className={classNames(
        "w-fit rounded-b-sm px-2 py-1 text-xs font-medium",
        status === "draft" && "bg-orange-100 text-orange-800",
        status === "published" && "bg-green-100 text-green-800",
        status === "archived" && "bg-gray-100 text-gray-800"
      )}
    >
      {children}
    </div>
  );
};

export default Tag;
