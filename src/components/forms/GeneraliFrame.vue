<template>
     <div>
          <iframe :src="blobUrl" frameborder="0" :width="customWidth" :height="customHeight"></iframe>
     </div>
</template>
<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
     source: {
          type: String,
          required: true,
     },
     width: {
          type: String,
          default: "100%"
     },
     height: {
          type: String,
          default: "900px"
     }
})
const customWidth = ref(props.width)
const customHeight = ref(props.height)
const blobUrl = ref('')
const blobUrlReg = /^blob/
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

if (blobUrlReg.test(props.source)) {
     blobUrl.value = props.source
} else {
     const currentIndex = ref(props.source)
     blobUrl.value = createBlobUrl(currentIndex.value)
}



</script>