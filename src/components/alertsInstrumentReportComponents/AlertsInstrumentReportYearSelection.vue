<template>
     <panel>
          <p class="text-xl ">{{ $t('general.year') }}</p>
          <custom-label title="reports.year-selection" />
          <alerts-instrument-report-input-selection :options="currentYears" @id-selected="handleIdSelected"
               placeholder="reports.select-year" />
     </panel>
</template>
<script setup>
import { useAlertsInstrumentStore } from '@/stores/alertsInstrumentStore';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue'

import Panel from '../forms/Panel.vue';
import CustomLabel from '../forms/CustomLabel.vue';
import alertsInstrumentReportInputSelection from './AlertsInstrumentReportInputSelection.vue';

const alertsInstrumentStore = useAlertsInstrumentStore()
const { allYears } = storeToRefs(alertsInstrumentStore)
const currentYears = ref(allYears.value)

const handleIdSelected = (newVal) => {
     alertsInstrumentStore.fetchContractAlerts(newVal)
}
</script>