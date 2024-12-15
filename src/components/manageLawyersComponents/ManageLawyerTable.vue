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
                    <tr v-for="lawyers in displayData" :key="lawyers.id">
                         <td class="px-3 py-4 text-sm text-gray-700">{{ lawyers.id }}</td>
                         <td class="px-3 py-4 text-sm text-gray-700">{{ lawyers.dpi }}</td>
                         <td class="px-3 py-4 text-sm text-gray-700">{{ lawyers.agp_key }}</td>
                         <td class="px-3 py-4 text-sm text-gray-700">{{ lawyers.number }}</td>
                         <td class="px-3 py-4 text-sm text-gray-700">{{ formatDate(lawyers.birthdate) }}</td>

                         <td class="text-end">
                              <div class="flex justify-end">
                                   <action-button-solid-icon icon="PencilIcon" color="text-emerald-500"
                                        size="h-6 w-6 mr-1" @click="openLawyerEditDialog(lawyers)" />
                                   <action-button-solid-icon icon="TrashIcon" color="text-red-600" size="h-6 w-6 mr-1"
                                        @click="openLawyerDeleteDialog(lawyers)" />
                              </div>
                         </td>
                    </tr>
               </tbody>
          </template>
     </general-table>
</template>
<script setup>
import { ArrowLongUpIcon } from '@heroicons/vue/24/outline'
import { useLawyerStore } from '@/stores/lawyerStore.js'
import { ref, computed } from 'vue'

import GeneralTable from '../forms/GeneralTable.vue';
import ActionButtonSolidIcon from '../buttons/ActionButtonSolidIcon.vue';

const lawyerStore = useLawyerStore()
const { openLawyerEditDialog, openLawyerDeleteDialog } = lawyerStore
const props = defineProps({
     lawyers: {
          type: Object,
          required: true
     },
})
const headers = ['lawyer-admin.id', 'lawyer-admin.personal-identification-document', 'lawyer-admin.agp-key', 'lawyer-admin.number', 'lawyer-admin.birthdate']
const noDataMessage = 'user-admin.empty-data'

const allLawyers = ref(props.lawyers)
const displayData = ref([])

const sortDirection = ref('asc')
const sortBy = ref(null)
const formatDate = (date) => {
     const parts = date.split('-')
     if (parts.length === 3) {
          const [year, month, day] = parts
          return `${day}/${month}/${year}`
     }
}
const handleSort = (column) => {
     sortDirection.value = sortBy.value === column ? (sortDirection.value === 'asc' ? 'desc' : 'asc') : 'asc'
     sortBy.value = column
}
const sortItems = computed(() => {
     let items = [...props.lawyers]
     if (sortBy.value !== null) {
          items.sort((a, b) => {
               let first, second
               if (sortBy.value === 0) {
                    first = a.id
                    second = b.id
               } else if (sortBy.value === 1) {
                    first = a.dpi
                    second = b.dpi
               } else if (sortBy.value === 2) {
                    first = a.agp_key.toLowerCase()
                    second = b.agp_key.toLowerCase()
               } else if (sortBy.value === 3) {
                    first = a.number
                    second = b.number
               } else if (sortBy.value === 4) {
                    first = a.phone
                    second = b.phone
               } else if (sortBy.value === 5) {
                    first = a.birthdate
                    second = b.birthdate
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