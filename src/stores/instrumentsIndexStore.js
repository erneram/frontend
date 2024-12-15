import { defineStore } from 'pinia'
import { useAuthStore } from './authStore'
import { useLawyerStore } from './lawyerStore'
import { useNotificationStore } from './notificationStore'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { DateTime } from 'luxon'
import router from '@/router'
import instance from '@/stores/axios.js'

export const useIndexStore = defineStore('index', () => {
    const dt = DateTime.local()
    const currentYear = dt.year
    const index = ref(null)
    const header = ref(null)
    const footer = ref(null)
    const archiveYearIndex = ref(null)
    const redirectPath = ref(null)
    const missingNumbers = ref([])
    const authStore = useAuthStore()
    const headers = authStore.authorizationHeader
    const showEditDialog = ref(false)
    const isLoadingInstrumentsIndexStore = ref(false)
    const lawyerStore = useLawyerStore()
    const { getId } = storeToRefs(lawyerStore)
    const notificationStore = useNotificationStore()

    watch(() => getId.value, () => {
        fetchIndex()
    })

    function openEditDialog() {
        showEditDialog.value = true
    }
    function hideEditDialog() {
        showEditDialog.value = false
    }
    function openIndexView(year) {
        try {
            archiveYearIndex.value = year
            fetchIndex(archiveYearIndex.value)
            redirectPath.value = '/protocol-index/year=' + archiveYearIndex.value
            router.push(redirectPath.value)
        } finally {
            // Nothing
        }
    }
    async function fetchIndex(year = currentYear) {
        isLoadingInstrumentsIndexStore.value = true
        try {
            archiveYearIndex.value = year
            const response = await instance.get('download/lawyer/index/' + getId.value + '/' + year)
            if (response.status == 200) {
                index.value = response.data.index
                header.value = response.data.header
                footer.value = response.data.footer
                missingNumbers.value = response.data.missing_numbers
            }
        } finally {
            isLoadingInstrumentsIndexStore.value = false
        }
    }
    async function fetchUpdatedIndex(id, header, footer) {
        isLoadingInstrumentsIndexStore.value = true
        try {
            const response = await instance.get('decorator/lawyer/index/' + getId.value + '/' + currentYear + '?' + 'header=' + header + '&footer=' + footer)
            if (response.status == 200) {
                index.value = response.data.index
                showEditDialog.value = false
            }
        } finally {
            isLoadingInstrumentsIndexStore.value = false
        }
    }

    function getIndexById(indexId) {
        return index.value.find((index) => index.id === indexId)
    }

    return {
        index, header, footer, missingNumbers, isLoadingInstrumentsIndexStore, showEditDialog,
        archiveYearIndex,
        openEditDialog, hideEditDialog, fetchIndex, fetchUpdatedIndex, getIndexById, openIndexView
    }

}, {
    persist: {
        paths: [
            'index', 'header', 'footer', 'missingNumbers', 'archiveYearIndex'
        ]

    }
})