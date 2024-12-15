import { defineStore } from 'pinia'
import { useLawyerStore } from './lawyerStore'
import { useNotificationStore } from './notificationStore'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import instance from '@/stores/axios.js'
import qs from 'qs'

export const useInstrumentsCategoriesStore = defineStore('type', () => {
    const categories = ref([])
    const typeCount = ref(Number)
    const documents = ref([])
    const alerts = ref([])
    const selectedCategory = ref(null)
    const showEditDialog = ref(false)
    const showDeleteDialog = ref(false)
    const showCreateDialog = ref(false)

    const isLoadingInstrumentCategoriesStore = ref(false)
    const isLoadingEditInstrumentCategories = ref(false)
    const isLoadingDeleteInstrumentCategories = ref(false)


    const lawyerStore = useLawyerStore()
    const { getId } = storeToRefs(lawyerStore)

    const notificationStore = useNotificationStore()

    function openEditDialog(categorySelected) {
        selectedCategory.value = categorySelected
        showEditDialog.value = true
        getDocumentsTypes()
        getAlertsTypes()
    }
    function openDeleteDialog(categorySelected) {
        selectedCategory.value = categorySelected
        showDeleteDialog.value = true
        openDeleteCategoryDialog(categorySelected)
    }
    function openCreateDialog() {
        showCreateDialog.value = true
    }
    function hideEditDeleteCreateDialog() {
        selectedCategory.value = null
        showEditDialog.value = false
        showDeleteDialog.value = false
        showCreateDialog.value = false
        typeCount.value = []
    }
    function hideAndReload() {
        hideEditDeleteCreateDialog()
        fetchCategoriesTypes()
    }
    async function fetchCategoriesTypes() {
        isLoadingInstrumentCategoriesStore.value = true
        try {
            const response = await instance.get('instrument/type')
            if (response.status == 200) {
                categories.value = response.data
            }
        } finally {
            isLoadingInstrumentCategoriesStore.value = false
        }
    }
    async function openDeleteCategoryDialog(id) {
        try {
            isLoadingDeleteInstrumentCategories.value = true
            const response = await instance.get('instrument/type/' + getId.value + '/' + id)
            if (response.status == 200) {
                typeCount.value = response.data.typeCount
            }
        } finally {
            isLoadingDeleteInstrumentCategories.value = false
        }
    }
    async function createInstrument(name, currentDocuments, currentAlerts) {
        isLoadingInstrumentCategoriesStore.value = true
        try {
            const formData = new FormData()
            formData.append('name', name)
            formData.append('documents', currentDocuments)
            formData.append('alerts', currentAlerts)
            await instance.post('instrument/type', formData)
            notificationStore.addNotification('success', 'action-create-success', 'action-create-success-message')
        } finally {
            isLoadingInstrumentCategoriesStore.value = false
            hideAndReload()
        }
    }
    async function deleteInstrument(id) {
        isLoadingInstrumentCategoriesStore.value = true
        try {
            await instance.delete('instrument/type/' + id)
            notificationStore.addNotification('success', 'action-delete-success', 'action-delete-success-message')
        } finally {
            isLoadingInstrumentCategoriesStore.value = false
            hideAndReload()
        }
    }
    async function editIntrument(id, name, updatedDocuments, updatedAlerts) {
        isLoadingInstrumentCategoriesStore.value = true
        try {
            const formData = {}
            formData['name'] = name
            updatedDocuments.forEach((value, index) => {
                formData[`ids[${index}]`] = value
            })
            updatedAlerts.forEach((value, index) => {
                formData[`alert_ids[${index}]`] = value
            })
            await instance.put('instrument/type/' + id, qs.stringify(formData))
            notificationStore.addNotification('success', 'action-edit-success', 'action-edit-success-message')
        } finally {
            isLoadingInstrumentCategoriesStore.value = false
            hideAndReload()
        }
    }
    async function getDocumentsTypes() {
        isLoadingEditInstrumentCategories.value = true
        try {
            const response = await instance.get('document')
            if (response.status == 200) {
                documents.value = response.data
            }
        } finally {
            isLoadingEditInstrumentCategories.value = false
        }
    }
    async function getAlertsTypes() {
        isLoadingEditInstrumentCategories.value = true
        try {
            const response = await instance.get('alert')
            if (response.status == 200) {
                alerts.value = response.data
            }
        } finally {
            isLoadingEditInstrumentCategories.value = false
        }
    }

    function getCategoryById(itemId) {
        return categories.value.find((item) => item.id === itemId)
    }

    return {
        categories, typeCount, isLoadingInstrumentCategoriesStore, selectedCategory, showEditDialog, showDeleteDialog,
        showCreateDialog, documents, alerts, isLoadingEditInstrumentCategories, isLoadingDeleteInstrumentCategories,
        openEditDialog, openDeleteDialog, openCreateDialog, hideEditDeleteCreateDialog, fetchCategoriesTypes,
        openDeleteCategoryDialog, createInstrument, deleteInstrument, editIntrument, getDocumentsTypes, getAlertsTypes,
        getCategoryById, hideAndReload
    }
}, {
    persist: {
        paths: ['categories', 'typeCount', 'documents', 'alerts']
    }
})