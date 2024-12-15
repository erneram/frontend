<template>
     <panel>
          ADMINISTRAR ABODAGOS
          <manage-lawyer-table :lawyers="currentLawyers" />
     </panel>
     <manage-lawyer-edit-dialog v-if="showLawyerEditDialog && selectedLawyer !== null" @close="hideEditDeleteDialog"
          :isOpen="showLawyerEditDialog" />
     <manage-lawyer-delete-dialog v-if="showLawyerDeleteDialog && selectedLawyer !== null" @close="hideEditDeleteDialog"
          :isOpen="showLawyerDeleteDialog" />
</template>
<script setup>
import { useLawyerStore } from '@/stores/lawyerStore.js'
import { storeToRefs } from "pinia"
import { ref, watch } from 'vue'
import { defineAsyncComponent } from "vue"

const manageLawyerEditDialog = defineAsyncComponent(() => import('@/components/ManageLawyersComponents/ManageLawyerEditDialog.vue'))
const manageLawyerDeleteDialog = defineAsyncComponent(() => import('@/components/ManageLawyersComponents/ManageLawyerDeleteDialog.vue'))

import Panel from '@/components/Forms/Panel.vue'
import manageLawyerTable from '@/components/ManageLawyersComponents/ManageLawyerTable.vue'


const lawyerStore = useLawyerStore()
lawyerStore.fetchLawyers()

const { hideEditDeleteDialog } = useLawyerStore()
const { allLawyers, showLawyerEditDialog, showLawyerDeleteDialog, selectedLawyer } = storeToRefs(lawyerStore)
const currentLawyers = ref(allLawyers.value)
const lawyerData = ref([])

watch(() => allLawyers.value, (newVal) => {
     currentLawyers.value = newVal
})

</script>