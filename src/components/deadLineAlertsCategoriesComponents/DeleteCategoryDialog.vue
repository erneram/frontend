<template>
     <dialog-category ref="createDialog" @close-modal="handleClose" :isOpen="isOpen"
          :dialogClass="' rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-black/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75'">
          <template #icon>
               <trash-icon class="h-6 w-6 mx-3 text-red-800" />
          </template>
          <template #title>
               <dialog-title as="h3" class="text-lg pb-4 font-medium leading-6 text-gray-900">
                    {{ $t('general.delete-category') }} {{ category.name }}
               </dialog-title>
          </template>
          <template #body>
               {{ $t('general.open-question-mark') }}{{ $t('general.delete-message') }} {{ category.name }}{{
                    $t('general.close-question-mark') }}
          </template>
          <template #buttons>
               <primary-button :isDisabled="isLoading" type="button" bgColor="orange" @click="deleteThisCategory()">
                    <spinner-loading v-if="isLoading" />
                    <div v-else class="uppercase">{{ $t('general.delete') }}</div>
               </primary-button>
          </template>
     </dialog-category>
</template>

<script setup>
import { useContractcategoryStore } from "@/stores/contractcategoryStore"
import { useDeadLineAlertCategoriesStore } from '@/stores/deadLineAlertCategoriesStore'
import { DialogTitle } from '@headlessui/vue'
import { ref } from 'vue'
import { storeToRefs } from "pinia"
import { TrashIcon } from '@heroicons/vue/24/outline'
import { defineAsyncComponent } from "vue"

const SpinnerLoading = defineAsyncComponent(() => import('@/components/forms/SpinnerLoading.vue'))
import DialogCategory from "@/components/forms/DialogCategory.vue"
import PrimaryButton from "@/components/forms/PrimaryButton.vue"

const createDialog = ref(null)
const contract = useContractcategoryStore()

const deadlinealertsStore = useDeadLineAlertCategoriesStore()
const { showDeleteDialog } = storeToRefs(deadlinealertsStore)
const handleClose = (closeModal) => {
     showDeleteDialog.value = closeModal
}

const props = defineProps({
     contractCategoryId: {
          type: Number || null,
          default: null
     },
     id: {
          type: Number || null,
          default: null
     },
     isOpen: {
          type: Boolean,
          default: false
     }
})

const { isLoading } = storeToRefs(contract)
const category = props.id == null ? null : contract.getCategoryById(props.id)


const deleteThisCategory = () => {
     contract.deleteCategory(props.id)
}
</script>