<template>
  <ul role="list" class="flex flex-1 flex-col gap-y-7">
    <li>
      <ul role="list" class="-mx-2 space-y-1">
        <li v-for="(item, index) in navigation" :key="item">
          <a v-if="!item.children" :href="item.href"
            :class="[item.current ? 'bg-emerald-900' : 'hover:bg-emerald-900', 'group flex gap-x-1 rounded-md p-2 text-sm leading-6 font-semibold text-white']">
            <component :is="item.icon" class="h-6 w-6 shrink-0 text-white" aria-hidden="true" />
            {{ $t(item.name) }}
          </a>
          <div v-else>
            <button
              :class="[openNavegation === index ? 'bg-emerald-900' : 'hover:bg-emerald-900', 'flex items-center w-full text-left rounded-md p-2 gap-x-1 text-sm leading-6 font-semibold text-white']"
              @click="toggleDisclosure(index)">
              <component :is="item.icon" class="h-6 w-6 shrink-0 text-white" aria-hidden="true" />
              {{ $t(item.name) }}
              <chevron-right-icon
                :class="[(openNavegation === index ? 'rotate-90' : ''), 'ml-auto h-5 w-5 shrink-0 text-white']"
                aria-hidden="true" />
            </button>
            <ul v-show="openNavegation === index" class="mt-1 px-2">
              <li v-for="subItem in item.children" :key="subItem.name">
                <a :href="subItem.href"
                  :class="[subItem.current ? 'bg-gray-50' : 'hover:bg-emerald-900', 'block rounded-md py-2 pl-4 flex text-sm leading-6 text-white space-x-4']">
                  <component :is="subItem.icon" class="h-6 mr-1 w-6 shrink-0 text-white" aria-hidden="true" />
                  {{ $t(subItem.name) }}
                </a>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </li>
    <div class="relative">
      <div class="absolute inset-0 flex items-center" aria-hidden="true">
        <div class="w-full border-t border-emerald-300" />
      </div>
    </div>
    <primary-button additionalCSS="justify-start gap-2" @click="logout">
      <x-circle-icon class="h-6 w-6 shrink-0 text-white"></x-circle-icon>
      {{ $t('general.exit') }}
    </primary-button>
  </ul>
</template>
<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { ChevronRightIcon } from '@heroicons/vue/20/solid'
import { BriefcaseIcon, BellAlertIcon, DocumentPlusIcon, ChartBarIcon, XCircleIcon } from '@heroicons/vue/24/outline'
import { navigationObject } from '@/components/navigation/navigation'
import { useAuthStore } from '@/stores/authStore'
import { useModulesStore } from '@/stores/modulesStore'
import { useUserStore } from '@/stores/userStore'
import PrimaryButton from "@/components/forms/PrimaryButton.vue"

const userStore = useUserStore()
const {
  userIsAdmin,
  userIsAssociate,
  userIsLawyer,
  userIsAssistant,
} = storeToRefs(userStore)
const modulesStore = useModulesStore()
const {
  allModulesNames,
  showDashboard,
  showProtocols,
  showProtocolCategories,
  showDocuments,
  showDocumentCategories,
  showStamps,
  showObligations,
  showArchive,
  showRequests,
  showIndex,
  showProfile,
  showAdminUsers,
  showAdminLawyers,
} = storeToRefs(modulesStore)

const navigation = [
  showDashboard.value ? navigationObject.home : null,
  {
    name: 'navigation.protocol',
    current: false,
    icon: BriefcaseIcon,
    children: [
      showProtocols.value ? navigationObject.instruments.protocol : null,
      showProtocolCategories.value ? navigationObject.instruments.protocolCategories : null,
      showDocuments.value ? navigationObject.instruments.stamps : null,
      showDocumentCategories.value ? navigationObject.instruments.archives : null,
      showStamps.value ? navigationObject.instruments.index : null,
      // navigationObject.instruments.changeRequest,
    ]
  },
  {
    name: 'navigation.deadline-alert',
    icon: BellAlertIcon,
    current: false,
    children: [
      showDocuments.value ? navigationObject.deadlineAlert.documents : null,
      showDocumentCategories.value ? navigationObject.deadlineAlert.documentCategories : null,
    ]
  },
  // {
  //   name: 'navigation.pn-docs',
  //   icon: DocumentPlusIcon,
  //   current: false,
  //   children: [
  //     navigationObject.docs.act,
  //   ]
  // },
  {
    name: 'navigation.reports',
    icon: ChartBarIcon,
    current: false,
    children: [
      navigationObject.report.protocolReport,
      navigationObject.report.alertReport,
    ]
  },
  showObligations.value ? navigationObject.obligations : null,
  showProfile.value ? navigationObject.porfile : null,

  // Role admin
  showAdminUsers.value && userIsAdmin.value ? navigationObject.manageUsers : null,
  showAdminLawyers.value && userIsAdmin.value ? navigationObject.manageLawyers : null,
].filter(Boolean)

const authStore = useAuthStore()
const logout = () => {
  authStore.logout()
}

const openNavegation = ref(null)

const toggleDisclosure = (index) => {
  openNavegation.value = openNavegation.value === index ? null : index
}
</script>
