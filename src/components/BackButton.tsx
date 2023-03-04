import type { FC } from "react";
import { useBuildingComplexIdStore } from "../store/useBuildingComplexIdStore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";

const BackButton: FC = () => {
  const buildingComplexId = useBuildingComplexIdStore((state) => state.id);
  const [backLink, setBackLink] = useState("/");
  const { isReady } = useRouter();

  useEffect(() => {
    if (!isReady || !buildingComplexId) return;

    setBackLink(`/${buildingComplexId}/noticeboard/`);
  }, [isReady, buildingComplexId]);

  return (
    <div className="flex flex-shrink-0 items-center px-4">
      <ArrowLongLeftIcon aria-hidden="true" className="h-6 w-6 text-gray-500" />
      <Link
        className="ml-1 text-sm text-gray-600 hover:underline"
        href={backLink}
      >
        Back to noticeboard
      </Link>
    </div>
  );
};

export default BackButton;
