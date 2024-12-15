<template>
     <nav class="flex" aria-label="Breadcrumb">
          <ol role="list" class="flex items-center">
          <li v-for="(page, index) in props.pages" :key="page.name">
               <div class="flex items-center">
               <ChevronRightIcon v-if="index > 0" class="h-5 w-5 mx-2 flex-shrink-0 text-gray-400" aria-hidden="true" />
               
               <a :href="page.path" class="text-sm font-medium text-gray-500 hover:text-gray-700 flex" :aria-current="page.current ? 'page' : undefined">
                    <component class="w-4 mr-1" :is="page.icon" />
                    {{$t(page.name) }}
               </a>
               </div>
          </li>
          </ol>
     </nav>
</template>
<script setup>
import { ChevronRightIcon } from '@heroicons/vue/20/solid'
const props = defineProps({
     pages: {
          type: Array,
          default: null
     }
})
</script>