<template>
     <div>
          <div class="w-fit">
               <div class="bg-emerald-500 shadow-md text-white p-4 flex justify-between items-center rounded-t-lg">
                    <div class="text-2xl font-semibold">
                         {{ $t('user-profile.contact') }}
                    </div>
               </div>
               <div class="grid gap-2 grid-cols-2 m-4">
                    <div class="flex ">
                         <action-button-solid-icon icon="UserIcon" color="text-emerald-600" size="h-8 w-8 mt-4"
                              class="align-center" />
                         <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="first_name"
                              type="text" title="general.name" inputPlaceholder='general.name' class="mt-2"
                              @newInput="handleFieldUpdate" />
                    </div>
                    <div class="flex">
                         <action-button-solid-icon icon="UserIcon" color="text-emerald-600" size="h-8 w-8 mt-4"
                              class="align-center" />
                         <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="last_name"
                              type="text" title="general.last-name" inputPlaceholder='general.last-name' class="mt-2"
                              @newInput="handleFieldUpdate" />
                    </div>
                    <div class="flex">
                         <action-button-solid-icon icon="PhoneIcon" color="text-emerald-600" size="h-8 w-8 mt-4"
                              class="align-center" />
                         <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="phone" type="number"
                              title="general.phone" inputPlaceholder='general.phone' class="mt-2"
                              @newInput="handleFieldUpdate" />
                    </div>
                    <div class="flex">
                         <action-button-solid-icon icon="EnvelopeIcon" color="text-emerald-600" size="h-8 w-8 mt-4"
                              class="align-center" />
                         <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="email" type="text"
                              title="general.email" inputPlaceholder='general.email' class="mt-2"
                              @newInput="handleFieldUpdate" />
                    </div>
                    <div class="col-span-2">
                         <primary-button type="button" @click="openChangePasswordDialog()"
                              :isDisabled="isLoadingUserStore">
                              <spinner-loading v-if="isLoadingUserStore" />
                              <div v-else class="uppercase">{{ $t('user-profile.update-password') }}
                              </div>
                         </primary-button>
                    </div>
               </div>
          </div>
     </div>
</template>

<script setup>
import { useForm } from 'vee-validate'
import { ref, watchEffect, watch, computed } from 'vue'
import { DateTime } from 'luxon'
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'

import Panel from "../forms/Panel.vue"
import ActionButtonSolidIcon from "../buttons/ActionButtonSolidIcon.vue"
import SpinnerLoading from '../forms/SpinnerLoading.vue'
import PrimaryButton from '../forms/PrimaryButton.vue'
import TextInput from "../forms/TextInput.vue"
import * as yup from 'yup'

const dt = DateTime.local()
const currentYear = dt.year

const userStore = useUserStore()
const { openChangePasswordDialog } = userStore
const { user, isLoadingUserStore } = storeToRefs(userStore)

const emit = defineEmits(['updatedData'])

const initialValues = computed(() => ({
     first_name: user.value.first_name || '',
     last_name: user.value.last_name || '',
     phone: user.value.phone || '',
     email: user.value.email || '',
}))

const { values } = useForm({
     initialValues,
     validationSchema: yup.object({
          first_name: yup.string().required(),
          last_name: yup.string().required(),
          phone: yup.number().required(),
          email: yup.string().required(),
     })
})


const handleFieldUpdate = (field, value) => {
     userStore.updateContactUser(field, value)
     // updateContactUser

     // después de esto, se actualiza el store
}


const newData = ref([])

</script>