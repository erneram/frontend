import { defineStore } from 'pinia'
import { useContractcategoryStore } from './contractcategoryStore'
import { useNotificationStore } from './notificationStore'
import { ref } from 'vue'
import instance from '@/stores/axios.js'

export const useDeadLineAlertCategoriesStore = defineStore('tree', () => {
    const categoriesData = ref([])
    const isLoading = ref(false)
    const selectedCategory = ref(null)
    const showEditDialog = ref(false)
    const showCreateNewDialog = ref(false)
    const showDeleteDialog = ref(false)
    const contractCategory = useContractcategoryStore()
    const notificationStore = useNotificationStore()

    function openEditDialog(categorySelected) {
        selectedCategory.value = categorySelected
        showEditDialog.value = true
    }
    function openCreateNewDialog(categorySelected) {
        selectedCategory.value = categorySelected
        showCreateNewDialog.value = true
    }
    function openDeleteDialog(categorySelected) {
        selectedCategory.value = categorySelected
        showDeleteDialog.value = true
    }
    function hideCreateEditDeleteDialog() {
        selectedCategory.value = null
        showEditDialog.value = false
        showDeleteDialog.value = false
        showCreateNewDialog.value = false
    }
    async function fetchDeadlinealerts() {
        isLoading.value = true
        try {
            const response = await instance.get('contract-category/tree')
            if (response.status == 200) {
                contractCategory.updateCategories(response.data)
                categoriesData.value = response.data
            }
        } finally {
            isLoading.value = false
        }
    }

    //agregar aqui adentro un getCategoryById

    return {
        isLoading, categoriesData, selectedCategory, showEditDialog, showCreateNewDialog, showDeleteDialog,
        openEditDialog, openDeleteDialog, openCreateNewDialog, hideCreateEditDeleteDialog, fetchDeadlinealerts
    }
}, {
    persist: {
        paths: [
            'categoriesData', 'selectedCategory'
        ]
    }
})