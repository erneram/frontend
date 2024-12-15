<template>
     <dialog-category ref="createDialog" :isOpen="isOpen" @closeModal="handleClose" dialog-size="max-w-lg">
          <template #title>
               <dialog-title as="h3" class="text-lg pb-4 mt-8 font-medium leading-6 text-emerald-600">
                    {{ $t('protocol-stamps.ticket-detail') }}
               </dialog-title>
          </template>
          <template #body>
               <div v-if="isLoadingStampsStore" class="grid grid-cols-2 gap-4">
                    <div v-for="(item, index) in 8" :key="index" class="w-full h-16">
                         <skeleton-loader width="100%" height="64px" />
                    </div>
               </div>
               <div v-else>
                    <div class="">
                         <dl class="grid grid-cols-1 sm:grid-cols-2 gap">
                              <div class="border-t border-gray-100 px-4 sm:col-span-1 sm:px-0">
                                   <dt class="mt-1 text-sm font-bold leading-6 text-gray-700 sm:mt-2">{{
                                        $t('protocol-stamps.date') }}</dt>
                                   <dd class="mb-4 ml-4 text-sm leading-6 text-gray-700">
                                        {{ formatDate(currentItemSelected.date) }}
                                   </dd>
                              </div>
                              <div class="border-t border-gray-100 px-4 sm:col-span-1 sm:px-0">
                                   <dt class="mt-1 text-sm font-bold leading-6 text-gray-700 sm:mt-2">{{
                                        $t('protocol-stamps.no-writing') }}</dt>
                                   <dd class="mb-4 ml-4 text-sm leading-6 text-gray-700">
                                        {{ currentItemSelected.number }}
                                   </dd>
                              </div>
                              <div class="border-t border-gray-100 px-4 sm:col-span-1 sm:px-0">
                                   <dt class="mt-1 text-sm font-bold  leading-6 text-gray-700 sm:mt-2">{{
                                        $t('protocol-stamps.customer') }}</dt>
                                   <dd class="mb-4 ml-4 text-sm leading-6 text-gray-700">
                                        {{ currentItemSelected.client }}
                                   </dd>
                              </div>
                              <div class="border-t border-gray-100 px-4 sm:col-span-1 sm:px-0">
                                   <dt class="mt-1 text-sm font-bold  leading-6 text-gray-700 sm:mt-2">{{
                                        $t('protocol-stamps.type-instrument') }}</dt>
                                   <dd class="mb-4 ml-4 text-sm leading-6 text-gray-700">
                                        {{ currentItemSelected.instrument_type }}
                                   </dd>
                              </div>
                              <div class="border-t border-gray-100 px-4 sm:col-span-1 sm:px-0">
                                   <dt class="mt-1 text-sm font-bold  leading-6 text-gray-700">{{
                                        $t('protocol-stamps.prosecutors') }}</dt>
                                   <dd class="mb-4 ml-4 text-sm leading-6 text-gray-700">
                                        {{ currentItemSelected.fiscal_pages }} {{ $t('protocol-stamps.50c-stamps') }}
                                   </dd>
                              </div>
                              <div class="border-t border-gray-100 px-4 sm:col-span-1 sm:px-0">
                                   <dt class="mt-1 text-sm font-bold  leading-6 text-gray-700 sm:mt-2">{{
                                        $t('protocol-stamps.notarial') }}</dt>
                                   <dd class="mb-4 ml-4 text-sm leading-6 text-gray-700">
                                        {{ $t('general.monetary-symbol') }}{{
                                             currentItemSelected.notarial_amount.toFixed(2) }}
                                   </dd>
                              </div>
                              <div class="border-t border-gray-100  px-4 sm:col-span-2 sm:px-0">
                                   <dt class="mt-1 text-sm font-bold  leading-6 text-gray-700 sm:mt-2">{{
                                        $t('protocol-stamps.total') }}</dt>
                                   <dd class="mb-4 ml-4 text-sm leading-6 text-gray-700">
                                        {{ $t('general.monetary-symbol') }}{{ ((currentItemSelected.fiscal_pages * 0.5)
                                             +
                                             currentItemSelected.notarial_amount).toFixed(2) }}
                                   </dd>
                              </div>
                         </dl>
                    </div>
               </div>
               <dialog-title as="h3" class="text-lg pb-4 mt-8 font-medium leading-6 text-emerald-600">
                    {{ $t('protocol-stamps.ticket-detail') }}
               </dialog-title>
               <div v-if="isLoadingStampsStore" class="grid grid-cols-2 gap-4">
                    <div v-for="(item, index) in 2" :key="index" class="w-full h-16">
                         <skeleton-loader width="100%" height="64px" />
                    </div>
               </div>
               <dl v-else class="grid grid-cols-1 sm:grid-cols-2">
                    <div class="border-t border-gray-100 px-4 md:col-span-1 sm:px-0">
                         <bookmark-icon
                              :class="[bannerColors[stampsTicketsQuantity.color], 'mt-4 text-sm leading-6 h-8 w-8 mx-3']" />
                    </div>
                    <div class="border-t border-gray-100 px-4 md:col-span-1 sm:px-0">
                         <dt class="mt-1 text-sm font-bold  leading-6 text-gray-700 sm:mt-2">{{
                              $t('protocol-stamps.quetzal-stamp') }}</dt>
                         <dd class="mb-4 ml-4 text-sm leading-6 text-gray-700">
                              {{ stampsTicketsQuantity.quantity }}
                         </dd>
                    </div>
               </dl>
          </template>
     </dialog-category>
</template>
<script setup>
import { DialogTitle } from '@headlessui/vue'
import { useStampsStore } from '@/stores/stampsStore.js'
import { BookmarkIcon } from '@heroicons/vue/20/solid'
import { ref, defineAsyncComponent } from 'vue'
import { storeToRefs } from "pinia"
import { useI18n } from "vue-i18n";

const SkeletonLoader = defineAsyncComponent(() => import('@/components/forms/SkeletonLoader.vue'))
import DialogCategory from "@/components/forms/DialogCategory.vue"

const { t } = useI18n();

const createDialog = ref(null)

const stampsStore = useStampsStore()
const { showDetailDialog, isLoadingStampsStore } = storeToRefs(stampsStore)
const handleClose = (closeModal) => {
     showDetailDialog.value = closeModal
}
const props = defineProps({
     id: Number,
     isOpen: {
          type: Boolean,
          default: false
     },
     currentId: Number,
     data: {
          type: Array,
          default: () => []
     }
})

const { getItemById } = stampsStore
const currentItemSelected = getItemById(props.currentId)
const stampsTicketsQuantity = currentItemSelected.tickets[0]
const createColor = `text-${stampsTicketsQuantity.color}-500`

const bannerColors = {
     purple: 'text-purple-500',
     red: 'text-red-500',
     black: 'text-black',
     green: 'text-green-500',
     blue: 'text-blue-500'
}

const months = ['calendar.january', 'calendar.february', 'calendar.march', 'calendar.april', 'calendar.may', 'calendar.june', 'calendar.july', 'calendar.august', 'calendar.september', 'calendar.october', 'calendar.november', 'calendar.december']
const formatDate = (date) => {
     const parts = date.split('-')
     if (parts.length === 3) {
          const day = parseInt(parts[2], 10)
          const month = parseInt(parts[1], 10) - 1
          const year = parseInt(parts[0], 10)
          const correctMonth = months[month]
          return `${day} de ${t(correctMonth)}  de ${year}`
     }
     return date
}

</script>