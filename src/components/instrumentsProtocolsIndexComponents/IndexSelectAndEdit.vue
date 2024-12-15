<template>
     <div class="flex m-2 mb-4">
          <lawyer-select class="w-[100%]" />
          <action-button-solid-icon icon="PencilIcon" color="text-emerald-600" @click="openEditDialog()" />
     </div>
</template>
<script setup>
import { useIndexStore } from '@/stores/instrumentsIndexStore.js'
import { useLawyerStore } from '@/stores/lawyerStore.js'
import { storeToRefs } from 'pinia'

import LawyerSelect from '@/components/forms/LawyerSelect.vue'
import ActionButtonSolidIcon from '@/components/buttons/ActionButtonSolidIcon.vue'

//Lawyer
const lawyerStore = useLawyerStore()
const { lawyers, getId } = storeToRefs(lawyerStore)
const lawyerList = lawyers.value
const currentSelection = getId.value


const indexStore = useIndexStore()
const { openEditDialog } = indexStore

</script>