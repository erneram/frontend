<template>
     <form action="#" method="GET">
          <custom-label :title="props.title" :textClass="props.alertClass" />
          <input type="date" @input="search" id="date" v-model="inputValue"
               class="mt-2 block w-full cursor-pointer rounded-md border border-gray-100 bg-gray-100 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
     </form>
</template>
<script setup>
import CustomLabel from '@/components/forms/CustomLabel.vue'
import { computed, ref, watch } from 'vue'

const props = defineProps({
     title: String,
     alertClass: String,
     clearText: Boolean,
})
const emit = defineEmits(['search'])
const inputValueRef = ref('')
const search = (e) => {
     inputValueRef.value = e.target.value
     emit('search', e.target.value)
}
const inputValue = computed(() => {
     return props.clearText ? inputValueRef.value = '' : inputValueRef.value
})
</script>