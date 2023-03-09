import type { FC } from "react";
import { Document, Page } from "react-pdf";
import pdfServiceWorker from "../utils/pdfServiceWorker";

type PdfViewer = {
  uploadUrl: string | null;
};

const PdfViewer: FC<PdfViewer> = ({ uploadUrl }) => {
  pdfServiceWorker();

  const displayCanvas = () => {
    const canvas = document.getElementsByClassName("react-pdf__Page");
    setTimeout(() => {
      for (let i = 0; i < canvas.length; i++) {
        canvas[i]?.classList.replace("hidden", "block");
      }
    }, 70);
  };

  return (
    <>
      <Document className="border  bg-white" file={uploadUrl}>
        <Page
          scale={0.4}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          pageIndex={0}
          renderMode="canvas"
          className="hidden aspect-[1/1.414]"
          onRenderSuccess={() => {
            displayCanvas();
          }}
        />
      </Document>
    </>
  );
};

export default PdfViewer;
