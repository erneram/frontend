<template>
     <!-- <panel> -->
     <div v-if="isLoadingOfficeStore">
          <panel>
               <spinner-loading class="mx-auto" />
          </panel>
     </div>
     <div v-else>
          <panel class="mb-2">
               <div class="flex justify-between mb-4">
                    <p class="font-bold text-3xl mr-4">
                         {{ fullName }}
                    </p>
                    <lawyer-select />
               </div>
               <user-profile-contact-card class="mb-2" />
          </panel>
          <user-profile-show-personal-identification class="mb-2" />
          <user-profile-notarial-offices />
     </div>
     <!-- </panel> -->
     <!-- 
     <user-profile-notarial-office-dialog v-if="showEditCreateNotarialOfficeDialog && selectedOffice !== null"
          @close="hideAllDialogs" :isOpen="showEditCreateNotarialOfficeDialog" :currentLawyerId="getId" />

     <user-profile-notarial-office-delete-dialog v-if="showDeleteNotarialOfficeDialog && selectedOffice !== null"
          @close="hideAllDialogs" :isOpen="showDeleteNotarialOfficeDialog" :currentLawyerId="getId" />

     <user-profile-notarial-office-change-password-dialog v-if="showChangePasswordDialog !== null"
          @close="hideChangePasswordDialog" :isOpen="showChangePasswordDialog" :currentLawyerId="getId" /> -->
</template>
<script setup>
import { useUserStore } from '@/stores/userStore'
import { useOfficeStore } from '@/stores/officesStore'
import { useLawyerStore } from '@/stores/lawyerStore'
import { storeToRefs } from 'pinia'
import { defineAsyncComponent, computed } from "vue"

const UserProfileNotarialOfficeDialog = defineAsyncComponent(() => import('@/components/userProfileComponents/UserProfileNotarialOfficeCreateEditDialog.vue'))
const UserProfileNotarialOfficeDeleteDialog = defineAsyncComponent(() => import('@/components/userProfileComponents/UserProfileNotarialOfficeDeleteDialog.vue'))
const UserProfileNotarialOfficeChangePasswordDialog = defineAsyncComponent(() => import('@/components/userProfileComponents/UserProfileNotarialOfficeChangePasswordDialog.vue'))

import LawyerSelect from '@/components/forms/LawyerSelect.vue'
import SpinnerLoading from '@/components/forms/SpinnerLoading.vue'
import UserProfileContactCard from '@/components/userProfileComponents/UserProfileContactCard.vue'
import UserProfileShowPersonalIdentification from '@/components/userProfileComponents/UserProfileShowPersonalIdentification.vue'
import UserProfileNotarialOffices from '@/components/userProfileComponents/UserProfileNotarialOffices.vue'
import Panel from '@/components/forms/Panel.vue';

const lawyerStore = useLawyerStore()
const { getId } = storeToRefs(lawyerStore)
lawyerStore.fetchPersonalIdentifications()

const userStore = useUserStore()
userStore.fetchUser()

const officeStore = useOfficeStore()
officeStore.fetchLawyerInformation()

const { user, showChangePasswordDialog } = storeToRefs(userStore)
const { hideChangePasswordDialog } = userStore
const fullName = computed(() => `${user.value.first_name} ${user.value.last_name}`)

const { selectedOffice, isLoadingOfficeStore, showEditCreateNotarialOfficeDialog, showDeleteNotarialOfficeDialog, showUpdatePasswordDialog, } = storeToRefs(officeStore)
const { hideAllDialogs } = officeStore

</script>