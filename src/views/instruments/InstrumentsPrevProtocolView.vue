<template>
    <panel>
        <spinner-loading v-if="isLoadingInstrumentStore" class="mx-auto" />
        <instruments-select-prev-years v-else :data="allYears" />
    </panel>
</template>
<script setup>
import { useInstrumentsStore } from '@/stores/instrumentsStore.js'
import { useIndexStore } from '@/stores/instrumentsIndexStore'
import { storeToRefs } from 'pinia'
import { ref, defineAsyncComponent } from 'vue'

const SpinnerLoading = defineAsyncComponent(() => import('@/components/forms/SpinnerLoading.vue'))

import Panel from '@/components/forms/Panel.vue'
import instrumentsSelectPrevYears from '@/components/instrumentsPreviousInstrumentsComponents/InstrumentsSelectPrevYears.vue'

const instrumentsStore = useInstrumentsStore()
instrumentsStore.fetchYears()
const { allYears, archiveYearInstruments, isLoadingInstrumentStore } = storeToRefs(instrumentsStore)

const indexStore = useIndexStore()
const { archiveYearIndex } = storeToRefs(indexStore)
</script>