import { useState } from 'react';

const useModal = (): {
  isShowing: boolean;
  toggle: () => void;
} => {
  const [isShowing, setIsShowing] = useState(false);

  const toggle = () => {
    setIsShowing(!isShowing);
  };

  return {
    isShowing,
    toggle,
  };
};

export default useModal;
