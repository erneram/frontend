<template>
     <div v-if="isLoadingDeadLineAlertStore || isLoadingFetchContract">
          <spinner-loading class="mx-auto" />
     </div>
     <div v-else>
          <form class="ml-10 align-item-center">
               <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    <div class="flex flex-col">
                         <p class="mb-2 text-gray-600 block text-sm font-medium leading-6">{{
                              $t('deadlinealert.description') }}</p>
                         <search-option :clean-text="clearText" @search="updateSearchCriteria('description', $event)"
                              icon="MagnifyingGlassIcon" textPlaceholder="deadlinealert.description" />
                    </div>
                    <div class="flex flex-col">
                         <p class="mb-2 text-gray-600 block text-sm font-medium leading-6">{{
                              $t('deadlinealert.category') }}</p>
                         <search-option :clean-text="clearText" @search="updateSearchCriteria('category', $event)"
                              icon="MagnifyingGlassIcon" textPlaceholder="deadlinealert.category" />
                    </div>
                    <div class="flex flex-col">
                         <p class="mb-2 text-gray-600 block text-sm font-medium leading-6">{{
                              $t('deadlinealert.parts') }}</p>
                         <search-option :clean-text="clearText" @search="updateSearchCriteria('parts', $event)"
                              icon="MagnifyingGlassIcon" textPlaceholder="deadlinealert.parts" />
                    </div>
                    <div class="flex flex-col">
                         <input-select title="deadlinealert.country" input-type="country" :data="countries"
                              v-model="countryId" class="mt-2" />
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
     </div>
</template>
<script setup>
import { useLawyerStore } from '@/stores/lawyerStore.js'
import { useDeadLineAlertStore } from '@/stores/deadLineAlertStore';
import { reactive, watchEffect, ref, nextTick, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { DialogDescription } from '@headlessui/vue';

const SpinnerLoading = defineAsyncComponent(() => import("@/components/forms/SpinnerLoading.vue"))

import SearchOption from '@/components/forms/SearchOption.vue'
import CustomLabel from '../forms/CustomLabel.vue';
import LawyerSelect from '@/components/forms/LawyerSelect.vue'
import InputSelect from '@/components/forms/InputSelect.vue'
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
const deadLineAlertsStore = useDeadLineAlertStore()
const { countries, isLoadingDeadLineAlertStore, isLoadingFetchContract } = storeToRefs(deadLineAlertsStore)

const countryId = ref({})
const searchCriteria = reactive({
     description: '',
     category: '',
     parts: '',
})
const filteredItems = ref([])
const updateSearchCriteria = (key, value) => {
     searchCriteria[key] = value
}
const clearText = ref(false)
const clearSearchCriteria = () => {
     clearText.value = true
     searchCriteria.description = ''
     searchCriteria.category = ''
     searchCriteria.parts = ''
     countryId.value = {}
     nextTick(() => {
          clearText.value = false
     })
}
watchEffect(() => {
     filteredItems.value = props.data.filter(item => {
          const descriptionMatch = !searchCriteria.description || item.description.toLowerCase().includes(searchCriteria.description.toLowerCase())
          const categoryMatch = !searchCriteria.category || item.category.toLowerCase().includes(searchCriteria.category.toLowerCase())
          const partMatch = !searchCriteria.parts || item.client.toLowerCase().includes(searchCriteria.parts.toLowerCase())
          const countryMatch = Object.values(countryId.value).length > 0 ? item.country_id === Number(countryId.value.id) : true
          return descriptionMatch && categoryMatch && partMatch && countryMatch
     })
     emit('FilteredData', filteredItems)
})
</script>
