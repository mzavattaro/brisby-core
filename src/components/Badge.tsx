import type { ReactNode, FC } from "react";
import { classNames } from "../utils/classNames";

type Badge = {
  children: ReactNode;
  status: string | null;
};

const Tag: FC<Badge> = ({ status, children }) => {
  return (
    <div
      className={classNames(
        "w-fit rounded-b-sm px-2 py-1 text-xs font-medium",
        status === "draft" &&
          "inline-flex items-center rounded bg-red-100 px-2 py-0.5 text-xs font-medium capitalize text-red-800",
        status === "published" &&
          "inline-flex items-center rounded bg-green-100 px-2 py-0.5 text-xs font-medium capitalize text-green-800",
        status === "archived" &&
          "inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium capitalize text-gray-800"
      )}
    >
      {children}
    </div>
  );
};

export default Tag;
