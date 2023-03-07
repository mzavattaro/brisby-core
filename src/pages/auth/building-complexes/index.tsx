import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../../../utils/trpc";
import InfoBox from "../../../components/InfoBox";
import StyledLink from "../../../components/StyledLink";
import {
  HomeIcon,
  BuildingOfficeIcon,
  BuildingLibraryIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/24/outline";

const BuildingComplexes: NextPage = () => {
  const { data: sessionData } = useSession();

  const { data: buildingComplexes } =
    trpc.buildingComplex.byOrganisation.useQuery();

  const organisationArray = buildingComplexes?.flatMap(
    (buildingComplex) => buildingComplex.organisation.name ?? []
  );

  const organisationName = organisationArray?.shift();

  return (
    <div className="mx-4 mt-6 flex flex-col items-center sm:mx-auto sm:w-full sm:max-w-2xl">
      {buildingComplexes?.length === 0 && (
        <p className="text-sm text-gray-500">Step 3 of 3</p>
      )}
      <h4 className="text-3xl font-bold text-gray-900">Brisby</h4>

      {buildingComplexes?.length === 0 ? (
        <InfoBox className="mt-6 flex flex-col items-center py-6 px-10 text-center">
          <div className="mb-6 flex">
            <HomeIcon className="h-6 w-6" />
            <BuildingLibraryIcon className="mx-4 h-6 w-6" />
            <BuildingOfficeIcon className="h-6 w-6" />
          </div>
          <h5 className="mb-2 text-xl font-bold">Building Complexes</h5>
          <p>
            You don&apos;t have any building complexes for your notices. Get
            started by creating your first <b>building complex</b>.
          </p>
          <StyledLink
            className="mt-10 px-5"
            href={"/auth/building-complexes/new"}
            type="button"
          >
            Create builing complex
          </StyledLink>
        </InfoBox>
      ) : (
        <div className="flex w-full flex-col items-center">
          <h1 className="my-6 text-2xl font-bold">View a noticeboard</h1>
          <div className="flex h-14 w-full items-center rounded-t-lg border bg-indigo-50 px-4">
            <h3>
              Building complexes for{" "}
              <span className="font-semibold">{organisationName}</span>
            </h3>
          </div>
          <ul
            role="list"
            className="h-96 w-full divide-y divide-gray-200 overflow-scroll rounded-b-lg border-l border-r border-b px-4"
          >
            {buildingComplexes?.map((buildingComplex) => (
              <li
                key={buildingComplex.id}
                className="flex w-full flex-col place-content-between py-2 sm:flex-row sm:items-center sm:px-0"
              >
                <div>
                  <p className="text-sm">{buildingComplex.name}</p>
                  <p className="text-xs text-gray-500">
                    {buildingComplex.streetAddress}, {buildingComplex.suburb}
                  </p>
                </div>
                <StyledLink
                  type="link"
                  href={{
                    pathname: "/[buildingId]/noticeboard",
                    query: { buildingId: buildingComplex.id },
                  }}
                  className="mt-2 flex flex-row items-center sm:mt-0"
                >
                  <span>View noticeboard</span>
                  <ArrowLongRightIcon className="ml-1 h-6 w-6" />
                </StyledLink>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex w-full flex-col place-content-between items-center rounded-lg border py-4 px-4 sm:h-21 sm:flex-row sm:py-0">
            <h3 className="font-semibold">
              Need to notify a new building complex?
            </h3>
            <StyledLink
              className="mt-4 px-5 sm:mt-0"
              href={"/auth/building-complexes/new"}
              type="button"
            >
              Create building complex
            </StyledLink>
          </div>
          <div className="mt-4 flex w-full flex-col items-center justify-center text-xs sm:mt-10 sm:flex-row sm:text-base">
            <p>Not seeing your building complex?</p>
            <button
              className="ml-1 flex items-center py-0 px-0 text-xs text-indigo-700 hover:underline sm:text-base"
              type="button"
              onClick={
                sessionData
                  ? () => signOut({ callbackUrl: "/" })
                  : () =>
                      signIn("email", {
                        callbackUrl: "/auth/check-credentials",
                      })
              }
            >
              {sessionData
                ? "Sign out and use a different email address"
                : "Sign in"}
              <ArrowLongRightIcon className="ml-1 h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildingComplexes;
