<template>
    <panel class="mb-2" v-if="archiveYearInstruments != currentYear">
        <div>
            <h1 class="bold text-3xl text-emerald-600  uppercase tracking-wide">
                {{ $t('previous-instruments.file-of-year') }} {{ archiveYearInstruments }}</h1>
        </div>
    </panel>
    <panel class="mb-2">
        <progress-bar title="progress-bar.compliance-with-notarial-obligations" description="public-note.public-note" />
    </panel>
    <panel>
        <div class="flex flex-col items-center">
            <instruments-filters class="w-full" :data="instruments" @FilteredData="handleFilters" />
            <instruments-table class="w-full" :data="updatedFilteredIntruments.value" />
        </div>
    </panel>

    <edit-dialog v-if="showAddDialog !== null && selectedDetail === null" @close="hideViewEditDeleteDialog"
        :isOpen="showAddDialog" :currentLawyerId="currentLawyerId" />
    <view-dialog v-if="showViewDialog !== false && selectedDetail !== null" @close="hideViewEditDeleteDialog"
        :isOpen="showViewDialog" />
    <edit-dialog v-if="showEditDialog && selectedDetail !== null" @close="hideViewEditDeleteDialog"
        :isOpen="showEditDialog" :current-selected="selectedDetail" :currentLawyerId="currentLawyerId" />
    <delete-dialog v-if="showDeleteDialog && selectedDetail !== null" @close="hideViewEditDeleteDialog"
        :isOpen="showDeleteDialog" :data="dataCurrentLawyer" :current-selected="selectedDetail" />
    <voucher-or-delete-dialog v-if="showVoucherDialog" @close="hideVoucherDialog" :isOpen="showVoucherDialog"
        dialog-type="isPDF" />
    <voucher-or-delete-dialog v-if="showDeleteVoucherDialog" @close="hideVoucherDialog"
        :isOpen="showDeleteVoucherDialog" dialog-type="isDeleting" />
    <instruments-document-dialog v-if="showEditDocumentTemplate" @close="hideEditDocumentTemplate"
        :isOpen="showEditDocumentTemplate" />
</template>
<script setup>
import { useInstrumentsStore } from '@/stores/instrumentsStore'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useLawyerStore } from '@/stores/lawyerStore'
import { DateTime } from 'luxon'
import { defineAsyncComponent } from "vue";

const EditDialog = defineAsyncComponent(() => import('@/components/instrumentsComponents/InstrumentsEditDialog.vue'))
const ViewDialog = defineAsyncComponent(() => import('@/components/instrumentsComponents/InstrumentsViewDialog.vue'))
const DeleteDialog = defineAsyncComponent(() => import('@/components/instrumentsComponents/InstrumentsDeleteDialog.vue'))
const VoucherOrDeleteDialog = defineAsyncComponent(() => import('@/components/instrumentsComponents/VoucherOrDeleteDialog.vue'))
const InstrumentsDocumentDialog = defineAsyncComponent(() => import('@/components/instrumentsComponents/InstrumentsDocumentDialog.vue'))

import Panel from '@/components/forms/Panel.vue'
import ProgressBar from '@/components/dashboardComponents/DashboardProgressBar.vue'
import InstrumentsFilters from '@/components/instrumentsComponents/InstrumentsFilters.vue'
import InstrumentsTable from '@/components/instrumentsComponents/InstrumentsTable.vue'
import router from '@/router'


const props = defineProps({
    year: {
        type: String,
        default: null
    }
})
const dt = DateTime.local()
const currentYear = ref(dt.year)

const instrumentsStore = useInstrumentsStore()
const { hideViewEditDeleteDialog, hideVoucherDialog, hideEditDocumentTemplate } = instrumentsStore
const { instruments, selectedDetail, detail, showAddDialog, showViewDialog, showEditDialog, showDeleteDialog,
    currentViewLawyer, archiveYearInstruments, showDeleteVoucherDialog, showVoucherDialog,
    showEditDocumentTemplate } = storeToRefs(instrumentsStore)
if (router.currentRoute.value.path === '/protocols') {
    instrumentsStore.fetchLawyerInstruments()
}
const dataCurrentLawyer = ref(currentViewLawyer.value)
const dataDetails = ref(detail.value)
//Lawyer
const lawyerStore = useLawyerStore()
const { getId } = storeToRefs(lawyerStore)
const currentLawyerId = ref(getId.value)
watch(() => getId.value, (newVal) => {
    currentLawyerId.value = newVal
    instrumentsStore.fetchLawyerInstruments()
})

watch(() => detail.value, (newVal) => {
    dataDetails.value = newVal
})

const updatedFilteredIntruments = ref([])
const handleFilters = (filteredItems) => {
    updatedFilteredIntruments.value = filteredItems
}


</script>