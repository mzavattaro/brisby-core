import React from 'react';
import type { FC } from 'react';
import Modal from '../Modal';
import Search from '../Search';

type SearchModalProps = {
  isShowing: boolean;
  hide: () => void;
  cancelButtonRef: React.MutableRefObject<null>;
};

const SearchModal: FC<SearchModalProps> = ({
  isShowing,
  hide,
  cancelButtonRef,
}) => (
  <Modal isShowing={isShowing} hide={hide} cancelButtonRef={cancelButtonRef}>
    <Search />
  </Modal>
);

export default SearchModal;
