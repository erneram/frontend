<template>
     <dialog-category ref="createDialog" :isOpen="props.isOpen" @closeModal="handleClose" dialog-size="max-w-lg">
          <template #title>
               <DialogTitle as="h3" class="text-xl pb-4 font-medium leading-6 text-yellow-600">
                    {{ $t('protocol-instruments.delete-script-warning') }}
               </DialogTitle>
          </template>
          <template #body>
               <p>{{ $t('protocol-instruments.delete-number-warning') }} {{ getNumber }}</p>
          </template>
          <template #buttons>
               <primary-button :isDisabled="isLoadingInstrumentStore" type="button" @click="killInstrument()"
                    bgColor="red">
                    <spinner-loading v-if="isLoadingInstrumentStore" />
                    <div v-else class="uppercase">{{ $t('general.delete') }}</div>
               </primary-button>
          </template>
     </dialog-category>
</template>
<script setup>
import { useInstrumentsStore } from '@/stores/instrumentsStore.js'
import { DialogTitle } from '@headlessui/vue'
import { storeToRefs } from "pinia"
import { defineAsyncComponent } from "vue"

const SpinnerLoading = defineAsyncComponent(() => import('@/components/forms/SpinnerLoading.vue'))
const SkeletonLoader = defineAsyncComponent(() => import('../forms/SkeletonLoader.vue'))
import DialogCategory from "@/components/forms/DialogCategory.vue"
import PrimaryButton from "@/components/forms/PrimaryButton.vue"

const instrumentsStore = useInstrumentsStore()
const { showDeleteDialog, isLoadingInstrumentStore } = storeToRefs(instrumentsStore)

const handleClose = (closeModal) => {
     showDeleteDialog.value = closeModal
}
const props = defineProps({
     isOpen: {
          type: Boolean,
          default: false,
     },
     data: {
          type: Object,
          default: () => { }
     },
     currentSelected: {
          type: Number,
          required: true,
     },
})
const getNumber = instrumentsStore.getInstrumentById(props.currentSelected).number
const killInstrument = () => {
     instrumentsStore.deleteInstrument(props.currentSelected)
}
</script>