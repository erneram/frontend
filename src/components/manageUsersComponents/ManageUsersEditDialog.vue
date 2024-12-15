<template>
     <DialogCategory ref="createDialog" :isOpen="props.isOpen" @closeModal="handleClose" dialog-size="max-w-4xl">
          <template #title>
               <DialogTitle as="h3" class="text-xl pb-4 font-medium leading-6 text-yellow-600">
                    {{ $t('user-admin.update-user') }}
               </DialogTitle>
          </template>
          <template #body>
               <div>
                    <ManageUsersEditForm :data="actualData" :modules="allModules" />
               </div>
          </template>
     </DialogCategory>
</template>
<script setup>
import { useUserStore } from '@/stores/userStore.js'
import { DialogTitle } from '@headlessui/vue'
import { storeToRefs } from "pinia"
import { ref } from 'vue'

import DialogCategory from "@/components/forms/DialogCategory.vue"
import ManageUsersEditForm from "./ManageUsersEditForm.vue"

const userStore = useUserStore()
const { showUserEditDialog, selectedUser, modules } = storeToRefs(userStore)

const handleClose = (closeModal) => {
     showUserEditDialog.value = closeModal
}
const props = defineProps({
     isOpen: {
          type: Boolean,
          default: false,
     },
})
const actualData = ref(selectedUser)
const allModules = ref(modules)

</script>