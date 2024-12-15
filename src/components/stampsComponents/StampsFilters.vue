<template>
     <form>
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
               <div class="flex flex-col">
                    <input-date :clearText="clearText" @search="updateSearchCriteria('fromDate', $event)"
                         title="general.from" />
               </div>
               <div class="flex flex-col">
                    <input-date :clearText="clearText" @search="updateSearchCriteria('untilDate', $event)"
                         title="general.until" />
               </div>
               <div class="flex flex-col">
                    <p class="mb-2 text-gray-600 block text-sm font-medium leading-6">{{
                         $t('protocol-stamps.writing-number') }}</p>
                    <search-option :cleanText="clearText" @search="updateSearchCriteria('writingNumber', $event)"
                         icon="MagnifyingGlassIcon" textPlaceholder="protocol-stamps.writing-number" />
               </div>
               <div class="flex flex-col">
                    <p class="mb-2 text-gray-600 block text-sm font-medium leading-6">{{ $t('protocol-stamps.customer')
                         }}</p>
                    <search-option :cleanText="clearText" @search="updateSearchCriteria('customer', $event)"
                         icon="MagnifyingGlassIcon" textPlaceholder="protocol-stamps.customer" />
               </div>
               <div class="flex flex-col">
                    <p class="mb-2 text-gray-600 block text-sm font-medium leading-6">{{
                         $t('protocol-stamps.type-instrument') }}</p>
                    <search-option :cleanText="clearText" @search="updateSearchCriteria('instrument', $event)"
                         icon="MagnifyingGlassIcon" textPlaceholder="protocol-stamps.type-instrument" />
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
import { storeToRefs } from 'pinia'
import { reactive, watchEffect, ref, nextTick } from 'vue'
import CustomLabel from '../forms/CustomLabel.vue'
import InputDate from '@/components/forms/InputDate.vue'
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


const handleIdSelection = (id) => {
     lawyerStore.updateCurrentLawyer(id.id)
}
const searchCriteria = reactive({
     fromDate: null,
     untilDate: null,
     writingNumber: '',
     customer: '',
     instrument: '',
})
const filteredItems = ref([])

const clearText = ref(false)
const clearSearchCriteria = () => {
     clearText.value = true
     searchCriteria.fromDate = null
     searchCriteria.untilDate = null
     searchCriteria.writingNumber = ''
     searchCriteria.customer = ''
     searchCriteria.instrument = ''
     nextTick(() => {
          clearText.value = false
     })
}
const updateSearchCriteria = (key, value) => {
     searchCriteria[key] = value
}
watchEffect(() => {
     filteredItems.value = props.data.filter(item => {
          const fromDateMatch = !searchCriteria.fromDate || new Date(item.date) >= new Date(searchCriteria.fromDate)
          const untilDateMatch = !searchCriteria.untilDate || new Date(item.date) <= new Date(searchCriteria.untilDate)
          const writingNumberMatch = !searchCriteria.writingNumber || item.number === Number(searchCriteria.writingNumber)
          const customerMatch = !searchCriteria.customer || item.client.toLowerCase().includes(searchCriteria.customer.toLowerCase())
          const instrumentMatch = !searchCriteria.instrument || item.instrument_type.toLowerCase().includes(searchCriteria.instrument.toLowerCase())
          return fromDateMatch && untilDateMatch && writingNumberMatch && customerMatch && instrumentMatch
     })
     emit('FilteredData', filteredItems)

})
</script>
