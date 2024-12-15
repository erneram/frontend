<template>
     <dialog-category ref="createDialog" :isOpen="isOpen" @close-modal="handleClose" dialog-size="max-w-xl">
          <template #title>
               <dialog-title as="h3" class="text-lg pb-4 font-medium leading-6 text-gray-900">
                    {{ $t('instrument-categories.warning') }}
               </dialog-title>
          </template>
          <template #body>
               {{ $t('instrument-categories.deleting-message-warning') }}
               <div class="text-gray-500">
                    <div v-if="isLoadingDeleteInstrumentCategories" class="overflow-visible mx-2 my-2 w-[500px] h-auto">
                         <skeleton-loader width="100%" height="72px" class="mb-2" />
                    </div>
                    <panel v-else>
                         {{ $t('instrument-categories.instrumets-type-of') }} {{ itemName }}
                         <spinner-loading v-if="isLoadingInstrumentCategoriesStore" />
                         <div v-else class="mt-3">
                              <div v-if="typeCount != 0">
                                   {{ $t('instrument-categories.existing-instruments-cateogry') }}
                              </div>
                              <div v-else>
                                   {{ $t('instrument-categories.non-existing-instruments-category') }}
                              </div>
                         </div>
                    </Panel>
               </div>
          </template>
          <template #buttons>
               <primary-button :isDisabled="isLoadingInstrumentCategoriesStore || typeCount != 0" type="button"
                    bgColor="red" @click="killInstrument()">
                    <SpinnerLoading v-if="isLoadingInstrumentCategoriesStore"></SpinnerLoading>
                    <div v-else>{{ $t('instrument-categories.acept') }}</div>
               </primary-button>
          </template>
     </dialog-category>
</template>
<script setup>
import { DialogTitle } from '@headlessui/vue'
import { useInstrumentsCategoriesStore } from '@/stores/instrumentsCategoriesStore'
import { ref } from 'vue'
import { storeToRefs } from "pinia"
import { defineAsyncComponent } from "vue"

const SpinnerLoading = defineAsyncComponent(() => import('@/components/forms/SpinnerLoading.vue'))
const SkeletonLoader = defineAsyncComponent(() => import('@/components/forms/SkeletonLoader.vue'))
import Panel from '@/components/forms/Panel.vue'
import DialogCategory from "@/components/forms/DialogCategory.vue"
import PrimaryButton from "@/components/forms/PrimaryButton.vue"

const instrumentsCategoriesStore = useInstrumentsCategoriesStore()
const { isLoadingInstrumentCategoriesStore, isLoadingDeleteInstrumentCategories, typeCount, showDeleteDialog } = storeToRefs(instrumentsCategoriesStore)

const handleClose = (closeModal) => {
     showDeleteDialog.value = closeModal
}

const createDialog = ref(null)
const props = defineProps({
     id: Number,
     isOpen: {
          type: Boolean,
          default: false
     }
})
const itemName = instrumentsCategoriesStore.getCategoryById(props.id).name


const killInstrument = () => {
     instrumentsCategoriesStore.deleteInstrument(props.id)
}
</script>