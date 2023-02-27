import type { ReactNode } from "react";
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";

type GridLayout = {
  children: ReactNode;
  isFetching: boolean;
  isFetchingNextPage: boolean;
};

const GridLayout: React.FC<GridLayout> = ({
  children,
  isFetching,
  isFetchingNextPage,
}) => {
  const { data: sessionData } = useSession();
  const { data: user } = trpc.user.byId.useQuery({
    id: sessionData?.user?.id,
  });

  if (isFetching && !isFetchingNextPage) return <>Fetching notices</>;

  const buildingComplexAddress = `${
    user?.buildingComplex?.streetAddress || ""
  }, ${user?.buildingComplex?.suburb || ""}`;

  return (
    <>
      <div className="mx-auto mt-4 flex max-w-md flex-col sm:max-w-full md:mt-6">
        <p className="text-sm font-bold md:text-lg">
          {user?.buildingComplex?.name || ""}
        </p>
        <p className="text-xs md:text-sm">
          {buildingComplexAddress ? buildingComplexAddress : ""}
        </p>
      </div>
      <div
        role="list"
        className="mx-auto grid max-w-md grid-cols-1 gap-6 pt-6 pb-12 sm:max-w-full sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {children}
      </div>
    </>
  );
};

export default GridLayout;
