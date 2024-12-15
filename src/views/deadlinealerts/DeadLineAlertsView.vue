<template>
    <panel class="mb-2 overflow-visible relative">
        <spinner-loading v-if="isLoadingDeadLineAlertStore || isLoadingFetchContract" class="mx-auto" />
        <dead-line-alerts-filters v-else :data="allContracts" @FilteredData="handleFilters" />
    </panel>
    <panel>
        <spinner-loading v-if="isLoadingDeadLineAlertStore" class="mx-auto" />
        <dead-line-alerts-table v-else :contracts="updatedFilteredAlerts" />
    </panel>
    <dead-line-alerts-delete-dialog v-if="showDeleteDialog && selectedDocument !== null"
        @close="hideViewEditDeleteDialog" :isOpen="showDeleteDialog" />
    <dead-line-alerts-edit-create-dialog v-if="showCreateEditDialog !== null && selectedDocument !== undefined"
        @close="hideViewEditDeleteDialog" :isOpen="showCreateEditDialog" />
    <dead-line-alerts-edit-create-dialog v-if="showCreateEditDialog !== null && selectedDocument === undefined"
        @close="hideViewEditDeleteDialog" :isOpen="showCreateEditDialog" />
</template>
<script setup>
import { useDeadLineAlertStore } from '@/stores/deadLineAlertStore.js'
import { storeToRefs } from 'pinia'
import { ref, watch, defineAsyncComponent } from 'vue'

const deadLineAlertsDeleteDialog = defineAsyncComponent(() => import('@/components/deadLineAlertsComponents/DeadLineAlertsDeleteDialog.vue'))
const deadLineAlertsEditCreateDialog = defineAsyncComponent(() => import('@/components/deadLineAlertsComponents/DeadLineAlertsEditCreateDialog.vue'))
const SpinnerLoading = defineAsyncComponent(() => import("@/components/forms/SpinnerLoading.vue"))
import Panel from '@/components/forms/Panel.vue';
import deadLineAlertsFilters from '@/components/deadLineAlertsComponents/DeadLineAlertsFilters.vue';
import deadLineAlertsTable from '@/components/deadLineAlertsComponents/DeadLineAlertsTable.vue';

const deadLineAlertStore = useDeadLineAlertStore()
deadLineAlertStore.fetchAllCountries()
deadLineAlertStore.fetchDeadLineAlerts()
deadLineAlertStore.fetchContractCategories()
const { hideViewEditDeleteDialog } = deadLineAlertStore
const { countries, contracts, isLoadingDeadLineAlertStore, isLoadingFetchContract, showCreateEditDialog, showDeleteDialog, selectedDocument } = storeToRefs(deadLineAlertStore)

const allContracts = ref(contracts.value)
watch(() => contracts.value, (newVal) => {
    allContracts.value = newVal
})
const updatedFilteredAlerts = ref([])
const handleFilters = (filteredData) => {
    updatedFilteredAlerts.value = filteredData.value
}

</script>