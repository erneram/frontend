<template>
     <div class="flex">
          <div class="sm:flex-auto">
               <h1 class="text-base font-semibold leading-6 text-gray-900">{{
                    $t('instrument-categories.instrument-categories')
                    }}</h1>
          </div>
          <div class=" flex flex-1 gap-x-4 self-stretch lg:gap-x-6 mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
               <action-button-solid-icon icon="PlusIcon" color="text-white" size="h-7 w-7 rounded-full bg-emerald-600"
                    @click="openCreateDialog()" />
               <search-option @search="handleSearch" icon="MagnifyingGlassIcon" textPlaceholder="general.search" />
          </div>
     </div>
     <general-table :is-loading-content="isLoadingInstrumentCategoriesStore" :headers="headers"
          :no-data-message="noDataMessage" :data="sortItems" @corrected-data="DataSized">
          <template #head>
               <thead>
                    <tr>
                         <th v-for="(header, index) in headers" :key="index" scope="col"
                              class="w-1/3 py-3.5 px-2 text-left text-sm font-semibold text-gray-400 hover:text-gray-700">
                              <button @click="handleSort(index)"
                                   class="flex items-center focus:outline-none transition-transform duration-300 transform hover:scale-110">
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
               <!-- <tbody v-if="isLoadingInstrumentCategoriesStore">
                    <tr>
                         <td colspan="10" class="colspan-4 whitespace-nowrap py-4 pl-4 pr-3 ">
                              <spinner-loading class="mx-auto" />
                         </td>
                    </tr>
               </tbody> -->
               <tbody class="divide-y divide-gray-200 bg-white">
                    <tr v-for="item in displayData" :key="item.id">
                         <td class="px-3 py-4 text-sm font-medium text-gray-900">{{ item.name }}</td>
                         <td class="px-3 py-4 text-sm text-center text-gray-500">{{ item.documents_names }}
                         </td>
                         <td class="px-6 py-4 text-sm text-center text-gray-500">{{ item.documents_types_names
                              }}
                         </td>
                         <td class="px-3 py-4 text-right text-sm font-medium">
                              <div class="flex justify-end px-3 py-4">
                                   <action-button-solid-icon icon="PencilIcon" color="text-emerald-600"
                                        @click="openEditDialog(item.id)" />
                                   <action-button-solid-icon icon="TrashIcon" color="text-red-600"
                                        @click="openDeleteDialog(item.id)" />
                              </div>
                         </td>
                    </tr>
               </tbody>
          </template>
     </general-table>
</template>

<script setup>
import { ArrowLongUpIcon } from '@heroicons/vue/24/outline'
import { useInstrumentsCategoriesStore } from '@/stores/instrumentsCategoriesStore'
import { defineAsyncComponent, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'

import ActionButtonSolidIcon from '../buttons/ActionButtonSolidIcon.vue'
import GeneralTable from '../forms/GeneralTable.vue'
import SearchOption from '@/components/forms/SearchOption.vue'
const SpinnerLoading = defineAsyncComponent(() => import('@/components/forms/SpinnerLoading.vue'))


const { fetchCategoriesTypes } = useInstrumentsCategoriesStore()
const instrumentsCategoriesComponents = useInstrumentsCategoriesStore()
const { categories, isLoadingInstrumentCategoriesStore } = storeToRefs(instrumentsCategoriesComponents)
const { openEditDialog, openDeleteDialog, openCreateDialog } = instrumentsCategoriesComponents
fetchCategoriesTypes()

const headers = ['instrument-categories.name', 'instrument-categories.documents', 'instrument-categories.types-of-documents', 'instrument-categories.actions']
const noDataMessage = 'user-admin.empty-data'

const displayData = ref([])
const searchFilter = ref('')
const filteredItems = computed(() => {
     const searchTerm = searchFilter.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
     let items = categories.value
     if (searchTerm !== '') {
          items = items.filter(item => {
               const itemName = item.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
               return itemName.includes(searchTerm)
          })
     }
     return items
})
const sortDirection = ref('asc')
const sortBy = ref(null)
const sortItems = computed(() => {
     let items = [...filteredItems.value]
     if (sortBy.value !== null) {
          items.sort((a, b) => {
               let first, second
               if (sortBy.value === 0) {
                    first = a.name.toLowerCase()
                    second = b.name.toLowerCase()
               } else if (sortBy.value === 1) {
                    first = a.documents_names.toLowerCase()
                    second = b.documents_names.toLowerCase()
               } else if (sortBy.value === 2) {
                    first = a.documents_types_names.toLowerCase()
                    second = b.documents_types_names.toLowerCase()
               } else if (sortBy.value === 3) {
                    first = a.name.toLowerCase()
                    second = b.name.toLowerCase()
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
const handleSort = (index) => {
     sortDirection.value = sortBy.value === index ? (sortDirection.value === 'asc' ? 'desc' : 'asc') : 'asc'
     sortBy.value = index
}
const handleSearch = (search) => {
     searchFilter.value = search
}

</script>