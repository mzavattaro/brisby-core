import { Document, Page } from "react-pdf";
import pdfServiceWorker from "../utils/pdfServiceWorker";

const PdfViewer = () => {
  pdfServiceWorker();

  return (
    <>
      <Document file="/sample.pdf">
        <Page
          scale={0.4}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          pageNumber={1}
          renderMode="canvas"
          className="aspect-[1/1.414]"
        />
      </Document>
    </>
  );
};

export default PdfViewer;
