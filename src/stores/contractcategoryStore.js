import { defineStore } from 'pinia'
import { useDeadLineAlertCategoriesStore } from './deadLineAlertCategoriesStore'
import { useNotificationStore } from './notificationStore'
import { ref } from 'vue'
import instance from '@/stores/axios.js'
import qs from 'qs'

export const useContractcategoryStore = defineStore('contract-category', () => {
    const categories = ref([])
    const isLoading = ref(false)
    const hasError = ref(false)

    const notificationStore = useNotificationStore()

    function updateCategories(category) {
        categories.value = category
    }
    async function createNewCategory(name, description) {
        isLoading.value = true
        try {
            hasError.value = true
            const formData = new FormData()
            formData.append('name', name)
            formData.append('description', description)
            const response = await instance.post('contract-category', formData)
            notificationStore.addNotification('success', 'action-create-success', 'action-create-success-message')
        } finally {
            finishAndReload()
        }
    }
    async function createSubCategory(name, description, id) {
        isLoading.value = true
        try {
            hasError.value = true
            const formData = new FormData()
            formData.append('name', name)
            formData.append('description', description)
            formData.append('contract_category_id', id)
            const response = await instance.post('contract-category', formData)
            console.log(response)
            console.log(response.data)
            notificationStore.addNotification('success', 'action-create-success', 'action-create-success-message')
        } finally {
            finishAndReload()
        }
    }
    async function editCategory(name, description, id) {
        isLoading.value = true
        try {
            hasError.value = true
            const formData = {}
            formData['name'] = name
            formData['description'] = description
            await instance.put('contract-category/' + id, qs.stringify(formData))
            notificationStore.addNotification('success', 'action-edit-success', 'action-edit-success-message')
        } finally {
            finishAndReload()
        }
    }
    async function deleteCategory(id) {
        isLoading.value = true
        try {
            await instance.delete('contract-category/' + id)
            notificationStore.addNotification('success', 'action-delete-success', 'action-delete-success-message')
        } finally {
            finishAndReload()
        }
    }
    function finishAndReload() {
        const deadlineAlertsStore = useDeadLineAlertCategoriesStore()
        deadlineAlertsStore.fetchDeadlinealerts()
        deadlineAlertsStore.hideCreateEditDeleteDialog()
        isLoading.value = false
        hasError.value = false
    }


    function getCategoryById(categoryId) {
        const findCategory = (categories, categoryId) => {
            for (const category of categories) {
                if (category.id == categoryId) {
                    return category
                }
                if (category.children) {
                    const found = findCategory(category.children, categoryId)
                    if (found) {
                        return found
                    }
                }
            }
            return null;
        };
        return findCategory(categories.value, categoryId);
    }
    function getCategoryNameById(categoryId) {
        const category = getCategoryById(categoryId)
        return category ? category.name : ""
    }

    function getCategoryDescriptionById(categoryId) {
        const category = getCategoryById(categoryId)
        return category ? category.description : ""
    }

    function getParentIdById(categoryId) {
        const findParent = (categories, categoryId) => {
            return categories.find(category => {
                if (category.children && category.children.length > 0) {
                    if (category.children.find(child => child.id == categoryId)) {
                        return category
                    }
                    return findParent(category.children, categoryId)
                }
                return false
            })
        }
    }

    return {
        categories, isLoading, hasError, updateCategories, createSubCategory, createNewCategory, editCategory,
        deleteCategory, finishAndReload,
        getCategoryById, getCategoryNameById, getCategoryDescriptionById, getParentIdById
    }
}, {
    persist: true
})