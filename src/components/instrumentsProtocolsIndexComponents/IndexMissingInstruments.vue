<template>
  <div v-if="isLoadingInstrumentsIndexStore">
    <spinner-loading />
  </div>
  <div v-else class="rounded-lg">
    <div v-if="missingNumbers.length > 0" class="m-8 font-bold text-xl flex text-center">
      {{ $t('protocol-index.instruments-need-to-be-entered') }}
    </div>
    <div v-if="missingNumbers.length === 0" class="m-8 font-bold text-xl flex text-center">
      <check-circle-icon class="mr-2 h-7 w-7 text-green-500" /> {{
        $t('protocol-index.no-instruments-need-to-be-entered') }}
    </div>

    <div class="m-8">
      <ul role="list" class="flex justify-center grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        <li v-if="missingNumbers.length > 0" v-for=" (item, index) in displayedItems" :key="index">
          <span
            class="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium text-gray-900 bg-white shadow-sm ring-1 ring-inset ring-gray-200">
            <svg class="h-3 w-3 fill-orange-500" viewBox="0 0 6 6" aria-hidden="true">
              <circle cx="3" cy="3" r="3" />
            </svg>
            {{ item }}
          </span>
        </li>
      </ul>
    </div>
    <div v-if="missingNumbers.length > 35" class="flex items-center justify-center">
      <primary-button @click="previousPage" :isDisabled="currentPage <= 1" class="mr-2" bgColor="white">
        <chevron-left-icon class="h-6 w-6" />
      </primary-button>
      <span class="">{{ currentPage }}-{{ pageCount }}</span>
      <primary-button @click="nextPage" :isDisabled="currentPage >= pageCount" bgColor="white">
        <chevron-right-icon class="h-6 w-6" />
      </primary-button>
    </div>
  </div>
</template>
<script setup>
import { useIndexStore } from '@/stores/instrumentsIndexStore.js'
import { storeToRefs } from 'pinia';
import { defineAsyncComponent, ref, computed } from 'vue'
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/vue/24/outline'

const SpinnerLoading = defineAsyncComponent(() => import('@/components/forms/SpinnerLoading.vue'))
const CheckCircleIcon = defineAsyncComponent(() => import("@heroicons/vue/24/outline/CheckCircleIcon"))
import PrimaryButton from '../forms/PrimaryButton.vue';

const indexStore = useIndexStore()
const { missingNumbers, isLoadingInstrumentsIndexStore } = storeToRefs(indexStore)

const itemsPerPage = ref(35)
const currentPage = ref(1)
const displayedItems = computed(() => {
  const perPage = parseInt(itemsPerPage.value, 10)
  const startIndex = (currentPage.value - 1) * perPage
  const endIndex = startIndex + perPage
  return missingNumbers.value.slice(startIndex, endIndex)
})
const pageCount = computed(() => {
  return Math.ceil(missingNumbers.value.length / itemsPerPage.value)
})
const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--
}
const nextPage = () => {
  if (currentPage.value < pageCount.value) currentPage.value++
}

</script>