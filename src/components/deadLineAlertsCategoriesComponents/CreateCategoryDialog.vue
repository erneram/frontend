<template>
  <dialog-category ref="createDialog" @close-modal="handleClose" :isOpen="isOpen"
    :dialogClass="' rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-black/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75'">
    <template #icon>
      <folder-plus-icon v-if="props.id == null" class="h-6 w-6 mx-3 text-emerald-800" />
      <pencil-icon v-else class="h-6 w-6 mx-3 text-emerald-800" />
    </template>
    <template #title>
      <dialog-title as="h3" class="text-lg pb-4 font-medium leading-6 text-gray-900">
        {{ $t(showCreateNewDialog ? (props.id === null ? 'deadlinealert.create-category' :
          'deadlinealert.create-subcategory') : 'deadlinealert.edit-category', { category: categoryName }) }}
      </dialog-title>
    </template>
    <template #body>
      <text-input :validationError="error" inputClassError="ring-yellow-300 focus:ring-yellow-600" name="name"
        type="text" title="general.name" inputPlaceholder='general.name' />
      <text-input :validationError="error" inputClassError="ring-yellow-300 focus:ring-yellow-600" name="description"
        type="text" title="general.description" @keyup.enter="createOrUpdateCategory()"
        inputPlaceholder='general.description' />
      <div class="mt-4">
        <warning-alert v-if="error" name="messageAlert" title="errors.The-given-data-was-invalid" />
      </div>
    </template>
    <template #buttons>
      <primary-button :isDisabled="isLoading || !isFormValid" type="button" @click="createOrUpdateCategory()">
        <spinner-loading v-if="isLoading" />
        <div v-else>{{ $t(props.id == null ? 'general.create' : 'general.edit') }}</div>
      </primary-button>
    </template>
  </dialog-category>
</template>

<script setup>
import { useContractcategoryStore } from "@/stores/contractcategoryStore"
import { useDeadLineAlertCategoriesStore } from '@/stores/deadLineAlertCategoriesStore'
import { DialogTitle } from '@headlessui/vue'
import { useForm } from 'vee-validate'
import { ref, defineAsyncComponent, computed } from 'vue'
import { storeToRefs } from "pinia"
import { FolderPlusIcon, PencilIcon } from '@heroicons/vue/24/outline'

const SpinnerLoading = defineAsyncComponent(() => import('@/components/forms/SpinnerLoading.vue'))
const WarningAlert = defineAsyncComponent(() => import('@/components/alerts/WarningAlert.vue'))
import DialogCategory from "@/components/forms/DialogCategory.vue"
import TextInput from "@/components/forms/TextInput.vue"
import PrimaryButton from "@/components/forms/PrimaryButton.vue"
import * as yup from 'yup'

const createDialog = ref(null)
const contract = useContractcategoryStore()

const deadlinealertsStore = useDeadLineAlertCategoriesStore()
const { isLoading, selectedCategory, showEditDialog, showCreateNewDialog, showDeleteDialog, } = storeToRefs(deadlinealertsStore)

const handleClose = (closeModal) => {
  showCreateNewDialog.value = closeModal
  showEditDialog.value = closeModal
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
  },

})

const { error } = storeToRefs(contract)

const category = props.id == null ? null : contract.getCategoryById(props.id)
const categoryName = contract.getCategoryNameById(props.id)
const description = contract.getCategoryDescriptionById(props.id)

const initialValues = props.id === null ? null : {
  name: showEditDialog.value == true ? category.name : '',
  description: showEditDialog.value == true ? category.description : ''
}
const { errors, values, handleSubmit } = useForm({
  initialValues,
  validationSchema: yup.object({
    name: yup.string().required(),
    description: yup.string().required(),
  })
})
const isFormValid = computed(() => {
  return Object.keys(errors.value).length === 0 && values.name && values.description
})
const createOrUpdateCategory = handleSubmit(values => {
  if (showCreateNewDialog.value == true && props.id == null) {
    contract.createNewCategory(values.name, values.description)
  } else if (showCreateNewDialog.value == true && props.id !== null) {
    contract.createSubCategory(values.name, values.description, props.id)
  } else if (showEditDialog.value == true && props.id !== null) {
    contract.editCategory(values.name, values.description, props.id)
  }

})
</script>