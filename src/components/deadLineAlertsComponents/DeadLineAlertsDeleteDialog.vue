<template>
     <dialog-category ref="createDialog" :isOpen="props.isOpen" @closeModal="handleClose" dialog-size="max-w-lg">
          <template #title>
               <dialog-title as="h3" class="text-xl pb-4 font-medium leading-6 text-red-600">
                    <h1>{{ $t('deadlinealert.document-delete') }}</h1>
               </dialog-title>
          </template>
          <template #body>
               <p>{{ $t('general.open-question-mark') }}{{ $t('deadlinealert.delete-warning') }}{{
                    $t('general.close-question-mark') }}</p>
          </template>
          <template #buttons>
               <primary-button :isDisabled="isLoadingDeadLineAlertStore" type="button" @click="killDocument()"
                    bgColor="red">
                    <spinner-loading v-if="isLoadingDeadLineAlertStore" />
                    <div v-else class="uppercase">{{ $t('general.delete') }}</div>
               </primary-button>
          </template>
     </dialog-category>
</template>
<script setup>
import { DialogTitle } from '@headlessui/vue'
import { useDeadLineAlertStore } from '@/stores/deadLineAlertStore.js'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { defineAsyncComponent } from "vue"

const SpinnerLoading = defineAsyncComponent(() => import('@/components/forms/SpinnerLoading.vue'))
import DialogCategory from "@/components/forms/DialogCategory.vue"
import PrimaryButton from "@/components/forms/PrimaryButton.vue"

const deadLineAlertStore = useDeadLineAlertStore()
const { showDeleteDialog, selectedDocument, isLoadingDeadLineAlertStore } = storeToRefs(deadLineAlertStore)
const handleClose = (closeModal) => {
     showDeleteDialog.value = closeModal
}
const props = defineProps({
     isOpen: {
          type: Boolean,
          default: false,
     },
})
const killDocument = () => {
     deadLineAlertStore.deleteDocument(selectedDocument.value.id)
}
</script>