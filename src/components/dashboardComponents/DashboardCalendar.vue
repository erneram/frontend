<template>
  <div v-if="isLoadingDashBoardStore" class="flex w-full justify-center">
    <spinner-loading />
  </div>
  <div v-else class="flex flex-col sm:flex-row">
    <div class="flex-none ml-6">
      <div class="flex flex-col bg-emerald-500 shadow-md text-xl p-4 justify-between items-start rounded-t-lg">
        <div class="text-lg text-emerald-700 font-semibold">
          {{ currentYear }}
        </div>
        <div class="text-2xl text-white font-semibold">
          {{ formatDateToString(todayDate) }}
        </div>

      </div>
      <div class=" flex-auto ">
        <div class="mt-10 text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 lg:mt-6 xl:col-start-9">
          <div class="flex items-center mb-4">
            <button type="button"
              class="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
              @click="changeMonth('previous')">
              <chevron-left-icon class="h-5 w-5" aria-hidden="true" />
            </button>
            <div class="flex-auto text-sm font-semibold">{{ $t(currentMonthName) }} {{ currentYear }}</div>
            <button type="button"
              class="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
              @click="changeMonth('next')">
              <chevron-right-icon class="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div class="mt-6 grid grid-cols-7 text-xs leading-6 text-gray-500">
            <div v-for="(weekday, index) in weekDays" :key="index">{{ $t(weekday) }}</div>
          </div>
          <div class="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200">
            <button v-for="(day, dayIdx) in createDays" :key="dayIdx" type="button"
              :class="['py-1.5 px-1 hover:bg-gray-100 focus:z-10', day.isCurrentMonth ? 'bg-white' : 'bg-gray-50', (day.isSelected || day.isToday) && 'font-semibold', day.isSelected && 'text-white', !day.isSelected && day.isCurrentMonth && !day.isToday && 'text-gray-900', !day.isSelected && !day.isCurrentMonth && !day.isToday && 'text-gray-400', day.isToday && !day.isSelected && 'text-emerald-600', dayIdx === 0 && 'rounded-tl-lg', dayIdx === 6 && 'rounded-tr-lg']">
              <span @click="selectedDate(day)" :datetime="dayIdx"
                :class="['mx-auto flex h-10 w-10 items-center justify-center rounded-full', day.isSelected && day.isToday && 'bg-blue-600', day.isSelected && !day.isToday && 'bg-gray-900', dayIdx === createDays.length - 7 && 'rounded-bl-lg', dayIdx === createDays.length - 1 && 'rounded-br-lg']">
                <div class="flex flex-col">
                  <p>
                    {{ day.date }}
                  </p>
                  <p v-if="getCalendarAlertCount(day.fullDate) > 0"
                    class="text-emerald-400 text-md justify-center hover:cursor-pointer">
                    <exclamation-circle-icon class="w-5 h-5" />
                  </p>
                </div>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-auto ml-12 mt-2">
      <!-- Alerts -->
      <template v-if="!getCalendarAlert(todayDate)">
        <div class="flex-auto">
          <h2 class="text-xl"><span class="font-bold text-gray-500">{{
            $t('calendar.no-notarial-obligations') }} </span></h2>
        </div>
      </template>
      <template v-else>
        <div>
          <dashboard-calendar-card-information :alert-information="currentAlertInformation" />
        </div>
      </template>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, ExclamationCircleIcon, } from '@heroicons/vue/20/solid'
import { useInstrumentsStore } from '@/stores/instrumentsStore'
import { useDashboardStore } from '@/stores/dashboardStore'
import { DateTime } from 'luxon'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'

import SpinnerLoading from '../forms/SpinnerLoading.vue'
import DashboardCalendarCardInformation from './dashboardCalendarCardInformation.vue'

const dt = DateTime.local()
const weekDays = ['calendar.sun', 'calendar.mon', 'calendar.tue', 'calendar.wed', 'calendar.thu', 'calendar.fri', 'calendar.sat']
const months = ['calendar.january', 'calendar.february', 'calendar.march', 'calendar.april', 'calendar.may', 'calendar.june', 'calendar.july', 'calendar.august', 'calendar.september', 'calendar.october', 'calendar.november', 'calendar.december']
const { t } = useI18n()
const emit = defineEmits(['dateSelected'])
function changeMonth(input) {
  if (input === 'next') {
    if (currentMonth.value < 12) {
      currentMonth.value++
    } else {
      currentMonth.value = 1
      currentYear.value++
    }
  }
  else if (input === 'previous') {
    if (currentMonth.value > 1) {
      currentMonth.value--
    } else {
      currentMonth.value = 12
      currentYear.value--
    }
  }
}

const createDays = computed(() => {
  const thisMonth = dt.set({ month: currentMonth.value, year: currentYear.value })
  const days = []

  let calendarStartDay = thisMonth.startOf('month')
  while (calendarStartDay.localWeekday > 1) {
    calendarStartDay = calendarStartDay.minus({ days: 1 })
    days.unshift({ date: calendarStartDay.day, isCurrentMonth: false, fullDate: `${calendarStartDay.day}-${calendarStartDay.month}-${currentYear.value}` })
  }
  for (let i = 1; i <= thisMonth.daysInMonth; i++) {
    if (i == dt.set({ month: dt.month, year: currentYear.value }).day) {
      days.push({ date: `${i}`, isCurrentMonth: true, isToday: true, fullDate: `${i}-${currentMonth.value}-${currentYear.value}` })
    } else {
      days.push({
        date: `${i}`, isCurrentMonth: true, fullDate: `${i}-${currentMonth.value}-${currentYear.value}`
      })
    }
  }
  let calendarLastDay = thisMonth.endOf('month')
  while (calendarLastDay.localWeekday < 7) {
    calendarLastDay = calendarLastDay.plus({ days: 1 })
    days.push({ date: calendarLastDay.day, isCurrentMonth: false, fullDate: `${calendarLastDay.day}-${calendarLastDay.month}-${currentYear.value}` })
  }
  return days
})

const formatDateToString = (date) => {
  const parts = date.split('-')
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10) - 1
    const year = parseInt(parts[2], 10)
    const correctMonth = months[month]
    return `${day} de ${t(correctMonth)}  de ${year}`
  }
  return date
}
const formatDate = (date) => {
  const dateOnly = date.split('T')[0]
  const parts = dateOnly.split('-')
  if (parts.length === 3) {
    const day = parseInt(parts[2], 10)
    const month = parseInt(parts[1], 10)
    const year = parseInt(parts[0], 10)
    return `${day}-${month}-${year}`
  }
  return date
}
const currentMonthName = computed(() => months[currentMonth.value - 1])
const currentMonth = ref(dt.month)
const currentYear = ref(dt.year)

const todayDate = ref(`${dt.day}-${dt.month}-${dt.year}`)
emit('dateSelected', `${dt.day}-${dt.month}-${dt.year}`)


const selectedDate = (date) => {
  todayDate.value = date.fullDate
  emit('dateSelected', date.fullDate)
}
const dashboardStore = useDashboardStore()
const { isLoadingDashBoardStore, allCalendarAlert } = storeToRefs(dashboardStore)
const allCalendarAlerts = ref(allCalendarAlert.value.filter((filter) => filter.type !== "notification"))
watch(() => allCalendarAlert.value, (newVal) => {
  allCalendarAlerts.value = newVal.filter((filter) => filter.type !== "notification");
})

const instrumentStore = useInstrumentsStore()
const { instruments } = storeToRefs(instrumentStore)

const filterEvent = (date) => {
  const instrumentsArray = Object.values(instruments.value)
  return instrumentsArray.filter((a) => a.expires_at === date)
}

const getCalendarAlertCount = (todayDate) => {
  if (allCalendarAlerts.value.find((date) => formatDate(date.alert_date) === todayDate)) {
    return allCalendarAlerts.value.filter((date) => formatDate(date.alert_date) === todayDate).length
  } else {
    return 0
  }
}

const getCalendarAlert = (todayDate) => {
  if (allCalendarAlerts.value.find((date) => formatDate(date.alert_date) === todayDate)) {
    return allCalendarAlerts.value.filter((date) => formatDate(date.alert_date) === todayDate)
  } else {
    return false
  }
}
const currentAlertInformation = computed(() => {
  return getCalendarAlert(todayDate.value)
})
</script>