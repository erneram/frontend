<template>
     <div class="flex justify-center">
          <div v-if="isLoadingInstrumentsIndexStore" class="overflow-visible mr-3 w-[500px] h-[500px]">
               <skeleton-loader width="100%" height="64px" class="mb-2">
                    <spinner-loading v-if="isLoadingInstrumentsIndexStore" />
               </skeleton-loader>

          </div>
          <iframe v-else :src="blobUrl" frameborder="0" width="100%" height="900px"></iframe>
     </div>
</template>

<script setup>
import { useIndexStore } from '@/stores/instrumentsIndexStore.js'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { defineAsyncComponent } from "vue"

const SpinnerLoading = defineAsyncComponent(() => import('@/components/forms/SpinnerLoading.vue'))
const SkeletonLoader = defineAsyncComponent(() => import('../forms/SkeletonLoader.vue'))

const indexStore = useIndexStore()
const { index, isLoadingInstrumentsIndexStore } = storeToRefs(indexStore)

const blobUrl = ref('')
function createBlobUrl(index) {
     const sliceSize = 512
     const byteCharacters = window.atob(index)
     const byteArrays = []
     for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize)
          const byteNumbers = new Array(slice.length)
          for (let i = 0; i < slice.length; i++) {
               byteNumbers[i] = slice.charCodeAt(i)
          }
          const byteArray = new Uint8Array(byteNumbers)
          byteArrays.push(byteArray)
     }
     const blob = new Blob(byteArrays, { type: 'application/pdf' })
     return URL.createObjectURL(blob)
}
const currentIndex = ref(index.value)
blobUrl.value = createBlobUrl(currentIndex.value)

watch(() => index.value, (newIndex) => {
     currentIndex.value = newIndex
     blobUrl.value = createBlobUrl(currentIndex.value)
})

</script>