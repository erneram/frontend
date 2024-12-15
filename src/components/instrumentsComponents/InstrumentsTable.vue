<template>
     <general-table :headers="headers" :no-data-message="noDataMessage" :data="sortItems" @corrected-data="DataSized">
          <template #head>
               <thead>
                    <tr>
                         <th v-for="(header, index) in headers" :key="index" scope="col"
                              class=" py-3.5 px-2 text-sm text-center font-semibold text-gray-400 hover:text-gray-700 ">
                              <button @click="handleSort(index)"
                                   class="flex items-start focus:outline-none transition-transform duration-300 transform hover:scale-110">
                                   <arrow-long-up-icon :class="{
                                        'rotate-180': sortBy === index && sortDirection === 'asc'
                                   }" class="h-5 w-5" />
                                   {{ $t(header) }}
                              </button>
                         </th>
                         <th>
                              <action-button-solid-icon icon="PlusCircleIcon" color="text-emerald-500"
                                   size="h-8 w-8 ml-4 mt-4" @click="openAddDialog()" />
                         </th>
                    </tr>
               </thead>
          </template>
          <template #body>
               <tbody class="divide-y divide-gray-200 bg-white">
                    <tr v-for="instrument in displayData" :key="instrument.id">
                         <td class="px-3 py-4 text-sm text-gray-700">{{ formatDate(instrument.date)
                              }}</td>
                         <td class="px-3 py-4 text-sm text-center text-gray-700">{{
                              instrument.number }}</td>
                         <td class="px-3 py-4 text-sm text-center text-gray-700">{{
                              instrument.client }}</td>
                         <td class="px-3 py-4 text-sm text-center text-gray-700">{{
                              instrument.instrumentType.name }}</td>
                         <td class="px-3 py-4 text-sm text-center text-gray-700">{{
                              instrument.instrumentStatus.name }}</td>
                         <td class="px-3 py-4 text-sm text-center text-gray-700 uppercase font-bold">
                              <span v-if="instrument.progress === 0" class="text-red-500">{{ $t('general.not-started')
                                   }}</span>
                              <span v-else-if="instrument.progress < 100" class="text-yellow-500">{{
                                   $t('general.incomplete') }}</span>
                              <span v-else class="text-green-500">{{ $t('general.complete') }}</span>
                         </td>
                         <td class="text-end">
                              <div class="flex justify-end">
                                   <action-button-solid-icon icon="EyeIcon" color="text-emerald-500" size="h-6 w-6 mr-1"
                                        @click="openViewDialog(instrument.id)" />
                                   <action-button-solid-icon icon="PencilIcon" color="text-emerald-600"
                                        size="h-6 w-6 mr-1" @click="openEditDialog(instrument.id)" />
                                   <action-button-solid-icon icon="TrashIcon" color="text-red-600" size="h-6 w-6 mr-1"
                                        @click="openDeleteDialog(instrument.id)" />
                              </div>
                         </td>
                    </tr>
               </tbody>
          </template>
     </general-table>
</template>

<script setup>
import { ArrowLongUpIcon } from '@heroicons/vue/24/outline'
import { useInstrumentsStore } from '@/stores/instrumentsStore.js'
import { computed, ref } from 'vue'

import ActionButtonSolidIcon from '../buttons/ActionButtonSolidIcon.vue'
import GeneralProgressBar from '@/components/forms/GeneralProgressBar.vue'
import GeneralTable from '../forms/GeneralTable.vue'
import { DateTime } from 'luxon'

const dt = DateTime.local()
const instrumentsStore = useInstrumentsStore()
const { openAddDialog, openViewDialog, openEditDialog, openDeleteDialog } = instrumentsStore
const headers = ['protocol-instruments.date', 'protocol-instruments.no-writing', 'protocol-instruments.customer', 'protocol-instruments.type-of-instrument', 'protocol-instruments.state', 'protocol-instruments.progress']
const noDataMessage = 'user-admin.empty-data'
const props = defineProps({
     data: {
          type: Array,
          default: () => []
     },
})
const displayData = ref([])
const sortDirection = ref('asc')
const sortBy = ref(null)

const formatDate = (date) => {
     if (date == null) {
          return date
     } else if (date !== null) {
          return DateTime.fromISO(date).toFormat('dd-MM-yyyy')
     }
}
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
                    first = a.instrumentType.name.toLowerCase()
                    second = b.instrumentType.name.toLowerCase()
               } else if (sortBy.value === 4) {
                    first = a.instrumentStatus.id === 1 ? 1 : 0
                    second = b.instrumentStatus.id === 1 ? 1 : 0
               } else if (sortBy.value === 5) {
                    first = a.progress
                    second = b.progress
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