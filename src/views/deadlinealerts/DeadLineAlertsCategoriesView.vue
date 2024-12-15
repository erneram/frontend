<template>
  <panel>
    <template v-if="isLoading == true">
      <spinner-loading class="mx-auto" />
    </template>
    <template v-else>
      <div class="justify-center z-10">
        <disclosure v-slot="{ open }">
          <accordion-category v-for="category in categoriesData" :open="open" :key="category.id" :category="category" />
        </disclosure>
      </div>
      <div>
        <div class="flex justify-center mt-4 ">
          <action-button-solid-icon icon="PlusIcon" color="text-emerald-500" class=" rounded-md"
            @click="openCreateNewDialog(null)" />
        </div>
      </div>
    </template>
  </panel>
  <create-category-dialog v-if="showCreateNewDialog" @close="hideCreateEditDeleteDialog" :isOpen="showCreateNewDialog"
    :id="selectedCategory" />
  <create-category-dialog v-if="showEditDialog && selectedCategory !== null" @close="hideCreateEditDeleteDialog"
    :isOpen="showEditDialog" :id="selectedCategory" />
  <delete-category-dialog v-if="showDeleteDialog && selectedCategory !== null" @close="hideCreateEditDeleteDialog"
    :isOpen="showDeleteDialog" :id="selectedCategory" />
</template>
<script setup>
import { useDeadLineAlertCategoriesStore } from '@/stores/deadLineAlertCategoriesStore'
import { Disclosure } from '@headlessui/vue'
import { storeToRefs } from "pinia"
import { defineAsyncComponent } from "vue"

const SpinnerLoading = defineAsyncComponent(() => import('@/components/forms/SpinnerLoading.vue'))
const CreateCategoryDialog = defineAsyncComponent(() => import('@/components/deadLineAlertsCategoriesComponents/CreateCategoryDialog.vue'))
const DeleteCategoryDialog = defineAsyncComponent(() => import('@/components/deadLineAlertsCategoriesComponents/DeleteCategoryDialog.vue'))

import Panel from "@/components/forms/Panel.vue"
import AccordionCategory from "@/components/deadLineAlertsCategoriesComponents/AccordionCategory.vue"
import ActionButtonSolidIcon from '@/components/buttons/ActionButtonSolidIcon.vue';

const deadlinealertsStore = useDeadLineAlertCategoriesStore()
const { fetchDeadlinealerts, hideCreateEditDeleteDialog, openCreateNewDialog } = deadlinealertsStore
const { isLoading, categoriesData, selectedCategory, showEditDialog, showCreateNewDialog, showDeleteDialog, } = storeToRefs(deadlinealertsStore)
fetchDeadlinealerts()


</script>
