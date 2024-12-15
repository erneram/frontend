<template>
     <dialog-category ref="createDialog" :isOpen="props.isOpen" @closeModal="handleClose" dialog-size="max-w-4xl">
          <template #title>
               <dialog-title v-if="!isData() && !isLoadingFetchContract" as="h3"
                    class="text-xl pb-4 font-medium leading-6 text-emerald-600">
                    <h1>{{ $t('deadlinealert.create-contact') }}</h1>
               </dialog-title>
          </template>
          <template #body>
               <div>
                    <div v-if="isLoadingFetchContract || isData()">
                         <div v-if="isLoadingFetchContract">
                              <div class="grid mt-4 grid-cols-2 gap-8">
                                   <div v-for="(item, index) in 6" :key="index" class="w-full h-16">
                                        <skeleton-loader width="100%" height="64px" />
                                   </div>
                              </div>
                              <div class="overflow-visible my-2 mt-8 w-[auto] h-[auto]">
                                   <skeleton-loader width="100%" height="200px" class="mb-2" />
                              </div>
                         </div>
                         <tab-group v-else>
                              <tab-list class="flex space-x-1 rounded-xl bg-emerald-900/20 p-1">
                                   <tab v-for="(editable, index) in header" as="template" :key="index"
                                        v-slot="{ selected }">
                                        <button @click="setViewToDisplay(index)" :class="[
                                             'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                                             'ring-white/60 ring-offset-2 ring-offset-emerald-400 focus:outline-none focus:ring-2',
                                             selected
                                                  ? 'bg-white text-emerald-700 shadow'
                                                  : 'text-emerald-900 hover:bg-emerald/[0.12] hover:text-white']">
                                             {{ $t(editable) }}
                                        </button>
                                   </tab>
                              </tab-list>
                              <div v-if="isLoadingFetchContract">
                                   <div class="grid mt-4 grid-cols-2 gap-8">
                                        <div v-for="(item, index) in 6" :key="index" class="w-full h-16">
                                             <skeleton-loader width="100%" height="64px" />
                                        </div>
                                   </div>
                                   <div class="overflow-visible my-2 mt-8 w-[auto] h-[auto]">
                                        <skeleton-loader width="100%" height="200px" class="mb-2" />
                                   </div>
                              </div>
                              <tab-panels v-else class="mt-2">
                                   <div>
                                        <div v-if="currentView === 0">
                                             <dead-line-alerts-document-info :data="actualData" />
                                        </div>
                                        <div v-if="currentView === 1">
                                             <dialog-title as="h2"
                                                  class="text-3xl font-bold tracking-tight text-emerald-800">
                                                  {{ $t('deadlinealert.edit-document') }}
                                             </dialog-title>
                                             <dead-line-alerts-form @updated-document="handleNewDocument" />
                                             <primary-button :isDisabled="isLoadingDeadLineAlertStore" type="button"
                                                  @click="updateDocument()" bgColor="emerald">
                                                  <spinner-loading v-if="isLoadingDeadLineAlertStore" />
                                                  <div v-else class="uppercase">{{ $t('general.update') }}</div>
                                             </primary-button>
                                             <dialog-title as="h4"
                                                  class="text-3xl mt-4 font-bold tracking-tight text-emerald-800">
                                                  {{ $t(statusText) }}
                                             </dialog-title>
                                             <primary-button :isDisabled="isLoadingDeadLineAlertStore" type="button"
                                                  @click="renovateActualDocument()" bgColor="emerald">
                                                  <spinner-loading v-if="isLoadingDeadLineAlertStore" />
                                                  <div v-else class="uppercase">{{ $t('general.renovate') }}</div>
                                             </primary-button>
                                        </div>
                                   </div>
                              </tab-panels>
                         </tab-group>
                    </div>
                    <div v-if="contract !== null && !isData() && !isLoadingFetchContract">
                         <div v-if="isLoadingFetchContract">
                              <div v-for="(item, index) in 6" :key="index" class="w-full h-16">
                                   <skeleton-loader width="100%" height="64px" />
                              </div>

                              <div class="overflow-visible my-2 mt-8 w-[auto] h-[auto]">
                                   <skeleton-loader width="100%" height="200px" class="mb-2" />
                              </div>
                         </div>
                         <div v-else class="lg:flex">
                              <div>
                                   <drag-drop-file-input @sendFiles="handleSendFiles"
                                        title="deadlinealert.drag-click-contract" />
                                   <general-iframe v-if="currentSource != ''" :source="currentSource" />
                              </div>
                              <div class="lg:flex-1 ml-4 overflow-hidden">
                                   <dead-line-alerts-form @updated-document="handleNewDocument" />
                              </div>
                         </div>
                    </div>
               </div>
          </template>
          <template #buttons v-if="!isData()">
               <primary-button :isDisabled="isLoadingDeadLineAlertStore || !validInputs" type="button"
                    @click="killDocument()" bgColor="emerald">
                    <spinner-loading v-if="isLoadingDeadLineAlertStore" />
                    <div v-else>{{ $t('general.create') }}</div>
               </primary-button>
          </template>
     </dialog-category>
</template>
<script setup>
import { TabGroup, TabList, Tab, TabPanels } from '@headlessui/vue'
import { useDeadLineAlertStore } from '@/stores/deadLineAlertStore.js'
import { DialogTitle } from '@headlessui/vue'
import { storeToRefs } from "pinia"
import { ref, watchEffect, watch, computed } from 'vue'
import { defineAsyncComponent } from "vue"

const SpinnerLoading = defineAsyncComponent(() => import('@/components/forms/SpinnerLoading.vue'))
const SkeletonLoader = defineAsyncComponent(() => import('../forms/SkeletonLoader.vue'))
const DeadLineAlertsDocumentInfo = defineAsyncComponent(() => import('@/components/deadLineAlertsComponents/DeadLineAlertsDocumentInfo.vue'))
const DeadLineAlertsForm = defineAsyncComponent(() => import('./DeadLineAlertsForm.vue'))

import DialogCategory from "@/components/forms/DialogCategory.vue"
import PrimaryButton from "@/components/forms/PrimaryButton.vue"
import GeneralIframe from "../forms/GeneraliFrame.vue"
import DragDropFileInput from '../forms/DragDropFileInput.vue'

const deadLineAlertStore = useDeadLineAlertStore()
const { showCreateEditDialog, contract, isLoadingDeadLineAlertStore, isLoadingFetchContract } = storeToRefs(deadLineAlertStore)
const handleClose = (closeModal) => {
     showCreateEditDialog.value = closeModal
     currentView.value = 0
}
const props = defineProps({
     isOpen: {
          type: Boolean,
          default: false,
     },
})

const header = ['deadlinealert.detail', 'deadlinealert.document-editing']
const actualData = ref(contract.value)
watch(() => contract.value, (newVal) => {
     actualData.value = newVal
})
const currentSource = ref('')
const isData = () => {
     if (Object.keys(contract.value).length > 0) {
          return true
     } else {
          return false
     }
}

const currentView = ref(0)
const setViewToDisplay = (index) => {
     currentView.value = index
}
const currentDocuments = ref({})
const handleNewDocument = (newVal) => {
     currentDocuments.value = newVal
}
const validInputs = computed(() => {
     if (Object.values(currentDocuments.value).length > 0) {
          return currentDocuments.value.isValid
     } else {
          return false
     }
})
const updateDocument = () => {
     deadLineAlertStore.updateDocument(currentDocuments.value)
     setTimeout(() => currentView.value = 0, 500)
}

const statusText = ref('general.empty')
if (actualData.value.status_id === 2) {
     statusText.value = 'deadlinealert.renewal-document'
} else if (actualData.value.status_id === 3) {
     statusText.value = 'deadlinealert.document-was-canceled'
} else if (actualData.value.status_id === 4) {
     statusText.value = 'deadlinealert.document-was-renewed'
}

const renovateData = ref([])
watchEffect(() => {
     renovateData.value = {
          id: actualData.value.id,
          status_id: actualData.value.status_id,
          lawyer_id: actualData.value.lawyer_id,
          contract_id: actualData.value.contract_id || 0
     }
})
const renovateActualDocument = () => {
     deadLineAlertStore.renovateDocument(renovateData.value)
     setTimeout(() => currentView.value = 0, 500)
}
const handleSendFiles = (newVal) => {
     currentSource.value = URL.createObjectURL(newVal)
}
</script>
