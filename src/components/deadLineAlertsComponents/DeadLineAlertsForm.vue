<template>
     <panel>
          <div class="overflow-visible">
               <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="description" type="text"
                    title="deadlinealert.description" inputPlaceholder='deadlinealert.description' class="mt-2"
                    :is-required="true" />
               <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="product" type="text"
                    title="deadlinealert.product" inputPlaceholder='deadlinealert.product' class="mt-2" />
               <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="entity" type="text"
                    title="deadlinealert.entity-that-issues-it" inputPlaceholder='deadlinealert.entity-that-issues-it'
                    class="mt-2" />
               <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="fileNumber" type="text"
                    title="deadlinealert.file-number" inputPlaceholder='deadlinealert.file-number' class="mt-2" />
               <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="comment" type="text"
                    title="deadlinealert.comment" inputPlaceholder='deadlinealert.comment' class="mt-2" />

               <input-select title="deadlinealert.country" inputType="country" :data="countries" v-model="countryId"
                    class="mt-2" :is-required="true" />
               <input-select title="deadlinealert.category" inputType="normal" :data="contractCategories"
                    v-model="category" class="mt-2" :is-required="true" />

               <multiple-selection-box title="deadlinealert.addressee" :data="destinataries"
                    v-model="selectedDestinataries" type-selection="isEmail" :is-required="true" />
               <multiple-selection-box title="deadlinealert.parts" :data="partsArray" v-model="selectedParts"
                    type-selection="isString" :is-required="true" />

               <div v-if="!isData()">
                    <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="start-date" type="date"
                         title="deadlinealert.start-date" class="mt-2" @update-value="handleStartDate"
                         :is-required="true" />
                    <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="expiration-date"
                         type="date" title="deadlinealert.expiration-date" class="mt-2"
                         @update-value="handleExpireDate" />
                    <div>
                         <primary-button :isDisabled="isButtonDisabled" @click="triggerDatePicker">
                              <p class="uppercase">
                                   {{ $t('deadlinealert.notification-date') }}
                              </p>
                         </primary-button>
                         <input ref="dateInput" type="date" @change="handleDateChange"
                              class="relative top-0 left-0 opacity-0 " />
                    </div>
                    <div class="mt-4 flex space-x-4 text-gray-500">
                         <span v-for="(notification, index) in notificationDates" :key="index"
                              @click="deleteNotification(index)" class="underline decoration-dashed cursor-pointer">
                              {{ notification }}
                         </span>
                    </div>

                    <div class="flex mt-4" v-if="isNinetyDaysVisible">
                         <p class="mr-4">{{ $t('deadlinealert.notification', { date: '90' }) }}</p>
                         <toggle-switch @toggle-selection="NinetyDays" />
                    </div>
                    <div class="flex mt-4" v-if="isThirtyDaysVisible">
                         <p class="mr-4">{{ $t('deadlinealert.notification', { date: '30' }) }}</p>
                         <toggle-switch @toggle-selection="ThirtyDays" />
                    </div>
                    <div class="flex mt-4" v-if="isFifteenDaysVisible">
                         <p class="mr-4">{{ $t('deadlinealert.notification', { date: '15' }) }}</p>
                         <toggle-switch @toggle-selection="FifteenDays" />
                    </div>

               </div>
          </div>
     </panel>
</template>

<script setup>
import { useDeadLineAlertStore } from '@/stores/deadLineAlertStore';
import { useLawyerStore } from '@/stores/lawyerStore.js'
import { useForm } from 'vee-validate'
import { ref, watchEffect, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore';
import { DateTime } from 'luxon';

import Panel from "../forms/Panel.vue"
import TextInput from "../forms/TextInput.vue"
import InputSelect from '@/components/forms/InputSelect.vue'
import MultipleSelectionBox from "../forms/MultipleSelectionBox.vue"
import PrimaryButton from '../forms/PrimaryButton.vue'
import ToggleSwitch from '../forms/ToggleSwitch.vue'
import * as yup from 'yup'

const emit = defineEmits(['updatedDocument'])
const dt = DateTime.local()
const userStore = useUserStore()
const { allUsers } = storeToRefs(userStore)
userStore.fetchUsers()
const deadLineAlertsStore = useDeadLineAlertStore()
const { contract, countries, contractCategories } = storeToRefs(deadLineAlertsStore)
const lawyerStore = useLawyerStore()
const { currentLaywer, getId } = storeToRefs(lawyerStore)

const actualContract = ref(contract.value || [])
const countryId = ref(deadLineAlertsStore.getCountryById(actualContract?.value?.country_id) || { id: 90, name: 'Guatemala' })
const category = ref(actualContract?.value.contract_category_id || [])
const destinataries = ref(actualContract?.value.destinataries || allUsers.value)
const partsArray = ref(actualContract?.value.client || [])
const selectedDestinataries = ref(actualContract?.value?.destinataries || [])
const selectedParts = ref(actualContract?.value.client || [])

const startDate = ref(null)
const expireDate = ref(null)
const NinetyDaysDate = ref(null)
const ThirtyDaysDate = ref(null)
const FifteenDaysDate = ref(null)
const notificationDates = ref([]);
const dateInput = ref(null);

const isData = () => {
     if (Object.keys(contract.value).length > 0) {
          return true
     } else {
          return false
     }
}

const initialValues = computed(() => ({
     description: actualContract.value.description || '',
     product: actualContract?.value?.product || '',
     entity: actualContract?.value?.emit_entity || '',
     fileNumber: actualContract?.value?.expedient_number || '',
     comment: actualContract?.value?.comment || '',
}))
const isNinetyDaysVisible = computed(() => {
     return expireDate.value && startDate.value && expireDate.value.diff(startDate.value, 'days').days >= 90;
});
const isThirtyDaysVisible = computed(() => {
     return expireDate.value && startDate.value && expireDate.value.diff(startDate.value, 'days').days >= 30;
});
const isFifteenDaysVisible = computed(() => {
     return expireDate.value && startDate.value && expireDate.value.diff(startDate.value, 'days').days >= 15;
});

const handleStartDate = (newDate) => {
     startDate.value = DateTime.fromISO(newDate)
}
const handleExpireDate = (newDate) => {
     expireDate.value = DateTime.fromISO(newDate)
}
const NinetyDays = (boolean) => {
     if (boolean && startDate.value) {
          NinetyDaysDate.value = calculateNextDays(startDate.value, 90)
          notificationDates.value.push(NinetyDaysDate.value)
     } else {
          notificationDates.value.pop(NinetyDaysDate.value)
     }
}
const ThirtyDays = (boolean) => {
     if (boolean && startDate.value) {
          ThirtyDaysDate.value = calculateNextDays(startDate.value, 30)
          notificationDates.value.push(ThirtyDaysDate.value)
     } else {
          notificationDates.value.pop(ThirtyDaysDate.value)
     }
}
const FifteenDays = (boolean => {
     if (boolean && startDate.value) {
          FifteenDaysDate.value = calculateNextDays(startDate.value, 15)
          notificationDates.value.push(FifteenDaysDate.value)
     } else {
          notificationDates.value.pop(FifteenDaysDate.value)
     }
})
const calculateNextDays = (date, n) => {
     const newDate = date.plus({ days: n });
     return newDate.toISODate();
}

const isButtonDisabled = computed(() => {
     return !startDate.value || !startDate.value.isValid || !expireDate.value || !expireDate.value.isValid;
});
const triggerDatePicker = () => {
     if (dateInput.value) {
          dateInput.value.focus();
          dateInput.value.showPicker();
     }
};
const handleDateChange = (event) => {
     const selectedDate = event.target.value;
     if (selectedDate) {
          notificationDates.value.push(selectedDate)
     }
}
const deleteNotification = (event) => {
     notificationDates.value.pop(event)
}

const { values, errors } = useForm({
     initialValues,
     validationSchema: yup.object({
          description: yup.string().required(),
          product: yup.string(),
          entity: yup.string(),
          fileNumber: yup.string(),
          comment: yup.string(),
     })
})
const isFormValid = computed(() => {
     return Object.keys(errors.value).length === 0 && values.description && Object.values(selectedDestinataries.value).length > 0 && selectedParts.value !== ''
})
const newData = ref([])
watchEffect(() => {
     newData.value = {
          isValid: isFormValid.value,
          id: actualContract.value.id,
          description: values.description,
          product: values.product,
          emit_entity: values.entity,
          expedient_number: values.fileNumber,
          comment: values.comment,
          country_id: countryId.value.id,
          contract_category_id: category.value,
          client: selectedParts.value,
          destinataries: selectedDestinataries.value,
          lawyer_id: getId.value
     }
     emit('updatedDocument', newData.value)
})
</script>