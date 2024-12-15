<template>
     <Panel>
          <div class="flex flex-col items-center space-y-8">
               <div class="flex items-center space-x-4">
                    <TextInputManagement name="Personal-identification-document"
                         placeholder="lawyer-admin.personal-identification-document" :previous-value="getDpi"
                         @send-new-value="handleNewDpi" />
                    <div class="mt-12 p-2">
                         <div :disabled="getDpi !== data.dpi">
                              <ActionButtonSolidIcon icon="CheckIcon" color="text-emerald-500" size="h-8 w-8"
                                   @click="updateNewDpi" />
                         </div>
                    </div>
               </div>
               <div class="flex items-center space-x-4">
                    <TextInputManagement name="Agp-key" placeholder="lawyer-admin.agp-key" :previous-value="getAgpkey"
                         @send-new-value="handleNewAgpkey" />
                    <div class="mt-12 p-2">
                         <ActionButtonSolidIcon icon="CheckIcon" color="text-emerald-500" size="h-8 w-8"
                              @click="updateNewAgpkey" />
                    </div>
               </div>
               <div class="flex items-center space-x-4">
                    <TextInputManagement name="Number" placeholder="lawyer-admin.number" :previous-value="getNumber"
                         @send-new-value="handleNewNumber" />
                    <div class="mt-12 p-2">
                         <ActionButtonSolidIcon icon="CheckIcon" color="text-emerald-500" size="h-8 w-8"
                              @click="updateNewNumber" />
                    </div>
               </div>
               <div class="flex items-center space-x-4">
                    <TextInputManagement name="Birthdate" placeholder="lawyer-admin.birthdate"
                         :previous-value="getBirthdate" @send-new-value="handleNewBirthdate" />
                    <div class="mt-12 p-2">
                         <ActionButtonSolidIcon icon="CheckIcon" color="text-emerald-500" size="h-8 w-8"
                              @click="updateNewBirthdate" />
                    </div>
               </div>

          </div>
     </Panel>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useLawyerStore } from '@/stores/lawyerStore.js'

import Panel from '@/components/forms/Panel.vue'
import TextInputManagement from "../forms/TextInputManagement.vue"
import ActionButtonSolidIcon from "../buttons/ActionButtonSolidIcon.vue"

const emit = defineEmits(['updatedData'])
const props = defineProps({
     data: {
          type: Object,
          required: true
     },
})
const lawyerStore = useLawyerStore()
const currentId = ref(props.data.id)
const temporalBody = ref({})
const fields = ref([])

const getDpi = ref(props.data.dpi || null)
const handleNewDpi = (newVal) => {
     getDpi.value = newVal
}
const updateNewDpi = () => {
     if (getDpi.value !== props.data.dpi) {
          fields.value.push({ name: "dpi", value: getDpi.value })
          lawyerStore.updateLawyerInformation(currentId.value, fields.value)
          fields.value = []
     }
}

const getAgpkey = ref(props.data.agp_key)
const handleNewAgpkey = (newVal) => {
     getAgpkey.value = newVal
}
const updateNewAgpkey = () => {
     if (getAgpkey.value !== props.data.agp_key) {
          fields.value.push({ name: "agp_key", value: getAgpkey.value })
          lawyerStore.updateLawyerInformation(currentId.value, fields.value)
          fields.value = []
     }
}

const getNumber = ref(props.data.number)
const handleNewNumber = (newVal) => {
     getNumber.value = newVal
}
const updateNewNumber = () => {
     if (getNumber.value !== props.data.number) {
          fields.value.push({ name: "number", value: getNumber.value })
          lawyerStore.updateLawyerInformation(currentId.value, fields.value)
          fields.value = []
     }
}

const getBirthdate = ref(props.data.birthdate)
const handleNewBirthdate = (newVal) => {
     getBirthdate.value = newVal
}
const updateNewBirthdate = () => {
     temporalBody.value = { birthdate: getBirthdate.value }
     if (getBirthdate.value !== props.data.birthdate) {
          fields.value.push({ name: "birthdate", value: getBirthdate.value })
          lawyerStore.updateLawyerInformation(currentId.value, fields.value)
          fields.value = []
     }
}


</script>