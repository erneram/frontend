<template>
    <panel>
        <instruments-categories-table />
    </panel>
    <instruments-delete-categories v-if="showDeleteDialog && selectedCategory !== null"
        @close="hideEditDeleteCreateDialog" :isOpen="showDeleteDialog" :id="selectedCategory" />
    <instruments-create-category v-if="showCreateDialog !== false" @close="hideEditDeleteCreateDialog"
        :isOpen="showCreateDialog" />
    <instruments-create-category v-if="showEditDialog && selectedCategory !== null" @close="hideEditDeleteCreateDialog"
        :isOpen="showEditDialog" :id="selectedCategory" />
</template>
<script setup>
import { useInstrumentsCategoriesStore } from '@/stores/instrumentsCategoriesStore'
import { storeToRefs } from "pinia"
import { defineAsyncComponent } from "vue";

const InstrumentsDeleteCategories = defineAsyncComponent(() => import('@/components/instrumentsCategoriesComponents/instrumentsDeleteCategory.vue'))
const InstrumentsCreateCategory = defineAsyncComponent(() => import('@/components/instrumentsCategoriesComponents/instrumentsCreateCategory.vue'))

import Panel from '@/components/forms/Panel.vue'
import InstrumentsCategoriesTable from '@/components/instrumentsCategoriesComponents/InstrumentsCategoriesTable.vue'

const instrumentsCategoriesStore = useInstrumentsCategoriesStore()
const { hideEditDeleteCreateDialog } = useInstrumentsCategoriesStore()
const { showEditDialog, showDeleteDialog, showCreateDialog, selectedCategory } = storeToRefs(instrumentsCategoriesStore)

</script>