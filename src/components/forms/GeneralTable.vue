<template>
     <div class="px-4 sm:px-6 lg:px-8">
          <div class="mt-8 flow-root">
               <div class="-mx-4 -my-2 overflow-x-auto">
                    <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                         <table class="min-w-full divide-y divide-gray-300">
                              <slot name="head"></slot>

                              <template v-if="props.data.length > 0">
                                   <slot name="body"></slot>
                              </template>
                              <template v-if="props.data.length === 0 || props.isLoadingContent">
                                   <tr>
                                        <td v-if="props.isLoadingContent" colspan="10"
                                             class="py-4 text-center text-sm text-gray-500">
                                             <spinner-loading class="mx-auto" />
                                        </td>
                                        <td v-else-if="props.data.length === 0" colspan="10"
                                             class="py-4 text-center text-sm text-gray-500">
                                             {{ $t(noDataMessage) }}
                                        </td>
                                   </tr>
                              </template>
                         </table>
                         <div class="relative">
                              <div class="absolute inset-0 flex items-center" aria-hidden="true">
                                   <div class="w-full border-t border-gray-300" />
                              </div>
                         </div>
                         <div class="mt-6 flex justify-between ">
                              <div class="flex items-center">
                                   <label for="itemsPerPage">{{ $t('instrument-categories.results-per-page') }}</label>
                                   <select v-model="itemsPerPage" id="itemsPerPage" class="ml-2 border:bg-emerald-500">
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="15">15</option>
                                        <option value="20">20</option>
                                   </select>
                              </div>
                              <div class="flex items-center">
                                   <primary-button @click="previousPage" :isDisabled="currentPage <= 1" class="mr-2"
                                        bgColor="white">
                                        <chevron-left-icon class="h-6 w-6" />
                                   </primary-button>
                                   <span class="mr-2 mt-3">{{ $t('instrument-categories.number-of-pages') }} {{
                                        currentPage }}-{{
                                             pageCount }}</span>
                                   <primary-button @click="nextPage" :isDisabled="currentPage >= pageCount"
                                        bgColor="white">
                                        <chevron-right-icon class="h-6 w-6" />
                                   </primary-button>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     </div>
</template>

<script setup>
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/vue/24/outline'
import { computed, ref, watch, watchEffect, defineAsyncComponent } from 'vue'
import PrimaryButton from '../forms/PrimaryButton.vue'
const SpinnerLoading = defineAsyncComponent(() => import('@/components/forms/SpinnerLoading.vue'))


const emit = defineEmits(['correctedData'])
const props = defineProps({
     data: {
          type: Object,
          default: () => []
     },
     headers: {
          type: Array
     },
     noDataMessage: String,
     isLoadingContent: {
          type: Boolean,
          default: false,
     },
})
const formatDate = (date) => {
     const parts = date.split('-')
     if (parts.length === 3) {
          const [year, month, day] = parts
          return `${day}/${month}/${year}`
     }
}
const itemsPerPage = ref(5)
const currentPage = ref(1)
const displayedItems = computed(() => {
     const perPage = parseInt(itemsPerPage.value, 10)
     const startIndex = (currentPage.value - 1) * perPage
     const endIndex = startIndex + perPage
     return props.data.slice(startIndex, endIndex)
});
watchEffect(() => {
     emit('correctedData', displayedItems.value)
})
const pageCount = computed(() => {
     return Math.ceil(props.data.length / itemsPerPage.value)
})
const previousPage = () => {
     if (currentPage.value > 1) currentPage.value--
}
const nextPage = () => {
     if (currentPage.value < pageCount.value) currentPage.value++
}
watch([() => props.data.length, itemsPerPage,], () => {
     currentPage.value = 1;
     window.scrollTo({
          top: 0,
          behavior: 'smooth'
     })
})
watch([() => props.data.length, currentPage,], () => {
     window.scrollTo({
          top: 0,
          behavior: 'smooth'
     })
});
</script>