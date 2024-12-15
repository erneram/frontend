<template>
  <div class="rounded-md bg-red-50 p-4">
    <div class="flex">
      <div class="flex-shrink-0">
        <XCircleIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
      </div>
      <div class="ml-3">
        <custom-label :title="props.title" name="props.name" :textClass="props.alertClass" />
      </div>
    </div>
  </div>
</template>

<script setup>
import CustomLabel from '@/components/forms/CustomLabel.vue'
import { XCircleIcon } from '@heroicons/vue/20/solid'

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
    default: 'text-red-600'
  }
})
</script>