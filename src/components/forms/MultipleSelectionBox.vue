<template>
     <listbox v-model="internalSelectedItems" as="div" multiple>
          <listbox-label class="flex items-center justify-start mt-2 text-gray-600 block text-sm font-medium leading-6">
               <div v-if="isRequired" class="text-red-600">*</div>
               {{ t(title) }}
          </listbox-label>
          <listbox-button class="relative w-full flex items-start border border-gray-300 rounded-md px-3 py-2">
               <div v-if="selectionType === 'isNormal'">
                    <div v-if="internalSelectedItems.length > 0" class="flex flex-wrap gap-2">
                         <div v-for="item in internalSelectedItems" :key="item.id"
                              class="bg-gray-200 rounded-full px-2 py-1 flex items-center">
                              <span class="mr-2 text-sm" @click.stop="toggleSelection(item)">{{ item.name }}</span>
                              <button @click.stop="toggleSelection(item)" type="button"
                                   class="h-4 w-4 rounded-full bg-gray-500 text-gray-200">
                                   <x-mark-icon />
                              </button>
                         </div>
                    </div>
                    <div v-else>
                         NA
                    </div>
                    <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                         <chevron-up-down-icon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
               </div>
               <div v-if="selectionType === 'isEmail'">
                    <div v-if="internalSelectedItems.length > 0" class="flex flex-wrap gap-2">
                         <div as="input" v-for="item in internalSelectedItems" :key="item"
                              class="bg-gray-200 rounded-full px-2 py-1 flex items-center">
                              <span class="mr-2 text-sm" @click.stop="toggleEmail(item)">{{ item.email ? item.email :
                                   item }}</span>
                              <button @click.stop="toggleEmail(item)" type="button"
                                   class="h-4 w-4 rounded-full text-gray-200">
                                   <x-mark-icon class="text-black" />
                              </button>
                         </div>
                    </div>
                    <div v-else>
                         NA
                    </div>
                    <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                         <chevron-up-down-icon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
               </div>

               <div v-if="selectionType === 'isString'">
                    <div v-if="internalSelectedItems.length > 0" class="flex flex-wrap gap-2">
                         <div v-for="item in internalSelectedItems" :key="item"
                              class="bg-gray-200 rounded-full px-2 py-1 flex items-center">
                              <span class="mr-2 text-sm" @click.stop="toggleArray(item)">{{ item }}</span>
                              <button @click.stop="toggleArray(item)" type="button"
                                   class="h-4 w-4 rounded-full bg-gray-500 text-gray-200">
                                   <x-mark-icon />
                              </button>
                         </div>
                    </div>
                    <div v-else>
                         NA
                    </div>
                    <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                         <chevron-up-down-icon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
               </div>
          </listbox-button>
          <!-- OPTIONS -->
          <div class="relative w-full">
               <listbox-options
                    class="absolute  z-40 mt-1 max-h-60 max-h-40 w-full overflow-auto rounded-md bg-white py-2 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm scrollbar-thin scrollbar-thumb-emerald-500 scrollbar-track-emerald-100">
                    <listbox-option v-if="selectionType === 'isNormal'" v-for="item in data" :key="item.id"
                         :value="item">
                         <div
                              class="ml-3 flex h-6 items-center cursor-default select-none py-2 relative flex items-start">
                              <input type="checkbox" :checked="isChecked(item)" @change="toggleSelection(item)"
                                   class="relative mr-2 h-4 w-4 rounded border-gray-300 text-emerald-600" />
                              <div :class="[isChecked(item) ? 'text-emerald-600' : 'text-gray-500']">
                                   {{ item.name }}
                              </div>
                         </div>
                    </listbox-option>
                    <listbox-option v-if="selectionType === 'isEmail'">
                         <form @click.prevent @submit.prevent="addManualEmail"
                              class="flex mb-2 h-6 items-center cursor-default select-none py-3 relative flex items-start">
                              <input v-model="manualEmail" @keyup.enter="addManualEmail" @keydown.stop
                                   class="border rounded-lg p-2 w-full focus:ring-2 focus:ring-emerald-600 transition-all duration-300"
                                   type="text" :placeholder="t('deadlinealert.add-addressee')" />
                         </form>
                         <p v-if="emailError" class="text-red-600 text-sm mt-1">{{ $t('general.not-valid-email') }}
                         </p>
                         <div v-for="item in data" :key="item.email || item" :value="item">
                              <div @click.stop="toggleEmail(item)"
                                   class="w-auto ml-2 flex h-6 items-center cursor-default select-none py-3 relative flex items-start">
                                   <input type="checkbox" :checked="isChecked(item)" @click.stop
                                        @change="toggleEmail(item)"
                                        class="relative mr-2 h-4 w-4 rounded border-gray-300 text-emerald-600" />
                                   <div @click.stop="toggleEmail(item)"
                                        :class="[isChecked(item) ? 'text-emerald-600' : 'text-gray-500']">
                                        {{ item.email || item }}
                                   </div>
                              </div>
                         </div>
                    </listbox-option>

                    <listbox-option v-if="selectionType === 'isString'">
                         <form @click.prevent @submit.prevent="addManualToArray"
                              class="flex h-6 items-center cursor-default select-none py-3 relative flex items-start">
                              <input v-model="manualInArray" @keyup.enter="addManualToArray" @keydown.stop
                                   class="border rounded-lg p-2 w-full focus:ring-2 focus:ring-emerald-600 transition-all duration-300"
                                   type="text" :placeholder="t('deadlinealert.add-parts')" />
                         </form>
                    </listbox-option>
               </listbox-options>
          </div>
     </listbox>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption, ListboxLabel } from '@headlessui/vue'
import { ChevronUpDownIcon, XMarkIcon, ExclamationTriangleIcon } from '@heroicons/vue/20/solid'

const { t } = useI18n()
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
     modelValue: {
          type: [Array, String],
          default: () => []
     },
     title: String,
     typeSelection: {
          type: String,
          default: 'isNormal',
     },
     data: {
          type: [Array, String],
          default: () => []
     },
     isRequired: {
          type: Boolean,
          default: false
     }
})
const selectionType = props.typeSelection
const internalSelectedItems = ref(
     props.typeSelection === 'isString'
          ? (typeof props.modelValue === 'string' ? props.modelValue.split(',') : [])
          : [...props.modelValue]
)
const manualEmail = ref('')
const manualInArray = ref('')
const emailError = ref(false)

const isChecked = (item) => {
     if (props.typeSelection === 'isEmail') {
          return internalSelectedItems.value.includes(item.email ? item.email : item)
     } else if (props.typeSelection === 'isString') {
          return internalSelectedItems.value.includes(item)
     } else {
          return internalSelectedItems.value.some(selectedItem => selectedItem.id === item.id)
     }
}
const toggleSelection = (item) => {
     if (isChecked(item)) {
          internalSelectedItems.value = internalSelectedItems.value.filter(i => i.id !== item.id)
     } else {
          internalSelectedItems.value.push(item)
     }
     emitValues()
}
const toggleEmail = (item) => {
     const email = item.email ? item.email : item;
     if (internalSelectedItems.value.includes(email)) {
          internalSelectedItems.value = internalSelectedItems.value.filter(i => i !== email)
     } else {
          internalSelectedItems.value.push(email)
     }
     emitValues()
}
const addManualEmail = () => {
     const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     emailError.value = !emailReg.test(manualEmail.value)
     if (!emailError.value && manualEmail.value.trim() !== '') {
          internalSelectedItems.value.push(manualEmail.value)
     }
     manualEmail.value = ''
     emitValues()
};
const toggleArray = (item) => {
     if (internalSelectedItems.value.includes(item)) {
          internalSelectedItems.value = internalSelectedItems.value.filter(i => i !== item)
     } else {
          internalSelectedItems.value.push(item)
     }
     emitValues()
}
const addManualToArray = () => {
     if (manualInArray.value !== '' && !internalSelectedItems.value.includes(manualInArray.value)) {
          internalSelectedItems.value.push(manualInArray.value)
     }
     manualInArray.value = ''
     emitValues()
}
const emitValues = () => {
     if (props.typeSelection === 'isString') {
          emit('update:modelValue', internalSelectedItems.value.join(', '))
     } else {
          emit('update:modelValue', internalSelectedItems.value)
     }
}
</script>
