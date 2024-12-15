<template>
     <div v-if="isLoadingLawyerStore">
          <spinner-loading class="mx-auto" />
     </div>
     <div v-else>
          <listbox as="div" v-model="selected" class="flex-1" @change="updateId">
               <div class="relative w-full">
                    <listbox-button
                         class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 ">
                         <span class="block truncate">
                              {{ selected.id }} - {{ selected.firstName }} {{ selected.lastName }}
                         </span>
                         <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                              <chevron-up-down-icon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                         </span>
                    </listbox-button>

                    <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100"
                         leave-to-class="opacity-0">
                         <listbox-options
                              class="absolute z-40 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              <listbox-option as="template" v-for="option in lawyers" :key="option.id" :value="option"
                                   v-slot="{ active, selected }">
                                   <li
                                        :class="[active ? 'bg-emerald-400 text-white' : 'text-emerald-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
                                        <span :class="[selected ? 'font-semibold text-emerald-500' : 'font-normal text-black', 'block truncate']"
                                             @click="updateId(option.id)">
                                             {{ option.id }} - {{ option.firstName }} {{ option.lastName }}
                                        </span>
                                        <span v-if="selected"
                                             :class="[active ? 'text-white' : 'text-green-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                                             <CheckIcon class="h-5 w-5 text-emerald-500" aria-hidden="true" />
                                        </span>
                                   </li>
                              </listbox-option>
                         </listbox-options>
                    </transition>
               </div>
          </Listbox>
     </div>
</template>
<script setup>
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import { ref, watch } from 'vue'
import { useLawyerStore } from '@/stores/lawyerStore.js'
import { storeToRefs } from 'pinia'

import SpinnerLoading from '@/components/forms/SpinnerLoading.vue'

const emit = defineEmits(['idSelected'])
const props = defineProps({
     options: {
          type: Array,
     },
     currentSelection: {
          type: Number,
          default: 0,
     }
})

const lawyerStore = useLawyerStore()
const { lawyers, getId, isLoadingLawyerStore } = storeToRefs(lawyerStore)
const selected = ref(lawyerStore.getLawyerById(getId.value))
const updateId = (newId) => {
     lawyerStore.updateCurrentLawyer(newId)
     selected.value = lawyerStore.getLawyerById(newId)
}
watch(selected.value, updateId)
</script>