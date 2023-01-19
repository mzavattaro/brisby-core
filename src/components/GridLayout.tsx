import type { ReactNode } from "react";
import ToolBar from "./ToolBar";

type GridLayout = {
  children: ReactNode;
  isFetching: boolean;
};

const GridLayout: React.FC<GridLayout> = ({ children, isFetching }) => {
  if (isFetching) return <>Loading...</>;

  return (
    <>
      <div
        role="list"
        className="grid grid-cols-1 gap-6 pt-6 pb-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {children}
      </div>
      <div className="sticky bottom-12 w-full">
        <ToolBar />
      </div>
    </>
  );
};

export default GridLayout;
