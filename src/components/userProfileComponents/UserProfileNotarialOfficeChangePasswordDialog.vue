<template>
     <dialog-category ref="createDialog" :isOpen="isOpen" @closeModal="handleClose" dialog-size="max-w-xl">
          <template #title>
               <DialogTitle as="h3" class="text-lg pb-4 font-medium leading-6 text-emerald-600">
                    {{ $t('user-profile.update-password') }}
               </DialogTitle>

          </template>
          <template #body>
               <div class="flex flex-col ">
                    <div>
                         <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="currentPassword"
                              type="password" title="user-profile.current-password"
                              inputPlaceholder='user-profile.current-password' class="mt-2" />
                    </div>
                    <div>
                         <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="newPassword"
                              type="password" title="user-profile.new-password"
                              inputPlaceholder='user-profile.new-password' class="mt-2" />
                    </div>
                    <div>
                         <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="confirmNewPassword"
                              type="password" title="user-profile.confirm-password"
                              inputPlaceholder='user-profile.confirm-password' class="mt-2 w-full" />
                    </div>

               </div>
          </template>
          <template #buttons>
               <primary-button type="button" @click="changePassword()" :isDisabled="isLoadingUserStore">
                    <SpinnerLoading v-if="isLoadingUserStore"></SpinnerLoading>
                    <div v-else class="uppercase">{{ $t('general.update') }}
                    </div>
               </primary-button>
          </template>
     </dialog-category>
</template>
<script setup>
import { useForm } from 'vee-validate'
import { DialogTitle } from '@headlessui/vue'
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from "pinia"
import { defineAsyncComponent, ref, watchEffect, computed } from "vue"

const SpinnerLoading = defineAsyncComponent(() => import('@/components/forms/SpinnerLoading.vue'))
import DialogCategory from "@/components/forms/DialogCategory.vue"
import TextInput from '../forms/TextInput.vue';
import PrimaryButton from "@/components/forms/PrimaryButton.vue"
import * as yup from 'yup'

const userStore = useUserStore()
const { showChangePasswordDialog, isLoadingUserStore } = storeToRefs(userStore)

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
          type: Object,
     }
})

const handleClose = (closeModal) => {
     showChangePasswordDialog.value = closeModal
}

const initialValues = computed(() => ({
     currentPassword: '',
     newPassword: '',
     confirmNewPassword: '',
}))

const { values } = useForm({
     initialValues,
     validationSchema: yup.object({
          currentPassword: yup.string().required(),
          newPassword: yup.string().required(),
          confirmNewPassword: yup.string().required(),
     })
})

const changePassword = () => {
     userStore.updatePassword(formData.value)
}
const formData = ref({})
watchEffect(() => {
     formData.value = {
          old_password: values.currentPassword,
          password: values.newPassword,
          password_confirmation: values.confirmNewPassword,
     }
})


</script>
