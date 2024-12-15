<template>
     <Panel>
          <div class="flex flex-col items-center space-y-8">
               <div class="flex items-center space-x-4">
                    <TextInputManagement name="Name" placeholder="user-admin.name" :previous-value="getName"
                         @send-new-value="handleNewName" />
                    <div class="mt-12 p-2">
                         <ActionButtonSolidIcon icon="CheckIcon" color="text-emerald-500" size="h-8 w-8"
                              @click="updateNewName" />
                    </div>
               </div>
               <div class="flex items-center space-x-4">
                    <TextInputManagement name="LastName" placeholder="user-admin.lastname" :previous-value="getLastName"
                         @send-new-value="handleLastName" />
                    <div class="mt-12 p-2">
                         <ActionButtonSolidIcon icon="CheckIcon" color="text-emerald-500" size="h-8 w-8"
                              @click="updateNewLastName" />
                    </div>
               </div>
               <div class="flex items-center space-x-4">
                    <TextInputManagement name="Email" placeholder="user-admin.mail" :previous-value="getEmail"
                         @send-new-value="handleNewEmail" />
                    <div class="mt-12 p-2">
                         <ActionButtonSolidIcon icon="CheckIcon" color="text-emerald-500" size="h-8 w-8"
                              @click="updateNewEmail" />
                    </div>
               </div>
               <div class="flex items-center space-x-4">
                    <TextInputManagement name="Phone" placeholder="user-admin.phone-number" :previous-value="getPhone"
                         @send-new-value="handleNewPhone" />
                    <div class="mt-12 p-2">
                         <ActionButtonSolidIcon icon="CheckIcon" color="text-emerald-500" size="h-8 w-8"
                              @click="updateNewPhone" />
                    </div>
               </div>
               <div class="flex items-center space-x-4">
                    <MultipleSelectionBox @send="handleNewModules" title="user-admin.modules" :data="allModules"
                         :current-data="currentModules" />
                    <div class="mt-12 p-2">
                         <ActionButtonSolidIcon icon="CheckIcon" color="text-emerald-500" size="h-8 w-8"
                              @click="updateNewModules" />
                    </div>
               </div>
          </div>
     </Panel>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore.js'
import { storeToRefs } from "pinia"
import { ref, watch } from 'vue'

import Panel from "@/components/forms/Panel.vue"
import TextInputManagement from "../forms/TextInputManagement.vue"
import ActionButtonSolidIcon from "../buttons/ActionButtonSolidIcon.vue"
import MultipleSelectionBox from "@/components/forms/MultipleSelectionBox.vue"

const userStore = useUserStore()
const emit = defineEmits(['updatedData'])
const props = defineProps({
     data: {
          type: Object,
          required: true
     },
     modules: {
          type: Object,
          required: true
     }
})
const currentId = ref(props.data.id)
const fields = ref([])

const getName = ref(props.data.first_name)
const handleNewName = (newVal) => {
     getName.value = newVal
}
const updateNewName = () => {
     if (getName.value !== props.data.first_name) {
          fields.value.push({ name: "first_name", value: getName.value })
          userStore.updateUserInformation(currentId.value, fields.value)
          fields.value = []
     }
}

const getLastName = ref(props.data.last_name)
const handleLastName = (newVal) => {
     getLastName.value = newVal
}
const updateNewLastName = () => {
     if (getLastName.value !== props.data.last_name) {
          fields.value.push({ name: "last_name", value: getLastName.value })
          userStore.updateUserInformation(currentId.value, fields.value)
          fields.value = []
     }
}

const getEmail = ref(props.data.email)
const handleNewEmail = (newVal) => {
     getEmail.value = newVal
}
const updateNewEmail = () => {
     if (getEmail.value !== props.data.email) {
          fields.value.push({ name: "email", value: getEmail.value })
          userStore.updateUserInformation(currentId.value, fields.value)
          fields.value = []
     }
}

const getPhone = ref(props.data.phone)
const handleNewPhone = (newVal) => {
     getPhone.value = newVal
}
const updateNewPhone = () => {
     if (getPhone.value !== props.data.phone) {
          fields.value.push({ name: "phone", value: getPhone.value })
          userStore.updateUserInformation(currentId.value, fields.value)
          fields.value = []
     }
}
const allModules = ref(props.modules)
const currentModules = ref(props.data.modules)
const handleNewModules = (newVal) => {
     currentModules.value = newVal
}
const updateNewModules = () => {
     if (currentModules.value !== props.data.modules) {
          for (let i = 0; i < currentModules.value.length; i++) {
               const add = currentModules.value[i]
               fields.value.push({ name: `modules[${i}]`, value: add.id })
          }
          userStore.updateUserInformation(currentId.value, fields.value)
          fields.value = []
     }
}
</script>