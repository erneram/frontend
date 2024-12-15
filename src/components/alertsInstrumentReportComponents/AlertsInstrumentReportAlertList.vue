<template>
     <panel>
          <div class="bg-emerald-500 shadow-md text-white p-4 flex justify-between items-center rounded-t-lg">
               <div class="text-2xl font-semibold">
                    {{ $t('reports.contract-alerts') }}
               </div>
               <div class="flex items-center">
                    <label class="mr-2">{{ $t('reports.pending-delivery') }}</label>
                    <input type="checkbox" id="pending"
                         class="form-checkbox h-5 w-5 text-white bg-white border-white rounded" v-model="pendingOnly" />
               </div>
          </div>
          <div>
               <dl class="mt-5">
                    <div v-if="filteredOptions.length === 0" class="flex justify-center font-thin">
                         {{ $t('reports.no-contract-alerts') }}
                    </div>
                    <div v-else>
                         <div v-for="item in filteredOptions" :key="item.id" @click="selectItem(item.number)"
                              class="relative flex overflow-hidden rounded-lg bg-white mb-2 px-4 py-4 shadow hover:bg-gray-100">
                              <div class="flex flex-col justify-center items-center">
                                   <div
                                        class="rounded-md bg-emerald-500 p-3 text-white w-20 h-10 flex items-center justify-center mt-2">
                                        {{ item.number }}
                                   </div>
                              </div>
                              <div class="ml-6 flex-1">
                                   <p class="truncate text-sm font-medium text-gray-500 max-w-full">
                                        {{ item.client }}
                                   </p>
                                   <p class="truncate text-sm font-medium text-gray-500 max-w-full">
                                        {{ item.date }}
                                   </p>
                                   <div class="flex items-baseline">
                                        <p :class="[
                                             'truncate text-sm font-medium',
                                             getPercentage(item.instrumentAlert) <= 50.0
                                                  ? 'text-red-500'
                                                  : 'text-green-500'
                                        ]">
                                             {{ getPercentage(item.instrumentAlert) }}%
                                        </p>
                                        <p class="ml-2 truncate text-sm font-medium text-gray-500 max-w-full">
                                             {{ instrumentCompleated(item.instrumentAlert) }} /
                                             {{ item.instrumentAlert.length }}
                                        </p>
                                   </div>
                                   <div class="flex truncate">
                                        <p class="truncate text-2xl font-semibold text-gray-900 max-w-full">
                                             {{ item.instrumentType.name }}
                                        </p>
                                        <p class="truncate mt-1 mx-2 text-xl font-semibold">-</p>
                                        <p :class="[
                                             'truncate mt-1 text-xl font-semibold text-gray-900',
                                             item.instrumentStatus.id === 1
                                                  ? 'text-green-500'
                                                  : 'text-red-500'
                                        ]">
                                             {{ item.instrumentStatus.name }}
                                        </p>
                                   </div>
                              </div>
                         </div>
                    </div>
               </dl>
          </div>
     </panel>
</template>

<script setup>
import { useAlertsInstrumentStore } from '@/stores/alertsInstrumentStore'
import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import Panel from '@/components/forms/Panel.vue'

const alertsInstrumentStore = useAlertsInstrumentStore()
const { contractAlerts } = storeToRefs(alertsInstrumentStore)
const pendingOnly = ref(false);
const filteredOptions = computed(() => {
     let options = contractAlerts.value.slice().sort((a, b) => a.number - b.number)
     if (pendingOnly.value) {
          return options.filter(item => getPercentage(item.instrumentAlert) < 100)
     }
     return options;
});

const selectedNumber = ref(null);
const instrumentCompleated = array => {
     return array.reduce((acc, item) => item.alert_status_id === 2 ? acc + 1 : acc, 0)
}
const getPercentage = array => {
     const completedCount = instrumentCompleated(array);
     return ((completedCount / array.length) * 100).toFixed(2)
}
const selectItem = number => {
     selectedNumber.value = number
     alertsInstrumentStore.openContractAlerts(number)
}
</script>
