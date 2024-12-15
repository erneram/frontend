<template>
     <dialog-category ref="createDialog" :isOpen="isOpen" @closeModal="handleClose" dialog-size="max-w-md">
          <template #title>
               <dialog-title as="h3" class="text-xl font-medium leading-6 text-emerald-600">
                    {{ $t('user-profile.edit-notarial-office') }}
               </dialog-title>
          </template>
          <template #body>
               <div class="flex flex-col space-y-4">
                    <div>
                         <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="address" type="text"
                              title="user-profile.address" inputPlaceholder='user-profile.address' class="w-full" />
                    </div>
                    <div>
                         <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="municipality"
                              type="text" title="user-profile.municipality" inputPlaceholder='user-profile.municipality'
                              class="w-full" />
                    </div>
                    <div>
                         <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="department"
                              type="text" title="user-profile.department" inputPlaceholder='user-profile.department'
                              class="w-full" />
                    </div>
                    <div class="flex space-x-4 justify-around">
                         <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="active"
                              type="checkbox" title="user-profile.active" inputPlaceholder='user-profile.active' />
                         <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="principal"
                              type="checkbox" title="user-profile.major" inputPlaceholder='user-profile.major' />
                    </div>
               </div>
          </template>
          <template #buttons>
               <primary-button type="button" @click="updateCreateNotarialOffice()" :isDisabled="isLoadingOfficeStore">
                    <spinner-loading v-if="isLoadingOfficeStore" />
                    <div v-else class="uppercase">{{ $t(officeInfo !== null ? 'general.update' : 'general.save') }}
                    </div>
               </primary-button>
          </template>
     </dialog-category>
</template>

<script setup>
import { useForm } from 'vee-validate'
import { DialogTitle } from '@headlessui/vue'
import { useOfficeStore } from '@/stores/officesStore'
import { storeToRefs } from "pinia"
import { defineAsyncComponent, ref, watchEffect, computed } from "vue"

const SpinnerLoading = defineAsyncComponent(() => import('@/components/forms/SpinnerLoading.vue'))
import DialogCategory from "@/components/forms/DialogCategory.vue"
import CheckBoxInput from '../forms/CheckBoxInput.vue'
import TextInput from '../forms/TextInput.vue';
import PrimaryButton from "@/components/forms/PrimaryButton.vue"
import * as yup from 'yup'

const officeStore = useOfficeStore()
const { showEditCreateNotarialOfficeDialog, selectedOffice, isLoadingOfficeStore } = storeToRefs(officeStore)

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
     showEditCreateNotarialOfficeDialog.value = closeModal
}
const officeInfo = ref(selectedOffice?.value || null)
const currentLawyerId = ref(props.currentLawyerId.id)
const initialValues = computed(() => ({
     address: officeInfo?.value?.direction || '',
     municipality: officeInfo?.value?.municipality || '',
     department: officeInfo?.value?.department || '',
     active: (officeInfo?.value?.active === 1 ? true : false || false),
     principal: (officeInfo?.value?.is_principal === 1 ? true : false || false)
}))

const { values } = useForm({
     initialValues,
     validationSchema: yup.object({
          address: yup.string().required(),
          municipality: yup.string().required(),
          department: yup.string().required(),
     })
})

const updateCreateNotarialOffice = () => {
     if (officeInfo.value !== null) {
          officeStore.updateNotarialOffice(officeInfo.value.id, formData.value)
     } else if (officeInfo.value === null) {
          officeStore.createNotarialOffice(formData.value)
     }
}
const formData = ref({})
watchEffect(() => {
     formData.value = {
          direction: values.address,
          municipality: values.municipality,
          department: values.department,
          active: (values.active === true ? 1 : 0),
          is_principal: (values.principal === true ? 1 : 0),
          ...(officeInfo.value === null && { lawyer_id: currentLawyerId.value })
     }
})


</script>
