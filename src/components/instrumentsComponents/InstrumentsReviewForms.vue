<template>
     <panel>
          <dl class="grid max-w-xl grid-cols-1 gap-8 sm:grid-cols-3">
               <div class="flex flex-col gap-y-3 border-l border-emerald-500 pl-6">
                    <dt class="text-sm leading-6 text-gray-600">{{ $t('protocol-instruments.number') }}</dt>
                    <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900">
                         {{ props.updatedData.number }}
                    </dd>
               </div>
               <div class="flex flex-col gap-y-3 border-l border-gray-900/10 pl-6">
                    <dt class="text-sm leading-6 text-gray-600">{{ $t('protocol-instruments.place') }}</dt>
                    <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900">{{
                         props.updatedData.place }}</dd>
               </div>
               <div class="flex flex-col gap-y-3 border-l border-gray-900/10 pl-6">
                    <dt class="text-sm leading-6 text-gray-600">{{ $t('protocol-instruments.state') }}</dt>
                    <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900">{{ $t(statusTxt) }}</dd>
               </div>
               <div class="flex flex-col gap-y-3 border-l border-gray-900/10 pl-6">
                    <dt class="text-sm leading-6 text-gray-600">{{ $t('protocol-instruments.type') }}</dt>
                    <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900">{{
                         props.updatedData.type }}</dd>
               </div>
               <div class="flex flex-col gap-y-3 border-l border-gray-900/10 pl-6">
                    <dt class="text-sm leading-6 text-gray-600">{{ $t('protocol-instruments.customer') }}</dt>
                    <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900">{{
                         props.updatedData.client }}</dd>
               </div>
               <div class="flex flex-col gap-y-3 border-l border-gray-900/10 pl-6">
                    <dt class="text-sm leading-6 text-gray-600">{{ $t('protocol-instruments.folio-in-which-it-begin') }}
                    </dt>
                    <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900">{{
                         props.updatedData.starting_folio }}</dd>
               </div>
               <div class="flex flex-col gap-y-3 border-l border-gray-900/10 pl-6">
                    <dt class="text-sm leading-6 text-gray-600">{{ $t('protocol-instruments.sheets-used') }}</dt>
                    <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900">{{
                         props.updatedData.sheets }}</dd>
               </div>
               <div class="flex flex-col gap-y-3 border-l border-gray-900/10 pl-6">
                    <dt class="text-sm leading-6 text-gray-600">{{ $t('protocol-instruments.instrument-value') }}</dt>
                    <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900">{{
                         props.updatedData.price }}</dd>
               </div>
               <div class="flex flex-col gap-y-3 border-l border-gray-900/10 pl-6 col-span-3">
                    <dt class="text-sm leading-6 text-gray-600">{{ $t('protocol-instruments.parts') }}</dt>
                    <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900">
                         <div v-for="(part, index) in props.updatedData.parts" :key="index">
                              {{ part.name }}
                         </div>
                    </dd>
               </div>
          </dl>
     </panel>
</template>

<script setup>
import { ref } from 'vue'
import Panel from '../forms/Panel.vue'

const props = defineProps({
     updatedData: {
          type: Object,
     },
     currentSelected: {
          type: Number,
     },
     types: {
          type: Object,
     },
     status: {
          type: Object,
     }
});
const statusId = ref(props.updatedData.instrument_status_id);
const statusTxt = ref('');

if (statusId.value === 1) {
     statusTxt.value = 'protocol-instruments.authorized';
} else if (statusId.value === 2) {
     statusTxt.value = 'protocol-instruments.cancelled';
}
</script>
