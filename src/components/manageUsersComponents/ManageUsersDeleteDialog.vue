<template>
     <DialogCategory ref="createDialog" :isOpen="props.isOpen" @closeModal="handleClose" dialog-size="max-w-lg">
          <template #title>
               <DialogTitle as="h3" class="text-xl pb-4 font-medium leading-6 text-yellow-600">
                    {{ $t('user-admin.delete-user') }}
               </DialogTitle>
          </template>
          <template #body>
               <p>{{ $t('general.open-question-mark') }}{{ $t('user-admin.delete-warning') }} {{ getName }} {{
                    getLastname }}{{ $t('general.close-question-mark') }} </p>
          </template>
          <template #buttons>
               <PrimaryButton :isDisabled="isLoadingUserStore && data !== null" type="button" @click="killInstrument()"
                    bgColor="red">
                    <SpinnerLoading v-if="isLoadingUserStore && data !== null"></SpinnerLoading>
                    <div v-else>{{ $t('user-admin.delete-button') }}</div>
               </PrimaryButton>
          </template>
     </DialogCategory>
</template>
<script setup>
import { useUserStore } from '@/stores/userStore.js'
import { DialogTitle } from '@headlessui/vue'
import { storeToRefs } from "pinia"
import { ref } from 'vue'
import { defineAsyncComponent } from "vue"

const SpinnerLoading = defineAsyncComponent(() => import('@/components/forms/SpinnerLoading.vue'))
import DialogCategory from "@/components/forms/DialogCategory.vue"
import PrimaryButton from "@/components/forms/PrimaryButton.vue"

const userStore = useUserStore()
const { showUserDeleteDialog, isLoadingUserStore, selectedUser } = storeToRefs(userStore)

const handleClose = (closeModal) => {
     showUserDeleteDialog.value = closeModal
}
const props = defineProps({
     isOpen: {
          type: Boolean,
          default: false,
     },
})

const getName = ref(selectedUser.value.first_name)
const getLastname = ref(selectedUser.value.last_name)



</script>