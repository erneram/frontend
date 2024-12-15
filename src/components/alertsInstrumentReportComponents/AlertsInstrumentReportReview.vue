<template>
     <panel>
          <div v-if="alertContract !== undefined">
               <div class="bg-emerald-500 shadow-md text-white p-4 flex justify-between items-center rounded-t-lg">
                    <div class="text-2xl font-semibold">
                         {{ $t('reports.contract-alerts') }}
                    </div>
               </div>
               <div class="px-6 mt-2">
                    <div class="mb-4 px-8">
                         <div class="flex flex-col items-center justify-center">
                              <p class="text-md font-bold">{{ $t('reports.instrument-number') }}: {{ numberAnalyzing }}
                              </p>
                              <p>{{ alertContract.instrumentType.name }}</p>
                              <p>{{ alertContract.client }}</p>
                         </div>
                    </div>
                    <div v-for="(item, index) in alertContract.instrumentAlert" :key="index" class=" p-2">
                         <p>{{ item.name }}</p>
                         <p v-if="item.alert_status_id === 1" class="text-orange-500">{{ $t('general.pending') }}</p>
                         <p v-if="item.alert_status_id === 2" class="text-green-500">{{ $t('general.complete') }}</p>
                    </div>
               </div>
          </div>
     </panel>
</template>
<script setup>
import { useAlertsInstrumentStore } from '@/stores/alertsInstrumentStore';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue'
import Panel from '../forms/Panel.vue';

const alertsInstrumentStore = useAlertsInstrumentStore()
const { contractAlerts } = storeToRefs(alertsInstrumentStore)

const props = defineProps({
     num: Number
})

const numberAnalyzing = ref(props.num)
const alertContract = ref(contractAlerts.value.find(contract => contract.number === numberAnalyzing.value))

watch(() => props.num, (newNum) => {
     numberAnalyzing.value = newNum
     alertContract.value = contractAlerts.value.find(contract => contract.number === numberAnalyzing.value)
})
</script>