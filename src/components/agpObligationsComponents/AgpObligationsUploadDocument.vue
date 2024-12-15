<template>
     <div class="overflow-hidden rounded-xl border border-gray-200 w-full">
          <div class="flex items-center gap-x-4 border-b border-gray-900/5 bg-white p-6 mb-2">
               <action-button-solid-icon icon="DocumentTextIcon" color="text-red-500" size="h-8 w-8" class="" />
               <div class="text-xl font-medium leading-6 text-gray-900"> {{ $t('agp-obligations.document-upload') }}
               </div>
          </div>
          <div v-for="(document, index) in lawyersObligation" :key="document.id"
               class="-my-3 divide-y divide-gray-100 px-6 py-4 text-md bg-white leading-6">
               <div class="">
                    <p :class="['flex mb-4 justify-between', document.user_obligations !== null ? '' : ' cursor-pointer']"
                         @dragover.prevent="onDragOver" @dragleave.prevent="onDragLeave"
                         @drop.prevent="document.user_obligations === null && onDrop"
                         @click="document.user_obligations === null && getObligationId(document.id)">
                         <a @click="document.user_obligations !== null && triggerFilePdf"
                              :ondrop="document.user_obligations !== null && triggerFilePdf">
                              {{ document.name }}
                              <div class="text-xs text-gray-500 font-thin">
                                   <div v-if="document.user_obligations === null">
                                        {{ $t('general.pending') }}
                                   </div>
                                   <div v-if="document.user_obligations !== null">
                                        {{ $t('general.complete') }}
                                   </div>
                              </div>
                         </a>
                    <div class="justify-items-end">
                         <div v-if="document.user_obligations !== null" class="flex">
                              <action-button-solid-icon icon="EyeIcon" color="text-emerald-500" size="h-6 w-6 mr-1"
                                   @click="openObligationDocument(document.user_obligations.user_id, document.user_obligations.obligation_id)" />
                              <action-button-solid-icon icon="FolderArrowDownIcon" color="text-emerald-500"
                                   size="h-6 w-6 mr-1"
                                   @click="downloadPdf(document.user_obligations.user_id, document.user_obligations.obligation_id)" />
                              <action-button-solid-icon icon="TrashIcon" color="text-red-500" size="h-6 w-6 mr-1"
                                   @click="openDeleteObligationDocument(document.user_obligations.user_id, document.user_obligations.obligation_id)" />

                         </div>
                         <div v-if="document.user_obligations === null">
                              <action-button-solid-icon icon="ArrowUpTrayIcon" color="text-red-500" size="h-6 w-6 mr-1"
                                   @click="triggerFilePdf" :ondrop="triggerFilePdf" />
                         </div>
                    </div>
                    </p>

               </div>
               <div v-if="lawyersObligation.length > 1 && index !== lawyersObligation.length - 1" class="relative">
                    <div class="absolute inset-0 flex items-center" aria-hidden="true">
                         <div class="w-full border-t border-gray-300"></div>
                    </div>
               </div>
          </div>
     </div>
     <input ref="filePdf" class="hidden" @change="handleFilePdf" id="filePdf_input" type="file"
          accept="application/pdf">
</template>
<script setup>
import { useAgpObligationStore } from '@/stores/agpObligationsStore'
import { storeToRefs } from 'pinia'
import { ref, watch, computed } from 'vue'

import ActionButtonSolidIcon from '../buttons/ActionButtonSolidIcon.vue'

import Panel from '../forms/Panel.vue'
import { typedArrayFor } from 'pdf-lib'

const agpObligationsStore = useAgpObligationStore()
const { lawyersObligation } = storeToRefs(agpObligationsStore)
const { openObligationDocument, openDeleteObligationDocument } = agpObligationsStore

const obligationId = ref(null)
const filePdf = ref(null)
const filePdfUplodaded = ref(false)

const downloadPdf = (userId, obligationId) => {
     agpObligationsStore.downloadObligationDocument(userId, obligationId, 'forDownload')
}

const triggerFilePdf = () => {
     filePdf.value.click()
}
const uploadedFile = ref(null)
const handleFilePdf = (event) => {
     const files = event.target.files
     if (files.length > 0) {
          filePdfUplodaded.value = true
          uploadedFile.value = files[0]
          agpObligationsStore.uploadDocument(obligationId.value, uploadedFile.value)
     } else {
          filePdfUplodaded.value = false
     }
}
//Drag and Drop
const isDragging = ref(false)
const onDragOver = () => {
     isDragging.value = true
}
const onDragLeave = () => {
     isDragging.value = false
}
const onDrop = (event) => {
     event.preventDefault();
     const files = event.dataTransfer.files
     if (files.length > 0) {
          filePdfUplodaded.value = true
          uploadedFile.value = files[0]
     } else {
          filePdfUplodaded.value = false
     }
     isDragging.value = false
}

const getObligationId = (obligation) => {
     obligationId.value = obligation
}
</script>