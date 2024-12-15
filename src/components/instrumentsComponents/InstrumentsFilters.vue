<template>
     <form class="ml-10 justify-item-center">
          <div class="grid grid-cols-1 flex gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
               <div class="flex flex-col">
                    <p class="mb-2 text-gray-600 block text-sm font-medium leading-6">{{
                         $t('protocol-instruments.writing-number') }}</p>
                    <search-option :clean-text="clearText" @search="updateSearchCriteria('writingNumber', $event)"
                         icon="MagnifyingGlassIcon" textPlaceholder="protocol-instruments.writing-number" />
               </div>
               <div class="flex flex-col">
                    <p class="mb-2 text-gray-600 block text-sm font-medium leading-6">{{
                         $t('protocol-instruments.customer') }}</p>
                    <search-option :clean-text="clearText" @search="updateSearchCriteria('customer', $event)"
                         icon="MagnifyingGlassIcon" textPlaceholder="protocol-instruments.customer" />
               </div>
               <div class="flex flex-col">
                    <p class="mb-2 text-gray-600 block text-sm font-medium leading-6">{{
                         $t('protocol-instruments.type-of-instrument') }}</p>
                    <search-option :clear-text="clearText" @search="updateSearchCriteria('instrumentType', $event)"
                         icon="MagnifyingGlassIcon" textPlaceholder="protocol-instruments.type-of-instrument" />
               </div>
               <div class="flex flex-col">
                    <p class="mb-2 text-gray-600 block text-sm font-medium leading-6">{{
                         $t('protocol-instruments.state')
                    }}</p>
                    <search-option :clean-text="clearText" @search="updateSearchCriteria('state', $event)"
                         icon="MagnifyingGlassIcon" textPlaceholder="protocol-instruments.state" />
               </div>
               <div class="flex flex-col ">
                    <custom-label title="general.lawyer" name="" class="mt-2" />
                    <lawyer-select class="" />
               </div>
               <div class="flex flex-col justify-center">
                    <action-button-outline-icon icon="TrashIcon" color="text-red-500" size="h-6 w-6 mr-1"
                         class="flex justify-start align-center" @click="clearSearchCriteria()" />
               </div>
          </div>
     </form>
</template>
<script setup>
import { useLawyerStore } from '@/stores/lawyerStore.js'
import { reactive, watchEffect, ref, nextTick } from 'vue'
import { storeToRefs } from 'pinia'

import CustomLabel from '../forms/CustomLabel.vue'
import SearchOption from '@/components/forms/SearchOption.vue'
import LawyerSelect from '@/components/forms/LawyerSelect.vue'
import ActionButtonOutlineIcon from '../buttons/ActionButtonOutlineIcon.vue'

const emit = defineEmits(['FilteredData'])
const props = defineProps({
     data: {
          type: Array,
          default: () => []
     }
})
const lawyerStore = useLawyerStore()
const { lawyers, getId } = storeToRefs(lawyerStore)
const lawyerList = lawyers.value
const currentSelection = getId.value


const searchCriteria = reactive({
     writingNumber: '',
     customer: '',
     typeInstrument: '',
     state: '',
})
const filteredItems = ref([])
const updateSearchCriteria = (key, value) => {
     searchCriteria[key] = value
}
const clearText = ref(false)
const clearSearchCriteria = () => {
     clearText.value = true
     searchCriteria.writingNumber = ''
     searchCriteria.customer = ''
     searchCriteria.typeInstrument = ''
     searchCriteria.state = ''
     nextTick(() => {
          clearText.value = false
     })
}
watchEffect(() => {
     filteredItems.value = props.data.filter(item => {
          const writingNumberMatch = !searchCriteria.writingNumber || item.number === Number(searchCriteria.writingNumber)
          const customerMatch = !searchCriteria.customer || item.client.toLowerCase().includes(searchCriteria.customer.toLowerCase())
          const instrumentMatch = !searchCriteria.typeInstrument || item.instrumentType.name.toLowerCase().includes(searchCriteria.typeInstrument.toLowerCase())
          const stateMatch = !searchCriteria.state || item.instrumentStatus.name.toLowerCase().includes(searchCriteria.state.toLowerCase())
          return writingNumberMatch && customerMatch && instrumentMatch && stateMatch
     })
     emit('FilteredData', filteredItems)
})
</script>
