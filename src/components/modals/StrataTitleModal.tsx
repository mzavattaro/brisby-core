import React from 'react';
import type { FC } from 'react';
import Modal from '../Modal';
import StyledLink from '../StyledLink';
import { ArrowLongRightIcon } from '@heroicons/react/24/outline';

type StrataTitleModalProps = {
  handleNextPage: () => void;
  isShowing: boolean;
  hide: () => void;
  cancelButtonRef: React.MutableRefObject<null>;
  toggle: () => void;
  buildingComplexes:
    | {
        organisation: {
          name: string;
        };
        id: string;
        name: string;
        streetAddress: string;
        suburb: string;
        type: string;
        totalOccupancies: number;
      }[]
    | undefined;
};

const StrataTitleModal: FC<StrataTitleModalProps> = ({
  handleNextPage,
  isShowing,
  hide,
  cancelButtonRef,
  toggle: toggleModal,
  buildingComplexes,
}) => (
  <Modal isShowing={isShowing} hide={hide} cancelButtonRef={cancelButtonRef}>
    <div className="text-center sm:text-left">
      <h3 className="text-lg font-medium leading-6 text-gray-900">
        Select Strata Title
      </h3>

      <div className="mt-2">
        <p className="text-sm text-gray-500">
          Select Strata Title to view its notices.
        </p>
      </div>
      <div className="sticky mb-2 mt-6">
        <h4>All Strata Titles</h4>
      </div>
    </div>
    <ul className="h-96 w-full divide-y divide-gray-200 overflow-scroll rounded-lg border">
      {buildingComplexes?.map((buildingComplexData) => (
        <li
          key={buildingComplexData.id}
          className="flex w-full flex-row place-content-between p-2 sm:items-center sm:p-4"
        >
          <div>
            <p className="text-sm">{buildingComplexData.name}</p>
            <p className="text-xs text-gray-500">
              {buildingComplexData.streetAddress}, {buildingComplexData.suburb}
            </p>
          </div>
          <StyledLink
            onClick={toggleModal}
            type="link"
            href={{
              pathname: '/[buildingId]/noticeboard',
              query: { buildingId: buildingComplexData.id },
            }}
            className="mt-2 flex flex-row items-center sm:mt-0"
          >
            <p>View</p>
            <ArrowLongRightIcon className="ml-1 h-6 w-6" />
          </StyledLink>
        </li>
      ))}
    </ul>

    <div className="flex justify-center text-left">
      <StyledLink
        type="button"
        href="/authentication/building-complexes/new"
        className="mt-4 px-4 text-sm"
        onClick={handleNextPage}
      >
        Create new Strata Title
      </StyledLink>
    </div>
  </Modal>
);

export default StrataTitleModal;
