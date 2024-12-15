import * as pdfjsLib from 'pdfjs-dist';
const pdfjsWorker = new URL(
     'pdfjs-dist/build/pdf.worker.min.js',
     import.meta.url
);
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export { pdfjsLib };