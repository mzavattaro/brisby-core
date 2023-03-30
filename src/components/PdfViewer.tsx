import type { FC } from 'react';
import { Document, Page } from 'react-pdf';
import pdfServiceWorker from '../utils/pdfServiceWorker';

type PdfViewerProps = {
  uploadUrl: string | null;
};

const PdfViewer: FC<PdfViewerProps> = ({ uploadUrl }) => {
  pdfServiceWorker();

  const displayCanvas = () => {
    const canvas = document.getElementsByClassName('react-pdf__Page');
    setTimeout(() => {
      Array.from(canvas).forEach((element) => {
        if (element.classList.contains('hidden')) {
          element.classList.replace('hidden', 'block');
        }
      });
    }, 70);
  };

  return (
    <Document className="bg-white" file={uploadUrl}>
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
  );
};

export default PdfViewer;
