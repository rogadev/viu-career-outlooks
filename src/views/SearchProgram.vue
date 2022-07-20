
<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
// import data from "../assets/temp_programs.json";

const route = useRoute();
const nid = ref(null);
nid.value = route.params.nid || ""; // expects a VIU nid on params - see router

const programs =
  import.meta.env.MODE === "PROD"
    ? await fetch("https://api.viu.ca/v1/programs")
    : (await import("../assets/temp_programs.json")).default;

const jobs = ref([]);
const res = await fetch(
  `https://viu-career-outlook.herokuapp.com/api/v1/jobs/program/${nid.value}`
);
jobs.value = await res.json();
console.log(jobs.value);
</script>

<template>
  <div>
    <h1>Search by Program</h1>
    <select name="program" id="program" v-bind="nid">
      <option
        v-for="program of programs"
        :value="program.nid"
        :id="program.nid"
      >
        {{ program.title }}
      </option>
    </select>
    <p>{{ nid }}</p>
  </div>
</template>