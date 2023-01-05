import { useState } from "react";
import { createPortal } from "react-dom";

const Portal = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="z-25">
      <button onClick={() => setShowModal(true)}>
        Show modal using a portal
      </button>
      {showModal &&
        createPortal(
          <div className="z-25 absolute inset-0 left-[calc(50%_-_42.25rem/2)] flex h-98 w-122 items-center justify-evenly border-2 bg-red-400 shadow-lg">
            <div>I'm a modal dialog</div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default Portal;
