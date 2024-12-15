import { defineStore, getActivePinia } from 'pinia'
import { useLawyerStore } from './lawyerStore'
import { useUserStore } from '@/stores/userStore'
import { useNotificationStore } from './notificationStore'
import router from "@/router"
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import instance from '@/stores/axios.js'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null);
    const isAuth = ref(false)
    const hasError = ref(null)
    const isLoadingAuthStore = ref(false)
    const token = ref(null)
    const userStore = useUserStore()
    const lawyerStore = useLawyerStore()
    const { isLoadingLawyerStore } = storeToRefs(lawyerStore)
    const { firstLogin, isLoadingUserStore } = storeToRefs(userStore)
    const notificationStore = useNotificationStore()

    async function fetchLogin(username, password) {
        isLoadingAuthStore.value = true
        try {
            const response = await instance.post('oauth/token', {
                grant_type: "password",
                client_id: 1,
                client_secret: "EJzLrkL2qYKE7CUJv1KkDU8kJ5XfraJa5HMWlumN",
                username: username,
                password: password,
            })
            user.value = response.data.user
            token.value = response.data.access_token
            isAuth.value = true
            hasError.value = null
            userStore.fetchUser(true)
            notificationStore.addNotification('success', 'action-login-success', 'action-login-success-message')
        } catch (error) {
            hasError.value = error
            isAuth.value = false
            setTimeout(() => { hasError.value = null }, 3000)
        } finally {
            isLoadingAuthStore.value = false
        }

    }
    async function logout() {
        // map through that list and use the **$reset** fn to reset the state
        // getActivePinia()._s.forEach(store => store.$reset());
        localStorage.clear()
        isLoadingAuthStore.value = true
        user.value = null
        isAuth.value = false
        token.value = null
        hasError.value = null
        isLoadingAuthStore.value = false
        router.push('/login')
        notificationStore.addNotification('logout', 'action-logout-success', 'action-logout-success-message')

    }


    const authorizationHeader = computed(() => ({
        Authorization: `Bearer ${token.value}`
    }))

    return {
        user, isAuth, hasError, isLoadingAuthStore, authorizationHeader, token,
        fetchLogin, logout
    }
}, {
    persist: true
})

