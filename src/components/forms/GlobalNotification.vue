<template>
     <div aria-live="assertive" class="pointer-events-none fixed inset-0 top-20 flex items-end px-2 py-6 sm:items-start sm:p-6">
          <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
               <transition 
                    enter-active-class="transform ease-out duration-300 transition" 
                    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2" 
                    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" 
                    leave-active-class="transition ease-in duration-100" 
                    leave-from-class="opacity-100" 
                    leave-to-class="opacity-0" >
                    <div v-if="show" class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                         <div class="p-4 flex justify-between items-center">
                              <slot/>
                              <button type="button" @click="show = false" class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                   <XMarkIcon class="h-5 w-5" aria-hidden="true" />
                              </button>
                         </div>
                    </div>
               </transition>
          </div>
     </div>
</template>

<script setup>
import { ref } from 'vue'
import { XMarkIcon } from '@heroicons/vue/20/solid'

const show = ref(true)
</script>