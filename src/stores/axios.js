// src/axios.js
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore.js'
import { storeToRefs } from 'pinia'
import { handleHttpError } from '@/utils/errorHandler'

// const API = () => {
//      let hostname = window.location.hostname
//      let first = hostname.split(".")[0]
//      if (first === 'localhost') {
//           return 'https://consortium.api.publicnote.tech/'
//      } else {
//           return 'https://' + first + '.api.publicnote.tech/'
//      }
// }

// baseURL: 'https://consortium.api.publicnote.tech/',
// baseURL: 'https://admin.api.publicnote.tech/',
const instance = axios.create({
     baseURL: 'https://consortium.api.publicnote.tech/',
     // baseURL: 'https://admin.api.publicnote.tech/',
})

instance.interceptors.request.use(
     (config) => {
          const authStore = useAuthStore()
          const { token } = storeToRefs(authStore)
          if (token.value !== null) {
               config.headers.Authorization = `Bearer ${token.value}`
          }
          return config
     }
)

instance.interceptors.response.use(
     response => response,
     error => {
          handleHttpError(error)
          return Promise.reject(error)
     }
)
export default instance
