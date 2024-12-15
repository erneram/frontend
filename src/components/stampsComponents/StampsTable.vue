<template>
  <general-table :headers="headers" :no-data-message="noDataMessage" :data="sortItems" @corrected-data="DataSized">
    <template #head>
      <thead>
        <tr>
          <th v-for="(header, index) in headers" :key="index" scope="col"
            class=" py-3.5 px-2 text-sm text-center font-semibold text-gray-400 hover:text-gray-700">
            <button @click="handleSort(index)"
              class="flex items-start focus:outline-none transition-transform duration-300 transform hover:scale-110">
              <arrow-long-up-icon :class="{
                'rotate-180': sortBy === index && sortDirection === 'asc'
              }" class="h-5 w-5" />
              {{ $t(header) }}
            </button>
          </th>
        </tr>
      </thead>
    </template>
    <template #body>
      <tbody class="divide-y divide-gray-200 bg-white">
        <tr v-for="instrument in displayData" :key="instrument">
          <td class="px-3 py-4 text-sm text-gray-700">{{ formatDate(instrument.date) }}</td>
          <td class="px-3 py-4 text-sm text-center text-gray-700">{{ instrument.number }}</td>
          <td class="px-3 py-4 text-sm text-center text-gray-700">{{ instrument.client }}</td>
          <td class="px-3 py-4 text-sm text-center text-gray-700">{{ instrument.instrument_type }}</td>
          <td class="px-3 py-4 text-sm text-center text-gray-700">{{ instrument.fiscal_pages }} {{
            $t('protocol-stamps.50c-stamps') }}</td>
          <td class="px-3 py-4 text-sm text-center text-gray-700">{{ $t('general.monetary-symbol') }}{{
            (instrument.notarial_amount).toFixed(2) }}</td>
          <td class="px-3 py-4 text-sm text-center text-gray-700">{{ $t('general.monetary-symbol') }}{{
            ((instrument.fiscal_pages * 0.5) + instrument.notarial_amount).toFixed(2) }}</td>
          <td class="text-end">
            <div class="flex justify-end">
              <action-button-solid-icon icon="EyeIcon" color="text-emerald-600"
                @click="openDetailTicketDialog(instrument.id)" />
            </div>
          </td>
        </tr>
      </tbody>
    </template>
  </general-table>
</template>

<script setup>
import { useStampsStore } from '@/stores/stampsStore.js';
import { ArrowLongUpIcon } from '@heroicons/vue/24/outline';
import { computed, ref } from 'vue';
import { DateTime } from 'luxon';

import ActionButtonSolidIcon from '../buttons/ActionButtonSolidIcon.vue';
import GeneralTable from '../forms/GeneralTable.vue';

const stampsStore = useStampsStore()
const { openDetailTicketDialog } = stampsStore
const headers = ['protocol-stamps.date', 'protocol-stamps.no-writing', 'protocol-stamps.customer', 'protocol-stamps.type-instrument', 'protocol-stamps.prosecutors', 'protocol-stamps.notarial', 'protocol-stamps.total']
const noDataMessage = 'user-admin.empty-data'
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
})
const formatDate = (date) => {
  const parts = date.split('-')
  if (parts.length === 3) {
    const [year, month, day] = parts
    return `${day}/${month}/${year}`
  }
}
const displayData = ref([])
const sortDirection = ref('asc')
const sortBy = ref(null)

const handleSort = (column) => {
  sortDirection.value = sortBy.value === column ? (sortDirection.value === 'asc' ? 'desc' : 'asc') : 'asc'
  sortBy.value = column
}
const sortItems = computed(() => {
  let items = [...props.data]
  if (sortBy.value !== null) {
    items.sort((a, b) => {
      let first, second
      if (sortBy.value === 0) {
        first = DateTime.fromISO(a.date)
        second = DateTime.fromISO(b.date)
      } else if (sortBy.value === 1) {
        first = a.number
        second = b.number
      } else if (sortBy.value === 2) {
        first = a.client.toLowerCase()
        second = b.client.toLowerCase()
      } else if (sortBy.value === 3) {
        first = a.instrument_type.toLowerCase()
        second = b.instrument_type.toLowerCase()
      } else if (sortBy.value === 4) {
        first = a.fiscal_pages
        second = b.fiscal_pages
      } else if (sortBy.value === 5) {
        first = a.notarial_amount
        second = b.notarial_amount
      } else if (sortBy.value === 6) {
        first = (a.fiscal_amount + a.notarial_amount)
        second = (b.fiscal_amount + b.notarial_amount)
      }
      if (first < second) return sortDirection.value === 'asc' ? 1 : -1
      if (first > second) return sortDirection.value === 'asc' ? -1 : 1
      return 0
    })
  }
  return items
})
const DataSized = (newData) => {
  displayData.value = newData
}
</script>