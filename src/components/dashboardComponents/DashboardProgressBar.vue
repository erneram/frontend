<template>
     <p class="pb-4 text-2xl text-center font-medium">{{ $t(props.title) }}</p>
     <div v-if="isLoadingLawyerStore" class="flex w-full justify-center">
          <spinner-loading />
     </div>

     <div v-else>
          <span class="text-lg pb-2 font-bold">{{ $t(props.description) }} - {{ totalProgress }}%</span>
          <general-progress-bar :percentage="totalProgress" />

          <ul class="list-none">
               <li v-for="(item, index) in lawyerProgress" :key="index">
                    <p class="pb-2 mt-2">{{ getLawyerNameById(item.id) }} - {{ item.progress }}%</p>
                    <general-progress-bar :percentage="item.progress" />
               </li>
          </ul>
     </div>
</template>

<script setup>
import { useLawyerStore } from '@/stores/lawyerStore'
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';
import { defineAsyncComponent, computed } from "vue"

const SpinnerLoading = defineAsyncComponent(() => import('@/components/forms/SpinnerLoading.vue'))

import GeneralProgressBar from '@/components/forms/GeneralProgressBar.vue'

const props = defineProps({
     title: {
          type: String,
          default: 'progress-bar.progress-bar',
     },
     description: {
          type: String,
          default: 'progress-bar.general-progress',
     },
})

const { getLawyerNameById } = useUserStore()
const lawyerStore = useLawyerStore()
const { isLoadingLawyerStore, lawyerProgress } = storeToRefs(lawyerStore)
lawyerStore.fetchLawyerProgress()

const totalProgress = computed(() =>
     Math.round(lawyerProgress.value.reduce((carry, lawyerProgress) => carry += lawyerProgress.progress, 0)
          / (lawyerProgress.value.length > 0 ? lawyerProgress.value.length : 1))
) 
</script>