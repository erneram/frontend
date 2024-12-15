import { defineStore } from 'pinia'
import { useLawyerStore } from '@/stores/lawyerStore'
import { useNotificationStore } from './notificationStore'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { DateTime } from 'luxon'
import instance from '@/stores/axios.js'


export const useStampsStore = defineStore('stamps', () => {
     const dt = DateTime.local()
     const currentYear = dt.year
     const instruments = ref([])
     const isLoadingStampsStore = ref(false)
     const selectedDetail = ref(null)
     const showDetailDialog = ref(false)
     const lawyerStore = useLawyerStore()
     const { getId } = storeToRefs(lawyerStore)
     const notificationStore = useNotificationStore()

     watch(() => getId.value, () => {
          fetchStamps()
     })
     async function fetchStamps() {
          isLoadingStampsStore.value = true
          try {
               const response = await instance.get('ticket/lawyer/' + getId.value + '/' + currentYear)
               if (response.status == 200) {
                    instruments.value = response.data
               }
          } finally {
               isLoadingStampsStore.value = false
          }
     }
     function openDetailTicketDialog(detailSelected) {
          selectedDetail.value = detailSelected
          showDetailDialog.value = true
     }
     function hideDetailTicketDialog() {
          selectedDetail.value = null
          showDetailDialog.value = false
     }

     function getItemById(instrumentId) {
          return instruments.value.find((instrument) => instrument.id === instrumentId)
     }

     return {
          instruments, isLoadingStampsStore, selectedDetail, showDetailDialog,
          fetchStamps, openDetailTicketDialog, hideDetailTicketDialog, getItemById
     }
}, {
     persist: {
          paths: [
               'instruments', 'selectedDetail'
          ]
     }
})