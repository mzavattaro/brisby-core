import { ReactNode } from "react";
import { classNames } from "../utils/classNames";

type Container = {
  children: ReactNode;
  className?: string;
};

const Container: React.FC<Container> = ({ children, className }) => {
  return (
    <div
      className={classNames(
        "mx-auto max-w-7xl px-2 sm:px-6 lg:px-8",
        className
      )}
    >
      {children}
    </div>
  );
};
export default Container;
