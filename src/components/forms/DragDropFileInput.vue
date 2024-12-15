<template>
     <div class="flex justify-center items-center mb-2 outline-dotted" @dragover.prevent="onDragOver"
          @dragleave.prevent="onDragLeave" @drop.prevent="onDrop">
          <div :disabled="isDragging">
               <input ref="filePdf" class="hidden" @change="handleFilePdf" id="filePdf_input" type="file"
                    accept="application/pdf">
               <div class="flex items-center m-4">
                    <ActionButtonSolid v-if="!filePdfUploaded" icon="ArrowUpTrayIcon" size="h-6 w-6"
                         color="text-emerald-800" @click="triggerFilePdf" />
                    <a @click="triggerFilePdf" class="ml-2" role="button">{{
                         $t(title)
                         }}</a>
                    <ActionButtonSolid v-if="filePdfUploaded" icon="CheckCircleIcon" size="h-6 w-6 mr-1" />
               </div>
          </div>
     </div>
</template>
<script setup>
import ActionButtonSolid from '@/components/buttons/ActionButtonSolidIcon.vue'
import { ref } from 'vue'

const emit = defineEmits(['sendFiles'])
const props = defineProps({
     data: {
          type: [String, File, Object],
          required: false
     },
     title: {
          type: String,
          required: true
     }
})

const filePdf = ref(null)
const filePdfUploaded = ref(!!props.data)
const uploadedFile = ref(props.data || null)
const triggerFilePdf = () => {
     filePdf.value.click()
}
const handleFilePdf = (event) => {
     const files = event.target.files;
     if (files.length > 0) {
          filePdfUploaded.value = true
          emit('sendFiles', files[0])
     } else {
          filePdfUploaded.value = false
     }
};

const isDragging = ref(false)
const onDragOver = () => {
     isDragging.value = true
}

const onDragLeave = () => {
     isDragging.value = false
}
const onDrop = (event) => {
     event.preventDefault()
     const files = event.dataTransfer.files
     if (files.length > 0) {
          filePdfUploaded.value = true
          uploadedFile.value = files[0]
          emit('sendFiles', uploadedFile.value)
     } else {
          filePdfUploaded.value = false
     }
     isDragging.value = false
}
</script>
