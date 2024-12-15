<template>
     <panel>
          <div class="flex justify-around">
               <div class="flex flex-col">
                    <p>{{ $t('user-profile.dpi-front') }}</p>
                    <img v-if="personalIdentification?.dpi_front_file.exist"
                         :src="'data:image/png;base64,' + identification.dpi_front_file.file" alt="">
               </div>
               <div class="flex flex-col ">
                    <p>{{ $t('user-profile.dpi-back') }}</p>
                    <img v-if="personalIdentification?.dpi_back_file.exist"
                         :src="'data:image/png;base64,' + identification.dpi_back_file.file" alt="">
               </div>
               <div class="flex flex-col">
                    <p>{{ $t('user-profile.membership-card') }}</p>
                    <img v-if="personalIdentification?.membership_card_file.exist"
                         :src="'data:image/png;base64,' + identification.membership_card_file.file" alt="">
               </div>
          </div>
     </panel>
</template>
<script setup>
import { useLawyerStore } from '@/stores/lawyerStore';
import { storeToRefs } from 'pinia';
import { ref } from 'vue'

import Panel from '../forms/Panel.vue';

const lawyerStore = useLawyerStore()
lawyerStore.fetchPersonalIdentifications()
const { personalIdentification } = storeToRefs(lawyerStore)
</script>