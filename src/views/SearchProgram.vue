
<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
// import data from "../assets/temp_programs.json";

const route = useRoute();
const nid = route.params.nid || ""; // expects a VIU nid on params - see router

const programs =
  import.meta.env.MODE === "PROD"
    ? await fetch("https://api.viu.ca/v1/programs").json()
    : (await import("../assets/temp_programs.json")).default;

// programs.value = data;
console.log(programs);
</script>

<template>
  <div>
    <h1>Search by Program</h1>
    <select name="program" id="program">
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