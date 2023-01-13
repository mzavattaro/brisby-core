import type { ReactNode } from "react";
import ToolBar from "./ToolBar";
import { z } from "zod";

type GridLayout = {
  children: ReactNode;
};

const GridLayout: React.FC<GridLayout> = ({ children }) => {
  return (
    <>
      <div
        role="list"
        className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-8 pt-6 pb-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {children}
      </div>
      <div className="fixed bottom-4 w-full">
        <ToolBar />
      </div>
    </>
  );
};

export default GridLayout;
