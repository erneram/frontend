<template>
  <div class="">
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog as="div" class="relative z-10 lg:hidden" @close="sidebarOpen = false">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0"
          enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100"
          leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-900/80" />
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild as="template" enter="transition ease-in-out duration-300 transform"
            enter-from="-translate-x-full" enter-to="translate-x-0"
            leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0"
            leave-to="-translate-x-full">
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0"
                enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100" leave-to="opacity-0">
                <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>
              <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-emerald-500 px-6 pb-2">
                <div class="flex h-16 shrink-0 items-center">
                  <img class="h-8 w-auto cursor-pointer"
                    src="https://consortium.publicnote.tech/static/img/publicnote-green.961bf63.png" alt="Your Company"
                    @click="goDashboard" />
                  <p class="px-2 font-bold text-white cursor-pointer" @click="goDashboard">{{
                    $t('public-note.public-note') }}</p>
                </div>
                <nav class="flex flex-1 flex-col">
                  <NavigationBar></NavigationBar>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div class="bg-emerald-500 hidden lg:fixed lg:inset-y-0 lg:z-10 lg:flex lg:w-72 lg:flex-col">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div class="flex grow flex-col gap-y-2 overflow-y-auto px-4">
        <div class="flex h-16 shrink-0 items-center">
          <img class="h-8 w-auto cursor-pointer"
            src="https://consortium.publicnote.tech/static/img/publicnote-green.961bf63.png" alt="Your Company"
            @click="goDashboard" />
          <p class="px-2 font-bold text-white cursor-pointer" @click="goDashboard">{{ $t('public-note.public-note') }}
          </p>
        </div>
        <nav class="flex flex-1 flex-col">
          <NavigationBar />
        </nav>
      </div>
    </div>

    <!-- Page content -->
    <div class="lg:pl-72">
      <div
        class="relative z-10 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" @click="sidebarOpen = true">
          <span class="sr-only">Open sidebar</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>

        <!-- Separator -->
        <div class="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

        <div class="flex flex-1 justify-end gap-x-4 self-stretch lg:gap-x-6">
          <!-- <SearchOption></SearchOption> not needed -->
          <div class="flex items-center gap-x-4 lg:gap-x-4">
            <!-- Separator -->
            <div class="block h-6 w-px bg-gray-900/10" aria-hidden="true" />
            <!-- Profile dropdown -->
            <Menu as="div" class="relative">
              <MenuButton class="-m-1.5 flex items-center p-1.5">
                <span class="flex items-center">
                  <span class="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">{{
                    getLoggedInUserName() }}</span>
                  <ChevronDownIcon class="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </MenuButton>
              <transition enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95">
                <MenuItems
                  class="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                  <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
                  <a :href="item.href" @click="item.name == 'general.logout' ? logout() : null"
                    :class="[active ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900 hover:cursor-pointer']">{{
                      $t(item.name) }}</a>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>
      <main class="py-4">
        <div class="px-4 sm:px-6 lg:px-8">
          <BreadCrumbs :pages='breadcrumb' class="mb-4"></BreadCrumbs>
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { ChevronDownIcon, XMarkIcon } from '@heroicons/vue/24/solid'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useUserStore } from '@/stores/userStore'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRoute } from 'vue-router';

import NavigationBar from '@/components/navigation/NavigationBar.vue'
import BreadCrumbs from '@/components/forms/BreadCrumbs.vue'
import SearchOption from '@/components/forms/SearchOption.vue'
import router from '@/router'
import 'vue-router'

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/vue'
import {
  Bars3Icon,
} from '@heroicons/vue/24/outline'

const { meta } = useRoute()
const { breadcrumb } = meta

const { getLoggedInUserName } = useUserStore()
const { logout } = useAuthStore()

function goDashboard() {
  router.push('/')
}

const userNavigation = [
  // { name: 'Your profile', href: '#' },
  { name: 'general.logout', },
]

const sidebarOpen = ref(false)
</script>