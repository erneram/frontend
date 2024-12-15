import { defineStore } from 'pinia'
import { useOfficeStore } from './officesStore'
import { useNotificationStore } from './notificationStore'
import { ref } from 'vue'
import { DateTime } from 'luxon'
import qs from 'qs'
import instance from '@/stores/axios.js'

export const useLawyerStore = defineStore('lawyer', () => {
     const lawyers = ref([])
     const lawyerProgress = ref([])
     const allLawyers = ref([]) //posibly rename
     const isLoadingLawyerStore = ref(false)
     const showLawyerEditDialog = ref(false)
     const showLawyerDeleteDialog = ref(false)
     const personalIdentification = ref(null)
     const currentLaywer = ref(null)
     const getId = ref(null)
     const selectedId = ref(null)
     const selectedLawyer = ref(null)
     const formData = {}

     const notificationStore = useNotificationStore()

     function openLawyerEditDialog(selectedItem) {
          selectedLawyer.value = selectedItem
          showLawyerEditDialog.value = true
     }
     function openLawyerDeleteDialog(selectedItem) {
          selectedLawyer.value = selectedItem
          showLawyerDeleteDialog.value = true
     }
     function hideEditDeleteDialog() {
          selectedLawyer.value = null
          showLawyerEditDialog.value = false
          showLawyerDeleteDialog.value = false
     }

     function updateLawyers(lawyer) {
          isLoadingLawyerStore.value = true
          lawyers.value = lawyer
          // updateCurrentLawyer()
          isLoadingLawyerStore.value = false
     }
     function setIdValue(id) {
          getId.value = id
     }
     function updateCurrentLawyer(id) {
          currentLaywer.value = null
          getId.value = null
          const officeStore = useOfficeStore()
          selectedId.value = id == null ? 0 : id
          if (selectedId.value === 0) {
               // getId.value = 1
               getId.value = lawyers[selectedId.value].value.id
               currentLaywer.value = getLawyerById(getId.value)
               officeStore.setId(currentLaywer.value)
          } else {
               // getId.value = 1
               getId.value = selectedId.value
               currentLaywer.value = getLawyerById(selectedId.value)
               officeStore.setId(getId.value)
          }
     }
     async function fetchLawyerProgress() {
          isLoadingLawyerStore.value = true
          try {
               const response = await instance.get('report/progress')
               if (response.status == 200) {
                    lawyerProgress.value = response.data
               }
          } finally {
               isLoadingLawyerStore.value = false
          }
     }
     async function fetchLawyers() {
          isLoadingLawyerStore.value = true
          try {
               hideEditDeleteDialog()
               const response = await instance.get('lawyer')
               if (response.status == 200) {
                    allLawyers.value = response.data
               }
          } finally {
               isLoadingLawyerStore.value = false
          }
     }
     async function updateLawyerInformation(id, fields) {
          isLoadingLawyerStore.value = true
          try {
               fields.forEach(field => {
                    formData[field.name] = field.value;
               })
               const config = {
                    headers: {
                         'Content-Type': 'application/x-www-form-urlencoded',
                    }
               }
               await instance.put('lawyer/' + id, qs.stringify(formData), { config })
          } finally {
               isLoadingLawyerStore.value = false
               fetchLawyers()
          }
     }
     async function fetchPersonalIdentifications() { //recoge informacion personal
          isLoadingLawyerStore.value = true
          try {
               const response = await instance.get('lawyer/documents/' + getId.value)
               if (response.status == 200) {
                    personalIdentification.value = response.data
               }
          } finally {
               isLoadingLawyerStore.value = false
          }
     }

     function getLawyerById(lawyerId) {
          return lawyers.value.find((lawyer) => lawyer.id === lawyerId)
     }
     function getLawyerNameById(lawyerId) {
          const lawyer = getLawyerById(lawyerId)
          return `${lawyer.firstName} ${lawyer.lastName}`
     }
     function getAllLawyersById(lawyerId) {
          return allLawyers.value.find((lawyer) => lawyer.id === lawyerId)
     }

     function getAllLawyerNameByID(lawyerId) {
          const lawyer = getAllLawyersById(lawyerId)
          return `${lawyer.first_name} ${lawyer.last_name}`
     }

     return {
          selectedLawyer, allLawyers, lawyers, currentLaywer, getId, isLoadingLawyerStore, lawyerProgress,
          showLawyerEditDialog, showLawyerDeleteDialog, personalIdentification,
          hideEditDeleteDialog, openLawyerEditDialog, openLawyerDeleteDialog,
          updateLawyers, updateCurrentLawyer, fetchLawyerProgress, fetchLawyers, updateLawyerInformation, getLawyerById,
          fetchPersonalIdentifications, getLawyerNameById, getAllLawyerNameByID, getAllLawyersById,
          setIdValue,
     }
}, {
     persist: {
          paths: [
               'selectedLawyer', 'allLawyers', 'lawyers', 'currentLaywer', 'getId', 'lawyerProgress', 'isLoadingLawyerStore',
               'personalIdentification'
          ]
     }
})