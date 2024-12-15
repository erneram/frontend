import { defineStore } from 'pinia'
import { useLawyerStore } from './lawyerStore'
import { useNotificationStore } from './notificationStore'
import { storeToRefs } from 'pinia'
import { ref, reactive } from 'vue'
import { DateTime } from 'luxon'
import router from '@/router'
import instance from '@/stores/axios.js'
import DangerAlert from '@/components/alerts/DangerAlert.vue'

export const useInstrumentsStore = defineStore('instruments', () => {
     const dt = DateTime.local()
     const currentYear = ref(dt.year)
     const instruments = ref([])
     const type = ref([])
     const status = ref([])
     const detail = ref([])
     const currentViewLawyer = ref([])
     const allYears = ref([])
     const indexFile = ref(null)
     const defaultText = ref(null)
     const selectedDetail = ref(null)
     const archiveYearInstruments = ref(null)
     const redirectPath = ref(null)
     const voucherNumber = ref(null)
     const voucherPdf = ref(null)
     const voucherDocument = ref(null)
     const currentDeletingId = ref(null)
     const alertDeletingId = ref(null)
     const alertDeletingIndex = ref(null)
     const arrayDeletingIndex = ref(null)
     const documentTemplate = ref(null)

     const showAddDialog = ref(false)
     const showViewDialog = ref(false)
     const showEditDialog = ref(false)
     const showVoucherDialog = ref(false)
     const showDeleteVoucherDialog = ref(false)
     const showDeleteDialog = ref(false)
     const showEditDocumentTemplate = ref(false)
     const isLoadingInstrumentStore = ref(false)
     const isLoadingEditInstruments = ref(false)
     const isLoadingViewInstruments = ref(false)
     const isLoadingDownloadObligationPdf = ref(false)
     const isLoadingDocumentTemplate = ref(false)

     const notificationStore = useNotificationStore()

     const lawyerStore = useLawyerStore()
     const { getId } = storeToRefs(lawyerStore)

     async function fetchLawyerInstruments(year = currentYear.value) {
          isLoadingInstrumentStore.value = true
          try {
               archiveYearInstruments.value = year
               const response = await instance.get('instrument/year/' + year + '/' + getId.value)
               if (response.status == 200) {
                    instruments.value = response.data
               }
          } finally {
               isLoadingInstrumentStore.value = false
          }
     }
     function openInstrumentView(year = currentYear) {
          archiveYearInstruments.value = year
          fetchLawyerInstruments(archiveYearInstruments.value)
          redirectPath.value = '/protocols/' + archiveYearInstruments.value + '/archive'
          router.push(redirectPath.value)
     }
     function openAddDialog() {
          detail.value = null
          selectedDetail.value = null
          showAddDialog.value = true
          fetchInstrumentStatus()
          fetchInstrumentType()
     }
     function openViewDialog(detailSelected) {
          selectedDetail.value = detailSelected
          showViewDialog.value = true
          fetchInstrumentInformation()
          getIndexFile()
     }
     function openEditDialog(detailSelected) { //actualmente editando
          selectedDetail.value = detailSelected
          showEditDialog.value = true
          fetchInstrumentDetail()
          fetchInstrumentStatus()
          fetchInstrumentType()
     }
     function openDeleteDialog(detailSelected) {
          selectedDetail.value = detailSelected
          showDeleteDialog.value = true
     }
     function openVoucherDialog(voucherName, pdf) {
          showVoucherDialog.value = true
          voucherNumber.value = pdf
          downloadNotarialObligationsPdf(voucherName, pdf, 'forVoucher')
     }
     function openDeleteVoucherDialog(currentId, alertId, arrayIndex) {
          showDeleteVoucherDialog.value = true
          currentDeletingId.value = currentId
          alertDeletingId.value = alertId
          arrayDeletingIndex.value = arrayIndex
     }
     function openEditDocumentTemplate(template) {
          showEditDocumentTemplate.value = true
          documentTemplate.value = template
     }
     function hideEditDocumentTemplate() {
          showEditDocumentTemplate.value = false
          documentTemplate.value = null
     }
     function hideVoucherDialog() {
          showVoucherDialog.value = false
          showDeleteVoucherDialog.value = false
          voucherDocument.value = null
          voucherNumber.value = null
          currentDeletingId.value = null
          alertDeletingId.value = null
          alertDeletingIndex.value = null
          arrayDeletingIndex.value = null
     }
     function hideViewEditDeleteDialog() {
          indexFile.value = null
          defaultText.value = null
          selectedDetail.value = null
          showAddDialog.value = false
          showViewDialog.value = false
          showEditDialog.value = false
          showDeleteDialog.value = false
     }
     async function getIndexFile() {
          isLoadingViewInstruments.value = true
          try {
               const response = await instance.get('download/instrument/base64/' + selectedDetail.value)
               if (response.status == 200) {
                    indexFile.value = response.data
               }
          } finally {
               isLoadingViewInstruments.value = false
          }
     }
     async function fetchInstrumentInformation() {
          isLoadingViewInstruments.value = true
          try {
               const response = await instance.get('instrument/' + selectedDetail.value)
               if (response.status == 200) {
                    currentViewLawyer.value = response.data
               }
          } finally {
               isLoadingViewInstruments.value = false
          }
     }
     async function uploadNotaralObligations(file, instrument_id, alert_id, alertIndex) {
          isLoadingInstrumentStore.value = true
          try {
               const formData = new FormData()
               formData.append('file', file)
               formData.append('instrument_id', instrument_id)
               formData.append('alert_id', alert_id)
               formData.append('alertIndex', alertIndex)
               await instance.post('instrument/alert/upload', formData)
               notificationStore.addNotification('success', 'action-upload-success', 'action-upload-success-message')
          } finally {
               isLoadingInstrumentStore.value = false
          }
     }
     async function downloadNotarialObligationsPdf(alertId, instrumentId, forDownload) {
          isLoadingDownloadObligationPdf.value = true
          try {
               const response = await instance.get('instrument/alert/url/' + alertId + '/' + instrumentId)
               if (response.status == 200) {
                    const data = response.data
                    if (forDownload === 'forDownload') {
                         let pdfWindow = window.open('')
                         pdfWindow.document.write("<iframe width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(data) + "'></iframe>")
                    }
                    else if (forDownload === 'forVoucher') {
                         voucherDocument.value = data
                    }
               }
          } finally {
               isLoadingDownloadObligationPdf.value = false
          }
     }
     async function getDocumentText(generalId, documentId, singleId,) {
          isLoadingInstrumentStore.value = true
          try {
               const response = await instance.get('download/instrument/document/' + generalId + '/' + documentId + '/' + singleId)
               if (response.status == 200) {
                    defaultText.value = response.data
               }
          } finally {
               isLoadingInstrumentStore.value = false
          }
     }
     async function generateNewDocument(document_id, instrument_id, template_text) {
          isLoadingInstrumentStore.value = true
          try {
               const body = { document_id: document_id, instrument_id: instrument_id, template_text: template_text }
               const response = await instance.post('instrument-document-pdf', body)
               if (response.status == 200) {
                    indexFile.value = response.data
               }
          } finally {
               isLoadingInstrumentStore.value = false
          }
     }
     async function deleteNotarialObligationsPdf(instrument_id, alert_id, alertIndex) {
          isLoadingInstrumentStore.value = true
          try {
               const body = { instrument_id: instrument_id, alert_id: alert_id, alertIndex: alertIndex }
               await instance.post('instrument/alert/delete', body)
               notificationStore.addNotification('success', 'action-delete-success', 'action-delete-success-message')
          } finally {
               showDeleteVoucherDialog.value = false
               isLoadingInstrumentStore.value = false
          }
     }
     async function fetchInstrumentDetail() {
          isLoadingEditInstruments.value = true
          try {
               const response = await instance.get('instrument/detail/' + selectedDetail.value)
               if (response.status == 200) {
                    detail.value = response.data
               }
          } finally {
               isLoadingEditInstruments.value = false
          }
     }
     async function editOrAddInstrument(instrument_type_id, instrument_status_id, client, place, date, is_reverse, parts, starting_folio, sheets, price, number, year, file, filename, id, current, lawyer_office_id, cause, lawyer_id) {
          isLoadingInstrumentStore.value = true
          try {
               const formData = new FormData()
               formData.append('instrument_type_id', instrument_type_id)
               formData.append('instrument_status_id', instrument_status_id)
               formData.append('client', client)
               formData.append('place', place)
               formData.append('date', date)
               formData.append('is_reverse', is_reverse)
               formData.append('parts', parts)
               formData.append('starting_folio', starting_folio)
               formData.append('sheets', sheets)
               formData.append('price', price)
               formData.append('number', number)
               formData.append('year', year)
               formData.append('file', file)
               formData.append('filename', filename)
               formData.append('id', id)
               formData.append('current', current)
               formData.append('lawyer_office_id', lawyer_office_id)
               formData.append('cause', cause)
               formData.append('lawyer_id', lawyer_id)
               if (id !== null) {
                    await instance.post('instrument/update/' + id, formData)
                    fetchLawyerInstruments()
                    showEditDialog.value = false
                    notificationStore.addNotification('success', 'action-edit-success', 'action-edit-success-message')
               } else if (id === null) {
                    await instance.post('instrument', formData)
                    fetchLawyerInstruments()
                    notificationStore.addNotification('success', 'action-create-success', 'action-create-success-message')
                    showAddDialog.value = false
               }
          } finally {
               isLoadingInstrumentStore.value = false
               showAddDialog.value = false
               showEditDialog.value = false
          }
     }
     async function deleteInstrument(id) {
          isLoadingInstrumentStore.value = true
          try {
               await instance.delete('instrument/' + id)
               fetchLawyerInstruments()
               notificationStore.addNotification('success', 'actino-delete-success', 'action-delete-success-message')
          } finally {
               isLoadingInstrumentStore.value = false
               showDeleteDialog.value = false
          }
     }
     async function fetchInstrumentStatus() {
          isLoadingInstrumentStore.value = true
          try {
               const response = await instance.get('instrument/status')
               if (response.status == 200) {
                    status.value = response.data
               }
          } finally {
               isLoadingInstrumentStore.value = false
          }
     }
     async function fetchInstrumentType() {
          isLoadingInstrumentStore.value = true
          try {
               const response = await instance.get('instrument/type')
               if (response.status == 200) {
                    type.value = response.data
               }
          } finally {
               isLoadingInstrumentStore.value = false
          }
     }
     async function fetchYears() {
          isLoadingInstrumentStore.value = true
          try {
               const response = await instance.get('instrument/current/years')
               if (response.status == 200) {
                    allYears.value = response.data
               }
          } finally {
               isLoadingInstrumentStore.value = false
          }
     }

     function getInstrumentById(instrumentId) {
          return instruments.value.find((instrument) => instrument.id === instrumentId)
     }
     return {
          instruments, type, status, detail, currentViewLawyer, indexFile, defaultText,
          selectedDetail, showAddDialog, showViewDialog, showEditDialog, showDeleteDialog, isLoadingInstrumentStore,
          allYears, archiveYearInstruments, isLoadingEditInstruments, isLoadingViewInstruments,
          showVoucherDialog, showDeleteVoucherDialog, voucherNumber, voucherPdf, voucherDocument, currentDeletingId,
          arrayDeletingIndex, alertDeletingId, isLoadingDownloadObligationPdf,
          showEditDocumentTemplate, documentTemplate, isLoadingDocumentTemplate,
          fetchLawyerInstruments, openAddDialog, openDeleteDialog, openEditDialog, openViewDialog,
          hideViewEditDeleteDialog, getIndexFile, fetchInstrumentInformation, uploadNotaralObligations,
          downloadNotarialObligationsPdf, getDocumentText, generateNewDocument, deleteNotarialObligationsPdf,
          fetchInstrumentDetail, editOrAddInstrument, deleteInstrument, fetchInstrumentStatus, fetchInstrumentType,
          getInstrumentById, fetchYears, openInstrumentView,
          openVoucherDialog, hideVoucherDialog, openDeleteVoucherDialog,
          openEditDocumentTemplate, hideEditDocumentTemplate,
     }
}, {
     persist: {
          paths: ['instruments', 'type', 'status', 'indexFile', 'defaultText',
               'selectedDetail', 'isLoadingInstrumentStore', 'allYears', 'archiveYearInstruments'],
     }
})