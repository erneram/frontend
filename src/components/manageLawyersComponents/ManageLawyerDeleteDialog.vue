<template>
     <DialogCategory ref="createDialog" :isOpen="props.isOpen" @closeModal="handleClose" dialog-size="max-w-lg">
          <template #title>
               <DialogTitle as="h3" class="text-xl pb-4 font-medium leading-6 text-yellow-600">
                    {{ $t('lawyer-admin.delete-lawyer') }}
               </DialogTitle>
          </template>
          <template #body>
               <p>{{ $t('general.open-question-mark') }}{{ $t('lawyer-admin.delete-warning') }} {{ getName }} {{
                    getLastname }}{{ $t('general.close-question-mark') }} </p>
          </template>
          <template #buttons>
               <PrimaryButton :isDisabled="isLoadingLawyerStore && data !== null" type="button"
                    @click="killInstrument()" bgColor="red">
                    <SpinnerLoading v-if="isLoadingLawyerStore && data !== null"></SpinnerLoading>
                    <div v-else>{{ $t('lawyer-admin.delete-button') }}</div>
               </PrimaryButton>
          </template>
     </DialogCategory>
</template>
<script setup>
import { useLawyerStore } from '@/stores/lawyerStore.js'
import { DialogTitle } from '@headlessui/vue'
import { storeToRefs } from "pinia"
import { ref } from 'vue'
import { defineAsyncComponent } from "vue"

const SpinnerLoading = defineAsyncComponent(() => import('@/components/forms/SpinnerLoading.vue'))
import DialogCategory from "@/components/forms/DialogCategory.vue"
import PrimaryButton from "@/components/forms/PrimaryButton.vue"

const lawyerStore = useLawyerStore()
const { showLawyerDeleteDialog, isLoadingLawyerStore, selectedLawyer } = storeToRefs(lawyerStore)
const handleClose = (closeModal) => {
     showLawyerDeleteDialog.value = closeModal
}
const props = defineProps({
     isOpen: {
          type: Boolean,
          default: false,
     },
})

const getName = ref(selectedLawyer.value.first_name)
const getLastname = ref(selectedLawyer.value.last_name)



</script>