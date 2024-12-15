import { defineStore } from 'pinia'
import { useLawyerStore } from './lawyerStore'
import { useNotificationStore } from './notificationStore'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import instance from '@/stores/axios.js'
import { watch } from 'vue'
import qs from 'qs'

export const useDeadLineAlertStore = defineStore('deadLineAlerts', () => {
     const countries = ref([])
     const contracts = ref([])
     const contract = ref([])
     const contractCategories = ref({})
     const selectedDocument = ref(null)

     const isLoadingDeadLineAlertStore = ref(false)
     const isLoadingFetchContract = ref(false)
     const showCreateEditDialog = ref(false)
     const showDeleteDialog = ref(false)

     const lawyerStore = useLawyerStore()
     const { getId } = storeToRefs(lawyerStore)
     const notificationStore = useNotificationStore()

     watch(() => getId.value, (newVal) => {
          fetchDeadLineAlerts()
     })
     function openCreateEditDialog(categorySelected) {
          selectedDocument.value = categorySelected
          contract.value = null
          if (selectedDocument.value !== undefined) {
               fetchContract(selectedDocument.value.id)
          } else if (selectedDocument.value === undefined) {
               contract.value = []
          }
          showCreateEditDialog.value = true
     }
     function openDeleteDialog(categorySelected) {
          selectedDocument.value = categorySelected
          showDeleteDialog.value = true
     }
     function hideCreateEditDeleteDialog() {
          selectedDocument.value = null
          isLoadingDeadLineAlertStore.value = false
          showCreateEditDialog.value = false
          showDeleteDialog.value = false
     }
     function fetchAndHide() {
          hideCreateEditDeleteDialog()
          fetchDeadLineAlerts()
     }
     async function fetchDeadLineAlerts() {
          isLoadingDeadLineAlertStore.value = true
          try {
               const response = await instance.get('contract?lawyer_id=' + getId.value)
               contracts.value = response.data
          } finally {
               isLoadingDeadLineAlertStore.value = false
          }
     }

     async function fetchContractCategories() {
          isLoadingDeadLineAlertStore.value = true
          try {
               const response = await instance.get('contract-category')
               contractCategories.value = response.data
          } finally {
               isLoadingDeadLineAlertStore.value = false
          }
     }

     async function fetchAllCountries() {
          isLoadingDeadLineAlertStore.value = true
          try {
               const response = await instance.get('all/countries')
               countries.value = response.data
          } finally {
               isLoadingDeadLineAlertStore.value = false
          }
     }
     async function fetchContract(contractId) {
          isLoadingFetchContract.value = true
          try {
               contract.value = []
               const response = await instance.get('contract/' + contractId)
               contract.value = response.data.contract
          } finally {
               isLoadingFetchContract.value = false
          }
     }
     async function deleteDocument(id) {
          isLoadingDeadLineAlertStore.value = true
          try {
               await instance.delete('contract/' + id)
               isLoadingDeadLineAlertStore.value = false
               notificationStore.addNotification('success', 'action-delete-success', 'action-delete-success-message')
          } finally {
               isLoadingDeadLineAlertStore.value = false
               fetchAndHide()
          }
     }
     async function updateDocument(body) {
          isLoadingDeadLineAlertStore.value = true
          try {
               const formData = {}
               formData['description'] = body.description
               formData['product'] = body.product
               formData['emit_entity'] = body.emit_entity
               formData['expedient_number'] = body.expedient_number
               formData['comment'] = body.comment
               formData['country_id'] = body.country_id
               formData['contract_category_id'] = body.contract_category_id
               formData['client'] = body.client
               formData['destinataries'] = body.destinataries
               formData['lawyer_id'] = body.lawyer_id
               const config = {
                    headers: {
                         'Content-Type': 'application/x-www-form-urlencoded',
                    }
               }
               await instance.put('contract/' + body.id, qs.stringify(formData), { config })
               notificationStore.addNotification('success', 'action-update-success', 'action-update-success-message')
          } finally {
               isLoadingDeadLineAlertStore.value = false
               fetchAndHide()
          }
     }
     async function renovateDocument(body) {
          isLoadingDeadLineAlertStore.value = true
          try {
               const formData = {}
               formData['status_id'] = 4
               formData['lawyer_id'] = body.lawyer_id
               formData['contract_id'] = body.contract_id
               const config = {
                    headers: {
                         'Content-Type': 'application/x-www-form-urlencoded',
                    }
               }
               await instance.put('contract/' + body.id, qs.stringify(formData), { config })
               notificationStore.addNotification('success', 'action-update-success', 'action-update-success-message')
          } finally {
               isLoadingDeadLineAlertStore.value = false
               fetchAndHide()
          }
     }

     function getCountryById(countryId) {
          return countries.value.find((country) => country.id === countryId)
     }
     function getCountryNameById(countryId) {
          const country = getCountryById(countryId)
          return country ? country.name : 'N/A'
     }
     return {
          countries, contracts, isLoadingDeadLineAlertStore, selectedDocument, showCreateEditDialog, showDeleteDialog,
          contract, isLoadingFetchContract, contractCategories,
          fetchDeadLineAlerts, fetchAllCountries, getCountryById, openCreateEditDialog,
          openDeleteDialog, hideCreateEditDeleteDialog, deleteDocument, fetchContract, updateDocument,
          renovateDocument, getCountryNameById, fetchContractCategories
     }
}, {
     persist: {
          paths: [
               'countries', 'contracts', 'selectedDocument'
          ]
     }
})