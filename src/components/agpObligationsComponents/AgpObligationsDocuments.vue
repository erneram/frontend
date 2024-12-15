<template>
     <div class="overflow-hidden rounded-xl border border-gray-200 w-full">
          <div class="flex items-center gap-x-4 border-b border-gray-900/5 bg-white p-6 mb-2">
               <action-button-solid-icon icon="DocumentIcon" color="text-blue-500" size="h-8 w-8" class="" />
               <div class="text-xl font-medium leading-6 text-gray-900"> {{ $t('agp-obligations.documents') }}
               </div>
          </div>
          <div v-for="(document, index) in documentsList" :key="document.id"
               class=" -my-3 divide-y divide-gray-100 px-6 py-4 text-md bg-white leading-6 cursor-pointer">
               <p class="flex inline-block align-middle mb-2 justify-between">
                    <a>
                         {{ $t(`agp-obligations.${document}`) }}
                    </a>
                    <action-button-solid-icon icon="ArrowDownTrayIcon" color="text-blue-500" size="h-6 w-6 mr-1" />
               </p>
               <div v-if="currentNotificationDocument.length > 1 && index !== currentNotificationDocument.length - 1"
                    class="relative">
                    <div class="absolute inset-0 flex items-center" aria-hidden="true">
                         <div class="w-full border-t border-gray-300"></div>
                    </div>
               </div>
          </div>
     </div>
</template>
<script setup>
import { useAgpObligationStore } from '@/stores/agpObligationsStore'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'

import ActionButtonSolidIcon from '../buttons/ActionButtonSolidIcon.vue'
import Panel from '../forms/Panel.vue'

const documentsList = ['notice-departure-country', 'data-update-form', 'signature-modification-process', 'modification-request', 'signature-modification-request', 'seal-modificatino-request']


const agpObligationsStore = useAgpObligationStore()
const { notificationDocument } = storeToRefs(agpObligationsStore)

const currentNotificationDocument = ref(notificationDocument.value)
watch(() => notificationDocument.value, (newVal) => {
     currentNotificationDocument.value = newVal
})

</script>