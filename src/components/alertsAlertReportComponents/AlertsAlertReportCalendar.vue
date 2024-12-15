<template>
     <div class="lg:flex lg:h-full lg:flex-col">
          <header class="flex items-center justify-between border-b border-gray-200 px-6 py-4 lg:flex-none">
               <button type="button"
                    class="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                    @click="changeMonth('previous')">
                    <ChevronLeftIcon class="h-6 w-6 text-emerald-500" aria-hidden="true" />
               </button>
               <div class="text-xl font-semibold">{{ $t(currentMonthName) }} {{ currentYear }}
               </div>
               <button type="button"
                    class="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                    @click="changeMonth('next')">
                    <ChevronRightIcon class="h-6 w-6 text-emerald-500" aria-hidden="true" />
               </button>
          </header>
          <div class="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
               <div
                    class="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 lg:flex-none">
                    <div class="bg-white py-2" v-for="(weekday, index) in weekDays" :key="index"
                         :class="[index == dayWeekNum ? 'text-emerald-500' : 'text-gray-700']">
                         {{ $t(weekday) }}
                    </div>
               </div>
               <div class="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
                    <div class="w-full grid grid-cols-7 grid-rows-5 gap-px">
                         <div v-for="day in createDays" :key="day.fullDate"
                              :class="[day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-500', 'relative p-4 text-left h-32']">
                              <p
                                   :class="[day.isToday ? 'border rounded-full border-double border-emerald-400 inline-block px-2' : '', 'hover:underline underline-offset-2']">
                                   {{ day.date }}
                                   <!-- <p v-if="filterEvent(day.fullDate)">filterEvent</p> -->
                              </p>
                              <p v-if="getEventDate(day.fullDate)" @click="openAlertDialog(day.fullDate)"
                                   class="flex p-2 bg-emerald-400 text-md justify-center hover:bg-emerald-600 hover:cursor-pointer">
                                   {{ day.fullDate
                                   }}</p>
                         </div>
                    </div>
               </div>
          </div>
     </div>
</template>


<script setup>
import {
     ChevronDownIcon,
     ChevronLeftIcon,
     ChevronRightIcon,
     ClockIcon,
     EllipsisHorizontalIcon,
} from '@heroicons/vue/20/solid'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { useAlertsAlertReportStore } from '@/stores/alertsAlertReportStore'
import { ref, computed, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { DateTime } from 'luxon'

const emit = defineEmits(['monthSelected'])
const dt = DateTime.local()
const weekDays = ['calendar.sun', 'calendar.mon', 'calendar.tue', 'calendar.wed', 'calendar.thu', 'calendar.fri', 'calendar.sat']
const months = ['calendar.january', 'calendar.february', 'calendar.march', 'calendar.april', 'calendar.may', 'calendar.june', 'calendar.july', 'calendar.august', 'calendar.september', 'calendar.october', 'calendar.november', 'calendar.december']

const dayWeekNum = ref(dt.weekday)

const currentMonthName = computed(() => months[currentMonth.value - 1])
const currentMonth = ref(dt.month)
const currentYear = ref(dt.year)


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
          days.unshift({
               date: `${calendarStartDay.day}`,
               isCurrentMonth: false,
               fullDate: `${calendarStartDay.day.toString().padStart(2, '0')}-${calendarStartDay.month.toString().padStart(2, '0')}-${currentYear.value}`
          })
     }
     for (let i = 1; i <= thisMonth.daysInMonth; i++) {
          if (i == dt.set({ month: dt.month, year: currentYear.value }).day) {
               days.push({
                    date: `${i}`,
                    isCurrentMonth: true,
                    isToday: true,
                    fullDate: `${i.toString().padStart(2, '0')}-${currentMonth.value.toString().padStart(2, '0')}-${currentYear.value}`
               })
          } else {
               days.push({
                    date: `${i}`,
                    isCurrentMonth: true,
                    fullDate: `${i.toString().padStart(2, '0')}-${currentMonth.value.toString().padStart(2, '0')}-${currentYear.value}`
               })
          }
     }
     let calendarLastDay = thisMonth.endOf('month')
     while (calendarLastDay.localWeekday < 7) {
          calendarLastDay = calendarLastDay.plus({ days: 1 })
          days.push({
               date: `${calendarLastDay.day}`,
               isCurrentMonth: false,
               fullDate: `${calendarLastDay.day.toString().padStart(2, '0')}-${calendarLastDay.month.toString().padStart(2, '0')}-${currentYear.value}`
          })
     }
     return days
})


const alertsReportStore = useAlertsAlertReportStore()
const { openAlertDialog } = alertsReportStore
const { currentMonthStore, currentYearStore, allEvents } = storeToRefs(alertsReportStore)
const events = ref(allEvents.value)

const getEventDate = (date) => {
     for (const event in events.value) {
          if (date === formatDate(events.value[event].expires_at)) {
               events.value[event]
               return events.value[event].category
          }
     }
     return false
}
const filterEvent = (date) => {
     return events.value.filter((a) => a.expires_at === date)
}

const formatDate = (date) => {
     if (date == null) {
          return date
     } else if (date !== null) {
          return DateTime.fromISO(date).toFormat('dd-MM-yyyy')
     }
}
watchEffect(() => {
     currentMonthStore.value = currentMonth.value
     currentYearStore.value = currentYear.value
})
// const selectedDay = days.find((day) => day.isSelected)
</script>