import { defineStore } from 'pinia'
import { useLawyerStore } from './lawyerStore'
import { useNotificationStore } from './notificationStore';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue'
import instance from '@/stores/axios.js'
import qs from 'qs'

export const useOfficeStore = defineStore('officeStore', () => {
    const lawyerInformation = ref([])
    const lawyerOfficeInformation = ref([])
    const validateDeleteOffice = ref([])
    const selectedOffice = ref(null)

    const isLoadingOfficeStore = ref(false)
    const showUpdatePasswordDialog = ref(false)
    const showEditCreateNotarialOfficeDialog = ref(false)
    const showDeleteNotarialOfficeDialog = ref(false)

    const lawyerStore = useLawyerStore()
    const { getId } = storeToRefs(lawyerStore)
    const notificationStore = useNotificationStore()

    watch(() => getId.value, () => {
        fetchLawyerInformation()
    })

    function openEditCreateNotarialOffice(selectedItem) {
        selectedOffice.value = selectedItem
        showEditCreateNotarialOfficeDialog.value = true
    }
    function openDeleteNotarialOffice(selectedItem) {
        selectedOffice.value = selectedItem
        checkDeleteOffice(selectedOffice.value.lawyer_id, selectedOffice.value.id)
    }
    function openUpdatePasswordDialog(selectedItem) {
        selectedOffice.value = selectedItem
        showUpdatePasswordDialog.value = true
    }
    function hideAllDialogs() {
        validateDeleteOffice.value = {}
        selectedOffice.value = null
        showDeleteNotarialOfficeDialog.value = false
        showEditCreateNotarialOfficeDialog.value = false
        showUpdatePasswordDialog.value = false
    }

    function hideAndRefresh() {
        hideAllDialogs()
        fetchLawyerInformation()
    }

    async function fetchLawyerInformation() {
        isLoadingOfficeStore.value = true
        try {
            const response = await instance.get('lawyer/office/' + getId.value)
            if (response.status == 200) {
                lawyerOfficeInformation.value = response.data
            }
        } finally {
            isLoadingOfficeStore.value = false
        }
    }

    async function updateNotarialOffice(id, body) {
        isLoadingOfficeStore.value = true
        try {
            const formData = { ...body }
            await instance.put('lawyer/office/' + id, qs.stringify(formData))
        } finally {
            isLoadingOfficeStore.value = false
            hideAndRefresh()
        }
    }
    async function createNotarialOffice(body) {
        isLoadingOfficeStore.value = true
        try {
            const formData = { ...body }
            formData['lawyer_id'] = getId.value
            await instance.post('lawyer/office', qs.stringify(formData))
        } finally {
            isLoadingOfficeStore.value = false
            hideAndRefresh()
        }
    }

    async function checkDeleteOffice(lawyerId, officeId) {
        isLoadingOfficeStore.value = true
        try {
            const response = await instance.get('instrument/office/' + lawyerId + '/' + officeId)
            if (response.status == 200) {
                validateDeleteOffice.value = response.data
            }
        } finally {
            isLoadingOfficeStore.value = false
            showDeleteNotarialOfficeDialog.value = true
        }
    }
    async function deleteNotarialOfice(officeId) {
        isLoadingOfficeStore.value = true
        try {
            await instance.delete('lawyer/office/' + officeId)
        } finally {
            isLoadingOfficeStore.value = false
            hideAndRefresh()
        }
    }
    async function setId(lawyerGetId) {
        isLoadingOfficeStore.value = true
        try {
            lawyerInformation.value = []
            const response = await instance.get('lawyer/office/' + lawyerGetId)
            if (response.status == 200) {
                lawyerInformation.value = response.data
            }
        } finally {
            isLoadingOfficeStore.value = false
        }
    }
    return {
        lawyerOfficeInformation, isLoadingOfficeStore, showEditCreateNotarialOfficeDialog, showDeleteNotarialOfficeDialog,
        showUpdatePasswordDialog, selectedOffice, validateDeleteOffice,
        openUpdatePasswordDialog, hideAllDialogs, openEditCreateNotarialOffice,
        fetchLawyerInformation, updateNotarialOffice, createNotarialOffice, openDeleteNotarialOffice,
        checkDeleteOffice, deleteNotarialOfice,
        setId
    }
}, {
    persist: true
})