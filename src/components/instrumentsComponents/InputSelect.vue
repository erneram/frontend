<template>
     <listbox as="div" v-model="selected" class="flex-1" @change="updateId">
          <div class="relative w-full">
               <listbox-button
                    class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 ">
                    <span class="block truncate"> {{ selected.name }}
                    </span>
                    <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                         <chevron-up-down-icon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
               </listbox-button>
               <listbox-options
                    class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    <listbox-option as="template" v-for="option in correctedOptions" :key="option.id" :value="option"
                         v-slot="{ active, selected }">
                         <li
                              :class="[active ? 'bg-emerald-400 text-white' : 'text-emerald-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
                              <span
                                   :class="[selected ? 'font-semibold text-emerald-500' : 'font-normal text-black', 'block truncate']">
                                   {{ option.name }}
                              </span>
                              <span v-if="selected"
                                   :class="[active ? 'text-white' : 'text-green-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                                   <check-icon class="h-5 w-5 text-emerald-500" aria-hidden="true" />
                              </span>
                         </li>
                    </listbox-option>
               </listbox-options>
          </div>
     </listbox>
</template>

<script setup>
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import { ref, watch } from 'vue'

const emit = defineEmits(['selectedInput'])
const props = defineProps({
     options: {
          type: Array,
     },
     parts: {
          type: Object,
     },
     currentSelection: {
          type: Number,
          default: 0,
     },
     currentIdView: {
          type: Number,
     }
})
const correctedOptions = ref([])
const constructOption = ref([])
const idInstrumentDocument = ref('')
const updateCorrectedOptions = () => {
     correctedOptions.value = []
     constructOption.value = []
     idInstrumentDocument.value = ''
     correctedOptions.value.push(constructOption.value = {
          document_id: `${props.currentIdView}`,
          name: `Sin documentos`,
     })
     props.options.forEach(item => {
          if (item.has_parts) {
               props.parts.forEach(part => {
                    constructOption.value = {
                         general_id: `${props.currentIdView}`,
                         document_id: `${item.document_id}`,
                         id: `${part.id}`,
                         name: `${item.name} - ${part.name}`,
                    }
                    idInstrumentDocument.value = `${props.currentIdView}/${item.document_id}/${part.id}`
                    correctedOptions.value.push(constructOption.value)
               })
          } else {
               correctedOptions.value.push(constructOption.value = {
                    general_id: `${props.currentIdView}`,
                    document_id: `${item.document_id}`,
                    id: `0`,
                    name: `${item.name}`,
               })
          }
     })
}
updateCorrectedOptions()
watch(() => [props.options, props.parts], updateCorrectedOptions)
const selected = ref(correctedOptions.value[props.currentSelection])
const updateId = () => {
     emit('selectedInput', selected.value)
}
watch(selected, updateId)
</script>
