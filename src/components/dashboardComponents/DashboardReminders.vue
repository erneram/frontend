<template>
  <div v-if="isLoadingDashBoardStore" class="flex w-full justify-center">
    <spinner-loading />
  </div>
  <div v-else>
    <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                  {{ $t('general.number') }}
                </th>
                <th scope="col" class="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6">
                  {{ $t('general.reminder') }}
                </th>
                <th scope="col" class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                  {{ $t('general.date') }}
                </th>
                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <template v-if="calendarAlert.length === 0">
                <tr>
                  <th scope="col" class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{{
                    $t('general.no-data-available') }}</th>
                </tr>
              </template>
              <template v-else>
                <tr v-for="alert in calendarAlert" :key="alert.id">
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">{{ alert.number }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">{{ alert.alert_name }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">{{
                    formatDate(alert.alert_date) }}</td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useDashboardStore } from '@/stores/dashboardStore';
import { ref, watch, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia';
import { DateTime } from 'luxon'
import { useI18n } from 'vue-i18n'

const SpinnerLoading = defineAsyncComponent(() => import('@/components/forms/SpinnerLoading.vue'))
import GeneralTable from '../forms/GeneralTable.vue';

const dt = DateTime.local()

const props = defineProps({
  dateSelected: {
    type: String,
    required: true
  }
})

const dashboardStore = useDashboardStore()
const { isLoadingDashBoardStore, calendarAlert } = storeToRefs(dashboardStore)


const { t } = useI18n()
const months = ['calendar.january', 'calendar.february', 'calendar.march', 'calendar.april', 'calendar.may', 'calendar.june', 'calendar.july', 'calendar.august', 'calendar.september', 'calendar.october', 'calendar.november', 'calendar.december']

const formatDate = (date) => {
  const dateOnly = date.split('T')[0]
  const parts = dateOnly.split('-')
  if (parts.length === 3) {
    const day = parseInt(parts[2], 10)
    const month = parseInt(parts[1], 10) - 1
    const year = parseInt(parts[0], 10)
    const correctMonth = months[month]
    return `${day} de ${t(correctMonth)}  de ${year}`
  }
  return date
}

</script>