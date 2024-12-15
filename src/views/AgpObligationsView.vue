<template>
     Obligaciones APG
     <lawyer-select />
     <div class="mt-2 lg:flex lg:space-x-4">
          <agp-obligations-documents />
          <agp-obligations-upload-document />
     </div>

     <div class="flex mt-4 w-full justify-center">
          <img src="../assets/calendarObligations2024.jpg" alt="Calendario de obligaciones">
     </div>
     <agp-document-dialog v-if="showObligationDocument" @close="hideObligationDocuments"
          :isOpen="showObligationDocument" dialog-type="isPDF" />
     <agp-document-dialog v-if="showDeleteObligationDocument" @close="hideObligationDocuments"
          :isOpen="showDeleteObligationDocument" dialog-type="isDeleting" />
</template>
<script setup>
import { useAgpObligationStore } from '@/stores/agpObligationsStore'
import { defineAsyncComponent } from "vue"
import { storeToRefs } from 'pinia';

const AgpObligationsDocuments = defineAsyncComponent(() => import('@/components/agpObligationsComponents/AgpObligationsDocuments.vue'))
const AgpDocumentDialog = defineAsyncComponent(() => import('@/components/agpObligationsComponents/AgpDocumentDialog.vue'))
const AgpObligationsUploadDocument = defineAsyncComponent(() => import('@/components/agpObligationsComponents/AgpObligationsUploadDocument.vue'))

import Panel from '@/components/forms/Panel.vue'
import LawyerSelect from '@/components/forms/LawyerSelect.vue';

const agpObligationStore = useAgpObligationStore()
const { showObligationDocument, showDeleteObligationDocument } = storeToRefs(agpObligationStore)
const { hideObligationDocuments } = agpObligationStore

const agpObligationsStore = useAgpObligationStore()
agpObligationsStore.fetchNotificationDocuments()
agpObligationsStore.fetchObligationLawyer()
// agpObligationsStore.downloadObligationDocument(2, 4)
// agpObligationsStore.deleteObligationDocument()
</script>