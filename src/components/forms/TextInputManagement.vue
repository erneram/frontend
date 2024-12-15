<template>
     <div>
          <CustomLabel :title="placeholder" class="mt-2" />
          <div class="flex items-center mt-4">
               <div class="mx-8 w-48 truncate">{{ previousValue }}</div>
               <ActionButtonSolidIcon icon="ArrowLongRightIcon" color="text-gray-500" size="h-8 w-8" class="ml-2" />
               <TextInput inputClassError="ring-yellow-300 focus:ring-yellow-600" :name="identifierName" type="text"
                    :inputPlaceholder='placeholder' class="ml-4" @updateValue="handleNewInput" />
          </div>
     </div>
</template>
<script setup>
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import ActionButtonSolidIcon from "../buttons/ActionButtonSolidIcon.vue"
import CustomLabel from "../forms/CustomLabel.vue"
import TextInput from "../forms/TextInput.vue"
import * as yup from 'yup'

const emit = defineEmits(['sendNewValue'])
const props = defineProps({
     name: {
          type: String,
     },
     placeholder: {
          type: String,
          required: true
     },
     previousValue: {
          type: String,
          required: true
     }

})
const placeholder = ref(props.placeholder)
const previousValue = ref(props.previousValue)
const identifierName = ref(props.name)
const { values } = useForm({
     validationSchema: yup.object({
          identifierName: yup.number().required(),
     })
})
const handleNewInput = (newValue) => {
     emit('sendNewValue', newValue)
}

</script>