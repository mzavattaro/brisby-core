import type { ReactNode } from "react";

type Heading = {
  headingSize: "h1" | "h2" | "h3" | "h4" | "h5";
  children: ReactNode;
};

const Heading: React.FC<Heading> = ({ headingSize, children }) => {
  function HeadingSize() {
    if (headingSize === "h1") {
      return <h1 className="text-4xl font-bold">{children}</h1>;
    } else if (headingSize === "h2") {
      return <h2 className="text-3xl font-medium">{children}</h2>;
    } else if (headingSize === "h3") {
      return <h3 className="font-book text-2xl">{children}</h3>;
    } else if (headingSize === "h4") {
      return <h4 className="font-book text-xl"> {children}</h4>;
    } else if (headingSize === "h5")
      <h5 className="font-book text-lg"> {children}</h5>;
  }

  return <>{HeadingSize()}</>;
};

export default Heading;
