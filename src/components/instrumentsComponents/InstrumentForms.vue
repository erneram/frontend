<template>
     <panel>
          <div>
               <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="number" type="number"
                    title="protocol-instruments.number" inputPlaceholder='protocol-instruments.number' class="mt-2" />
               <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="place" type="text"
                    title="protocol-instruments.place" inputPlaceholder='protocol-instruments.place' class="mt-2" />
               <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="date" type="date"
                    title="protocol-instruments.date" inputPlaceholder='protocol-instruments.date' class="mt-2" />
               <check-box-input title="protocol-instruments.state" :data="statusData" :currentSelected="statusId"
                    @sendSelected="updateStatus" class="mt-2" />
               <div v-if="statusId === 1">
                    <input-select inputType="country" title="protocol-instruments.type" :data="allTypes"
                         :currentSelected="currentInstrumentTypeId" class="mt-2" v-model="currentInstrumentTypeId" />
                    <div class="flex">
                         <check-box-input title="protocol-instruments.parts" :data="dataParts"
                              :currentSelected="hasParts" @sendSelected="updateHasParts" class="mt-2" />
                         <action-button-solid-icon v-if="hasParts === 1" icon="PlusIcon" color="text-emerald-600"
                              size="h-8 w-8 ml-4 mt-8" @click="addDocumentPart()" class="align-center" />
                    </div>
               </div>

               <div v-if="hasParts === 1 && statusId === 1">
                    <div v-for="part in allParts" :key="part.id" class="mt-2 ml-8 flex">
                         <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600"
                              :name="`document_name_${part.id}`" type="text" title="protocol-instruments.name"
                              inputPlaceholder='protocol-instruments.name' class="mt-2" @click="changePartId(part.id)"
                              @updateValue="handleNewInput" />
                         <action-button-solid-icon icon="TrashIcon" color="text-red-600" size="h-8 w-8 ml-4 mt-9"
                              @click="deleteDocumentPart(part.id)" />
                    </div>
               </div>

               <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="customer" type="text"
                    title="protocol-instruments.customer" inputPlaceholder='protocol-instruments.customer'
                    class="mt-2" />
               <text-input inputClassError="ring-yellow-300 focus:ring-yellow-600" name="folioInWhichItBegin"
                    type="number" title="protocol-instruments.folio-in-which-it-begin"
                    inputPlaceholder='protocol-instruments.folio-in-which-it-begin' class="mt-2" />
               <check-box-input title="protocol-instruments.type-of-sheet" :data="typeSheet"
                    :currentSelected="isReverse" @sendSelected="updateTypeSheet" class="mt-2" />
               <text-input v-if="statusId === 1" inputClassError="ring-yellow-300 focus:ring-yellow-600"
                    name="sheetsUsed" type="number" title="protocol-instruments.sheets-used"
                    inputPlaceholder='protocol-instruments.sheets-used' class="mt-2" />
               <custom-label title="protocol-instruments.instrument-value" class="mt-2" />
               <div class="flex mt-2">
                    <check-box-input title="general.empty" :data="InOrDeterminated" :currentSelected="hasValue"
                         @sendSelected="updateHasValue" />
                    <text-input v-if="hasValue === 1" inputClassError="ring-yellow-300 focus:ring-yellow-600"
                         name="instrumentValue" type="number" class="ml-2"
                         inputPlaceholder='protocol-instruments.instrument-value' />
               </div>
          </div>
     </Panel>
</template>
<script setup>
import { useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'
import { useInstrumentsStore } from '@/stores/instrumentsStore'
import { ref, watchEffect, watch, computed } from 'vue'
import { DateTime } from 'luxon'
import { PDFDocument } from 'pdf-lib'
import { pdfjsLib } from '/src/workers/pdf-worker'

import Panel from '@/components/forms/Panel.vue'
import ActionButtonSolidIcon from "@/buttons/ActionButtonSolidIcon.vue"
import CustomLabel from '@/components/forms/CustomLabel.vue'
import TextInput from '@/components/forms/TextInput.vue'
import CheckBoxInput from '@/components/CheckBoxInput.vue'
import InputSelect from '@/components/forms/InputSelect.vue'
import * as yup from 'yup'

const dt = DateTime.local()
const currentYear = dt.year

const emit = defineEmits(['updatedData'])
const props = defineProps({
     data: {
          type: Object,
     },
     currentSelected: {
          type: Number,
     },
     currentLawyerId: {
          type: Number,
          required: true,
     },
     types: {
          type: Object,
          required: true,
     },
     status: {
          type: Object,
          required: true,
     },
     file: {
          type: [String, File],
     }
})
const instrumentStore = useInstrumentsStore()
const actualData = props.data || []
const initialValues = computed(() => ({
     number: actualData?.number || '',
     place: actualData?.place || '',
     date: actualData?.date || '',
     customer: actualData?.client || '',
     folioInWhichItBegin: actualData?.starting_folio || '',
     sheetsUsed: actualData?.sheets || 0,
     instrumentValue: actualData?.price || 0,
     hasValue: actualData?.price ? 1 : 0,
}))

const allTypes = ref(props.types)
const currentInstrumentTypeId = ref([])
const actualTypeId = ref(actualData?.instrument_type_id || null)
const statusData = ref(props.status)
const statusId = ref(actualData?.instrument_status_id || 2)
const isReverse = ref(actualData?.is_reverse || 0)
const hasValue = ref(actualData?.price ? 1 : 0)
const allParts = ref(actualData?.parts || [])
const hasParts = ref(Object.values(allParts?.value).length > 0 ? 1 : 0)

watch(() => actualTypeId.value, (newVal) => {
     const instrumentType = allTypes.value.find(type => type.id === newVal);
     if (instrumentType) {
          currentInstrumentTypeId.value = [{
               id: newVal,
               name: instrumentType.name
          }];
     }
}, { immediate: true });

const handleNewType = (newTypes) => {
     currentInstrumentTypeId.value = newTypes
}
//Status button
const updateStatus = (newSelected) => {
     statusId.value = newSelected
     allParts.value = []
}
//sheet button
const typeSheet = [
     { id: 0, name: "protocol-instruments.obverse" },
     { id: 1, name: "protocol-instruments.reverse" }
]
const updateTypeSheet = (newSelected) => {
     isReverse.value = newSelected
}
//determinated button
const InOrDeterminated = [
     { id: 0, name: "protocol-instruments.indeterminate" },
     { id: 1, name: "protocol-instruments.determinated" }
]
const updateHasValue = (newSelected) => {
     hasValue.value = newSelected
}
//Parts Buttons
const dataParts = [
     { id: 0, name: "protocol-instruments.for-me/before-me" },
     { id: 1, name: "protocol-instruments.others" }
]
if (hasParts.value === 1) {
     allParts.value.forEach(element => {
          initialValues.value[`document_name_${element.id}`] = element.name;
     });
} else {
     allParts.value = [];
}
const updateHasParts = (newSelected) => {
     hasParts.value = newSelected
     allParts.value = []
}
//text inputs
const addDocumentPart = () => {
     allParts.value.push({
          id: DateTime.now(),
          name: '',
          document_type: "",
          document_number: "",
     })
}
const deleteDocumentPart = (id) => {
     allParts.value = allParts.value.filter(part => part.id !== id)
}
const partId = ref(null)
const changePartId = (id) => {
     partId.value = id
}
const handleNewInput = (newValue) => {
     const findPart = allParts.value.find(part => part.id === partId.value)
     findPart.name = newValue
}
const { values, errors, setFieldValue } = useForm({
     initialValues,
     validationSchema: yup.object({
          number: yup.number().required(),
          place: yup.string().required(),
          date: yup.date().required(),
          customer: yup.string().required(),
          folioInWhichItBegin: yup.number().required(),
          sheetsUsed: yup.number().nullable().when('hasValue', {
               is: value => value === 1,
               then: schema => schema.required(),
               otherwise: schema => schema.notRequired()
          }),
          instrumentValue: yup.number().nullable().when('hasValue', {
               is: value => value === 1,
               then: schema => schema.required(),
               otherwise: schema => schema.notRequired()
          })
     })
})
const isFormValid = computed(() => {
     return Object.keys(errors.value).length === 0 && values.number && values.place && values.date && values.customer && values.folioInWhichItBegin
})
async function analyzePDF(file) {
     if (!file || !(file instanceof File)) {
          console.warn('No valid file provided to analyzePDF.');
          return;
     }
     try {
          const fileReader = new FileReader();
          const arrayBuffer = await new Promise((resolve, reject) => {
               fileReader.onload = () => resolve(fileReader.result);
               fileReader.onerror = () => reject(fileReader.error);
               fileReader.readAsArrayBuffer(props.file);
          });
          const loadingTask = pdfjsLib.getDocument(new Uint8Array(arrayBuffer));
          const pdfDoc = await loadingTask.promise;
          // Load PDF from deprecated library
          // const arrayBuffer = await props.file.arrayBuffer();
          // const pdfDoc = await PDFDocument.load(arrayBuffer);
          // const pageCount = pdfDoc.getPageCount();
          setFieldValue('sheetsUsed', pdfDoc.numPages)
     } catch (error) {
          console.error('Error analyzing PDF:', error);
     }
}
const newData = ref([])
watchEffect(() => {
     if (allParts.value.length === 0) {
          allParts.value.push({
               name: 'Por mi ante mi',
               document_type: "",
               document_number: "",
          })
     }
     const partsWithoutIds = allParts.value.map(part => {
          const { id, ...rest } = part
          return rest
     })
     analyzePDF(props.file)
     newData.value = {
          isValid: isFormValid.value,
          cause: actualData?.cause || '.',
          client: values.customer,
          current: props.currentLawyerId,
          date: values.date,
          file: props.file,
          instrument_status_id: statusId.value,
          instrument_type_id: currentInstrumentTypeId.value || 0,
          is_reverse: isReverse.value || 0,
          number: values.number,
          parts: allParts.value,
          place: values.place,
          price: values.instrumentValue || 0,
          sheets: values.sheetsUsed || 0,
          starting_folio: values.folioInWhichItBegin,
          year: actualData?.year || currentYear,
          ...(props?.currentSelected !== 0 && { lawyer_office_id: props?.currentLawyerId, id: actualData?.id, })
     }
     if (props.file !== null) {
          emit('updatedData', newData)
     }
})
</script>