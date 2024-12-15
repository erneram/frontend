import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import NavigationView from '@/views/NavigationView.vue'
import DashboardView from '@/views/DashboardView.vue'
import InstrumentsView from '@/views/instruments/InstrumentsView.vue'
import InstrumentCategoriesView from '@/views/instruments/InstrumentCategoriesView.vue'
import InstrumentStampsView from '@/views/instruments/InstrumentStampsView.vue'
import InstrumentPrevProtocolView from '@/views/instruments/InstrumentsPrevProtocolView.vue'
import InstrumentProtocolIndexView from '@/views/instruments/InstrumentProtocolIndexView.vue'
import InstrumentChangeRequestView from '@/views/instruments/InstrumentChangeRequestView.vue'
import DeadLineAlertsCategoriesView from '@/views/deadlinealerts/DeadLineAlertsCategoriesView.vue'
import DeadLineAlertsView from '@/views/deadlinealerts/DeadLineAlertsView.vue'
import PnBillView from '@/views/pndocs/PnBillView.vue'
import AlertsAlertReportView from '@/views/alerts/AlertsAlertReportView.vue'
import AlertsInstrumentReportView from '@/views/alerts/AlertsInstrumentReportView.vue'
import AgpObligationsView from '@/views/AgpObligationsView.vue'
import UserProfileView from '@/views/UserProfileView.vue'
import ManageLawyersView from '@/views/adminpages/ManageLawyersView.vue'
import ManageUsersView from '@/views/adminpages/ManageUsersView.vue'
import NotPageFoundView from '@/views/NotPageFoundView.vue'

import { useAuthStore } from '@/stores/authStore'
import { HomeIcon, UserIcon, ListBulletIcon } from '@heroicons/vue/24/outline'
import { navigationObject } from '@/components/Navigation/navigation'

const generateBreadcrumb = (navigationItem) => [navigationObject.home, navigationItem]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: NavigationView,
      redirect: '/dashboard',
      children: [
        {
          path: '/dashboard', // Dashboard
          component: DashboardView,
          meta: { breadcrumb: [navigationObject.home] }
        },
        {
          path: '/protocols',
          component: InstrumentsView,
          meta: { breadcrumb: generateBreadcrumb(navigationObject.instruments.protocol) }
        },
        {
          path: '/protocols-categories',
          component: InstrumentCategoriesView,
          meta: { breadcrumb: generateBreadcrumb(navigationObject.instruments.protocolCategories) }
        },
        {
          path: '/protocol-stamps',
          component: InstrumentStampsView,
          meta: { breadcrumb: generateBreadcrumb(navigationObject.instruments.stamps) }
        },
        {
          path: '/protocol-archive',
          component: InstrumentPrevProtocolView,
          meta: { breadcrumb: generateBreadcrumb(navigationObject.instruments.archives) }
        },
        {
          path: '/protocol-index',
          component: InstrumentProtocolIndexView,
          meta: { breadcrumb: generateBreadcrumb(navigationObject.instruments.index) }
        },
        {
          path: '/protocol-changeRequests',
          component: InstrumentChangeRequestView,
          meta: { breadcrumb: generateBreadcrumb(navigationObject.instruments.changeRequest) }
        },
        {
          path: '/document',
          component: DeadLineAlertsView,
          meta: { breadcrumb: generateBreadcrumb(navigationObject.deadlineAlert.documents) }
        },
        {
          path: '/documents-categories',
          component: DeadLineAlertsCategoriesView,
          meta: { breadcrumb: generateBreadcrumb(navigationObject.deadlineAlert.documentCategories) }
        },
        {
          path: '/pndocs/act',
          component: PnBillView,
          meta: { breadcrumb: generateBreadcrumb(navigationObject.docs.act) }

        },
        {
          path: '/report/protocol',
          component: AlertsInstrumentReportView,
          meta: { breadcrumb: generateBreadcrumb(navigationObject.report.protocolReport) }
        },
        {
          path: '/report/alert',
          component: AlertsAlertReportView,
          meta: { breadcrumb: generateBreadcrumb(navigationObject.report.alertReport) }
        },
        {
          path: '/obligations',
          component: AgpObligationsView,
          meta: { breadcrumb: generateBreadcrumb(navigationObject.obligations) }
        },
        {
          path: '/user-profile',
          component: UserProfileView,
          meta: { breadcrumb: generateBreadcrumb(navigationObject.porfile) }
        },
        {
          path: '/userAdmin',
          component: ManageUsersView,
          meta: { breadcrumb: generateBreadcrumb(navigationObject.manageUsers) }
        },
        {
          path: '/lawyerAdmin',
          component: ManageLawyersView,
          meta: { breadcrumb: generateBreadcrumb(navigationObject.manageLawyers) }
        },
        {
          path: '/protocols/:year/archive',
          component: InstrumentsView,
          meta: { breadcrumb: generateBreadcrumb(navigationObject.instruments.protocol) }
        },
        {
          path: '/protocol-index/year=:year',
          component: InstrumentProtocolIndexView,
          meta: { breadcrumb: generateBreadcrumb(navigationObject.instruments.index) }
        },
      ],
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
    }, {
      path: '/login',
      name: 'login',
      component: LoginView
    },
  ]
})



router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  if (auth.isAuth) {
    if (to.name == 'login') {
      next('/')
      return
    }
  }
  else if (to.name !== 'login') {
    next('login')
    return
  }
  next()
})

export default router
