import { defineStore, storeToRefs } from 'pinia'
import { useLawyerStore } from './lawyerStore'
import { useNotificationStore } from './notificationStore';
import { ref } from 'vue'
import { utils, writeFileXLSX } from 'xlsx';
import { DateTime } from 'luxon'
import instance from '@/stores/axios.js'


export const useAlertsAlertReportStore = defineStore('alertReport', () => {
     const allEvents = ref({})
     const currentDateAlert = ref({})
     const currentAlert = ref({})

     const isLoading = ref(false)
     const isLoadingDownloadAllAlerts = ref(false)
     const isLoadingDownloadMonthAlerts = ref(false)
     const showAlertDialog = ref(false)

     const dt = DateTime.local()
     const currentMonthStore = ref(dt.month)
     const currentYearStore = ref(dt.year)

     const lawyerStore = useLawyerStore()
     const { lawyers } = storeToRefs(lawyerStore)

     const notificationStore = useNotificationStore()

     function openAlertDialog(selectedDate) {
          currentDateAlert.value = selectedDate
          currentAlert.value = getAlertByDate(currentDateAlert.value)
          showAlertDialog.value = true
     }

     function hideAlertDialog() {
          showAlertDialog.value = false
     }

     async function fetchLawyerEvents() {
          isLoading.value = true
          try {
               allEvents.value = {}
               let eventIndex = 1
               for (const lawyer of lawyers.value) {
                    const body = { lawyer_id: lawyer.id }
                    const queryString = new URLSearchParams(body).toString()
                    const response = await instance.get('contract?lawyer_id=' + lawyer.id, queryString)
                    if (response.data && Array.isArray(response.data)) {
                         response.data.forEach(item => {
                              allEvents.value[eventIndex] = item
                              eventIndex++
                         })
                    }
               }
          } finally {
               isLoading.value = false
          }
     }
     async function downloadAllEvents() {
          isLoadingDownloadAllAlerts.value = true
          try {
               const eventsArray = Object.entries(allEvents.value)
               const ws = utils.json_to_sheet(eventsArray)
               const wb = utils.book_new();
               utils.book_append_sheet(wb, ws, "Data")
               writeFileXLSX(wb, "Reporte de Alertas.xlsx")
               notificationStore.addNotification('success', 'action-download-success', 'action-download-success-message')
          } finally {
               isLoadingDownloadAllAlerts.value = false
          }
     }

     async function downloadMonthEvents() {
          isLoadingDownloadMonthAlerts.value = true
          try {
               const eventsArray = Object.entries(allEvents.value)
               const monthEvents = []
               for (const [key, event] of eventsArray) {
                    const evaluateDate = DateTime.fromISO(event.expires_at)
                    if (evaluateDate.year === currentYearStore.value && evaluateDate.month === currentMonthStore.value) {
                         monthEvents.push(event)
                    }
               }
               const ws = utils.json_to_sheet(monthEvents)
               const wb = utils.book_new();
               utils.book_append_sheet(wb, ws, "Data")
               writeFileXLSX(wb, `Reporte de Alertas para el mes ${currentMonthStore.value} del ${currentYearStore.value}.xlsx`)
               notificationStore.addNotification('success', 'action-download-success', 'action-download-success-message')
          } finally {
               isLoadingDownloadMonthAlerts.value = false
          }
     }


     function getAlertByDate(expiresDate) {
          const allEventsArray = Object.values(allEvents.value)
          return allEventsArray.find((event) => formatDate(event.expires_at) === expiresDate)
     }

     const formatDate = (date) => {
          if (date == null) {
               return date
          }
          else if (date !== null) {
               return DateTime.fromISO(date).toFormat('dd-MM-yyyy')
          }
     }

     return {
          isLoading, allEvents, currentMonthStore, currentYearStore,
          showAlertDialog, currentAlert, currentDateAlert, isLoadingDownloadAllAlerts, isLoadingDownloadMonthAlerts,
          fetchLawyerEvents, downloadAllEvents, downloadMonthEvents,
          openAlertDialog, hideAlertDialog
     }
}, {
     persist: {
          paths: [
               'allEvents', 'currentMonthStore', 'currentYearStore', 'currentAlert', 'currentDateAlert',
          ]
     }
})
