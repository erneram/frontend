<template>
     <div class="bg-emerald-200 h-4 rounded-full w-full">
          <div class="progress" :style="{ width: `${props.percentage}%` }"> </div>
     </div>
</template>
<script setup>
const props = defineProps({
     percentage: {
          type: Number,
          default: 0,
     },
})
</script>
<style setup>
.progress {
     height: 100%;
     background-color: #1eb887;
     border-radius: inherit;
}
</style>
