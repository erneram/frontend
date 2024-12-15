<template>
    <panel class="mb-2" v-if="archiveYearIndex != currentYear">
        <div>
            <h1 class="bold text-3xl text-emerald-600  uppercase tracking-wide">
                {{ $t('previous-instruments.index-of-year') }} {{ archiveYearIndex }}</h1>
        </div>
    </panel>
    <panel>
        <div v-if="isLoadingInstrumentsIndexStore" class="flex w-full justify-center">
            <spinner-loading />
        </div>
        <div v-else>
            <div class="ml-3 text-4md text-left">
                {{ $t('protocol-index.select-the-lawyer') }}
            </div>
            <div>
                <select-and-edit />
            </div>
            <div class="flex justify-center">
                <div class="w-2/3 p-2">
                    <index-show-pdf />
                </div>
                <div class="w-1/3 p-2">
                    <index-missing-instruments />
                </div>
            </div>
        </div>
    </panel>
    <index-edit-dialog v-if="showEditDialog !== null" @close="hideEditDialog" :isOpen="showEditDialog"
        :indexHeaderHtml="header" :indexFooterHtml="footer" />
</template>
<script setup>
import { useIndexStore } from '@/stores/instrumentsIndexStore.js'
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { DateTime } from 'luxon'
import { defineAsyncComponent } from "vue";

const SpinnerLoading = defineAsyncComponent(() => import('@/components/forms/SpinnerLoading.vue'))
const IndexEditDialog = defineAsyncComponent(() => import('@/components/instrumentsProtocolsIndexComponents/IndexEditDialog.vue'))

import Panel from '@/components/forms/Panel.vue'
import IndexShowPdf from '@/components/instrumentsProtocolsIndexComponents/IndexShowPdf.vue'
import IndexMissingInstruments from '@/components/instrumentsProtocolsIndexComponents/IndexMissingInstruments.vue'
import SelectAndEdit from '@/components/instrumentsProtocolsIndexComponents/IndexSelectAndEdit.vue'
import router from '@/router'

const dt = DateTime.local()
const currentYear = ref(dt.year)
//Index
const indexStore = useIndexStore()
if (router.currentRoute.value.path === '/protocol-index') {
    indexStore.fetchIndex()
}
const { hideEditDialog } = indexStore
const { isLoadingInstrumentsIndexStore, header, footer, missingNumbers, showEditDialog, archiveYearIndex } = storeToRefs(indexStore)
</script>
