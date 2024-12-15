<template>
  <div v-if="isLoadingUserStore">
    <spinner-loading />
  </div>
  <div v-else>
    <h2 class="text-xl"><span class="font-bold text-red-500">ALERTA </span>El {{
      formatDateToString(arrayAlertInformation[0].alert_date) }} vence{{ arrayAlertInformation.length == 1 ? '' : 'n'
      }}:</h2>
    <div v-for="(item, index) in arrayAlertInformation" :key="index">
      <panel class="flex mb-2 hover:cursor-pointer" @click="openViewDialog(item.instrument_id)">
        <div class="flex flex-col">
          <p class="text-xl font-bold"> {{ item.alert_name }} </p>
          <div class="flex">
            <p class="font-medium mr-2">{{ $t('general.instrument') }}:</p>
            <p>{{ item.instrument_type }}</p>
          </div>
          <div class="flex">
            <p class="font-medium mr-2">{{ $t('general.lawyer') }}:</p>
            <p>{{ lawyerStore.getLawyerNameById(item.lawyer_id) }}</p>
          </div>
          <div class="flex">
            <p class="font-medium mr-2">{{ $t('general.client') }}:</p>
            <p>{{ item.instrument_client }}</p>
          </div>
        </div>
        <div class="">
          <p>{{ formatDateToString(item.alert_date) }}</p>
        </div>
      </panel>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, defineAsyncComponent } from 'vue'
import { useInstrumentsStore } from '@/stores/instrumentsStore';
import { useUserStore } from '@/stores/userStore';
import { useLawyerStore } from '@/stores/lawyerStore';
import { DateTime } from 'luxon'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia';

import Panel from '../forms/Panel.vue';
const SpinnerLoading = defineAsyncComponent(() => import('@/components/forms/SpinnerLoading.vue'))

const dt = DateTime.local()
const { t } = useI18n()
const months = ['calendar.january', 'calendar.february', 'calendar.march', 'calendar.april', 'calendar.may', 'calendar.june', 'calendar.july', 'calendar.august', 'calendar.september', 'calendar.october', 'calendar.november', 'calendar.december']

const lawyerStore = useLawyerStore()
const { allLawyers } = lawyerStore
const userStore = useUserStore()
const { isLoadingUserStore } = storeToRefs(userStore)
const instrumentsStore = useInstrumentsStore()
const { openViewDialog } = instrumentsStore

const props = defineProps({
  alertInformation: {
    type: Array,
    default: {}
  }
})
const arrayAlertInformation = ref(props.alertInformation)
watch(() => props.alertInformation, (newVal) => {
  arrayAlertInformation.value = newVal
})

const formatDateToString = (date) => {
  const dateOnly = date.split('T')[0]
  const parts = dateOnly.split('-')
  if (parts.length === 3) {
    const day = parseInt(parts[2], 10)
    const month = parseInt(parts[1], 10) - 1
    const year = parseInt(parts[0], 10)
    const correctMonth = months[month]
    return `${day} de ${t(correctMonth)} de ${year}`
  }
  return date
}
</script>