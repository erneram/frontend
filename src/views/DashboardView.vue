<template>
  <panel class="mb-2">
    <progress-bar />
  </panel>
  <panel class="mb-2">
    <lawyer-select class="mb-4" />
    <calendar @date-selected="handleDateSelection" />
  </panel>
  <panel>
    <reminders :date-selected="passEmitedDate" />
  </panel>
  <view-dialog v-if="showViewDialog && selectedDetail !== null" @close="hideViewEditDeleteDialog"
    :isOpen="showViewDialog" :data="dataCurrentLawyer" />
</template>

<script setup>
import { useDashboardStore } from "@/stores/dashboardStore"
import { useInstrumentsStore } from "@/stores/instrumentsStore"
import { storeToRefs } from "pinia"
import { ref, defineAsyncComponent } from 'vue'

import ProgressBar from "@/components/dashboardComponents/DashboardProgressBar.vue"
import Calendar from "@/components/dashboardComponents/DashboardCalendar.vue"
import Reminders from "@/components/dashboardComponents/DashboardReminders.vue"
import LawyerSelect from "@/components/forms/LawyerSelect.vue"
import SpinnerLoading from "@/components/forms/SpinnerLoading.vue"
import Panel from "@/components/forms/Panel.vue"

const ViewDialog = defineAsyncComponent(() => import('@/components/instrumentsComponents/InstrumentsViewDialog.vue'))

const instrumentStore = useInstrumentsStore()
instrumentStore.fetchLawyerInstruments()

const dashboardStore = useDashboardStore()
dashboardStore.fetchCalendarAlert()
dashboardStore.fetchAllCalendarAlert()

const instrumentsStore = useInstrumentsStore()
const { hideViewEditDeleteDialog } = instrumentsStore
const { selectedDetail, showViewDialog, currentViewLawyer } = storeToRefs(instrumentsStore)
const dataCurrentLawyer = ref(currentViewLawyer.value)
const passEmitedDate = ref(null)

const handleDateSelection = (date) => {
  passEmitedDate.value = date
}

</script>