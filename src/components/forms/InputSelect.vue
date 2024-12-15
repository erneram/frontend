<template>
     <div>
          <custom-label v-if="props.title !== ''" :title="props.title" :name="props.name" :is-required="isRequired" />
          <listbox v-model="selected" class="flex-1">
               <div class="relative w-full">
                    <listbox-button
                         class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600">
                         <span class="block truncate">{{ selected?.name }}</span>
                         <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                              <chevron-up-down-icon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                         </span>
                    </listbox-button>

                    <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100"
                         leave-to-class="opacity-0">
                         <listbox-options
                              class="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              <listbox-option as="template" v-if="data.length > 0" v-for="option in props.data"
                                   :key="option.id" :value="option" v-slot="{ active, selected }">
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
                              <listbox-option v-else :value="null" disabled>
                                   <li class="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-500">
                                        <span class="block truncate">
                                             {{ $t('general.no-data-available') }}
                                        </span>
                                   </li>
                              </listbox-option>
                         </listbox-options>
                    </transition>
               </div>
          </listbox>
     </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import CustomLabel from '@/components/forms/CustomLabel.vue'

const props = defineProps({
     name: String,
     data: {
          type: Array,
          default: () => []
     },
     title: String,
     modelValue: {
          type: [Array, Object, String, Number],
          default: () => []
     },
     inputType: {
          type: String,
          default: "normal",
     },
     isRequired: {
          type: Boolean,
          default: false
     }
})
const emit = defineEmits(['update:modelValue'])
const selected = ref(props.data[0] || props.modelValue || '')
function initializeSelected() {
     if (props.inputType === "country") {
          if (Array.isArray(props.modelValue) && props.modelValue.length > 0) {
               selected.value = props.data.find(option => option.id === props.modelValue[0].id)
          } else if (props.modelValue.length > 0 && typeof props.modelValue === 'object') {
               selected.value = props.data.find(option => option.id === props.modelValue.id)
          } else if (props.data.length > 0) {
               selected.value = props.data[0]
          } else {
               selected.value = { id: 0, name: "País" }
          }
     } else if (props.inputType === "normal") {
          if (typeof props.modelValue === 'number') {
               selected.value = props.data.find(option => option.id === props.modelValue)
          } else if (typeof props.modelValue === 'object') {
               selected.value = props.data.find(option => option.id === props.modelValue.id) || props.data[0]
          } else if (Object.keys(props.data).length > 0) {
               selected.value = props.data[0]
          } else {
               selected.value = { id: 0, name: 'N/A' }
          }
     }
}
initializeSelected()
watch(selected, (newValue) => {
     emit('update:modelValue', newValue)
})
</script>
