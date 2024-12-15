import { defineStore, storeToRefs } from 'pinia'
import { useLawyerStore } from './lawyerStore'
import { useNotificationStore } from './notificationStore'
import { ref, watch } from 'vue'
import instance from '@/stores/axios.js'

export const useAlertsInstrumentStore = defineStore('alertsInstrument', () => {
     const allYears = ref([])
     const contractAlerts = ref([])
     const reusableLawyerId = ref(null)
     const contractAlertNumber = ref(null)

     const isLoadingAlertsInstrumentStore = ref(false)
     const isLoadingNotarySelect = ref(false)
     const isLoadingYearSelect = ref(false)


     const lawyerStore = useLawyerStore()
     const { lawyers, getId } = storeToRefs(lawyerStore)
     const allLawyerList = ref(lawyers.value)
     const selectedLawyer = ref(lawyerStore.getLawyerById(getId.value))

     const notificationStore = useNotificationStore()

     watch(() => getId.value, (newVal) => {
          fetchYearsOfLawyer(newVal)
     })
     function openContractAlerts(number) {
          contractAlertNumber.value = number
     }
     async function fetchYearsOfLawyer(id) {
          contractAlertNumber.value = null
          contractAlerts.value = []
          isLoadingNotarySelect.value = true
          try {
               reusableLawyerId.value = id
               const response = await instance.get('instrument/lawyer/years/' + id)
               allYears.value = response.data
          } finally {
               isLoadingNotarySelect.value = false
          }
     }
     async function fetchContractAlerts(year) {
          contractAlertNumber.value = null
          isLoadingYearSelect.value = true
          try {
               const response = await instance.get('instrument/year/' + year + '/' + reusableLawyerId.value)
               contractAlerts.value = response.data
          } finally {
               isLoadingYearSelect.value = false
          }
     }
     return {
          isLoadingAlertsInstrumentStore, allYears, contractAlerts, allLawyerList,
          isLoadingNotarySelect, isLoadingYearSelect, reusableLawyerId, contractAlertNumber,
          fetchYearsOfLawyer, fetchContractAlerts, openContractAlerts
     }
}, {
     persist: false
     // {
     //      paths: [
     //      ]
     // }
})