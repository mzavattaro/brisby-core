import type { ReactNode, FC } from "react";

type infoBox = {
  children: ReactNode;
};

const InfoBox: FC<infoBox> = ({ children }) => {
  return (
    <div className="max-w-md rounded-md border bg-white p-6 shadow-lg">
      {children}
    </div>
  );
};

export default InfoBox;
