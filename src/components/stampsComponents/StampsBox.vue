<template>
     <div>
          <dl
               class="mt-5 grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:grid-cols-3 md:divide-x md:divide-y-0">
               <div v-for="(item, index) in headers" :key="item" class="px-4 py-5 sm:p-6">
                    <dt class="text-base font-normal text-gray-900">{{ $t(item) }}</dt>
                    <dd v-if="data.length !== 0" class="mt-1 flex items-baseline justify-between md:block lg:flex">
                         <div class="flex items-baseline text-4xl font-semibold text-emerald-600">
                              <template v-if="index === 0">
                                   {{ $t('general.monetary-symbol') }}{{ totalFiscal }}
                              </template>
                              <template v-if="index === 1">
                                   {{ $t('general.monetary-symbol') }}{{ totalNotarial }}
                              </template>
                              <template v-if="index === 2">
                                   {{ $t('general.monetary-symbol') }}{{ totalNotarialFiscal }}
                              </template>
                              <div v-if="index === 0" class="ml-2 text-sm font-medium text-gray-500">
                                   {{ totalStamps }} {{ $t('protocol-stamps.50c-stamps') }}
                              </div>
                         </div>

                    </dd>
                    <dd v-if="data.length === 0">
                         <div class="flex items-baseline text-4xl font-semibold text-emerald-600">
                              <template v-if="index === 0">
                                   {{ $t('general.monetary-symbol') }}00.00
                              </template>
                              <template v-if="index === 1">
                                   {{ $t('general.monetary-symbol') }}00.00
                              </template>
                              <template v-if="index === 2">
                                   {{ $t('general.monetary-symbol') }}00.00
                              </template>
                              <div v-if="index === 0" class="ml-2 text-sm font-medium text-gray-500">
                                   0 {{ $t('protocol-stamps.50c-stamps') }}
                              </div>
                         </div>
                    </dd>
               </div>
          </dl>
     </div>
</template>

<script setup>
import { computed } from 'vue'
const headers = ['protocol-stamps.prosecutors', 'protocol-stamps.notarial', 'protocol-stamps.total']
const props = defineProps({
     data: {
          type: Array,
          default: () => []
     }
})

const totalFiscal = computed(() => {
     return props.data.reduce((acc, item) => acc + item.fiscal_amount, 0).toFixed(2)
})
const totalStamps = computed(() => {
     return (props.data.reduce((acc, item) => acc + item.fiscal_pages, 0)).toFixed(2)
})
const totalNotarial = computed(() => {
     return props.data.reduce((acc, item) => acc + item.notarial_amount, 0).toFixed(2)
})
const totalNotarialFiscal = computed(() => {
     return (parseFloat(totalNotarial.value) + parseFloat(totalFiscal.value)).toFixed(2)
})

</script>
