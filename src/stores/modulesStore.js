import { useUserStore } from "./userStore"
import { storeToRefs, defineStore } from "pinia"
import { computed } from "vue"
export const useModulesStore = defineStore('modules', () => {
     const userStore = useUserStore()
     const { user } = storeToRefs(userStore)

     const allModulesNames = computed(() => user.value.modules.map(module => module.name))
     const showDashboard = computed(() => user.value.modules.some(module => module.id === 1))
     const showProtocols = computed(() => user.value.modules.some(module => module.id === 2))
     const showProtocolCategories = computed(() => user.value.modules.some(module => module.id === 3))
     const showDocuments = computed(() => user.value.modules.some(module => module.id === 4))
     const showDocumentCategories = computed(() => user.value.modules.some(module => module.id === 5))
     const showStamps = computed(() => user.value.modules.some(module => module.id === 6))
     const showObligations = computed(() => user.value.modules.some(module => module.id === 7))
     const showArchive = computed(() => user.value.modules.some(module => module.id === 8))
     const showRequests = computed(() => user.value.modules.some(module => module.id === 9))
     const showIndex = computed(() => user.value.modules.some(module => module.id === 10))
     const showProfile = computed(() => user.value.modules.some(module => module.id === 11))
     const showAdminUsers = computed(() => user.value.modules.some(module => module.id === 12))
     const showAdminLawyers = computed(() => user.value.modules.some(module => module.id === 13))
     // const showNotarialDocuments = computed(() => user.value.modules.some(module => module.id === 14))

     return {
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
     }
})