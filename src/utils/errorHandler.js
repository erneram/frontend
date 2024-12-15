import axios from "axios";
import { useNotificationStore } from "@/stores/notificationStore";
import i18n from "@/langs";

export function handleHttpError(error) {
     const notificationStore = useNotificationStore();
     console.log(error)
     let type = 'error'
     if (axios.isAxiosError(error)) {
          if (error.response) { //Status >2xx
               const status = error.response.status;
               let titleKey = `error-${status}`
               let messageKey = `error-${status}-message`

               if (!notificationExist(titleKey)) {
                    titleKey = 'unknown-error'
               }
               if (!notificationExist(messageKey)) {
                    messageKey = 'unknown-error-message'
               }
               notificationStore.addNotification('error', titleKey, messageKey);
          } else if (error.request) { // Network Error
               let titleKey = `network-error`
               let messageKey = `network-error-message`
               notificationStore.addNotification('error', titleKey, messageKey);
          } else { // Request error
               const titleKey = 'unknown-error';
               const messageKey = 'unknown-error-message';
               notificationStore.addNotification(type, titleKey, messageKey);
          }
     } else { // Not an Axios Error
          const titleKey = 'unknown-error';
          const messageKey = 'unknown-error-message';
          notificationStore.addNotification(type, titleKey, messageKey);
     }
}
function notificationExist(key) {
     return i18n.global.te(`http-errors.${key}`)
}