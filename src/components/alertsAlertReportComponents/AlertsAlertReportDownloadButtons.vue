<template>
     <div v-if="isLoading">
          <spinner-loading class="mx-auto" />
     </div>
     <div v-else>
          <primary-button :isDisabled="isLoadingDownloadAllAlerts" type="button" @click="downloadAllEvents()"
               bgColor="emerald">
               <spinner-loading v-if="isLoadingDownloadAllAlerts" />
               <div v-else>{{ $t('reports.download-all-alerts') }}</div>
          </primary-button>
          <primary-button :isDisabled="isLoadingDownloadMonthAlerts" type="button" @click="downloadMonthEvents()"
               bgColor="emerald">
               <spinner-loading v-if="isLoadingDownloadMonthAlerts" />
               <div v-else>{{ $t('reports.download-month-alerts') }}{{ $t(formatMonthByNumber(currentMonthStore)) }}
               </div>
          </primary-button>
     </div>
</template>
<script setup>
import { useAlertsAlertReportStore } from '@/stores/alertsAlertReportStore'
import { storeToRefs } from 'pinia'

import SpinnerLoading from '../forms/SpinnerLoading.vue'
import PrimaryButton from '../forms/PrimaryButton.vue'

const alertsReportStore = useAlertsAlertReportStore()
const { currentMonthStore, currentYearStore, isLoading, isLoadingDownloadAllAlerts, isLoadingDownloadMonthAlerts, } = storeToRefs(alertsReportStore)
const downloadAllEvents = () => {
     alertsReportStore.downloadAllEvents()

}
const downloadMonthEvents = () => {
     alertsReportStore.downloadMonthEvents()
}

const months = ['calendar.january', 'calendar.february', 'calendar.march', 'calendar.april', 'calendar.may', 'calendar.june', 'calendar.july', 'calendar.august', 'calendar.september', 'calendar.october', 'calendar.november', 'calendar.december']
const formatMonthByNumber = (month) => {
     return months[month - 1]
}


</script>