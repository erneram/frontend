<template>
     <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="mx-auto max-w-2xl lg:mx-0">
               <h2 class="text-3xl font-bold tracking-tight text-emerald-800">{{
                    $t('deadlinealert.document-information')
                    }}</h2>
          </div>
          <div
               class="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-8 text-base leading-7 sm:grid-cols-2 sm:gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
               <div>
                    <h3 class="border-l border-emerald-500 pl-6 font-semibold text-gray-900 uppercase ">{{
                         $t('deadlinealert.description') }}
                    </h3>
                    <div class="border-l border-gray-200 pl-6 pt-2 not-italic text-gray-600">
                         <p>{{ description }}</p>
                    </div>
               </div>
               <div>
                    <h3 class="border-l border-emerald-500 pl-6 font-semibold text-gray-900 uppercase">{{
                         $t('deadlinealert.product') }}
                    </h3>
                    <div class="border-l border-gray-200 pl-6 pt-2 not-italic text-gray-600">
                         <p>{{ product }}</p>
                    </div>
               </div>
               <div>
                    <h3 class="border-l border-emerald-500 pl-6 font-semibold text-gray-900 uppercase">{{
                         $t('deadlinealert.category') }}
                    </h3>
                    <div class="border-l border-gray-200 pl-6 pt-2 not-italic text-gray-600">
                         <p>{{ category }}</p>
                    </div>
               </div>
               <div>
                    <h3 class="border-l border-emerald-500 pl-6 font-semibold text-gray-900 uppercase">{{
                         $t('deadlinealert.start-date') }}
                    </h3>
                    <div class="border-l border-gray-200 pl-6 pt-2 not-italic text-gray-600">
                         <p>{{ formatDate(startDate) }}</p>
                    </div>
               </div>
               <div>
                    <h3 class="border-l border-emerald-500 pl-6 font-semibold text-gray-900 uppercase">{{
                         $t('deadlinealert.expiration-date') }}
                    </h3>
                    <div class="border-l border-gray-200 pl-6 pt-2 not-italic text-gray-600">
                         <p>{{ formatDate(expireDate) }}</p>
                    </div>
               </div>
               <div>
                    <h3
                         :class="['border-l border-emerald-500 pl-6 font-semibold uppercase', status === 'Cancelado' ? 'text-red-700' : 'text-emerald-700']">
                         {{
                              $t('deadlinealert.status') }}
                    </h3>
                    <div class=" border-l border-gray-200 pl-6 pt-2 not-italic text-gray-600">
                         <p>{{ status }}</p>
                    </div>
               </div>
          </div>
     </div>

     <div
          class="mx-auto mx-8 mb-10 mt-6 grid max-w-2xl grid-cols-1 gap-8 text-base leading-7 sm:grid-cols-2 sm:gap-y-16 lg:mx-4 lg:max-w-none lg:grid-cols-3">
          <div class="mt-8">
               <div class="flex border-l border-emerald-500">
                    <UserIcon class="ml-2 h-6 w-6 text-emerald-400" />
                    <h3 class="pl-3 font-semibold text-gray-900 uppercase">{{
                         $t('deadlinealert.clients') }}
                    </h3>
               </div>
               <div class="border-l border-gray-200 pl-6 pt-2 not-italic text-gray-600">
                    <p>{{ client }}</p>
               </div>
          </div>
          <div class="mt-8">
               <div class="flex border-l border-emerald-500">
                    <EnvelopeIcon class="ml-2 h-6 w-6 text-emerald-400" />
                    <h3 class="pl-3 font-semibold text-gray-900 uppercase">{{
                         $t('deadlinealert.addressee') }}
                    </h3>
               </div>
               <div v-for="(item, index) in addressee" :key="index"
                    class="border-l border-gray-200 pl-6 pt-2 not-italic text-gray-600">
                    <p>{{ item }}</p>
               </div>
          </div>
          <div class="mt-8">
               <div class="flex border-l border-emerald-500">
                    <CalendarDaysIcon class="ml-2 h-6 w-6 text-emerald-400" />
                    <h3 class="pl-3 font-semibold text-gray-900 uppercase">{{
                         $t('deadlinealert.notification-date') }}
                    </h3>
               </div>
               <div v-for="(item, index) in notifications" :key="index"
                    class="border-l border-gray-200 pl-6 pt-2 not-italic text-gray-600">
                    <p>{{ formatDate(item.date) }}</p>
               </div>
          </div>
     </div>
     <div>
          <GeneraliFrame :source="base64" />
     </div>
</template>
<script setup>
import {
     UserIcon, EnvelopeIcon, CalendarDaysIcon
} from '@heroicons/vue/24/solid'
import GeneraliFrame from '../forms/GeneraliFrame.vue';
import { ref } from 'vue'
const props = defineProps({
     data: {
          type: Object
     }
})
const actualData = ref(props.data)
const description = actualData.value.description
const product = actualData.value.product
const category = actualData.value.contract_category?.name
const startDate = actualData.value.initial_date
const expireDate = actualData.value.expires_at
const status = actualData.value.status_name
const client = actualData.value.client
const addressee = actualData.value.destinataries
const notifications = actualData.value.contract_notifications
const base64 = actualData.value.base64

const formatDate = (date) => {
     const parts = date.split('-')
     if (parts.length === 3) {
          const [year, month, day] = parts
          return `${day}/${month}/${year}`
     }
}
</script>