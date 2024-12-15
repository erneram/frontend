<template>
     <panel>
          <p class="text-xl ">{{ $t('reports.notary') }}</p>
          <custom-label title="reports.notary-selection" />
          <alerts-instrument-report-input-selection :options="allLawyerList" @id-selected="handleIdSelected"
               placeholder="reports.select-notary" />
     </panel>
</template>
<script setup>
import { useAlertsInstrumentStore } from '@/stores/alertsInstrumentStore';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue'

import Panel from '../forms/Panel.vue';
import CustomLabel from '../forms/CustomLabel.vue';
import AlertsInstrumentReportInputSelection from '@/components/alertsInstrumentReportComponents/AlertsInstrumentReportInputSelection.vue';

const alertsInstrumentStore = useAlertsInstrumentStore()
const { allLawyerList } = storeToRefs(alertsInstrumentStore)

const handleIdSelected = (newVal) => {
     alertsInstrumentStore.fetchYearsOfLawyer(newVal)
}
</script>