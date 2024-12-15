<template>
     <div v-if="isLoadingDeadLineAlertStore || isLoadingFetchContract">
          <spinner-loading class="mx-auto" />
     </div>
     <div v-else>
          <general-table :no-data-message="noDataMessage" :data="sortItems" @corrected-data="DataSized">
               <template #head>
                    <thead>
                         <tr>
                              <th v-for="(header, index) in headers" :key="index" scope="col"
                                   class=" py-3.5 px-2 text-sm text-center font-semibold text-gray-400 hover:text-gray-700">
                                   <button @click="handleSort(index)"
                                        class="flex items-start focus:outline-none transition-transform duration-300 transform hover:scale-110">
                                        <ArrowLongUpIcon :class="{
                                             'rotate-180': sortBy === index && sortDirection === 'asc'
                                        }" class="h-5 w-5" />
                                        {{ $t(header) }}
                                   </button>
                              </th>
                              <th>
                                   <action-button-solid-icon icon="PlusCircleIcon" color="text-emerald-500"
                                        size="h-8 w-8 " @click="openCreateEditDialog()" />
                              </th>
                         </tr>
                    </thead>
               </template>
               <template #body>
                    <tbody class="divide-y divide-gray-200 bg-white">
                         <tr v-for="contract in displayData" :key="contract.id">
                              <td class="px-3 py-4 text-sm text-gray-700">{{ contract.description }}</td>
                              <td class="px-3 py-4 text-sm text-gray-700">{{ contract.client }}</td>
                              <td class="px-3 py-4 text-sm text-gray-700">{{ contract.product }}</td>
                              <td class="px-3 py-4 text-sm text-gray-700">{{ getCountryNameById(contract.country_id) }}
                              </td>
                              <td class="px-3 py-4 text-sm text-gray-700">{{ contract.category }}</td>
                              <td class="px-3 py-4 text-sm text-gray-700">{{ contract.status_name }}</td>
                              <td class="px-3 py-4 text-sm text-gray-700">{{ formatDate(contract.initial_date) }}</td>
                              <td class="px-3 py-4 text-sm text-gray-700">{{ formatDate(contract.expires_at) }}</td>
                              <td class="text-end">
                                   <div class="flex justify-end">
                                        <action-button-solid-icon icon="EyeIcon" color="text-emerald-500"
                                             size="h-6 w-6 mr-1" @click="openCreateEditDialog(contract)" />
                                        <action-button-solid-icon icon="TrashIcon" color="text-red-600"
                                             size="h-6 w-6 mr-1" @click="openDeleteDialog(contract)" />
                                   </div>
                              </td>
                         </tr>
                    </tbody>
               </template>
          </general-table>
     </div>
</template>
<script setup>
import { ArrowLongUpIcon } from '@heroicons/vue/24/outline'
import { useDeadLineAlertStore } from '@/stores/deadLineAlertStore';
import { ref, computed, defineAsyncComponent } from 'vue'
import { DateTime } from 'luxon'
import { storeToRefs } from 'pinia'

const SpinnerLoading = defineAsyncComponent(() => import("@/components/forms/SpinnerLoading.vue"))
import GeneralTable from '../forms/GeneralTable.vue';
import ActionButtonSolidIcon from '../buttons/ActionButtonSolidIcon.vue';

const deadLineAlertsStore = useDeadLineAlertStore()
const props = defineProps({
     contracts: {
          type: Object,
          required: true
     },
})
const { openCreateEditDialog, openDeleteDialog, getCountryNameById } = useDeadLineAlertStore()
const { isLoadingDeadLineAlertStore, isLoadingFetchContract } = storeToRefs(deadLineAlertsStore)

const headers = ['deadlinealert.description', 'deadlinealert.parts', 'deadlinealert.product', 'deadlinealert.country', 'deadlinealert.category', 'deadlinealert.status', 'deadlinealert.start-date', 'deadlinealert.expiration-date']
const noDataMessage = 'user-admin.empty-data'

const allLawyers = ref(props.contracts)
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
     let items = [...props.contracts]
     if (sortBy.value !== null) {
          items.sort((a, b) => {
               let first, second
               if (sortBy.value === 0) {
                    first = a.description.toLowerCase()
                    second = b.description.toLowerCase()
               } else if (sortBy.value === 1) {
                    first = a.client.toLowerCase()
                    second = b.client.toLowerCase()
               } else if (sortBy.value === 2) {
                    first = a.product.toLowerCase()
                    second = b.product.toLowerCase()
               } else if (sortBy.value === 3) {
                    first = a.country_id
                    second = b.country_id
               } else if (sortBy.value === 4) {
                    first = a.category.toLowerCase()
                    second = b.category.toLowerCase()
               } else if (sortBy.value === 5) {
                    first = a.status_name.toLowerCase()
                    second = b.status_name.toLowerCase()
               } else if (sortBy.value === 6) {
                    first = a.initial_date
                    second = b.initial_date
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