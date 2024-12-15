<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto" src="https://consortium.publicnote.tech/static/img/publicnote-green.961bf63.png" width="250"
        height="250" />
      <h2 id="app" class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"> {{
        $t('login.signinMessage') }}</h2>
    </div>
    <form class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm" @submit="onSubmitLogin">
      <text-input :validationError="hasError ? true : false" class="mt-2" name="email" type="email" title="login.email"
        :autocomplete-value="true" />
      <text-input :validationError="hasError ? true : false" class="mt-2" name="password" type="password"
        title="login.password" @keyup.enter="onSubmitLogin" :autocomplete-value="true" />
      <div v-if="hasError !== null" class="mt-4 text-center justify-between">
        <danger-alert name="messageError" title="vee-validate.The user credentials were incorrect" />
      </div>
      <primary-button @click="onSubmitLogin" :isDisabled="isLoadingAuthStore || !isFormValid">
        <spinner-loading v-if="isLoadingAuthStore" />
        <div v-else>{{ $t('login.signin') }}</div>
      </primary-button>
    </form>
  </div>
</template>
<script setup>
import { useAuthStore } from '@/stores/authStore'
import { defineAsyncComponent, ref, computed, watchEffect } from "vue";
import { useForm } from 'vee-validate'
import * as yup from 'yup';
import { storeToRefs } from "pinia"

import PrimaryButton from "@/components/forms/PrimaryButton.vue"
import TextInput from "@/components/forms/TextInput.vue"

const SpinnerLoading = defineAsyncComponent(() => import('@/components/forms/SpinnerLoading.vue'))
const DangerAlert = defineAsyncComponent(() => import('@/components/alerts/DangerAlert.vue'))

const authStore = useAuthStore()
const { isLoadingAuthStore, hasError } = storeToRefs(authStore)
const validationError = ref(false)
const { handleSubmit, errors, values } = useForm({
  validationSchema: yup.object({
    email: yup.string().required().email(),
    password: yup.string().required(),
  })
})
const isFormValid = computed(() => {
  return Object.keys(errors.value).length === 0 && values.email && values.password
})
const onSubmitLogin = handleSubmit(values => {
  validationError.value = false
  authStore.fetchLogin(values.email, values.password)
  if (hasError) {
    validationError.value = true
  }
})
</script>