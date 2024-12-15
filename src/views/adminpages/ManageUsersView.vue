<template>
     <panel>
          ADMINISTRAR USUARIOS
          <manage-users-table :users="currentUsers" />
     </panel>
     <manage-users-edit-dialog v-if="showUserEditDialog && selectedUser !== null" @close="hideEditDeleteDialog"
          :isOpen="showUserEditDialog" :modules="allModules" />
     <manage-users-delete-dialog v-if="showUserDeleteDialog && selectedUser !== null" @close="hideEditDeleteDialog"
          :isOpen="showUserDeleteDialog" />
     <notification-alert />
</template>
<script setup>
import { useUserStore } from '@/stores/userStore.js'
import { storeToRefs } from "pinia"
import { ref, watch } from 'vue'
import { defineAsyncComponent } from "vue"

const NotificationAlert = defineAsyncComponent(() => import('@/components/alerts/NotificationAlert.vue'))
const ManageUsersEditDialog = defineAsyncComponent(() => import('@/components/manageUsersComponents/ManageUsersEditDialog.vue'))
const ManageUsersDeleteDialog = defineAsyncComponent(() => import('@/components/manageUsersComponents/ManageUsersDeleteDialog.vue'))

import Panel from '@/components/forms/Panel.vue'
import ManageUsersTable from '@/components/manageUsersComponents/ManageUsersTable.vue'

const userStore = useUserStore()
userStore.fetchUsers()
userStore.fetchModules()

const { hideEditDeleteDialog } = useUserStore()
const { allUsers, modules, selectedUser, showUserEditDialog, showUserDeleteDialog } = storeToRefs(userStore)
const currentUsers = ref(allUsers.value)
const allModules = ref(modules.value)
const userData = ref([])

watch(() => allUsers.value, (newVal) => {
     currentUsers.value = newVal
})

</script>