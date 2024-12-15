<template>
  <div>
    <custom-label v-if="props.title != ''" :title="props.title" :name="props.name" :is-required="isRequired" />
    <div :class="{ 'mt-2': props.title !== 'general.empty' }"></div>
    <div v-if="type === 'checkbox'" class="flex justify-center space-x-2 ">
      <input v-model="value" :type="type || 'text'" required
        :class="['w-6 h-6 text-emerald-500 rounded border-gray-300 focus:ring-emerald-500', props.validationError || setTimeClass ? props.inputClassError : 'focus:ring-2 focus:ring-emerald-300']"
        @input="search" @focusout="handleNewInput" :autocomplete="props.autocompleteValue" />
    </div>
    <div v-else>
      <input v-model="value" :type="type || 'text'" required
        :class="['block w-full rounded-md border-0 py-1.5 text-gray-900 shadow ring-1 ring-inset sm:text-sm sm:leading-6 px-2', props.validationError || setTimeClass ? props.inputClassError : 'focus:ring-2 focus:ring-emerald-300 ring-1 ring-emerald-500']"
        :placeholder="$t(props.inputPlaceholder)" @input="search" @focusout="handleNewInput"
        :autocomplete="props.autocompleteValue" />
    </div>
    <span>{{ $t(localMessage) }}</span>
  </div>
</template>

<script setup>
import { useField } from 'vee-validate'
import { ref, watch } from 'vue';
import CustomLabel from '@/components/forms/CustomLabel.vue'

const props = defineProps({
  name: {
    type: String,
    default: 'general.empty'
  },
  type: {
    type: String,
    default: 'general.empty'
  },
  inputClassError: {
    type: String,
    default: 'ring-red-300 focus:ring-red-600'
  },
  validationError: {
    type: Boolean,
    default: false
  },
  inputPlaceholder: {
    type: String,
    default: 'general.empty'
  },
  title: {
    type: String,
    default: 'general.empty'
  },
  emitNewInput: {
    type: Boolean,
    default: false
  },
  autocompleteValue: {
    type: Boolean,
    default: false
  },
  isRequired: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['updateValue'], ['newInput'])

const search = (e) => {
  emit('updateValue', e.target.value)
}

const handleNewInput = (e) => {
  if (props.emitNewInput) {
    emit('newInput', props.name, e.target.value)
  }
}

const { value, errorMessage } = useField(() => props.name)
const localMessage = ref('general.empty')
const setTimeClass = ref(false)
let waitingTime = null
watch(value, () => {
  localMessage.value = 'general.empty'
  setTimeClass.value = false
  clearTimeout(waitingTime)
  waitingTime = setTimeout(() => {
    localMessage.value = "vee-validate." + errorMessage.value
    if (errorMessage.value) {
      setTimeClass.value = true
    }
  }, 5000)
})
</script>
