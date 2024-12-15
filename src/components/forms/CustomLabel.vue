<template>
  <div class="flex items-center justify-start">
    <div v-if="isRequired" class=" text-red-600">*</div>
    <label :for="props.name" :class="[props.textClass, 'block leading-6', props.textSize]">{{ $t(props.title)
      }}</label>
  </div>
</template>
<script setup>
import { ExclamationTriangleIcon } from '@heroicons/vue/24/solid'
const props = defineProps({
  name: String,
  title: String,
  textClass: {
    type: String,
    default: 'text-gray-600'
  },
  textSize: {
    type: String,
    default: 'text-sm font-medium'
  },
  isRequired: {
    type: Boolean,
    default: false
  }
})
</script>