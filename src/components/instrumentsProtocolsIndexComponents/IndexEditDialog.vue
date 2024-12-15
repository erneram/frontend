<template>
     <dialog-category ref="createDialog" :isOpen="props.isOpen" @closeModal="handleClose" dialog-size="max-w-3xl">
          <template #title>
               <dialog-title as="h3" class="text-xl pb-4 font-medium leading-6 text-emerald-600">
                    {{ $t(selectedHeader) }}
               </dialog-title>
          </template>
          <template #body>
               <div v-if="isLoadingInstrumentsIndexStore">
                    <skeleton-loader width="100%" height="128px" class="mb-2 w-64" />
               </div>
               <div v-else>
                    <tab-group>
                         <tab-list class="flex space-x-1 rounded-xl bg-emerald-900/20 p-1">
                              <tab v-for="(editable, index) in header" as="template" :key="index" v-slot="{ selected }">
                                   <button @click="setHtmlToDisplay(index)" :class="[
                                        'w-full rounded-lg py-2.5 text-sm font-medium leading-5 uppercase',
                                        'ring-white/60 ring-offset-2 ring-offset-emerald-400 focus:outline-none focus:ring-2',
                                        selected
                                             ? 'bg-white text-emerald-700 shadow'
                                             : 'text-emerald-900 hover:bg-emerald/[0.12] hover:text-white']">
                                        {{ $t(editable) }}
                                   </button>
                              </tab>
                         </tab-list>
                         <tab-panels class="mt-2">
                              <QuillEditor ref="quillEditor" theme="snow" toolbar="full"
                                   :content="cleanText(selectedContent)" content-type="html" class="custom-quill-editor"
                                   @textChange="handleTextChange" />
                         </tab-panels>
                    </tab-group>
               </div>
          </template>
          <template #buttons>
               <primary-button :isDisabled="isLoadingInstrumentsIndexStore" type="button"
                    @click="updateHeaderAndFooter()">
                    <spinner-loading v-if="isLoadingInstrumentsIndexStore" />
                    <div v-else class="uppercase">{{ $t('general.update') }}</div>
               </primary-button>
          </template>
     </dialog-category>
</template>
<script setup>
import { DialogTitle } from '@headlessui/vue'
import { useIndexStore } from '@/stores/instrumentsIndexStore.js'
import { TabGroup, TabList, Tab, TabPanels } from '@headlessui/vue'
import { QuillEditor } from '@vueup/vue-quill'
import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { defineAsyncComponent } from "vue"

const SpinnerLoading = defineAsyncComponent(() => import('@/components/forms/SpinnerLoading.vue'))
const SkeletonLoader = defineAsyncComponent(() => import('@/components/forms/SkeletonLoader.vue'))

import DialogCategory from "@/components/forms/DialogCategory.vue"
import PrimaryButton from "@/components/forms/PrimaryButton.vue"
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const indexStore = useIndexStore()
const { isLoadingInstrumentsIndexStore, showEditDialog } = storeToRefs(indexStore)
const handleClose = (closeModal) => {
     showEditDialog.value = closeModal
}
const header = ['protocol-index.header', 'protocol-index.footer']
const props = defineProps({
     isOpen: {
          type: Boolean
     },
     indexHeaderHtml: {
          type: String,
     },
     indexFooterHtml: {
          type: String,
     },
})
const selectedTab = ref(0)
const setHtmlToDisplay = (index) => {
     selectedTab.value = index
}
const selectedHeader = computed(() => {
     return selectedTab.value === 0 ? 'protocol-index.edit-header' : 'protocol-index.edit-footer'
})
const cleanText = (content) => {
     if (content === null) return
     const cleanText = content
          .replace(/<!DOCTYPE html\b([^>]*)>/gi, "")
          .replace(/<html>/gi, "")
          .replace(/<\/html>/gi, "")
          .replace(/<body>/gi, "")
          .replace(/<\/body>/gi, "")
          .replace(/\n/g, "")
          .replace(/\s\s+/g, "")
     return cleanText
}

const currentHeaderHtml = ref(cleanText(props.indexHeaderHtml))
const currentFooterHtml = ref(cleanText(props.indexFooterHtml))
const selectedContent = computed(() => {
     return selectedTab.value === 0 ? currentHeaderHtml.value : currentFooterHtml.value
})

const quillEditor = ref(null);
const handleTextChange = () => {
     const editor = quillEditor.value.getHTML()

     if (selectedTab.value === 0) {
          currentHeaderHtml.value = editor

     } else {
          currentFooterHtml.value = editor

     }
};

const updateHeaderAndFooter = () => {
     const encodedHeader = encodeURI(currentHeaderHtml.value)
     const encodedFooter = encodeURI(currentFooterHtml.value)
     indexStore.fetchUpdatedIndex(1, encodedHeader, encodedFooter)
}

</script>
<style>
.custom-quill-editor {
     height: 200px;
     width: 100%;
}
</style>
