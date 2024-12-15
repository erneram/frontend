<template>
     <listbox as="div" v-model="currentSelection" class="relative flex-1">
          <div class="relative w-full">
               <listbox-button
                    class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600">
                    <span class="block truncate">
                         <div v-if="selectedOption">
                              <div v-if="selectedOption.id">
                                   <p> {{ selectedOption.id }} - {{ selectedOption.firstName }} {{
                                        selectedOption.lastName }}</p>
                              </div>
                              <div v-else>{{ selectedOption }}</div>
                         </div>
                         <div v-else>
                              {{ $t(props.placeholder) }}
                         </div>
                    </span>
                    <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                         <chevron-up-down-icon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
               </listbox-button>
               <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100"
                    leave-to-class="opacity-0">
                    <listbox-options
                         class="fixed z-[100] mt-1 max-h-60 w-fit overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                         <listbox-option as="template" v-for="option in currentOptions" :key="option"
                              :value="option.id || option" v-slot="{ active, currentSelection }">
                              <li
                                   :class="[active ? 'bg-emerald-400 text-white' : 'text-emerald-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
                                   <span
                                        :class="[currentSelection ? 'font-semibold text-emerald-500' : 'font-normal text-black', 'block truncate']">
                                        <div v-if="option.id" class="flex">
                                             <p>{{ option.id }} - {{ option.firstName }} {{ option.lastName }}</p>
                                        </div>
                                        <div v-else>
                                             <p>{{ option }}</p>
                                        </div>
                                   </span>
                                   <span v-if="currentSelection"
                                        :class="[active ? 'text-white' : 'text-green-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                                        <check-icon class="h-5 w-5 text-emerald-500" aria-hidden="true" />
                                   </span>
                              </li>
                         </listbox-option>
                    </listbox-options>
               </transition>
          </div>
     </listbox>
</template>

<script setup>
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import { ref, watch } from 'vue'
import { useLawyerStore } from '@/stores/lawyerStore'

const emit = defineEmits(['idSelected'])
const props = defineProps({
     options: {
          type: Array,
          required: true,
     },
     placeholder: {
          default: "general.select-option"
     }
})
const lawyerStore = useLawyerStore()

const currentOptions = ref(props.options)
const currentSelection = ref(null)
const selectedOption = ref(null)

// watch(() => props.options, (newVal) => {
//      currentOptions.value = newVal
//      currentSelection.value = null
//      selectedOption.value = null
// })

watch(() => currentSelection.value, (newVal) => {
     emit('idSelected', newVal)
     selectedOption.value = lawyerStore.getLawyerById(newVal) || newVal
})
</script>
