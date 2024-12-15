<template>
     <panel class="mb-2">
          <stamps-filter :data="allInstruments" @FilteredData="handleFilters" />
     </panel>
     <panel>
          <stamps-box :data="updatedFilteredIntruments.value" />
          <stamps-table :data="updatedFilteredIntruments.value" />
     </panel>
     <stamps-detail-dialog v-if="showDetailDialog && selectedDetail !== null" @close="hideDetailTicketDialog"
          :isOpen="showDetailDialog" :id="selectedDetail" :data="allInstruments" :currentId="selectedDetail" />
</template>
<script setup>
import { defineAsyncComponent } from "vue";
import { useStampsStore } from '@/stores/stampsStore.js'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'

const StampsDetailDialog = defineAsyncComponent(() => import('@/components/stampsComponents/StampsDetailDialog.vue'))

import StampsFilter from '@/components/stampsComponents/StampsFilters.vue'
import StampsBox from '@/components/stampsComponents/StampsBox.vue'
import StampsTable from '@/components/stampsComponents/StampsTable.vue'
import Panel from '@/components/forms/Panel.vue'

const stampsStore = useStampsStore()
stampsStore.fetchStamps()
const { hideDetailTicketDialog } = stampsStore
const { instruments, selectedDetail, showDetailDialog } = storeToRefs(stampsStore)
const allInstruments = ref(instruments.value)
watch(() => instruments.value, (newVal) => {
     allInstruments.value = newVal
})

const updatedFilteredIntruments = ref([])
const handleFilters = (filteredData) => {
     updatedFilteredIntruments.value = filteredData
}

</script>