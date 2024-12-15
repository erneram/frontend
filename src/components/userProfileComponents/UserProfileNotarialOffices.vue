<template>
     <panel>
          <div class="flex justify-between items-center align-center">
               <div>
                    <p class="text-xl font-bold">{{ $t('user-profile.notarial-offices') }}</p>
               </div>
               <div class="">
                    <action-button-solid-icon icon="PlusCircleIcon" color="text-emerald-600" size="h-8 w-8"
                         class="align-center" @click="openEditCreateNotarialOffice()" />
               </div>
          </div>
          <general-table v-if="!isLoadingOfficeStore" :headers="headers" :no-data-message="noDataMessage"
               :data="sortItems" @corrected-data="DataSized">
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
                         </tr>
                    </thead>
               </template>
               <template #body>
                    <tbody class="divide-y divide-gray-200 bg-white">
                         <tr v-for="office in displayData" :key="office.id">
                              <td class="px-3 py-4 text-sm text-gray-700">{{ office.direction }}</td>
                              <td class="px-3 py-4 text-sm text-gray-700">{{ office.municipality }}</td>
                              <td class="px-3 py-4 text-sm text-gray-700">{{ office.department }}</td>
                              <td class="px-3 py-4 text-sm text-gray-700">
                                   <CheckIcon v-if="office.active === 1" class="h-8 w-8 text-green-500" />
                                   <XMarkIcon v-if="office.active === 0" class="h-8 w-8 text-red-500" />
                              </td>
                              <td class="px-3 py-4 text-sm text-gray-700">
                                   <CheckIcon v-if="office.is_principal === 1" class="h-8 w-8 text-green-500" />
                                   <XMarkIcon v-if="office.is_principal === 0" class="h-8 w-8 text-red-500" />
                              </td>

                              <td class="text-end">
                                   <div class="flex justify-end">
                                        <action-button-solid-icon icon="PencilIcon" color="text-emerald-500"
                                             size="h-6 w-6 mr-1" @click="openEditCreateNotarialOffice(office)" />
                                        <action-button-solid-icon v-if="office.is_principal === 0" icon="TrashIcon"
                                             color="text-red-500" size="h-6 w-6 mr-1"
                                             @click="openDeleteNotarialOffice(office)" />
                                   </div>
                              </td>
                         </tr>
                    </tbody>
               </template>
          </general-table>
          <div v-else class="w-full">
               <spinner-loading class="mx-auto" />
          </div>
     </panel>
</template>
<script setup>
import { ArrowLongUpIcon, CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useLawyerStore } from '@/stores/lawyerStore';
import { useOfficeStore } from '@/stores/officesStore';
import { storeToRefs } from 'pinia';
import { ref, computed } from 'vue'

import Panel from '../forms/Panel.vue';
import ActionButtonSolidIcon from "../buttons/ActionButtonSolidIcon.vue"
import GeneralTable from '../forms/GeneralTable.vue';
import SpinnerLoading from '../forms/SpinnerLoading.vue';

const headers = ['user-profile.address', 'user-profile.municipality', 'user-profile.department', 'user-profile.active', 'user-profile.major']
const noDataMessage = 'user-profile.empty-data'


const officeStore = useOfficeStore()
const { openEditCreateNotarialOffice, openDeleteNotarialOffice } = officeStore
const { lawyerOfficeInformation, isLoadingOfficeStore } = storeToRefs(officeStore)

const displayData = ref([])
const sortDirection = ref('asc')
const sortBy = ref(null)

const handleSort = (column) => {
     sortDirection.value = sortBy.value === column ? (sortDirection.value === 'asc' ? 'desc' : 'asc') : 'asc'
     sortBy.value = column
}
const sortItems = computed(() => {
     let items = [...lawyerOfficeInformation.value]
     if (sortBy.value !== null) {
          items.sort((a, b) => {
               let first, second
               if (sortBy.value === 0) {
                    first = a.direction.toLowerCase()
                    second = b.direction.toLowerCase()
               } else if (sortBy.value === 1) {
                    first = a.municipality.toLowerCase()
                    second = b.municipality.toLowerCase()
               } else if (sortBy.value === 2) {
                    first = a.department.toLowerCase()
                    second = b.department.toLowerCase()
               } else if (sortBy.value === 3) {
                    first = a.active
                    second = b.active
               } else if (sortBy.value === 4) {
                    first = a.is_principal
                    second = b.is_principal
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