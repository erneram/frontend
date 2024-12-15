<template>
     <dialog-category ref="createDialog" :isOpen="isOpen" @closeModal="handleClose" @close="handleClose"
          :dialog-size="dialogType === 'isVoucher' ? 'max-w-3xl' : 'max-w-xl'" :cancel-button="false">
          <template #title>
               <dialog-title as="h1" class="text-xl font-medium leading-6 text-emerald-600">
                    {{ $t('general.document') }}
               </dialog-title>
          </template>
          <template #body>
               <div v-if="dialogType === 'isPDF'">
                    <skeleton-loader v-if="isLoadingDownloadDocument" width="100%" height="64px" />
                    <general-iframe v-else :source="obligationDocumentBase64" />
               </div>
               <div v-if="dialogType === 'isDeleting'">
                    <p>
                         {{ $t('agp-obligations.delete-document-message') }}:
                    </p>
                    <p class="font-semibold">
                         <!-- {{ instrumentAlerts[arrayDeletingIndex].name }} -->
                         {{ findNameByObligationId(obligation_id) }}
                    </p>
               </div>
          </template>
          <template #buttons>
               <primary-button v-if="dialogType === 'isDeleting'" type="button" bgColor="red">
                    <div class="uppercase" @click="deleteDocument">{{ $t('general.delete') }}</div>
               </primary-button>
          </template>
     </dialog-category>
</template>
<script setup>
import { DialogTitle } from '@headlessui/vue'
import { useAgpObligationStore } from '@/stores/agpObligationsStore';
import { storeToRefs } from 'pinia';
import { ref, computed } from 'vue';
import DialogCategory from '../forms/DialogCategory.vue';
import PrimaryButton from '../Forms/PrimaryButton.vue';
import SkeletonLoader from '../forms/SkeletonLoader.vue';
import GeneralIframe from '../forms/GeneraliFrame.vue';

const agpObligationsStore = useAgpObligationStore()
const { showObligationDocument, showDeleteObligationDocument, obligationDocumentBase64, lawyersObligation, obligation_id, user_id, isLoadingDownloadDocument } = storeToRefs(agpObligationsStore)
const props = defineProps({
     isOpen: {
          type: Boolean,
          default: false,
     },
     dialogType: {
          type: String,
          Required: true,
     }
})
const handleClose = (closeModal) => {
     showObligationDocument.value = closeModal
     showDeleteObligationDocument.value = closeModal
}

function findNameByObligationId(obligationId) {
     const document = lawyersObligation.value.find(
          doc => doc.user_obligations && doc.user_obligations.obligation_id === obligationId
     )
     return document ? document.name : 'No se encontró el documento';
}
function deleteDocument() {
     agpObligationsStore.deleteObligationDocument(user_id.value, obligation_id.value)
}



</script>