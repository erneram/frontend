<template>
     <dialog-category ref="createDialog" :isOpen="props.isOpen" @close-modal="handleClose" dialog-size="max-w-6xl"
          :is-children-open="showVoucherDialog || showDeleteVoucherDialog || showEditDocumentTemplate">
          <template #title>
               <dialog-title as="h1" class="text-xl font-medium leading-6 text-emerald-600">
                    {{ $t('protocol-instruments.detail') }}
               </dialog-title>
          </template>
          <template #body>
               <div class="justify-center">
                    <div class="mr-2">
                         <dialog-title as="h4" class="text-lg mt-2 mb-2 font-medium leading-6 text-emerald-600">
                              {{ $t('protocol-instruments.instrument-information') }}
                         </dialog-title>
                         <div v-if="isLoadingViewInstruments" class="grid grid-cols-2 gap-4">
                              <div v-for="(item, index) in 6" :key="index" class="w-full h-16">
                                   <skeleton-loader width="100%" height="64px" />
                              </div>
                         </div>
                         <div v-else>
                              <dl class="grid grid-cols-1 sm:grid-cols-2">
                                   <div class="border-t border-gray-100 px-4 sm:col-span-1 sm:px-0">
                                        <dt class="mt-1 text-sm font-bold leading-6 text-gray-700 sm:mt-2">{{
                                             $t('protocol-instruments.no-writing') }}</dt>
                                        <dd class="mb-4 ml-4 text-sm leading-6 text-gray-700">
                                             {{ currentViewLawyer.number }}
                                        </dd>
                                   </div>
                                   <div class="border-t border-gray-100 px-4 sm:col-span-1 sm:px-0">
                                        <dt class="mt-1 text-sm font-bold leading-6 text-gray-700 sm:mt-2">{{
                                             $t('protocol-instruments.customer') }}</dt>
                                        <dd class="mb-4 ml-4 text-sm leading-6 text-gray-700">
                                             {{ currentViewLawyer.client }}
                                        </dd>
                                   </div>
                                   <div class="border-t border-gray-100 px-4 sm:col-span-1 sm:px-0">
                                        <dt class="mt-1 text-sm font-bold  leading-6 text-gray-700 sm:mt-2">{{
                                             $t('protocol-instruments.type-of-instrument') }}</dt>
                                        <dd class="mb-4 ml-4 text-sm leading-6 text-gray-700">
                                             {{ currentViewLawyer.instrumentType.name }}
                                        </dd>
                                   </div>
                                   <div class="border-t border-gray-100 px-4 sm:col-span-1 sm:px-0">
                                        <dt class="mt-1 text-sm font-bold  leading-6 text-gray-700 sm:mt-2">{{
                                             $t('protocol-instruments.date') }}</dt>
                                        <dd class="mb-4 ml-4 text-sm leading-6 text-gray-700">
                                             {{ formatDate(currentViewLawyer.date) }}
                                        </dd>
                                   </div>
                                   <div class="border-t border-gray-100 px-4 sm:col-span-1 sm:px-0">
                                        <dt class="mt-1 text-sm font-bold  leading-6 text-gray-700">{{
                                             $t('protocol-instruments.state') }}</dt>
                                        <dd class="mb-4 ml-4 text-sm leading-6 text-gray-700">
                                             {{ currentViewLawyer.instrumentStatus.name }}
                                        </dd>
                                   </div>
                                   <div class="border-t border-gray-100 px-4 sm:col-span-1 sm:px-0">
                                        <dt class="mt-1 text-sm font-bold  leading-6 text-gray-700 sm:mt-2">{{
                                             $t('protocol-instruments.folio-in-which-it-begin') }}</dt>
                                        <dd class="mb-4 ml-4 text-sm leading-6 text-gray-700">
                                             {{ currentViewLawyer.starting_folio }}
                                        </dd>
                                   </div>
                              </dl>
                         </div>
                         <dialog-title as="h4" class="text-lg my-4 font-medium leading-6 text-emerald-600">
                              {{ $t('protocol-instruments.notarial-obligation') }}
                         </dialog-title>
                         <div class="flex justify-center space-x-2">
                              <panel v-if="isLoadingViewInstruments || instrumentAlerts.length > 0" class="mb-2 w-1/2">
                                   <div v-if="isLoadingViewInstruments" class="w-full my-2 mr-3">
                                        <skeleton-loader width="100%" height="128px" class="mb-2 w-64" />
                                   </div>
                                   <div v-else>
                                        <dialog-title as="h4"
                                             class="text-lg mb-2 font-medium leading-6 text-emerald-700">
                                             {{ $t('protocol-instruments.attach-proof-of-Notarial-obligations') }}
                                        </dialog-title>
                                        <div v-for="(alert, index) in instrumentAlerts" :key="alert.alert_id"
                                             class="justify-start ">
                                             <div class="flex flex-row mx-2 my-1">
                                                  <input :ref="'filePdf_' + alert.alert_id" class="hidden"
                                                       @change="handleFilePdf($event, index)"
                                                       :id="'filePublicDeedTermination_input_' + alert.alert_id"
                                                       type="file" accept="application/pdf"
                                                       :disabled="alertStatusId[index] === 2">
                                                  <div class="flex justify-between items-center space-x-2">
                                                       <a :disabled="alertStatusId[index] === 2"
                                                            @click="triggerFilePdf(alert.alert_id)">{{
                                                                 alert.name
                                                            }}</a>
                                                  </div>
                                                  <div class="flex space-x-2 ml-auto">
                                                       <action-button-solid-icon v-if="alertStatusId[index] === 1"
                                                            icon="DocumentPlusIcon" size="h-6 w-6 " color="text-red-500"
                                                            @click="triggerFilePdf(alert.alert_id)" />
                                                       <action-button-solid-icon v-if="alertStatusId[index] === 2"
                                                            icon="EyeIcon" size="h-6 w-6 "
                                                            @click="openVoucherDialog(alert.alert_id, currentViewLawyer.id)" />
                                                       <action-button-solid-icon v-if="alertStatusId[index] === 2"
                                                            icon="FolderArrowDownIcon" size="h-6 w-6 "
                                                            @click="downloadPdf(alert.alert_id, currentViewLawyer.id)" />
                                                       <action-button-solid-icon v-if="alertStatusId[index] === 2"
                                                            icon="XCircleIcon" size="h-6 w-6 " color="text-red-500"
                                                            @click="openDeleteVoucherDialog(currentViewLawyer.id, alert.alert_id, index)" />
                                                  </div>
                                             </div>
                                             <div v-if="index != instrumentAlerts.length - 1"
                                                  class="w-full border-t border-gray-300"></div>
                                        </div>
                                   </div>
                              </panel>
                              <panel v-if="isLoadingViewInstruments || instrumentDocument.length > 0"
                                   class="mb-2 w-1/2">
                                   <div v-if="isLoadingViewInstruments" class="w-full my-2 mr-3">
                                        <skeleton-loader width="100%" height="128px" class="mb-2 w-64" />
                                   </div>
                                   <div v-else>
                                        <dialog-title as="h4"
                                             class="text-lg mb-2 font-medium leading-6 text-emerald-700">
                                             {{ $t('protocol-instruments.particular-obligations-instruments') }}
                                        </dialog-title>
                                        <div v-for="(item, index) in instrumentDocument" :key="item.id"
                                             class="justify-start">
                                             <div class="flex flex-row mx-2 my-1">
                                                  <div class="flex justify-between items-center space-x-2">
                                                       {{ item.name }}

                                                  </div>
                                                  <div class="flex space-x-2 ml-auto">
                                                       <action-button-solid-icon icon="PencilSquareIcon" size="h-6 w-6 "
                                                            color="text-emerald-500"
                                                            @click="openEditDocumentTemplate(item.template)" />
                                                  </div>
                                             </div>
                                             <div v-if="index != instrumentAlerts.length - 1"
                                                  class="w-full border-t border-gray-300"></div>
                                        </div>
                                   </div>
                              </panel>

                         </div>
                    </div>
                    <div>
                         <div v-if="isLoadingViewInstruments && !isData()"
                              class="overflow-visible my-2 mr-3 w-[auto] h-[auto]">
                              <skeleton-loader width="100%" height="128px" class="mb-2" />
                         </div>
                         <div v-else>
                              <input-select @selectedInput="handleFetchPdf" inputType="normal"
                                   :currentIdView="currentViewLawyer.id" :options="currentNotarialDocuments"
                                   :parts="currentParts" class="mb-2" />
                              <QuillEditor v-if="showQuillEditor" ref="quillEditor" theme="snow" toolbar="minimal"
                                   :content="currentTextEditing" content-type="html" class="custom-quill-editor"
                                   scrolling-container="auto" />
                              <primary-button v-if="showQuillEditor && !returnEditing" type="button"
                                   @click="generateNewDocument()">
                                   <div>{{ $t('protocol-instruments.generate-document') }}</div>
                              </primary-button>
                         </div>

                         <div v-if="isLoadingViewInstruments && !isData()"
                              class="overflow-visible my-2 mr-3 w-[auto] h-[auto]">
                              <skeleton-loader width="100%" height="128px" class="mb-2" />
                         </div>
                         <div v-else>
                              <iframe v-if="!showQuillEditor" :src="url" frameborder="0" width="100%"
                                   height="500px"></iframe>
                              <primary-button v-if="!showQuillEditor && returnEditing" type="button"
                                   @click="returnToEditing()">
                                   <div>{{ $t('protocol-instruments.return-to-editing') }}</div>
                              </primary-button>
                         </div>
                    </div>
               </div>
          </template>
          <template #buttons>
               <button tabindex="0" class="sr-only">hidden</button>
          </template>
     </dialog-category>
</template>
<script setup>
import { DialogTitle } from '@headlessui/vue'
import { useInstrumentsStore } from '@/stores/instrumentsStore.js'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { QuillEditor } from '@vueup/vue-quill'
import { ref, watch, computed, defineAsyncComponent } from 'vue'

const SkeletonLoader = defineAsyncComponent(() => import('../forms/SkeletonLoader.vue'))

import Panel from '@/components/forms/Panel.vue'
import ActionButtonSolidIcon from '@/components/buttons/ActionButtonSolidIcon.vue'
import DialogCategory from "@/components/forms/DialogCategory.vue"
import PrimaryButton from "@/components/forms/PrimaryButton.vue"
import InputSelect from "@/components/instrumentsComponents/InputSelect.vue"
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import AlertsAlertReportCalendar from '../alertsAlertReportComponents/AlertsAlertReportCalendar.vue'

const instrumentsStore = useInstrumentsStore()
const { showViewDialog, indexFile, defaultText, isLoadingViewInstruments, currentViewLawyer, showVoucherDialog, showDeleteVoucherDialog, voucherNumber, currentDeletingId, arrayDeletingIndex, showEditDocumentTemplate } = storeToRefs(instrumentsStore)
const { openVoucherDialog, openDeleteVoucherDialog, hideVoucherDialog, openEditDocumentTemplate } = instrumentsStore
const isData = () => {
     if (Object.keys(currentViewLawyer.value).length > 0) {
          return true
     } else {
          return false
     }
}
const props = defineProps({
     isOpen: {
          type: Boolean,
          default: false,
     }
})
const handleClose = (closeModal) => {
     showViewDialog.value = closeModal
}
const currentNotarialDocuments = computed(() => {
     return currentViewLawyer.value.notarial_documents || []
})
const currentParts = computed(() => {
     return currentViewLawyer.value.parts || []
})

//PEDIR NUEVO DOCUMENT PDF
const returnEditing = ref(false)
const showQuillEditor = ref(false)
const actualDocumentIds = ref(null)
const currentTextEditing = computed(() => {
     return defaultText.value !== null ? defaultText.value.template : null
})
const quillEditor = ref(null);
const handleFetchPdf = (documentIds) => {
     actualDocumentIds.value = documentIds
     if (documentIds.name === 'Sin documentos') {
          instrumentsStore.getIndexFile()
          generateNewDocument()
     } else {
          instrumentsStore.getDocumentText(documentIds.general_id, documentIds.document_id, documentIds.id)
          returnEditing.value = false
          showQuillEditor.value = true
     }
}
const generateNewDocument = () => {
     if (actualDocumentIds.value.name !== 'Sin documentos') {
          instrumentsStore.generateNewDocument(actualDocumentIds.value.document_id, actualDocumentIds.value.general_id, quillEditor.value.getHTML().replace('<p>', '').replace('</p>', ''))
     }
     showQuillEditor.value = false
     returnEditing.value = true
}
//Upload files
const alertStatusId = ref([])
const instrumentAlerts = computed(() => {
     alertStatusId.value = currentViewLawyer.value.instrumentAlert.map(alert => alert.alert_status_id)
     return currentViewLawyer.value.instrumentAlert || []
})
const instrumentDocument = computed(() => {
     return currentViewLawyer.value.instrumentType.documents || []
})
const updateAlertStatus = (index, status) => {
     instrumentAlerts.value[index].alert_status_id = status; // Cambia directamente en instrumentAlerts
};

// const alertStatusId = computed(() => {
//      console.log(instrumentAlerts.value.map(alert => alert.alert_status_id))
//      return instrumentAlerts.value.map(alert => alert.alert_status_id)
// })
const triggerFilePdf = (alertId) => {
     const fileInput = document.getElementById(`filePublicDeedTermination_input_${alertId}`)
     if (fileInput) {
          fileInput.click()
     }
}
const handleFilePdf = (event, index) => {
     const files = event.target.files
     if (files.length > 0) {
          try {
               instrumentsStore.uploadNotaralObligations(files[0], currentViewLawyer.value.id, instrumentAlerts.value[index].alert_id, 0)
               updateAlertStatus(index, 2)
          } catch (error) {
               updateAlertStatus(index, 1)
          }
     } else {
          updateAlertStatus(index, 1)
     }
}
const downloadPdf = (alertId, currentId) => {
     instrumentsStore.downloadNotarialObligationsPdf(alertId, currentId, 'forDownload')
}
const resetFileInput = (index) => {
     const fileInput = document.getElementById(`filePublicDeedTermination_input_${instrumentAlerts.value[index].alert_id}`)
     fileInput.value = ''
}
//TABLA
const months = ['calendar.january', 'calendar.february', 'calendar.march', 'calendar.april', 'calendar.may', 'calendar.june', 'calendar.july', 'calendar.august', 'calendar.september', 'calendar.october', 'calendar.november', 'calendar.december']
const blobUrl = ref('')
function createBlobUrl(index) {
     const sliceSize = 512
     const byteCharacters = window.atob(index)
     const byteArrays = []
     for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize)
          const byteNumbers = new Array(slice.length)
          for (let i = 0; i < slice.length; i++) {
               byteNumbers[i] = slice.charCodeAt(i)
          }
          const byteArray = new Uint8Array(byteNumbers)
          byteArrays.push(byteArray)
     }
     const blob = new Blob(byteArrays, { type: 'application/pdf' })
     return URL.createObjectURL(blob)
}
// const url = ref(indexFile)
// blobUrl.value = createBlobUrl(url.value)
// watch(() => indexFile.value, (newIndex) => { 
//      url.value = newIndex
//      blobUrl.value = createBlobUrl(url.value)
//      returnEditing.value = true
// })
const url = computed(() => {
     if (indexFile.value !== null) {
          return createBlobUrl(indexFile.value)
     }
})
const returnToEditing = () => {
     returnEditing.value = false
     showQuillEditor.value = true
}
const { t } = useI18n()
const formatDate = (date) => {
     if (date == null) {
          return date
     } else if (date !== null) {
          const parts = date.split('-')
          if (parts.length === 3) {
               const day = parseInt(parts[2], 10)
               const month = parseInt(parts[1], 10) - 1
               const year = parseInt(parts[0], 10)
               const correctMonth = months[month]
               return `${day} de ${t(correctMonth)}  de ${year}`
          }
     }
}
</script>
<style>
.custom-quill-editor {
     height: 100%;
     width: 100%;
}
</style>