import { defineStore, storeToRefs } from 'pinia'
import { useLawyerStore } from './lawyerStore'
import { useNotificationStore } from './notificationStore'
import { ref, watch } from 'vue'
import instance from '@/stores/axios.js'

export const useDashboardStore = defineStore('dashboard', () => {
     const calendarAlert = ref([])
     const allCalendarAlert = ref([])
     const isLoadingDashBoardStore = ref(false)
     const lawyerStore = useLawyerStore()
     const { getId } = storeToRefs(lawyerStore)
     const notificationStore = useNotificationStore()

     watch(() => getId.value, () => {
          fetchCalendarAlert()
          fetchAllCalendarAlert()
     })
     async function fetchCalendarAlert() {
          isLoadingDashBoardStore.value = true
          try {
               const response = await instance.get('/alerts/next/' + getId.value)
               if (response.status == 200) {
                    calendarAlert.value = response.data
               }
          } finally {
               isLoadingDashBoardStore.value = false
          }
     }
     async function fetchAllCalendarAlert() {
          isLoadingDashBoardStore.value = true
          try {
               const response = await instance.get('/calendar/' + getId.value)
               if (response.status == 200) {
                    allCalendarAlert.value = response.data
               }
          } finally {
               isLoadingDashBoardStore.value = false
          }
     }
     return {
          isLoadingDashBoardStore, calendarAlert, allCalendarAlert,
          fetchCalendarAlert, fetchAllCalendarAlert
     }
}, {
     persist: true
})