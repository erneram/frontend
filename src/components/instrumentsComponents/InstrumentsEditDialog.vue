<template>
     <dialog-category ref="createDialog" :isOpen="isOpen" @closeModal="handleClose" dialog-size="max-w-6xl">
          <template #title>
               <dialog-title as="h3" class="text-lg pb-4 font-medium leading-6 text-emerald-600">
                    {{ $t(currentIdSelected !== 0 ? 'protocol-instruments.edit-instrument' :
                         'protocol-instruments.new-instrument') }}
               </dialog-title>
          </template>
          <template #body>
               <div class="flex justify-center">
                    <div v-if="isLoadingEditInstruments" class="overflow-visible mr-3 w-[500px] h-[500px]">
                         <skeleton-loader width="100%" height="64px" class="mb-2" />
                         <skeleton-loader width="100%" height="100%" />
                    </div>
                    <div v-else>
                         <!-- PDF LOADER -->
                         <div v-if="currentPage === 0">
                              <drag-drop-file-input @sendFiles="handleSendFiles" :data="currentIndex"
                                   title="protocol-instruments.drag-or-click-here-to-upload-the-new-pdf-of-the-instrument" />
                         </div>
                         <iframe :src="blobUrl" frameborder="0" width="100%" height="100%"></iframe>
                         <div class="relative mt-2 mb-4">
                              <div class="absolute inset-0 flex items-center" aria-hidden="true">
                                   <div class="w-full border-t border-gray-300" />
                              </div>
                         </div>
                    </div>
                    <div v-if="isLoadingEditInstruments" class="overflow-visible mr-3 w-[500px] h-[500px]">
                         <div v-for="(item, index) in 6" :key="index">
                              <skeleton-loader width="100%" height="50px" class="mb-2" />
                         </div>
                    </div>
                    <div v-else class="ml-4 flex-1">
                         <tab-group>
                              <tab-list class="flex space-x-1 rounded-xl bg-emerald-900/20 p-1">
                                   <tab v-for="(label, key) in header" :key="key" as="template" v-slot="{ selected }">
                                        <button :class="[
                                             'w-full rounded-lg py-2.5 text-sm font-medium leading-5 uppercase',
                                             'ring-white/60 ring-offset-2 ring-offset-emerald-400 focus:outline-none focus:ring-2',
                                             selected
                                                  ? 'bg-white text-emerald-700 shadow'
                                                  : 'text-emerald-900 hover:bg-emerald/[0.12] hover:text-white'
                                        ]">
                                             {{ $t(label) }}
                                        </button>
                                   </tab>
                              </tab-list>
                              <tab-panels class="mt-2">
                                   <tab-panel v-if="currentPage === 0">
                                        <instrument-forms :data="detail" :types="allTypes" :status="allStatus"
                                             :currentSelected="currentIdSelected" :currentLawyerId="currentLawyerId"
                                             :file="uploadedFile || currentIndex" @updated-data="handleUpdatedData" />
                                   </tab-panel>
                                   <tab-panel v-else-if="currentPage === 1">
                                        <instruments-review-forms :updatedData="reviewData" :types="allTypes"
                                             :status="allStatus" />
                                   </tab-panel>
                                   <tab-panel v-else-if="currentPage === 2" class="flex justify-center">
                                        <spinner-loading />
                                   </tab-panel>
                              </tab-panels>
                         </tab-group>
                    </div>
               </div>
          </template>
          <template #buttons>
               <primary-button v-if="currentPage === 1" type="button" @click="back()" bgColor="orange" class="mr-2 ">
                    <div>{{ $t('general.back') }}</div>
               </primary-button>
               <primary-button type="button" @click="next()"
                    :isDisabled="isLoadingInstrumentStore || (!uploadedFile && currentIndex === null) || !validInputs">
                    <spinner-loading v-if="isLoadingInstrumentStore" />
                    <div v-else>
                         <!-- <div>
                              {{ isLoadingInstrumentStore || (!uploadedFile && currentIndex === null) || !validInputs }}
                         </div>
                         <div>
                              {{ (!uploadedFile && currentIndex === null) }}
                         </div> -->
                         <div v-if="currentPage === 0" class="uppercase">{{ $t('general.continue') }}</div>
                         <div v-else-if="currentPage === 1" class="uppercase">{{ $t('general.confirm') }}</div>
                         <div v-else-if="currentPage === 2" class="justify-center">
                              <spinner-loading />
                         </div>
                    </div>
               </primary-button>
          </template>
     </dialog-category>
</template>
<script setup>
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import { DialogTitle } from '@headlessui/vue'
import { useInstrumentsStore } from '@/stores/instrumentsStore.js'
import { ref, watch, computed } from 'vue'
import { storeToRefs } from "pinia"
import { defineAsyncComponent } from "vue"

const SpinnerLoading = defineAsyncComponent(() => import('@/components/forms/SpinnerLoading.vue'))
const SkeletonLoader = defineAsyncComponent(() => import('../forms/SkeletonLoader.vue'))
const InstrumentForms = defineAsyncComponent(() => import('@/components/instrumentsComponents/InstrumentForms.vue'))
const InstrumentsReviewForms = defineAsyncComponent(() => import('@/components/instrumentsComponents/InstrumentsReviewForms.vue'))
import DialogCategory from "@/components/forms/DialogCategory.vue"
import PrimaryButton from "@/components/forms/PrimaryButton.vue"
import DragDropFileInput from '@/components/forms/DragDropFileInput.vue'

const instrumentsStore = useInstrumentsStore()
const { type, showEditDialog, showAddDialog, status, isLoadingInstrumentStore,
     isLoadingEditInstruments, detail, currentViewLawyer, selectedDetail } = storeToRefs(instrumentsStore)
const props = defineProps({
     isOpen: {
          type: Boolean,
          default: false,
     },
     currentSelected: {
          type: Number,
          default: 0,
     },
     currentLawyerId: {
          type: Number,
          default: 0,
     }
})
const handleClose = (closeModal) => {
     showAddDialog.value = closeModal
     showEditDialog.value = closeModal
}
const currentLawyerId = ref(props.currentLawyerId)
const currentIdSelected = ref(props.currentSelected)
const allTypes = ref(type.value)
const allStatus = ref(status.value)

const blobUrl = ref('')
const url = computed(() => {
     return detail?.value?.file || null
})
const currentIndex = computed(() => {
     if (url.value != null) {
          return blobUrl.value = createBlobUrl(url.value)
     }
     return null
})
const isNameFile = ref(false)
const currentPage = ref(0)
const reviewData = ref({})

//PROPS FILE
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
// UPLOAD FILE
const uploadedFile = ref(null);
const handleSendFiles = (newFile) => {
     uploadedFile.value = newFile
     blobUrl.value = URL.createObjectURL(newFile)
}
const createFileFromData = (base64Data, fileName = 'default.pdf') => {
     if (!base64Data) {
          console.error("No base64 data found for file conversion.")
          return null;
     }
     const byteCharacters = atob(base64Data)
     const byteNumbers = new Array(byteCharacters.length)
     for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
     }
     const byteArray = new Uint8Array(byteNumbers);
     const blob = new Blob([byteArray], { type: 'application/pdf' })
     return new File([blob], fileName, {
          type: 'application/pdf',
          lastModified: Date.now()
     })
}
///BLOB URL
const validInputs = computed(() => {
     if (Object.values(reviewData.value).length > 0) {
          return reviewData.value.isValid
     } else {
          return false
     }
})
const next = () => {
     currentPage.value += 1
     updateHeader()
     if (currentPage.value === 2) {
          isNameFile.value = uploadedFile.value ? uploadedFile.value.name : false
          if (!uploadedFile.value || !(uploadedFile.value instanceof File)) {
               const file = createFileFromData(detail.value.file, "file.pdf")
               uploadedFile.value = file
          }
          if (currentIdSelected.value !== 0) {
               validInputs.value = reviewData.value.isValid
               const temporalType = reviewData.value.instrument_type_id
               const temporalNumberType = Array.isArray(temporalType) ? temporalType[0].id : temporalType.id;
               instrumentsStore.editOrAddInstrument(
                    temporalNumberType,
                    reviewData.value.instrument_status_id,
                    reviewData.value.client,
                    reviewData.value.place,
                    reviewData.value.date,
                    reviewData.value.is_reverse,
                    JSON.stringify(reviewData.value.parts),
                    reviewData.value.starting_folio,
                    reviewData.value.sheets,
                    reviewData.value.price,
                    reviewData.value.number,
                    reviewData.value.year,
                    uploadedFile.value, //file
                    isNameFile.value,
                    reviewData.value.id,
                    reviewData.value.current,
                    reviewData.value.lawyer_office_id,
                    reviewData.value.cause,
                    props.currentLawyerId
               )
          } else {
               const temporalType = reviewData.value.instrument_type_id || []
               const temporalNumberType = temporalType.id || 0;
               instrumentsStore.editOrAddInstrument(
                    temporalNumberType,
                    reviewData.value.instrument_status_id,
                    reviewData.value.client,
                    reviewData.value.place,
                    reviewData.value.date,
                    reviewData.value.is_reverse,
                    JSON.stringify(reviewData.value.parts),
                    reviewData.value.starting_folio,
                    reviewData.value.sheets,
                    reviewData.value.price,
                    reviewData.value.number,
                    reviewData.value.year,
                    uploadedFile.value, //filee
                    isNameFile.value,
                    reviewData.value.id || null,
                    reviewData.value.current,
                    reviewData.value.lawyer_office_id,
                    reviewData.value.cause,
                    props.currentLawyerId,
               )
          }
     }
}
const back = () => {
     currentPage.value -= 1
     updateHeader()
}
const header = ref({
     edit: 'general.edit',
     review: 'general.review'
})
function updateHeader() {
     if (currentPage.value === 0) {
          header.value = {
               edit: 'general.edit'
          }
     } else if (currentPage.value === 1) {
          header.value = {
               review: 'general.review'
          }
     }
}
updateHeader()
const handleUpdatedData = (newData) => {
     reviewData.value = newData.value
}
</script>
