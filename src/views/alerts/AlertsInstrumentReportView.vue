<template>
    <div class="grid grid-cols-2 gap-2">
        <div class="">
            <spinner-loading v-if="isLoadingAlertsInstrumentStore" class="mx-auto" />
            <alerts-instrument-report-notary-selection v-else />
        </div>
        <div>
            <spinner-loading v-if="isLoadingNotarySelect" class="mx-auto" />
            <alerts-instrument-report-year-selection v-if="!isLoadingNotarySelect && reusableLawyerId !== null" />
        </div>
        <div>
            <spinner-loading v-if="isLoadingYearSelect" class="mx-auto" />
            <alerts-instrument-report-alert-list
                v-if="!isLoadingYearSelect && reusableLawyerId !== null && contractAlerts.length > 0" />
        </div>
        <div>
            <spinner-loading v-if="isLoadingAlertsInstrumentStore" class="mx-auto" />
            <alerts-instrument-report-review v-if="!isLoadingAlertsInstrumentStore && contractAlertNumber !== null"
                :num="contractAlertNumber" />
        </div>
    </div>
</template>
<script setup>
import { useAlertsInstrumentStore } from '@/stores/alertsInstrumentStore';
import { defineAsyncComponent, watch, ref } from "vue"
import { storeToRefs } from 'pinia';


const AlertsInstrumentReportNotarySelection = defineAsyncComponent(() => import('@/components/alertsInstrumentReportComponents/AlertsInstrumentReportNotarySelection.vue'))
const AlertsInstrumentReportYearSelection = defineAsyncComponent(() => import('@/components/alertsInstrumentReportComponents/AlertsInstrumentReportYearSelection.vue'))
const AlertsInstrumentReportAlertList = defineAsyncComponent(() => import('@/components/alertsInstrumentReportComponents/AlertsInstrumentReportAlertList.vue'))
const AlertsInstrumentReportReview = defineAsyncComponent(() => import('@/components/alertsInstrumentReportComponents/AlertsInstrumentReportReview.vue'))
const SpinnerLoading = defineAsyncComponent(() => import('@/components/forms/SpinnerLoading.vue'))

import Panel from '@/components/forms/Panel.vue';

const alertsInstrumentStore = useAlertsInstrumentStore()
const { contractAlerts, isLoadingAlertsInstrumentStore, isLoadingNotarySelect, isLoadingYearSelect, reusableLawyerId, contractAlertNumber } = storeToRefs(alertsInstrumentStore)
</script>