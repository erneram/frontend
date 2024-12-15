<template>
  <div :class="`border-l-4 border-yellow-400 bg-yellow-50 ${props.containerClass}`">
    <div class="flex">
      <div class="flex-shrink-0">
        <ExclamationTriangleIcon class="h-5 w-5 text-yellow-400" aria-hidden="true" />
      </div>
      <div class="ml-3">
        <custom-label :title="props.title" name="props.name" :textClass="props.alertClass" />
      </div>
    </div>
  </div>
</template>

<script setup>
import CustomLabel from '../forms/CustomLabel.vue';
import { ExclamationTriangleIcon } from '@heroicons/vue/20/solid'

const props = defineProps({
  title: {
    type: String,
    default: 'login.The-user-credentials-were-incorrect'
  },
  name: {
    type: String,
    default: ''
  },
  alertClass: {
    type: String,
    default: 'text-yellow-600'
  },
  containerClass: {
    type: String,
    default: 'p-4'
  }
})
</script>