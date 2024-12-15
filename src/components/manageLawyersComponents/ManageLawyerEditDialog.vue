<template>
     <DialogCategory ref="createDialog" :isOpen="props.isOpen" @closeModal="handleClose" dialog-size="max-w-4xl">
          <template #title>
               <DialogTitle as="h3" class="text-xl pb-4 font-medium leading-6 text-yellow-600">
                    {{ $t('user-admin.update-user') }}
               </DialogTitle>
          </template>
          <template #body>
               <div>
                    <manageLawyerEditForm :data="actualData" />
               </div>
          </template>
     </DialogCategory>
</template>
<script setup>
import { useLawyerStore } from '@/stores/lawyerStore.js'
import { DialogTitle } from '@headlessui/vue'
import { storeToRefs } from "pinia"
import { ref } from 'vue'

import DialogCategory from "@/components/forms/DialogCategory.vue"
import manageLawyerEditForm from "./ManageLawyerEditForm.vue"

const lawyerStore = useLawyerStore()
const { showLawyerEditDialog, selectedLawyer } = storeToRefs(lawyerStore)
const handleClose = (closeModal) => {
     showLawyerEditDialog.value = closeModal
}
const props = defineProps({
     isOpen: {
          type: Boolean,
          default: false,
     },
})
const actualData = ref(selectedLawyer.value)

</script>