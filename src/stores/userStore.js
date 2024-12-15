import { defineStore, storeToRefs } from 'pinia'
import { useLawyerStore } from './lawyerStore.js'
import { useNotificationStore } from './notificationStore.js'
import { ref, computed } from 'vue'
import router from "@/router"
import axios, { AxiosError } from 'axios'
import qs from 'qs'
import instance from '@/stores/axios.js'

export const useUserStore = defineStore('user', () => {
     const user = ref({})
     const firstLogin = ref(false)
     const allUsers = ref([])
     const modules = ref([])
     const isLoadingUserStore = ref(false)
     const showUserEditDialog = ref(false)
     const showUserDeleteDialog = ref(false)
     const showChangePasswordDialog = ref(false)
     const userIsAdmin = ref(false)
     const userIsAssociate = ref(false)
     const userIsLawyer = ref(false)
     const userIsAssistant = ref(false)
     const selectedDetail = ref(null)
     const selectedUser = ref(null)

     const lawyerStore = useLawyerStore()
     const { getId, lawyers } = storeToRefs(lawyerStore)
     const notificationStore = useNotificationStore()
     async function fetchUser(firstLogin = false) {
          isLoadingUserStore.value = true
          try {
               const response = await instance.get('user')
               if (response.status == 200) {
                    user.value = response.data
                    lawyerStore.setIdValue(user.value.lawyer.find(() => true).id)
                    lawyerStore.updateLawyers(user.value.lawyer)
                    if (firstLogin === true) {
                         getUserRole(user.value.roles.map(role => role.id))
                         router.push('/')
                    }
               }
          } finally {
               isLoadingUserStore.value = false
          }
     }
     function getUserRole(roleId) {
          if (roleId == 1) { userIsAdmin.value = true }
          if (roleId == 2) { userIsAssociate.value = true }
          if (roleId == 3) { userIsLawyer.value = true }
          if (roleId == 4) { userIsAssistant.value = true }
     }
     function openUserEditDialog(selectedItem) {
          selectedUser.value = selectedItem
          showUserEditDialog.value = true
     }
     function openUserDeleteDialog(selectedItem) {
          selectedUser.value = selectedItem
          showUserDeleteDialog.value = true
     }
     function openChangePasswordDialog() {
          showChangePasswordDialog.value = true
     }
     function hideEditDeleteDialog() {
          selectedUser.value = null
          showUserEditDialog.value = false
          showUserDeleteDialog.value = false
     }
     function hideChangePasswordDialog() {
          showChangePasswordDialog.value = false
     }
     async function fetchModules() {
          isLoadingUserStore.value = true
          try {
               const response = await instance.get('modules')
               if (response.status == 200) {
                    modules.value = response.data
               }
          } finally {
               isLoadingUserStore.value = false
          }

     }
     async function fetchUsers() {
          isLoadingUserStore.value = true
          try {
               hideEditDeleteDialog()
               const response = await instance.get('users')
               if (response.status == 200) {
                    allUsers.value = response.data
               }
          } finally {
               isLoadingUserStore.value = false
          }
     }
     async function updateUserInformation(id, fields) {
          isLoadingUserStore.value = true
          try {
               const formData = {}
               fields.forEach(field => {
                    formData[field.name] = field.value;
               })
               const config = {
                    headers: {
                         'Content-Type': 'application/x-www-form-urlencoded',
                    }
               }
               await instance.put('users/' + id, qs.stringify(formData), { config })
               notificationStore.addNotification('success', 'action-update-success', 'action-update-success-message')
          } finally {
               fetchUser()
               isLoadingUserStore.value = false
          }
     }
     async function updateContactUser(field, value) {
          isLoadingUserStore.value = true
          try {
               const formData = {}
               formData[field] = value
               const config = {
                    headers: {
                         'Content-Type': 'application/x-www-form-urlencoded',
                    }
               }
               await instance.put('user/' + getId.value, qs.stringify(formData), { config })
               notificationStore.addNotification('success', 'action-update-success', 'action-update-success-message')
          } finally {
               fetchUser()
               isLoadingUserStore.value = false
          }
     }

     async function updatePassword(body) {
          isLoadingUserStore.value = true
          try {
               const formData = { ...body }
               const response = await instance.post('change-password', qs.stringify(formData))
               notificationStore.addNotification('success', 'action-update-success', 'action-update-success-message')
               hideChangePasswordDialog()
          } finally {
               hideChangePasswordDialog()
               isLoadingUserStore.value = false
          }
     }

     function getLawyerById(lawyerId) {
          return lawyers.value.find((lawyer) => lawyer.id === lawyerId)
     }

     function getLawyerNameById(lawyerId) {
          const lawyer = getLawyerById(lawyerId)
          return `${lawyer.firstName} ${lawyer.lastName}`
     }

     function getLoggedInUserName() {
          const currentUser = user.value
          return `${currentUser.first_name} ${user.value.last_name}`
     }
     function getUserById(userId) {
          return allUsers.value.find((user) => user.id === userId)
     }
     function getUserNameById(userId) {
          const user = getUserById(userId)
          return `${user.first_name} ${user.last_name}`
     }

     return {
          selectedUser,
          user, allUsers, modules, selectedDetail, isLoadingUserStore, showUserEditDialog,
          showUserDeleteDialog, firstLogin, userIsAdmin, userIsAssociate, userIsLawyer, userIsAssistant,
          showChangePasswordDialog,
          openUserEditDialog, openUserDeleteDialog, hideEditDeleteDialog, fetchUser, fetchModules,
          fetchUsers, updateUserInformation, getLawyerById, getLawyerNameById,
          openChangePasswordDialog, hideChangePasswordDialog, updatePassword, updateContactUser,
          getUserById, getUserNameById, getLoggedInUserName
     }
}, {
     persist: true
})

