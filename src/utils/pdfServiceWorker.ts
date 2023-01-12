import { pdfjs } from "react-pdf";

const pdfServiceWorker = () => {
  return (pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`);
};

export default pdfServiceWorker;
