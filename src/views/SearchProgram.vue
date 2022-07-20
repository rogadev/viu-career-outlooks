
<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const nid = route.params.nid || ""; // expects a VIU nid on params - see router
</script>

<template>
  <div>
    <h1>Search by Program</h1>
    <p>{{ nid }}</p>
  </div>
</template>