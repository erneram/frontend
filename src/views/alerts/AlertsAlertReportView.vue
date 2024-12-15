<template>
    <panel>
        <div v-if="!isLoading">
            <alerts-alert-report-calendar />
            <alerts-alert-report-download-buttons />
        </div>
        <div v-else class="w-full">
            <spinner-loading class="mx-auto" />
        </div>
    </panel>

    <alerts-alert-report-detail-dialog v-if="showAlertDialog && currentDateAlert !== null" @close="hideAlertDialog"
        :isOpen="showAlertDialog" />
</template>
<script setup>
import { useAlertsAlertReportStore } from '@/stores/alertsAlertReportStore.js';
import { storeToRefs } from 'pinia';
import { defineAsyncComponent, watch, ref } from "vue"

const AlertsAlertReportDetailDialog = defineAsyncComponent(() => import('@/components/alertsAlertReportComponents/AlertsAlertReportDetailDialog.vue'))

import SpinnerLoading from '@/components/forms/SpinnerLoading.vue';
import Panel from '@/components/forms/Panel.vue';
import AlertsAlertReportCalendar from '@/components/alertsAlertReportComponents/AlertsAlertReportCalendar.vue'
import AlertsAlertReportDownloadButtons from '@/components/alertsAlertReportComponents/AlertsAlertReportDownloadButtons.vue'

const alertsReportStore = useAlertsAlertReportStore()
const { isLoading, showAlertDialog, currentDateAlert } = storeToRefs(alertsReportStore)
const { hideAlertDialog } = alertsReportStore
alertsReportStore.fetchLawyerEvents()
</script>