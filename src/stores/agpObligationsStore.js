import { defineStore, storeToRefs } from 'pinia'
import { useLawyerStore } from './lawyerStore'
import { useNotificationStore } from './notificationStore'
import { ref, watch } from 'vue'
import instance from '@/stores/axios.js'

export const useAgpObligationStore = defineStore('agpObligation', () => {
     const notificationDocument = ref({})
     const lawyersObligation = ref({})
     const user_id = ref(null)
     const obligation_id = ref(null)
     const obligationDocumentBase64 = ref(null)
     const showObligationDocument = ref(false)
     const showDeleteObligationDocument = ref(false)

     const isLoading = ref(false)
     const isLoadingObligationDocument = ref(false)
     const isLoadingDownloadDocument = ref(false)

     const lawyerStore = useLawyerStore()
     const { getId } = storeToRefs(lawyerStore)

     const notificationStore = useNotificationStore()

     watch(() => getId.value, (newVal) => {
          fetchNotificationDocuments()
          fetchObligationLawyer()
     })
     function openObligationDocument(userId, obligationId) {
          showObligationDocument.value = true
          user_id.value = userId
          obligation_id.value = obligationId
          downloadObligationDocument(userId, obligationId, 'forDialog')
     }
     function openDeleteObligationDocument(userId, obligationId) {
          showDeleteObligationDocument.value = true
          user_id.value = userId
          obligation_id.value = obligationId
     }
     function hideObligationDocuments() {
          showObligationDocument.value = false
          showDeleteObligationDocument.value = false
          obligationDocumentBase64.value = null
          user_id.value = null
          obligation_id.value = null
     }
     async function fetchNotificationDocuments() {
          isLoading.value = true
          try {
               const response = await instance.get('notification-documents/' + getId.value)
               notificationDocument.value = response.data
          } finally {
               isLoading.value = false
          }
     }
     async function fetchObligationLawyer() {
          isLoading.value = true
          try {
               const response = await instance.get('obligation/lawyer/' + getId.value)
               lawyersObligation.value = response.data
          } finally {
               isLoading.value = false
          }
     }

     async function uploadDocument(obligationId, file) {
          isLoading.value = true
          try {
               const formData = new FormData()
               formData.append('lawyer_id', getId.value)
               formData.append('obligation_id', obligationId)
               formData.append('file', file)
               await instance.post('obligation/upload', formData)
               notificationStore.addNotification('success', 'action-upload-success', 'action-upload-success-message')
          } finally {
               isLoading.value = false
               fetchObligationLawyer()
          }
     }

     async function downloadObligationDocument(userId, obligationId, forDownload) {
          isLoadingDownloadDocument.value = true
          try {
               const response = await instance.get('user/obligation/' + userId + '/' + obligationId + "/download")
               if (response.status == 200) {
                    const data = response.data
                    if (forDownload === 'forDownload') {
                         let pdfWindow = window.open('')
                         pdfWindow.document.write("<iframe width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(data) + "'></iframe>")
                    }
                    else if (forDownload === 'forDialog') {
                         obligationDocumentBase64.value = response.data
                    }
               }
          } finally {
               isLoadingDownloadDocument.value = false
          }
     }
     async function deleteObligationDocument(userId, obligationId) {
          isLoadingObligationDocument.value = true
          try {
               await instance.delete('user/obligation/' + userId + '/' + obligationId)
               notificationStore.addNotification('success', 'action-delete-success', 'action-delete-success-message')
               fetchObligationLawyer()
          } finally {
               isLoadingObligationDocument.value = false
               showDeleteObligationDocument.value = false
          }
     }
     return {
          isLoading, notificationDocument, lawyersObligation, showObligationDocument, showDeleteObligationDocument,
          isLoadingObligationDocument, obligationDocumentBase64, user_id, obligation_id, isLoadingDownloadDocument,
          fetchNotificationDocuments, fetchObligationLawyer, uploadDocument, downloadObligationDocument,
          openObligationDocument, openDeleteObligationDocument, hideObligationDocuments, deleteObligationDocument,
     }
}, {
     persist: {
          paths: ['notificationDocument', 'lawyersObligation',]
     }
})