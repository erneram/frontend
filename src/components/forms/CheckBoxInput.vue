<template>
     <div>
          <custom-label v-if="props.title != ''" :title="props.title" :name="name" />
          <fieldset>
               <div class="mt-2">
                    <div class="ml-4 space-y-6 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                         <div v-for="data in props.data" :key="data.id" class="flex items-center">
                              <input :id="data.id" :name="name" type="radio" :value="data.id" v-model="selected"
                                   @change="emitSelected"
                                   class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                              <label :for="data.id" class="ml-3 block text-sm font-medium leading-6 text-gray-900">{{
                                   $t(data.name)
                              }}</label>
                         </div>
                    </div>
               </div>
          </fieldset>
     </div>
</template>

<script setup>
import CustomLabel from '@/components/forms/CustomLabel.vue'
import { ref, watch } from 'vue'

const emit = defineEmits(['sendSelected']);
const props = defineProps({
     title: String,
     name: String,
     data: {
          type: Object,
     },
     currentSelected: {
          type: Number,
          required: true,
     },
})
const selected = ref(props.currentSelected)
watch(() => props.currentSelected, (newVal) => {
     selected.value = newVal;
});
const emitSelected = () => {
     emit('sendSelected', selected.value)
}

</script>