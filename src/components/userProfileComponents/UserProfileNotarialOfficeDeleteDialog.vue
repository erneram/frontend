<template>
     <dialog-category ref="createDialog" :isOpen="isOpen" @closeModal="handleClose" dialog-size="max-w-2xl">
          <template #title>
               <DialogTitle as="h3" class="text-lg pb-4 font-medium leading-6 text-red-600">
                    {{ $t('general.warning') }}
               </DialogTitle>
          </template>
          <template #body>
               <div classs="mt-2" />
               <div>
                    <p>{{ $t('user-profile.delete-warning') }}</p>
                    <panel>
                         <p>{{ $t('user-profile.delete-text', { text: selectedOffice.direction }) }}</p>
                         <div v-if="validateTypeCount === 0" classs="mt-2" />
                         <p v-if="validateTypeCount === 0" class="text-md font-bold">{{
                              $t('user-profile.delete-no-notarial-office') }}
                         </p>

                    </panel>

               </div>
          </template>
          <template #buttons>
               <primary-button type="button" @click="deleteNotarialOffice()"
                    :isDisabled="isLoadingOfficeStore || validateTypeCount > 0" bg-color="red">
                    <SpinnerLoading v-if="isLoadingOfficeStore"></SpinnerLoading>
                    <div v-else class="uppercase">{{ $t('general.delete') }}
                    </div>
               </primary-button>
          </template>
     </dialog-category>
</template>
<script setup>
import { DialogTitle } from '@headlessui/vue'
import { useOfficeStore } from '@/stores/officesStore'
import { storeToRefs } from "pinia"
import { defineAsyncComponent, ref } from "vue"

const SpinnerLoading = defineAsyncComponent(() => import('@/components/forms/SpinnerLoading.vue'))
import DialogCategory from "@/components/forms/DialogCategory.vue"
import Panel from '../forms/Panel.vue'
import PrimaryButton from "@/components/forms/PrimaryButton.vue"

const officeStore = useOfficeStore()
const { showDeleteNotarialOfficeDialog, selectedOffice, validateDeleteOffice, isLoadingOfficeStore } = storeToRefs(officeStore)

const props = defineProps({
     isOpen: {
          type: Boolean,
          default: false,
     },
     data: {
          type: Object,
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
     showDeleteNotarialOfficeDialog.value = closeModal
}
const validateTypeCount = ref(validateDeleteOffice?.value?.typeCount)
const officeInfo = ref(selectedOffice?.value)


const deleteNotarialOffice = () => {
     officeStore.deleteNotarialOfice(officeInfo.value.id)
}



</script>
