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
        status === "draft" &&
          "inline-flex items-center rounded-md bg-red-100 px-2.5 py-0.5 text-sm font-medium capitalize text-red-800",
        status === "published" &&
          "inline-flex items-center rounded-md bg-green-100 px-2.5 py-0.5 text-sm font-medium capitalize text-green-800",
        status === "archived" &&
          "inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-sm font-medium capitalize text-gray-800"
      )}
    >
      {children}
    </div>
  );
};

export default Tag;
