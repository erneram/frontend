<template>
     <div class="w-full px-4">
          <div v-for="(item, index) in allData" :key="index" class="mx-auto w-full max-w-xl rounded-2xl bg-white p-2">
               <div :class="openIndex === index ? 'open' : ''">
                    <div @click="toggleItem(index)"
                         class="flex w-full justify-between rounded-lg bg-emerald-400 px-8 py-6 text-left text-xl font-medium text-white hover:bg-emerald-300 focus:outline-none focus-visible:ring focus-visible:ring-black-500/75 cursor-pointer">
                         <span class="flex-1 mt-1 text-center">{{ item }}</span>
                         <chevron-up-icon :class="openIndex === index ? 'rotate-180 transform' : ''"
                              class="h-7 w-7 text-white ml-auto" />
                    </div>
                    <div v-if="openIndex === index"
                         class="flex  justify-between px-4 pb-2 pt-4 text-sm text-gray-500 uppercase">
                         <action-button-outline-icon title="previous-instruments.instruments" icon="ArchiveBoxIcon"
                              color="text-emerald-600" size="h-6 w-6 mr-1"
                              buttonStyles="flex items-center px-4 py-2 rounded-md bg-gray-200"
                              @click="openInstrumentView(item)" />
                         <action-button-outline-icon title="previous-instruments.obligations" icon="CheckIcon"
                              color="text-emerald-600" size="h-6 w-6 mr-1"
                              buttonStyles="flex items-center px-4 py-2 rounded-md bg-gray-200" />
                         <action-button-outline-icon title="previous-instruments.index" icon="ListBulletIcon"
                              color="text-emerald-600" size="h-6 w-6 mr-1"
                              buttonStyles="flex items-center px-4 py-2 rounded-md bg-gray-200"
                              @click="openIndexView(item)" />
                    </div>
               </div>
          </div>
     </div>
</template>

<script setup>
import { ref } from 'vue'
import { ChevronUpIcon } from '@heroicons/vue/20/solid'
import { useInstrumentsStore } from '@/stores/instrumentsStore'
import { useIndexStore } from '@/stores/instrumentsIndexStore.js'

import ActionButtonSolidIcon from '../buttons/ActionButtonSolidIcon.vue'
import ActionButtonOutlineIcon from '../buttons/ActionButtonOutlineIcon.vue'

const indexStore = useIndexStore()
const instrumentsStore = useInstrumentsStore()
const props = defineProps({
     data: {
          type: Array,
          required: true,
     }
})

const allData = ref(props.data)
const openIndex = ref(null)

const { openInstrumentView } = instrumentsStore
const { openIndexView } = indexStore
const toggleItem = (index) => {
     openIndex.value = openIndex.value === index ? null : index
}
</script>
