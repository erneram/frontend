<template>
  <div class="w-full pt-2 ">
    <div class="border-emerald-400">
      <disclosure v-slot="{ open }">
        <disclosure-button
          class="flex justify-between w-full rounded-lg px-4 py-2 text-left text-sm font-medium text-emerald-900 shadow focus:outline-none focus-visible:ring focus-visible:ring-emerald-500/75"
          :class="{ 'cursor-pointer': category.children.length > 0, 'cursor-default': category.children.length === 0 }">
          <div class="flex flex-col">
            <span class="mr-2 text-black">{{ category.name }}</span>
            <div class="text-xs text-gray-400 inset-x-0 bottom-0">{{ category.description }}</div>
          </div>
          <span class="flex items-center">
            <chevron-down-icon v-if="category.children.length > 0" :class="open ? 'rotate-180 transform' : ''"
              class="h-5 ml-10 mx-3 text-black-500 hover:bg-white" />
            <div @click.stop class="flex gap-x-2">
              <action-button-outline-icon icon="FolderPlusIcon" @click="openCreateNewDialog(category.id)" />
              <action-button-outline-icon icon="PencilIcon" @click="openEditDialog(category.id)" />
              <action-button-outline-icon icon="TrashIcon" color="text-red-800"
                @click="openDeleteDialog(category.id)" />
            </div>
          </span>
        </disclosure-button>
        <disclosure-panel v-if="category.children.length > 0" class="space-y-2 pl-4 text-sm text-gray-500">
          <ul>
            <li v-for="child in category.children " :key="child.id">
              <accordion-category v-if="child.children" :category="child" />
            </li>
          </ul>
        </disclosure-panel>
      </disclosure>
    </div>
  </div>
</template>
<script setup>
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { useDeadLineAlertCategoriesStore } from "@/stores/deadLineAlertCategoriesStore"
import AccordionCategory from "@/components/deadLineAlertsCategoriesComponents/AccordionCategory.vue"
import ActionButtonOutlineIcon from "@/components/buttons/ActionButtonOutlineIcon.vue"

const deadlinealertsStore = useDeadLineAlertCategoriesStore()
const { openCreateNewDialog, openEditDialog, openDeleteDialog } = deadlinealertsStore
defineProps({
  category: Object,
})
</script>