<template>
     <dialog-category ref="createDialog" :isOpen="isOpen" @close-modal="handleClose" dialog-size="max-w-xl">
          <template #title>
               <dialog-title as="h3" class="text-lg pb-4 font-medium leading-6 text-gray-900">
                    {{ $t(props.id == null ? 'instrument-categories.new-category-of-instruments' :
                         'instrument-categories.edit-category-instrument') }}
               </dialog-title>
          </template>
          <template #body>
               <div v-if="isLoadingEditInstrumentCategories"
                    class="overflow-visible flex flex-col justify-center mx-auto mr-3 w-[500px] h-auto">
                    <skeleton-loader width="100%" height="64px" class="mb-2" />
                    <skeleton-loader width="100%" height="64px" class="mb-2" />
                    <skeleton-loader width="100%" height="64px" class="mb-2" />
               </div>
               <div v-else class="overflow-visible relative">
                    <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="name" type="text"
                         title="general.name" inputPlaceholder='general.name' />
                    <multiple-selection-box title="instrument-categories.select-documents" :data="documents"
                         v-model="currentDocuments" />
                    <multiple-selection-box title="instrument-categories.select-alerts" :data="alerts"
                         v-model="currentAlerts" />
               </div>
          </template>
          <template #buttons>
               <primary-button :isDisabled="isLoadingInstrumentCategoriesStore || !isFormValid" type="button"
                    @click="createOrUpdateInstrument()">
                    <spinner-loading v-if="isLoadingInstrumentCategoriesStore" />
                    <div v-else class="uppercase">{{ $t(props.id == null ? 'instrument-categories.create' :
                         'general.edit') }}</div>
               </primary-button>
          </template>
     </dialog-category>
</template>
<script setup>
import { DialogTitle } from '@headlessui/vue'
import { useInstrumentsCategoriesStore } from '@/stores/instrumentsCategoriesStore'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { storeToRefs } from "pinia"
import { ref, reactive, defineAsyncComponent, computed } from 'vue'

const SpinnerLoading = defineAsyncComponent(() => import('@/components/forms/SpinnerLoading.vue'))
const SkeletonLoader = defineAsyncComponent(() => import('@/components/forms/SkeletonLoader.vue'))

import MultipleSelectionBox from "@/components/forms/MultipleSelectionBox.vue"
import DialogCategory from "@/components/forms/DialogCategory.vue"
import TextInput from "@/components/forms/TextInput.vue"
import PrimaryButton from "@/components/forms/PrimaryButton.vue"

const instrumentsCategoriesStore = useInstrumentsCategoriesStore()
const { isLoadingInstrumentCategoriesStore, isLoadingEditInstrumentCategories, showCreateDialog, showEditDialog, documents, alerts } = storeToRefs(instrumentsCategoriesStore)
const handleClose = (closeModal) => {
     showCreateDialog.value = closeModal
     showEditDialog.value = closeModal
}
const createDialog = ref(null)
const props = defineProps({
     isOpen: Boolean,
     contractCategoryId: {
          type: Number || null,
          default: null
     },
     id: {
          type: Number || null,
          default: null
     },
})
const { getItemById } = useInstrumentsCategoriesStore()
const documentsData = documents.value
const alertsData = alerts.value
const category = props.id == null ? { documents: [], alerts: [] } : instrumentsCategoriesStore.getCategoryById(props.id)
const currentDocuments = ref(category.documents.length == [] ? documentsData.slice(0, 2) : category.documents)
const currentAlerts = ref(category.alerts.length == [] ? alertsData.slice(0, 1) : category.alerts)
const instrumentsType = reactive({
     alerts: [],
     documents: [],
})
const updateInstrumentsType = (key, value) => {
     instrumentsType[key] = value
}
const initialValues = props.id === null ? null : {
     name: category.name,
     description: category.description
}
const { errors, values, handleSubmit } = useForm({
     initialValues,
     validationSchema: yup.object({
          name: yup.string().required(),
     })
})
const isFormValid = computed(() => {
     return Object.keys(errors.value).length === 0 && values.name
})

const createOrUpdateInstrument = handleSubmit(values => {
     if (props.id == null) {
          instrumentsCategoriesStore.createInstrument(
               values.name,
               instrumentsType.documents.map(document => document.id).length == [] ? currentDocuments.value.map((item) => item.id) : instrumentsType.documents.map(document => document.id),
               instrumentsType.alerts.map(alert => alert.id).length == [] ? currentAlerts.value.map((item) => item.id) : instrumentsType.alerts.map(document => document.id)
          )
     } else {
          instrumentsCategoriesStore.editIntrument(
               props.id,
               values.name,
               instrumentsType.documents.map(document => document.id).length == [] ? currentDocuments.value.map((item) => item.id) : instrumentsType.documents.map(document => document.id),
               instrumentsType.alerts.map(alert => alert.id).length == [] ? currentAlerts.value.map((item) => item.id) : instrumentsType.alerts.map(document => document.id)
          )
     }
})
</script>