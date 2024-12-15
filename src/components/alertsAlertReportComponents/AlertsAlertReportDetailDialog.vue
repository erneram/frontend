<template>
     <dialog-category ref="createDialog" :isOpen="isOpen" @closeModal="handleClose" dialog-size="max-w-xl">
          <template #title>
               <div class="bg-emerald-500 shadow-md text-white p-4 flex justify-between items-center rounded-t-lg">
                    <div class="text-2xl font-semibold">
                         {{ category }}
                    </div>
               </div>
          </template>
          <template #body>
               <div classs="mt-2" />
               <div>
                    <div class="flex my-4 text-2md">
                         <p class="font-bold mr-2">{{ $t('reports.client') }}:</p>
                         <p class="font-thin">{{ client }}</p>
                    </div>
                    <div class="flex">
                         <p class="font-bold mr-2">{{ `${$t('reports.description')}` }}:</p>
                         <p class="font-thin">{{ `${description}` }}</p>
                    </div>
                    <div class="flex">
                         <p class="font-bold mr-2">{{ `${$t('reports.country')}` }}:</p>
                         <p class="font-thin">{{ `${country}` }}</p>
                    </div>
                    <div class="flex">
                         <p class="font-bold mr-2">{{ `${$t('reports.status')}` }}:</p>
                         <p class="font-thin">{{ `${status}` }}</p>
                    </div>
                    <div class="flex">
                         <p class="font-bold mr-2">{{ `${$t('reports.initual-date')}` }}:</p>
                         <p class="font-thin">{{ `${created_at}` }}</p>
                    </div>
                    <div class="flex">
                         <p class="font-bold mr-2">{{ `${$t('reports.lawyer')}` }}:</p>
                         <p class="font-thin">{{ `${lawyer_id}` }}</p>
                    </div>
                    <div class="flex">
                         <p class="font-bold mr-2">{{ $t('reports.expires-at') }}:</p>
                         <p class="font-thin">{{ expires_at }}</p>
                    </div>

               </div>
          </template>
          <template #buttons>
          </template>
     </dialog-category>
</template>
<script setup>
import { DialogTitle } from '@headlessui/vue'
import { useAlertsAlertReportStore } from '@/stores/alertsAlertReportStore.js';
import { useUserStore } from '@/stores/userStore';
import { useLawyerStore } from '@/stores/lawyerStore';
import { storeToRefs } from "pinia"
import { defineAsyncComponent, ref } from "vue"

import DialogCategory from "@/components/forms/DialogCategory.vue"
import Panel from '../forms/Panel.vue'
import PrimaryButton from "@/components/forms/PrimaryButton.vue"

const alertsReportStore = useAlertsAlertReportStore()
const { isLoading, showAlertDialog, currentAlert } = storeToRefs(alertsReportStore)

const userStore = useUserStore()
userStore.fetchUsers()
const { allUsers } = storeToRefs(userStore)



const lawyerStore = useLawyerStore()
const { allLawyers } = storeToRefs(lawyerStore)

const props = defineProps({
     isOpen: {
          type: Boolean,
          default: false,
     },
     data: {
          type: Object,
     },
     currentSelected: {
          type: Number,
          default: 0,
     },
     currentLawyerId: {
          type: Number,
          default: 0,
     }
})

const handleClose = (closeModal) => {
     showAlertDialog.value = closeModal
}
const category = currentAlert.value.category
const client = currentAlert.value.client
const description = currentAlert.value.description
const country = currentAlert.value.country.name
const status = currentAlert.value.status_name
const created_at = currentAlert.value.initial_date
//preguntar porque segun la lista de ALLUSERS, el id no coincide con el que se muestra.
//En la pagina original no muestra el id correcto o no se ni donde sale.
const lawyer_id = userStore.getUserNameById(currentAlert.value.lawyer_id)
const expires_at = currentAlert.value.expires_at




</script>
