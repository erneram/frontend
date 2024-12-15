import {
     HomeIcon,
     CheckIcon,
     UserIcon,
     UserGroupIcon,
     UserPlusIcon,
     DocumentIcon,
     AdjustmentsHorizontalIcon,
     ListBulletIcon,
     MegaphoneIcon,
     BackwardIcon,
     CheckCircleIcon,
     SpeakerWaveIcon,
     QueueListIcon,
     DocumentTextIcon,
     ExclamationCircleIcon,
     ClipboardDocumentIcon,
     NoSymbolIcon,
} from '@heroicons/vue/24/outline'

export const navigationObject = {
     home: { name: 'navigation.dashboard', href: '/', icon: HomeIcon, current: false },
     instruments: {
          protocol: { name: 'protocol.instrument', icon: DocumentIcon, href: '/protocols' },
          protocolCategories: { name: 'protocol.instrument-category', href: '/protocols-categories', icon: AdjustmentsHorizontalIcon },
          stamps: { name: 'protocol.stamps', href: '/protocol-stamps', icon: MegaphoneIcon },
          archives: { name: 'protocol.previous-protocols', href: '/protocol-archive', icon: BackwardIcon },
          index: { name: 'protocol.protocol-index', href: '/protocol-index', icon: QueueListIcon },
          changeRequest: { name: 'protocol.change-requests', href: '/protocol-changeRequests', icon: CheckCircleIcon }
     },
     deadlineAlert: {
          documents: { name: 'deadlinealert.deadline-alert', href: '/document', icon: SpeakerWaveIcon },
          documentCategories: { name: 'deadlinealert.deadlind-alert-categories', href: '/documents-categories', icon: ListBulletIcon },
     },
     docs: {
          act: { name: 'pn-docs.act', href: '/pndocs/act', icon: DocumentTextIcon },
     },
     report: {
          protocolReport: { name: 'reports.instrument-reports', href: '/report/protocol', icon: ClipboardDocumentIcon },
          alertReport: { name: 'reports.alert-reports', href: '/report/alert', icon: ExclamationCircleIcon },
     },
     obligations: { name: 'navigation.agp-obligations', href: '/obligations', icon: CheckIcon, current: false },
     porfile: { name: 'navigation.user-profile', href: '/user-profile', icon: UserIcon, current: false },
     manageUsers: { name: 'navigation.manage-users', href: '/userAdmin', icon: UserPlusIcon, current: false },
     manageLawyers: { name: 'navigation.manage-lawyers', href: '/lawyerAdmin', icon: UserGroupIcon, current: false },
     noPageFound: { name: 'errors.error', herf: '/error', icon: NoSymbolIcon, current: false },

}