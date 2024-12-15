<template>
     <dialog-category ref="createDialog" :isOpen="isOpen" @closeModal="handleClose" dialog-size="max-w-xl">
          <template #title>
               <dialog-title as="h1" class="text-xl font-medium leading-6 text-emerald-600">
                    {{ $t('general.document') }}
               </dialog-title>
          </template>
          <template #body @click.stop>
               <div @click.stop>
                    <skeleton-loader v-if="isGeneratingPdf" width="100%" height="64px" />
                    <general-iframe v-if="!showQuillEditor && pdfBlobUrl && !isGeneratingPdf" :source="pdfBlobUrl"
                         @click.stop />

                    <QuillEditor v-if="showQuillEditor" ref="quillEditor" theme="snow" toolbar="full"
                         v-model:content="quillDocumentTemplate" content-type="html" class="custom-quill-editor"
                         @click.stop />
                    <div class="flex flex-row ">
                         <div :class="[!showQuillEditor ? 'w-1/2' : 'w-full']">
                              <primary-button type="button" bgColor="emerald" @click="editOrGenerateDocument()"
                                   @click.stop>
                                   <div class="uppercase">{{ $t(showQuillEditor ?
                                        'protocol-instruments.generate-document' : 'protocol-instruments.edit-document')
                                        }}
                                   </div>
                              </primary-button>
                         </div>
                         <div v-if="!showQuillEditor" class="flex w-1/2 justify-around">
                              <primary-button type="button" bgColor="blue" @click="downloadAsWord" @click.stop
                                   class="w-full mx-2">
                                   <div class="uppercase">{{ $t(
                                        'protocol-instruments.doc-format') }}</div>
                              </primary-button>
                              <primary-button type="button" bgColor="red" @click="downloadAsPdf" @click.stop
                                   class="w-full mx-2">
                                   <div class="uppercase">{{ $t(
                                        'protocol-instruments.pdf-format') }}</div>
                              </primary-button>
                         </div>

                    </div>

               </div>
          </template>
          <!-- <template #buttons>
               <primary-button type="button" bgColor="red">
                    <div class="uppercase" @click="deleteVoucher">{{ $t('general.delete') }}</div>
               </primary-button>
          </template> -->
     </dialog-category>
</template>
<script setup>
import { useInstrumentsStore } from '@/stores/instrumentsStore';
import { DialogTitle } from '@headlessui/vue';
import { storeToRefs } from 'pinia';
import { ref, onMounted, nextTick } from 'vue';

import { saveAs } from 'file-saver';
import html2pdf from 'html2pdf.js';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import htmlToPdfmake from 'html-to-pdfmake';

import DialogCategory from '../forms/DialogCategory.vue';
import PrimaryButton from '../Forms/PrimaryButton.vue';
import GeneralIframe from '../forms/GeneraliFrame.vue';
import SkeletonLoader from '../forms/SkeletonLoader.vue';
import { QuillEditor } from '@vueup/vue-quill';

pdfMake.vfs = pdfFonts.vfs;

const instrumentStore = useInstrumentsStore();
const { showEditDocumentTemplate, documentTemplate } = storeToRefs(instrumentStore);
const props = defineProps({
     isOpen: {
          type: Boolean,
          default: false,
     },
});

const handleClose = (closeModal) => {
     showEditDocumentTemplate.value = closeModal;
};

const showQuillEditor = ref(false);
const quillEditor = ref(null);
const quillDocumentTemplate = ref(documentTemplate.value);

const pdfBlobUrl = ref(null);

function editOrGenerateDocument() {
     if (showQuillEditor.value) {
          showQuillEditor.value = false;
          generatePdf(quillDocumentTemplate.value);
     } else {
          showQuillEditor.value = true;
     }
}
onMounted(() => {
     generatePdf(documentTemplate.value);
});
const isGeneratingPdf = ref(false);

async function generatePdf() {
     if (isGeneratingPdf.value) return;
     isGeneratingPdf.value = true;

     try {
          await nextTick(); // Esperar a que el DOM se actualice

          const htmlContent = quillDocumentTemplate.value;

          // Convertir el contenido HTML a un formato compatible con pdfmake
          const content = htmlToPdfmake(htmlContent);

          // Definir el documento pdfmake
          const docDefinition = {
               content: content,
               defaultStyle: {
                    font: 'Roboto',
               },
          };

          // Generar el PDF y obtener el blob
          const pdfDocGenerator = pdfMake.createPdf(docDefinition);

          pdfDocGenerator.getBlob((pdfBlob) => {
               const blobUrl = URL.createObjectURL(pdfBlob);
               pdfBlobUrl.value = blobUrl;
               isGeneratingPdf.value = false;
          });
     } catch (error) {
          console.error('Error al generar el PDF:', error);
          isGeneratingPdf.value = false;
     }
}

// function generatePdfBlobUrl(templateText) {
//      return new Promise((resolve, reject) => {
//           // Create the content div and set styles as before
//           const div = document.createElement('div');
//           div.innerHTML = templateText;
//           div.style.whiteSpace = 'pre-wrap';
//           div.style.fontFamily = 'Helvetica, Arial, sans-serif';
//           div.style.fontSize = '12pt';
//           div.style.width = '180mm';

//           const options = {
//                margin: [10, 10, 30, 10], // Increased bottom margin
//                filename: 'document.pdf',
//                image: { type: 'jpeg', quality: 0.98 },
//                html2canvas: {
//                     scale: 2,
//                     logging: false // Disable html2canvas logging
//                },
//                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
//                logging: false // Try to disable html2pdf.js logging
//           };

//           // Optionally suppress console logs
//           const originalConsoleLog = console.log;
//           console.log = function () { };

//           html2pdf()
//                .from(div)
//                .set(options)
//                .outputPdf('blob')
//                .then(function (pdfBlob) {
//                     console.log = originalConsoleLog; // Restore console.log

//                     const blobUrl = URL.createObjectURL(pdfBlob);
//                     resolve(blobUrl);
//                })
//                .catch(function (err) {
//                     console.log = originalConsoleLog; // Restore console.log

//                     console.error('Error generating PDF:', err);
//                     reject(err);
//                });
//      });
// }

function downloadAsPdf() {
     const link = document.createElement('a');
     link.href = pdfBlobUrl.value;
     link.download = 'documento.pdf';
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
}


function downloadAsWord() {
     try {
          const htmlContent = quillDocumentTemplate.value;
          const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset="utf-8">
          <title>Documento</title>
        </head>
        <body>
    `;
          const footer = `
        </body>
      </html>
    `;
          const fullHtml = header + htmlContent + footer;

          const blob = new Blob(['\ufeff', fullHtml], {
               type: 'application/msword',
          });
          saveAs(blob, 'documento.doc');
     } catch (error) {
          console.error('Error al generar el documento Word:', error);
     }
}

</script>

<style>
.custom-quill-editor {
     height: 100%;
     width: 100%;
}
</style>