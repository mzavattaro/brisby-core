import { useEffect, useRef } from "react";

const PdfViewer = () => {
  // const viewer = useRef(null);

  // useEffect(() => {
  //   const loadWebViewer = async () => {
  //     const WebViewer = (await import("@pdftron/webviewer")).default;
  //     if (viewer.current) {
  //       WebViewer(
  //         {
  //           path: "/webviewer/lib",
  //           initialDoc: "/sample.pdf",
  //           disabledElements: [
  //             "viewControlsButton",
  //             "viewControlsOverlay",
  //             "toolsOverlay",
  //             "ribbonsDropdown",
  //             "selectToolButton",
  //             "panToolButton",
  //             "leftPanelButton",
  //             "toggleNotesButton",
  //             "toolsHeader",
  //           ],
  //         },
  //         viewer.current
  //       );
  //     }
  //   };
  //   loadWebViewer();
  // }, []);

  return (
    <>
      <embed
        type="application/pdf"
        className="aspect-[1/1.11] w-full"
        src="/sample.pdf#page=1"
      />
    </>
  );
};

export default PdfViewer;
