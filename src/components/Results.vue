<script setup>
defineProps({
  results: {
    type: Object,
    required: true,
  },
});
</script>
<template>
  <div v-if="results.length > 0">
    <p v-for="(result, i) of results.jobs" :key="i">{{ result.title }}</p>
  </div>
</template>