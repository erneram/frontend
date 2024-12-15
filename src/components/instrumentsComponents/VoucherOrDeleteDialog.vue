<template>
     <dialog-category ref="createDialog" :isOpen="isOpen" @closeModal="handleClose"
          :dialog-size="dialogType === 'isPDF' ? 'max-w-3xl' : 'max-w-xl'">
          <template #title>
               <dialog-title as="h1" class="text-xl font-medium leading-6 text-emerald-600">
                    {{ $t('protocol-instruments.voucher') }}
               </dialog-title>
          </template>
          <template #body>
               <div v-if="dialogType === 'isPDF'">
                    <skeleton-loader v-if="isLoadingDownloadObligationPdf" width="100%" height="64px" />
                    <general-iframe v-else :source="voucherDocument" />
               </div>
               <div v-if="dialogType === 'isDeleting'">
                    <p>
                         {{ $t('protocol-instruments.deleting-voucher-message') }}:
                    </p>
                    <p class="font-semibold">
                         {{ instrumentAlerts[arrayDeletingIndex].name }}
                    </p>
               </div>
          </template>
          <template #buttons>
               <primary-button v-if="dialogType === 'isDeleting'" type="button" bgColor="red">
                    <div class="uppercase" @click="deleteVoucher">{{ $t('general.delete') }}</div>
               </primary-button>
          </template>
     </dialog-category>
</template>
<script setup>
import { DialogTitle } from '@headlessui/vue'
import { storeToRefs } from 'pinia';
import { useInstrumentsStore } from '@/stores/instrumentsStore';
import { ref, computed } from 'vue';
import DialogCategory from '../forms/DialogCategory.vue';
import GeneralIframe from "../forms/GeneraliFrame.vue"
import SkeletonLoader from '../forms/SkeletonLoader.vue';
import PrimaryButton from '../Forms/PrimaryButton.vue';
import InstrumentsEditDialog from './InstrumentsEditDialog.vue';

const instrumentStore = useInstrumentsStore()
const { showVoucherDialog, showDeleteVoucherDialog, voucherDocument, currentViewLawyer, currentDeletingId, alertDeletingId, alertDeletingIndex, arrayDeletingIndex, isLoadingDownloadObligationPdf } = storeToRefs(instrumentStore)
const { openVoucherDialog, hideVoucherDialog, } = instrumentStore
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
     showVoucherDialog.value = closeModal
     showDeleteVoucherDialog.value = closeModal
}
const alertStatusId = ref([])
const instrumentAlerts = computed(() => {
     alertStatusId.value = currentViewLawyer.value.instrumentAlert.map(alert => alert.alert_status_id)
     return currentViewLawyer.value.instrumentAlert || []
})
const updateAlertStatus = (index, status) => {
     instrumentAlerts.value[index].alert_status_id = status; // Cambia directamente en instrumentAlerts
};
const deleteVoucher = () => {
     instrumentStore.deleteNotarialObligationsPdf(currentDeletingId.value, alertDeletingId.value, arrayDeletingIndex.value)
}
</script>